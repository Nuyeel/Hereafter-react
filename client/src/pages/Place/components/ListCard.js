import MapIcon from "./MapIcon";
import SoulIcon from "./SoulIcon";
// import LikeIcon from "./LikeIcon";
import { FaHeart } from "react-icons/fa";
import { BsFillCartPlusFill } from "react-icons/bs";

// TODO: index.js import data再用props傳進來

function ListCard(props) {
    const { sid, year, month, country, city, dist, remainQuantity, price } =
        props;

    // 收藏
    const saveLikedPlace = (e) => {
        const t = e.currentTarget;
        console.log(t.closest(".list-card").getAttribute("data-placesid"));
        // TODO: 存到資料庫 place-liked
        // 1. 判斷有無登入
        // 2. 存到資料庫 place-liked
    };

    // 加到轉生購物車
    const addPlaceToCart = (e) => {
        const placeIndex = e.currentTarget
            .closest(".list-card")
            .getAttribute("data-placesid");
        console.log(placeIndex);
        // TODO: 存到資料庫
    };

    return (
        <>
            <div className="list-card" data-placesid={sid}>
                <div className="title">
                    <p className="yeartitle">
                        {year}年 {+month < 10 ? `0${month}` : `${month}`}月
                    </p>
                    <p className="cityTitle">
                        {country} {city} {dist}
                    </p>
                    <MapIcon fill="#DB8DB3" className="map-icon-list" />
                </div>

                <div className="remain-quant">
                    剩餘數量：<span> {remainQuantity}</span>
                </div>
                <div className="price-wrap">
                    所需陰德值：
                    <div className="price">
                        <SoulIcon className="soul-icon" />
                        <span>{price}</span>
                    </div>
                </div>
                {/* TODO: 底色state變化 */}
                <div className="place-btns-wrap">
                    <div
                        className="place-likeBtn hover-text"
                        onClick={saveLikedPlace}
                        data-hover="加入收藏"
                    >
                        <FaHeart className="place-like-icon " />
                    </div>
                    <div
                        className="place-cartBtn hover-text"
                        onClick={addPlaceToCart}
                        data-hover="加入轉生購物車"
                    >
                        <BsFillCartPlusFill className="place-cart-icon" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListCard;
