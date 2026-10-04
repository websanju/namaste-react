import { Link } from "react-router-dom";
import RestaurantCard from "../components/restaurantCard";
import { useEffect, useState } from "react";

const RestaurantList = () => {
  const [cardsList, setCardsList] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  //  const [filterCardsList, setFilterCardsList] = useState([]);

  console.log(searchText);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then((response) => response.json())
      .then((data) => {
    

        const restaurants = data?.data?.structuredContent?.restaurants || [];

        setCardsList(restaurants);
        setAllCards(restaurants);
        setLoading(false);
      })

      
      .catch((error) => {
        console.error("Restaurant API error:", error);
        setLoading(false);
      });
        
  }, []);

  const filterTopRated = () => {
    const result = allCards.filter((restaurant) => restaurant.avgRating > 4);

    setCardsList(result);
  };

  const resetFilter = () => {
    setCardsList(allCards);
  };

  if (loading) {
    return (
      <section className="container">
        <h2>Loading restaurants...</h2>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>Top restaurants near you</h2>

      <div className="button-action">
        <button type="button" onClick={filterTopRated}>
          Top Rated Restaurant
        </button>

        <button type="button" onClick={resetFilter}>
          Reset
        </button>

        <div className="search">
          <input
            type="text"
            placeholder="Search for restaurant or food"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
             const result = allCards.filter((restaurant) => restaurant.name.toLowerCase().includes(searchText.toLowerCase()));
             setCardsList(result);
              console.log("Search result:", result);
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="restaurants">
        {cardsList.map((restaurant) => (
         <Link to={"restaurants/" + restaurant.id} key={restaurant.id}> <RestaurantCard key={restaurant.id} resData={restaurant} /></Link>
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
