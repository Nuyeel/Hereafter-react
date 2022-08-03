import Summary from '../components/Summary';
import { useState, useContext } from 'react';

// scss
import '../styles/sub-pages.scss';
import '../../Event/_xuan_styles.scss';
import './_payment.scss';
import creditcard_logo from '../imgs/creditcard-logo.svg';
import creditcard_logo_back from '../imgs/creditcard-logo-back.svg';

// 會員登入登出驗證
import AuthContext from '../../../context/AuthContext/AuthContext';

function Payment(props) {

        // 會員登入登出驗證(auth)
        const { authorized, sid, account, token } = useContext(AuthContext);
    const {
        calcPickNumber,
        calcPickPrice,
        calcPickDonateNumber,
        calcPickDonateTotalPrice,
        calcPickVolunNumber,
        calcPickVolunTotalPrice,
        cardInfor,
        setCardInfor,
    } = props;

    // 切換卡片正反面的 style
    const cardAF = {
        //卡片正面效果 .front
        perspective: '1000px',
        transform: 'rotateY(0deg)',
    };
    const cardAB = {
        //卡片正面效果 .back
        perspective: '1000px',
        transform: 'rotateY(180deg)',
    };
    const cardBF = {
        //卡片背面效果 .front
        perspective: '1000px',
        transform: 'rotateY(-180deg)',
    };
    const cardBB = {
        //卡片背面效果 .back
        perspective: '1000px',
        transform: 'rotateY(0deg)',
    };

    // 預設是卡片正面效果
    const [cardTransformFront, setCardTransformFront] = useState(cardAF);
    const [cardTransformBack, setCardTransformBack] = useState(cardAB);

    // ------------這段處理資料傳進 MySQL 過程-------------------


    const handleChange = (e) => {
        setCardInfor({ ...cardInfor, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 先阻擋預設送出行為(預設用GET URLencoded)

        // 這裡可以得到目前輸入的值
        // 第一種方式: 從狀態得到
        console.log(cardInfor);

        // 第二種方式: 用FormData物件
        const formData = new FormData(e.target);

        console.log(
            formData.get('sid'),
            formData.get('cardnumber'),
            formData.get('cardholder'),
            formData.get('ex_month'),
            formData.get('ex_year'),
            formData.get('cvv')
        );

        // 作更多驗証

        const fd = new FormData(document.creditform); //建立一個formdata

        // 如果Router已有upload功能，可直接用formdata
        // 送到伺服器(fetch/ajax)
        fetch('http://localhost:3500/eventcarts/creditcard', {
            method: 'POST',
            body: fd, //目前送出格式為multiple formdata
        })
            .then((r) => r.json())
            .then((obj) => {
                console.log('收到的res', obj);
            });
    };

    return (
        <>
            {/* 信用卡放這邊 */}
            <div className="xuan-creditcard-container">
                <div className="row">
                    <div className=" col-9 col ">
                        {/* 對位用 不放內容 */}
                        <div className="xuan-creditcard-top"></div>

                        <div className="payment-card-container">
                            <div className="card-left">
                                <span className="xuan-h5">填寫信用卡資訊</span>

                                <div className="xuan-bill">
                                    <label
                                        htmlFor="test-text"
                                        className="xuan-label-title xuan-body"
                                    >
                                        發票：
                                    </label>
                                    <input
                                        className="xuan-input-radio"
                                        name="gender"
                                        type="radio"
                                    />
                                    <label className="xuan-label-title  xuan-body">
                                        二聯式
                                    </label>
                                    <input
                                        className="xuan-input-radio"
                                        name="gender"
                                        type="radio"
                                    />
                                    <label className="xuan-label-title  xuan-body">
                                        三聯式
                                    </label>
                                    <input
                                        className="xuan-input-radio"
                                        name="gender"
                                        type="radio"
                                    />
                                    <label className="xuan-label-title  xuan-body">
                                        實體發票
                                    </label>
                                </div>

                                <div>
                                    <label
                                        className="xuan-label-title  xuan-body"
                                        htmlFor="test-text"
                                    >
                                        付款方式:
                                    </label>
                                    <input
                                        className="xuan-input-radio"
                                        name="gender"
                                        type="radio"
                                    />
                                    <label className="xuan-label-title  xuan-body">
                                        信用卡
                                    </label>
                                    <input
                                        className="xuan-input-radio"
                                        name="gender"
                                        type="radio"
                                    />
                                    <label className="xuan-label-title  xuan-body">
                                        LINE Pay(4小時內付款)
                                    </label>
                                </div>
                            </div>

                            <div className="card-right">
                                <div className="card-right-btn">
                                    <button
                                        className="xuan-btn-m xuan-btn-pri"
                                        style={{ margin: 20 + 'px' }}
                                    >
                                        查看訂單明細
                                    </button>
                                </div>

                                {/* 信用卡本人 */}
                                <div className="xuan-card-container">
                                    {/* 這邊會做翻牌變動 */}
                                    <div
                                        className="xuan-front"
                                        style={cardTransformFront}
                                    >
                                        {/* 信用卡卡號 */}
                                        <p className="xuan-credit-notion xuan-body">
                                            信用卡卡號
                                        </p>

                                        <div className="card-number-box">
                                            {cardInfor.cardnumber
                                                ? cardInfor.cardnumber
                                                : '0000-0000-0000-0000'}
                                        </div>

                                        <div className="xuan-display-flex xuan-credit-bottom">
                                            <div className="box">
                                                <p className="xuan-credit-notion xuan-body">
                                                    有效期限
                                                </p>

                                                <div className="expiration">
                                                    <span className="exp-month">
                                                        {cardInfor.ex_month
                                                            ? cardInfor.ex_month
                                                            : '01'}
                                                    </span>
                                                    <span className="exp-year">
                                                        {cardInfor.ex_year
                                                            ? cardInfor.ex_year
                                                            : '2022'}
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className="card-holder-name">
                                                        {cardInfor.cardholder}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="box">
                                                <img
                                                    src={creditcard_logo}
                                                    alt=""
                                                    className="credit-img-front"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 這邊會做翻牌變動 */}
                                    <div
                                        className="back"
                                        style={cardTransformBack}
                                    >
                                        <div className="stripe"></div>

                                        <div className="box">
                                            <p className="xuan-credit-notion xuan-body cvv-notion">
                                                CVV
                                            </p>
                                            <div className="cvv-box">
                                                {cardInfor.cvv}
                                            </div>
                                            <div className="credit-img-back">
                                                <img
                                                    src={creditcard_logo_back}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form
                                    name="creditform"
                                    onSubmit={handleSubmit}
                                    className="xuan-credit-form"
                                >
                                    <div className="xuan-input-cardnumber">
                                        {/* <input
                                            style={{ display: 'none' }}
                                            className="xuan-input-text"
                                            name="member_sid"
                                            type="text"
                                            id="test-text"
                                            defaultValue={membersid}
                                        /> */}

                                        <p className="xuan-label">信用卡卡號</p>
                                        <input
                                            // type="text"
                                            maxLength="16"
                                            name="cardnumber"
                                            value={cardInfor.cardnumber}
                                            className="xuan-input-text"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="xuan-display-flex">
                                        <div>
                                            <p className="xuan-label ">
                                                持卡人姓名
                                            </p>
                                            <input
                                                // type="text"
                                                maxLength={8}
                                                name="cardholder"
                                                value={cardInfor.cardholder}
                                                className="xuan-input-text xuan-input-cardholder"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <p className="xuan-label">
                                                信用卡有效期限
                                            </p>

                                            <select
                                                name="ex_month"
                                                className="xuan-input-text xuan-input-month"
                                                value={cardInfor.ex_month}
                                                onChange={handleChange}
                                            >
                                                <option value="month" disabled>
                                                    month
                                                </option>

                                                <option value="01">01</option>
                                                <option value="02">02</option>
                                                <option value="03">03</option>
                                                <option value="04">04</option>
                                                <option value="05">05</option>
                                                <option value="06">06</option>
                                                <option value="07">07</option>
                                                <option value="08">08</option>
                                                <option value="09">09</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                            </select>

                                            <select
                                                name="ex_year"
                                                id="test-text"
                                                className="xuan-input-text"
                                                value={cardInfor.ex_year}
                                                onChange={handleChange}
                                            >
                                                <option value="year" disabled>
                                                    year
                                                </option>
                                                <option value="2022">
                                                    2022
                                                </option>
                                                <option value="2023">
                                                    2023
                                                </option>
                                                <option value="2024">
                                                    2024
                                                </option>
                                                <option value="2025">
                                                    2025
                                                </option>
                                                <option value="2026">
                                                    2026
                                                </option>
                                                <option value="2027">
                                                    2027
                                                </option>
                                                <option value="2028">
                                                    2028
                                                </option>
                                                <option value="2029">
                                                    2029
                                                </option>
                                                <option value="2030">
                                                    2030
                                                </option>
                                                <option value="2031">
                                                    2031
                                                </option>
                                                <option value="2032">
                                                    2032
                                                </option>
                                                <option value="2033">
                                                    2033
                                                </option>
                                                <option value="2034">
                                                    2034
                                                </option>
                                                <option value="2035">
                                                    2035
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="xuan-display-flex">
                                        <div className="xuan-w-50">
                                            <span className="xuan-label">
                                                信用卡背面後3碼
                                            </span>
                                            <input
                                                // type="text"
                                                maxLength="3"
                                                name="cvv"
                                                value={cardInfor.cvv}
                                                className="xuan-input-text"
                                                onMouseLeave={() => {
                                                    setCardTransformFront(
                                                        cardAF
                                                    );
                                                    setCardTransformBack(
                                                        cardAB
                                                    );
                                                }}
                                                onMouseEnter={() => {
                                                    setCardTransformFront(
                                                        cardBF
                                                    );
                                                    setCardTransformBack(
                                                        cardBB
                                                    );
                                                }}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setCardTransformFront(
                                                        cardBF
                                                    );
                                                    setCardTransformBack(
                                                        cardBB
                                                    );
                                                }}
                                            />
                                        </div>

                                        <div className="xuan-w-50 xuan-display-flex xuan-submit-button">
                                            <button
                                                type="submit"
                                                className="xuan-btn-m xuan-btn-sec"
                                            >
                                                確認付款
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <Summary
                        calcPickNumber={calcPickNumber} //已勾選總數量
                        calcPickPrice={calcPickPrice} //已勾選總金額
                        calcPickDonateNumber={calcPickDonateNumber} //已勾選「贊助」總數量
                        calcPickDonateTotalPrice={calcPickDonateTotalPrice} //已勾選「贊助」總金額
                        calcPickVolunNumber={calcPickVolunNumber} //已勾選「志工」總數量
                        calcPickVolunTotalPrice={calcPickVolunTotalPrice} //已勾選「贊助」總金額
                    />
                </div>
            </div>
        </>
    );
}

export default Payment;
