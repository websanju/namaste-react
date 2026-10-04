import { CDN_URl } from "../utils/constatns";
const RestaurantCard = ({resData}) => {
 const {
    cloudinaryImageId,
    name,
    avgRatingString,
    slaString,
    cuisines,
    costForTwo,
  } = resData;

const imageUrl = `${CDN_URl}/${cloudinaryImageId}`;


  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img src={imageUrl} />
      </div>

      <div className="restaurant-content">
        <h3>{name}</h3>
        <div className="rating">
          ⭐ {avgRatingString} · {slaString}{" "}
        </div>
        <p> {cuisines.join( ", " )}</p>
        <span> {costForTwo} </span>
      </div>
    </div>
  );
};


export default RestaurantCard;