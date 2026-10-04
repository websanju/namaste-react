import { Link } from "react-router-dom";
const RestaurantCard = ({ resData }) => {
  const {
    id,
    name,
    imageUrl,
    avgRating,
    cuisines,
    costForTwo,
    areaName,
    deliveryTimeMinutes,
  } = resData;


  const info = resData?.info;

  return (
    <article className="restaurant-card">
      <div className="restaurant-image">
        {imageUrl && <img src={imageUrl} alt={name} />}
      </div>
      <div className="restaurant-content">
        <h3>{name}</h3>

        <div className="rating">⭐ {avgRating}</div>

        <p>{cuisines?.join(", ")}</p>

        <p>{costForTwo}</p>

        <p>{areaName}</p>

        <p>{deliveryTimeMinutes} mins</p>
      </div>
    </article>
  );
};

export default RestaurantCard;
