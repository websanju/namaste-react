import cards from "../utils/maxData";
import RestaurantCard from "../components/restaurantCard";
import { useEffect, useState } from "react";

const RestaurantList = () => {
  const [cardsList, setCardsList] = useState(cards);

  useEffect(() => {
    
  })

  return (
    <section className="container">
      <h2>Top restaurants near you</h2>

      <div className="">
        <div className="button-action">
          <button
            type="button"
            onClick={() => {
              const result = cardsList.filter((card2) => {
                return card2.info.avgRatingString > 4;
              });
              setCardsList(result);
            }}
          >
            Top Rated Restaurant
          </button>

          <button
            type="button"
            onClick={() => {
              setCardsList(cards);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="restaurants">
        {cardsList.map((card) => (
          <RestaurantCard key={card.info.id} resData={card.info} />
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
