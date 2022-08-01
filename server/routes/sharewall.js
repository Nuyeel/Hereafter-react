const express = require('express');
const router = express.Router();
const db = require(`${__dirname}/../modules/mysql2-connect`);

// 專用處理 sql 字串的工具，主要 format 與 escape
const SqlString = require('sqlstring');

// 路由裏面的 Top-level Middlewares

// TODO: 修改貼文標籤的版
// 分享貼文撰寫的版？ 直接跳過來嗎？

// TABLE: share_avatar_posts
// TODO: 新增圖片用的欄位 share_post_img
// DONE: 直接把 avatar_sid 存進檔名裡面就不可能重複 `ava${avatar_sid}.png`
// const row = {
//     share_post_sid: 1, // 分享文章流水號 // PK
//     member_sid: 1, // 會員流水號 // FK
//     avatar_sid: 1, // 來生形象流水號
//     share_post_title: '白肚肚貓貓人', // 分享時的形象名稱
//     share_post_text: '我是文章內容最多兩百個字元', // 文章內容
//     share_post_likes: 12, // 喜歡這篇貼文的人數
//     share_post_collects: 13, // 收藏這篇貼文的人數
//     created_at: '', // 分享時間
//     updated_at: '', // 最後修改時間
// };

// TABLE: share_avatar_tags
// TODO: 新增一個欄位代表被搜尋次數來排序這些標籤
// DONE: share_post_search_times
// const row = {
//     share_post_tag_sid: 1, // 分享文章標籤流水號 // PK
//     share_post_tag_text: '短髮', // 標籤內容
//     share_post_tag_search_times: 123 // 被搜尋次數
// };

// TABLE: share_avatar_posts_to_tags (多對多)
// 分享文章最多三個標籤
// TODO: 要讓標籤可以重複嗎? 很重要所以說三次之類的
// PK: share_p_to_t_sid
// FK: share_post_sid
// const rows = [
//     { share_p_to_t_sid: 1, share_post_sid: 1, share_post_tag_sid: 2 },
//     { share_p_to_t_sid: 2, share_post_sid: 2, share_post_tag_sid: 2 },
//     { share_p_to_t_sid: 3, share_post_sid: 1, share_post_tag_sid: 5 },
//     { share_p_to_t_sid: 4, share_post_sid: 5, share_post_tag_sid: 5 },
//     { share_p_to_t_sid: 5, share_post_sid: 1, share_post_tag_sid: 8 },
//     { share_p_to_t_sid: 6, share_post_sid: 8, share_post_tag_sid: 8 },
// ]

// TABLE: share_avatar_comments (一對多)
// const row = {
//     share_post_sid: 1, // 分享文章流水號
//     member_sid: 1, // 留言者 sid // FK
//     share_post_comment_sid: 1, // 分享文章留言流水號 // PK
//     share_post_comment_text: '哎呦～不錯喔！', // 分享文章留言內容
//     created_at: '' // 留言時間
//     updated_at: '' // 最後編輯時間
// };

// TODO: 建立一張各會員按讚貼文的對應表
// TABLE: share_avatar_likes (一對多)
// const row = {
//     share_post_like_sid, // 分享文章按讚流水號 // PK
//     share_post_sid, // 分享文章流水號 // FK
//     member_sid, // 留言者 sid // FK
// }
// ASK: (感覺是多對多...) 一篇文可以有很多人按讚
// ASK: 對這個會員來說 按讚哪些文章是重要的嗎
// ASK: 對這篇文章來說 是誰按了自己讚是重要的嗎 要顯示嗎 (NO!)
// DONE: 像 comment 一樣處理即可
// DONE: 新增假資料 會員會按讚 sid 因數的貼文

// TODO: 建立一張會員收藏貼文的對應表
// TABLE: share_avatar_collects (一對多) (感覺是多對多...)
// const row = {
//     share_post_collect_sid, // 分享文章按讚流水號 // PK
//     share_post_sid, // 分享文章流水號 // FK
//     member_sid, // 留言者 sid // FK
// }
// ASK: (感覺是多對多...) 一篇文可以有很多人收藏
// ASK: 對這個會員來說 收藏哪些文章是重要的吧 會員中心要用
// ASK: 對這篇文章來說 是誰收藏了自己是重要的嗎 感覺只有數字重要吧
// DONE: 像 comment 一樣處理即可
// DONE: 新增假資料 會員會收藏 11 - sid 因數的貼文

// DONE: 至寧醬: 可以用一個 type 欄位區分 就可以只建兩張表
// 但一般來說是分開 因為可能用途不同

// ASK: 會員是否喜歡此貼文的處理層級 (愛心是否實心)
// ASK: 會員是否收藏此貼文的處理層級 (旗幟是否實心)

// FIXME: 利用中介軟體 JOIN 表單資料後再送出有喜歡資訊的版本
router
    .route('/')
    .get(async (req, res) => {
        if (req.query.searchtag) {
            // 如果來的是標籤做標籤搜尋
            // console.log(req.query.searchtag);

            // console.log(res.locals.loginUser); // 取得 token 內容

            let searchtagString = '';
            if (!Array.isArray(req.query.searchtag)) {
                searchtagString = SqlString.escape(req.query.searchtag);
            } else {
                for (
                    let i = 0, strLength = req.query.searchtag.length;
                    i < strLength;
                    i++
                ) {
                    if (i !== 0) {
                        searchtagString += ', ';
                    }
                    searchtagString += SqlString.escape(req.query.searchtag[i]);
                }
            }
            // console.log(searchtagString);

            const $tag_sql = ` 
                SELECT share_post_tag_sid 
                FROM share_avatar_tags 
                WHERE share_post_tag_text 
                IN (${searchtagString}) 
            `;

            const [tag_results] = await db.query($tag_sql);
            // console.log(tag_results);

            if (!tag_results.length) {
                // 沒有匹配的標籤
                return res.json([]);
            }

            // TODO: 進行標籤搜尋
            // DONE: 標籤搜尋 OK
            let $searchtag_sql = ` SELECT t1.* FROM `;
            let tableIndex = 1;
            for (
                let i = 0, strLength = tag_results.length;
                i < strLength;
                i++
            ) {
                if (i !== 0) {
                    $searchtag_sql += ` JOIN `;
                }
                $searchtag_sql += ` 
                    (SELECT share_post_sid 
                    FROM share_avatar_posts_to_tags 
                    WHERE share_post_tag_sid = ${tag_results[i].share_post_tag_sid}) t${tableIndex} 
                `;
                if (i !== 0) {
                    $searchtag_sql += ` 
                        ON t${
                            tableIndex - 1
                        }.share_post_sid=t${tableIndex}.share_post_sid 
                    `;
                }
                tableIndex++;
            }
            // console.log($searchtag_sql);
            const [post_results] = await db.query($searchtag_sql);
            // console.log(post_results);

            if (!post_results.length) {
                // 沒有匹配的貼文
                return res.json([]);
            }

            // TODO: 製作搜尋字串
            // DONE: 標籤搜尋 OK
            let searchPostsString = '';
            for (
                let i = 0, strLength = post_results.length;
                i < strLength;
                i++
            ) {
                if (i !== 0) {
                    searchPostsString += ', ';
                }
                searchPostsString += `${post_results[i].share_post_sid}`;
            }
            // console.log(searchPostsString);
            const $sql = ` 
                SELECT * 
                FROM share_avatar_posts s 
                JOIN member m 
                ON s.member_sid = m.sid 
                WHERE share_post_sid 
                IN (${searchPostsString}) 
                ORDER BY created_at DESC 
            `;

            // console.log($sql);
            const [results] = await db.query($sql);
            res.json(results);
        } else {
            // 如果來的是純文字做標題搜尋或全搜尋
            // sql 前後多留空 多空不會錯 少空會錯
            // FIXME: 處理跳脫
            // DONE: 跳脫 OK
            let formatSql;
            if (req.query.search) {
                const escapeString = SqlString.escape(req.query.search);
                const likeString = `'%${escapeString.slice(1, -1)}%'`;
                // console.log(likeString);
                const $search_sql = ` 
                    SELECT * 
                    FROM share_avatar_posts s 
                    JOIN member m 
                    ON s.member_sid = m.sid 
                    WHERE share_post_title 
                    LIKE ${likeString} 
                    ORDER BY created_at DESC 
                `;

                // console.log($search_sql);
                formatSql = $search_sql;
            } else {
                const $search_sql = ` 
                    SELECT * 
                    FROM share_avatar_posts s 
                    JOIN member m 
                    ON s.member_sid = m.sid 
                    ORDER BY created_at DESC 
                `;

                // formatSql = SqlString.format($search_sql);
                formatSql = $search_sql;
            }
            // console.log(formatSql);
            const [results] = await db.query(formatSql);
            // console.log(results);
            res.json(results);
        }
    })
    .post(async (req, res) => {
        // TODO: 改成 GET 要資料
        // 之後每次捲動都必須繼承條件來要
        // ASK: 德醬
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // FIXME: 這個改成 GET
        // 用 POST 方法的話會取得無限捲動的文章
        // FIXME: 先用 Postman 測試
        // console.log(req.body.num);
        const pageNumStart = Number(req.body.num);
        const pageNumEnd = pageNumStart + 10; // 目前一次十筆

        // FIXME: 只拿需要的資料 先全拿
        // 寫法一：
        // const $sql =
        // ' SELECT * FROM `share_avatar_posts` s JOIN `member` m ON s.member_sid = m.sid ORDER BY created_at DESC LIMIT ?, ? ';
        // const [results] = await db.query($sql, [pageNumStart, pageNumEnd]);
        // res.json(results);
        // DONE: 目前可以成功取得貼文 剩下 setState
        // DONE: setState() 完成

        // 寫法二：
        // 先做出 formatSql
        const $sql = ` 
            SELECT * 
            FROM share_avatar_posts s 
            JOIN member m 
            ON s.member_sid = m.sid 
            ORDER BY created_at DESC 
            LIMIT ?, ? 
        `;

        const formatSql = SqlString.format($sql, [pageNumStart, pageNumEnd]);
        // 這樣寫的好處是可以 console.log
        // console.log(formatSql);
        const [results] = await db.query(formatSql);
        // console.log(results);
        res.json(results);
    });

router.route('/:sharepostID').get(async (req, res) => {
    if (isNaN(Number(req.params.sharepostID))) {
        // TODO: 更好的處理方式？
        console.log('這不是文章ID');
        return res.json({});
    }

    // FIXME: 之後要詳細寫出需要的欄位 或許可以加上狀態碼等資訊
    // 請注意一個是陣列而另一個是物件
    let results = {
        postResults: {},
        postTagResults: [],
    };

    const $post_sql = ` 
        SELECT * 
        FROM share_avatar_posts s
        JOIN member m 
        ON s.member_sid = m.sid 
        WHERE share_post_sid = ${req.params.sharepostID} 
    `;

    const [[post_results]] = await db.query($post_sql);
    results.postResults = post_results;

    const $post_tag_sql = ` 
        SELECT sat.share_post_tag_text, sat.share_post_tag_sid  
        FROM share_avatar_posts sap 
        JOIN share_avatar_posts_to_tags saptt 
        ON sap.share_post_sid = saptt.share_post_sid 
        JOIN share_avatar_tags sat 
        ON saptt.share_post_tag_sid = sat.share_post_tag_sid 
        WHERE sap.share_post_sid = ${req.params.sharepostID} 
    `;

    const [post_tag_results] = await db.query($post_tag_sql);
    results.postTagResults = post_tag_results;

    // console.log(results);
    res.json(results);
});

router.route('/tagbar/tags').get(async (req, res) => {
    const $sql = ` 
        SELECT share_post_tag_text
        FROM share_avatar_tags 
        WHERE 1 
        ORDER BY share_post_tag_search_times DESC 
        LIMIT 5; 
    `;

    const [results] = await db.query($sql);
    res.json(results);
});

module.exports = router;
