// 只要曾經 require 過就取得原本的參照 (Reference)
const express = require('express');

// 建立 Router 物件
const router = express.Router();

// 與資料庫連線 會建立連線池的 Promise 物件
const db = require(`${__dirname}/../modules/mysql2-connect`);

// JWT 用
const jwt = require('jsonwebtoken');

// 進行 bcrypt 加密用
const bcryptjs = require('bcryptjs');

const sqlstring = require('sqlstring');

// 進行寄發驗證信
const nodemailer = require('nodemailer');

const dayjs = require('dayjs');

// 傳送 AJAX 用
// const axios = require('axios');

// 測試: http://localhost:3500/api/member
// router.route('/').get(async (req, res) => {
//     // 進行某動作...
// });

// 測試: http://localhost:3500/api/member/login
// 登入
router
    .get(async (req, res) => {
        res.render('login');
    })
    .post('/login', async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
            data: {},
        };
        // console.log(req.body.account);

        const sql = 'SELECT * FROM `member` WHERE account = ?';
        const [q1] = await db.query(sql, [req.body.account]);

        if (!q1.length) {
            output.code = 401;
            output.error = '帳戶錯誤';
            return res.json(output);
        }

        if (!req.body.password) {
            output.code = 402;
            output.error = '請輸入密碼';
            return res.json(output);
        }

        const row = q1[0];

        output.success = await bcryptjs.compare(
            req.body.password,
            row.password
        );
        if (!output.success) {
            output.code = 403;
            output.error = '密碼錯誤';
            return res.json(output);
        } else {
            const $del_sql =
                ' DELETE FROM `admin_test_jwt` WHERE member_sid = ? ';
            await db.execute($del_sql, [row.sid]);

            // 開始簽署新的 token 並寫入資料表
            const jwtPayload = {
                id: row.sid,
                account: row.account,
                // 可以裝更多東西 看心情
                // 不過最好不要太大
                // FIXME: 目前測試表轉成 JSON 後資料庫中最大長度是 255
            };

            const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET);

            // 將之寫入資料表中
            const $sql =
                'INSERT INTO `admin_test_jwt`(`member_sid`, `token`, `expires`, `payload`) VALUES (?, ?, ?, ?)';

            await db.execute($sql, [
                row.sid,
                token,
                // 用 JavaScript 當前毫秒數 + 20 分鐘存入
                // TODO: 目前登入後再登出前會永遠登入
                // 沒有去驗證過不過期 但大專這樣就夠了
                Date.now() + 1200000,
                JSON.stringify(jwtPayload),
            ]);

            // 查詢會員是否仍在人世
            // FIXME: 這是個值什麼時候變 true 應該大專就不處理了
            // DONE: 目前先將 7 號會員設定為 true
            const $isdead_sql = ` 
                SELECT isdead 
                FROM member 
                WHERE sid = ? 
            `;

            const [[{ isdead: isdead_result }]] = await db.query($isdead_sql, [
                row.sid,
            ]);

            // console.log(isdead_result);
            // console.log(typeof isdead_result); // string
            let isdead_boolean = false;
            if (isdead_result === 'true') {
                isdead_boolean = true;
            }

            output.data = {
                sid: row.sid,
                token,
                account: row.account,
                isDead: isdead_boolean,
            };
        }
        res.json(output);
    });

// 測試: http://localhost:3500/api/member/register
// 註冊
router
    .route('/register')
    .get(async (req, res) => {
        res.render('register');
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        // 用query方法查詢
        const sql = 'SELECT * FROM `member` WHERE account = ?';
        const [q1] = await db.query(sql, [req.body.account]);
        // console.log(q1);
        if (q1.length > 0) {
            output.code = 405;
            output.error = '會員帳戶已存在';
            return res.json(output);
        }

        const sql2 = 'SELECT * FROM `member` WHERE email = ?';
        const [q2] = await db.query(sql2, [req.body.email]);
        if (q2.length > 0) {
            output.code = 406;
            output.error = '電子信箱已存在';
            return res.json(output);
        }

        console.log(req.body.account, req.body.email, req.body.password);
        const sql3 =
            'INSERT INTO `member`(`account`, `email`, `password`, `create_at`) VALUES (?,?,?,Now())';
        const salt = bcryptjs.genSaltSync(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        // 用execute方法執行新增資料
        const [q3] = await db.execute(sql3, [
            req.body.account,
            req.body.email,
            hash,
        ]);

        console.log(q3.insertId);

        const search = `SELECT * FROM member WHERE account = ?`;
        const [searchR] = await db.query(search, [req.body.account]);

        const sid = searchR[0]['sid'];
        const combinationCreate = JSON.stringify({
            basic: [1, 1, 1],
            basic_color: 0,
            body: { hand: 0, foot: 0, tale: 0, special: 0 },
            special_color: { tale: 0, special: 0 },
            face: {
                eye: 0,
                ear: 0,
                lip: 0,
                nose: 0,
                hairFront: 0,
                hairBack: 0,
                topEar: 0,
            },
            face_color: { eye: 0, nose: 0, hairFront: 0, topEar: 0 },
        });
        const combinationTextCreate = JSON.stringify({
            hand: '饅頭',
            foot: '饅頭',
            bodyColor: '粉',
            specialColor: '',
            tale: '無',
            taleColor: '',
            eye: '瞇瞇眼',
            eyeColor: '灰',
            nose: '那個人',
            noseColor: '白',
            hair: '中分+不留長',
            hairColor: '黑',
            ear: '小饅頭',
            topearColor: '',
            lip: 'kitty',
        });
        const imgCreate = 'default.png';

        const sqlcreate = `INSERT INTO showcase (member_sid, avatar_created_at, combination, combinationText, img_name, price) VALUES (?, NOW(), ?, ?, ?, 300)`;
        const [rCreate_1] = await db.query(sqlcreate, [
            sid,
            combinationCreate,
            combinationTextCreate,
            imgCreate,
        ]);

        console.log(rCreate_1.insertId);

        const $create_profile_piture_sql = `
            UPDATE member SET profile_picture=${rCreate_1.insertId} WHERE sid = ${sid}
        `;

        const [create_profile_piture_result] = await db.execute(
            $create_profile_piture_sql
        );

        const [rCreate_2] = await db.query(sqlcreate, [
            sid,
            combinationCreate,
            combinationTextCreate,
            imgCreate,
        ]);
        const [rCreate_3] = await db.query(sqlcreate, [
            sid,
            combinationCreate,
            combinationTextCreate,
            imgCreate,
        ]);
        const [rCreate_4] = await db.query(sqlcreate, [
            sid,
            combinationCreate,
            combinationTextCreate,
            imgCreate,
        ]);
        const [rCreate_5] = await db.query(sqlcreate, [
            sid,
            combinationCreate,
            combinationTextCreate,
            imgCreate,
        ]);

        output.success = true;
        output.error = '註冊成功';

        res.json(output);
    });

// 測試: http://localhost:3500/api/member/forgotpassword
// 忘記密碼頁面
router
    .route('/forgotpassword')
    .get(async (req, res) => {
        // 登入先擋掉
        if (res.locals.loginUser) {
            return;
        }
        // const output = {
        //     success: false,
        //     error: '',
        //     code: 0,
        // };
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        const sql = 'SELECT * FROM `member` WHERE account = ?';
        const [q1] = await db.query(sql, [req.body.account]);
        console.log(q1);
        console.log(req.body.account);

        if (!q1.length) {
            output.code = 405;
            output.error = '帳戶不存在';
            return res.json(output);
        }

        if (q1[0].email !== req.body.email) {
            output.code = 407;
            output.error = '電子信箱錯誤';
            return res.json(output);
        }

        // 先隨機產生一組驗證碼
        const verifyNum = Math.random().toFixed(6).slice(-6);
        // console.log(verifyNum);
        // console.log(typeof verifyNum);

        console.log(req.body.account);
        // 存進資料表看看
        const passcodeupdate = async () => {
            const sql = `UPDATE member SET passcode='${verifyNum}' WHERE account = ?`;
            const [r] = await db.execute(sql, [req.body.account]);
            console.log(r);
        };
        passcodeupdate();
        // `UPDATE 'member' SET 'passcode'=${verifyNum} WHERE account=?`
        //寄發驗證信
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
                // ！！測試寄信用的金鑰先不上傳！！
            },
        });
        transporter
            .sendMail({
                from: '來生投放所 <service@nextlife.com.tw>',
                to: `${q1[0].email}`,
                subject: '《來生投放所》修改密碼通知信',
                html: `
                <span>
                <h2 style='color: #9587E1'>歡迎蒞臨來生投放所。</h2>
                <h2 style='color: #9587E1'>您申請修改密碼的驗證碼為：<h2 style='color: #E384F2'>${verifyNum}</h2></h2>
                <h2 style='color: #9587E1'>請盡速前往修改，謝謝！</h2>
                </span>
                <a href="http://localhost:3000/forgotpasswordrevise">
                <img src="https://i.imgur.com/ICrQRRJ.png" width="800" />
                </a>
            `,
                // 用這支會有非同源問題
                // http://192.168.24.173:3000/forgotpasswordrevise
            })
            .then((info) => {
                console.log({ info });
            })
            .catch(console.error);

        output.success = true;
        output.error = '驗證信件寄發成功';

        res.json(output);
    });

// 測試: http://localhost:3500/api/member/forgotpasswordrevise
// 修改密碼頁面
router
    .route('/forgotpasswordrevise')
    .get(async (req, res) => {
        if (res.locals.loginUser) {
            return;
        }
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        // 用query方法查詢驗證碼
        const sql = 'SELECT * FROM member WHERE passcode = ?';
        const [q1] = await db.query(sql, [req.body.passcode]);
        // console.log(req.body.passcode);
        // console.log(q1.length);

        if (!q1.length && req.body.passcode !== q1.passcode) {
            output.code = 412;
            output.error = '您的驗證碼輸入錯誤';
            return res.json(output);
        } else {
            //更新登入密碼
            const sql3 = 'UPDATE `member` SET `password`=? WHERE passcode=?';
            const salt = bcryptjs.genSaltSync(10);
            const hash = await bcryptjs.hash(req.body.password, salt);
            const [q3] = await db.execute(sql3, [hash, req.body.passcode]);
            // console.log(req.body.passcode);
        }
        output.success = true;
        output.error = '密碼修改成功';

        res.json(output);
    });

// 測試: http://localhost:3500/api/member/profile
// 會員主頁
router.route('/profile').get(async (req, res) => {
    // 未登入先擋掉
    if (!res.locals.loginUser) {
        return;
    }
    const output = {
        success: false,
        error: '',
        code: 0,
        data: {},
        bithdatedata: {
            birthdate: '',
            deathdate: '',
        },
        placedata: {
            country: '',
            city: '',
            dist: '',
        },
        placelikeddata: {
            country: '',
            city: '',
            dist: '',
        },
    };

    const sql4 = 'SELECT profile_picture FROM `member` WHERE sid = ?';
    const [[q4]] = await db.query(sql4, [res.locals.loginUser.id]);

    if (q4.profile_picture == null) {
        const sql2 = 'SELECT * FROM `member` WHERE sid = ?';
        const [q2] = await db.query(sql2, [res.locals.loginUser.id]);
        output.bithdatedata = q2;
    } else {
        const sql =
            'SELECT m.*, sc.img_name FROM member m JOIN showcase sc ON m.profile_picture = sc.avatar_id WHERE sid = ?';
        const [[q1]] = await db.query(sql, [res.locals.loginUser.id]);

        if (q1.birthdate) {
            q1.birthdate = dayjs(q1.birthdate).format('YYYY-MM-DD');
            // console.log(q1.birthdate);
        }
        if (q1.deathdate) {
            q1.deathdate = dayjs(q1.deathdate).format('YYYY-MM-DD');
            // console.log(q1.deathdate);
        }

        output.data = q1;
    }

    const sql3 =
        'SELECT p.country, p.city, p.dist FROM place p JOIN place_in_cart pc ON p.sid = pc.place_sid  WHERE pc.member_sid = ? ORDER BY RAND() LIMIT 1';
    const [q3] = await db.query(sql3, [res.locals.loginUser.id]);

    if (q3.length !== 0) {
        output.placedata = q3[0];
    }

    const sql5 =
        'SELECT p.country, p.city, p.dist FROM place p JOIN place_liked pl ON p.sid = pl.place_sid WHERE pl.member_sid = ? ORDER BY RAND() LIMIT 1';
    const [q5] = await db.query(sql5, [res.locals.loginUser.id]);
    // console.log(q5[0]);

    if (q5.length !== 0) {
        output.placelikeddata = q5[0];
    }

    output.success = true;
    output.error = '成功取得資料';

    res.json(output);
});

// 測試: http://localhost:3500/api/member/memberprofilerevise
// 修改會員資料
router
    .route('/profilerevise')
    .get(async (req, res) => {
        // 未登入先擋掉
        if (!res.locals.loginUser) {
            return;
        }
        const output = {
            success: false,
            error: '',
            code: 0,
            data: {},
        };
        const sql = 'SELECT * FROM `member` WHERE sid = ?';
        const [[q1]] = await db.query(sql, [res.locals.loginUser.id]);

        if (q1.birthdate) {
            q1.birthdate = dayjs(q1.birthdate).format('YYYY-MM-DD');
            // console.log(q1.birthdate);
        }
        if (q1.deathdate) {
            q1.deathdate = dayjs(q1.deathdate).format('YYYY-MM-DD');
            // console.log(q1.deathdate);
        }

        output.success = true;
        output.data = q1;
        output.error = '成功取得資料';

        res.json(output);
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        // 用query方法查詢
        const sql = 'SELECT * FROM `member` WHERE account = ?';
        const [q1] = await db.query(sql, [req.body.account]);

        //更新會員名稱
        const nameupdate = 'UPDATE `member` SET `name`=? WHERE sid=?';
        const nameupdate2 = sqlstring.format(nameupdate, [
            req.body.name,
            res.locals.loginUser.id,
        ]);
        const nameupdate3 = await db.query(nameupdate2);
        // console.log(nameupdate3);

        //更新出生日
        const birthdateupdate = 'UPDATE `member` SET `birthdate`=? WHERE sid=?';
        const birthdateupdate2 = sqlstring.format(birthdateupdate, [
            req.body.birthdate,
            res.locals.loginUser.id,
        ]);
        const birthdateupdate3 = await db.query(birthdateupdate2);
        // console.log(birthdateupdate3);

        //更新死亡日
        const deathdateupdate = 'UPDATE `member` SET `deathdate`=? WHERE sid=?';
        const deathdateupdate2 = sqlstring.format(deathdateupdate, [
            req.body.deathdate,
            res.locals.loginUser.id,
        ]);
        const deathdateupdate3 = await db.query(deathdateupdate2);
        // console.log(deathdateupdate3);

        console.log(req.body.email);
        //更新電子信箱
        const sql2 = 'SELECT `sid` FROM `member` WHERE email = ?';
        const [q2] = await db.query(sql2, [req.body.email]);
        console.log('q2: ', q2);
        // SELECT COUNT(*) FROM `member` WHERE `email`='HappyCat0@gmail.com';

        if (q2.length && q2[0].sid !== res.locals.loginUser.id) {
            output.code = 406;
            output.error = '已有人使用此電子信箱';
            return res.json(output);
        }

        const emailupdate = 'UPDATE `member` SET `email`=? WHERE sid=?';
        const emailupdate2 = sqlstring.format(emailupdate, [
            req.body.email,
            res.locals.loginUser.id,
        ]);
        const emailupdate3 = await db.query(emailupdate2);
        // console.log(emailupdate3);

        output.success = true;
        output.error = '修改成功';

        res.json(output);
    });

// 測試: http://localhost:3500/api/member/memberpasswordrevise
// 修改會員頁內的密碼
router
    .route('/profilepasswordrevise')
    .get(async (req, res) => {
        if (!res.locals.loginUser) {
            return;
        }
        // res.render('profilepasswordrevise');
    })
    .post(async (req, res) => {
        // console.log(res.locals.loginUser);
        // console.log(req.body.currentPassword);
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        // 用query方法查詢
        const sql = 'SELECT * FROM `member` WHERE sid = ?';
        const [q1] = await db.query(sql, [res.locals.loginUser.id]);

        output.success = await bcryptjs.compare(
            req.body.currentPassword,
            q1[0].password
        );
        if (!output.success) {
            output.code = 408;
            output.error = '您的密碼輸入錯誤';
            return res.json(output);
        } else {
            const sql4 = 'UPDATE `member` SET `password`=? WHERE sid=?';
            const salt = bcryptjs.genSaltSync(10);
            const hash = await bcryptjs.hash(req.body.password, salt);

            // 用execute方法執行新增資料
            const [q4] = await db.execute(sql4, [
                hash,
                res.locals.loginUser.id,
            ]);

            output.success = true;
            output.error = '密碼修改成功';
        }
        res.json(output);
    });

// FIXME: 實際路由設計可以自己決定
// 測試: http://localhost:3500/api/member/logout
router.route('/logout').get(async (req, res) => {
    // 進行某動作... (登出)
    // delete req.session.member;
    // res.redirect('/');
});

// 輸出 router 這個 Middleware (Function)
module.exports = router;
