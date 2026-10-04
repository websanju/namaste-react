import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantMenu = () => {
  const { resId } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resId) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/restaurants/${resId}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();


        const structuredContent =
          data?.structuredContent ||
          data?.data?.structuredContent ||
          {};

        const restaurantData =
          structuredContent?.restaurant || null;

        const menuData =
          structuredContent?.categories || [];


        setRestaurant(restaurantData);
        setMenu(menuData);
      } catch (error) {
        console.error(
          "Restaurant Menu API error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [resId]);

  if (loading) {
    return (
      <div className="restaurant-page">
        <div className="menu-container">
          <div className="menu-loader">
            <div className="loader-spinner"></div>
            <p>Loading restaurant menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-page">
        <div className="menu-container">
          <div className="menu-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-page">
        <div className="menu-container">
          <div className="menu-error">
            <h2>Restaurant not found</h2>
            <p>Restaurant ID: {resId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="restaurant-page">
      <div className="menu-container">

        {/* Restaurant Header */}
        <section className="restaurant-hero">

          <div className="restaurant-hero-content">

            <span className="restaurant-badge">
              Restaurant
            </span>

            <h1>
              {restaurant.name}
            </h1>

            {restaurant.cuisines?.length > 0 && (
              <p className="restaurant-cuisines">
                {restaurant.cuisines.join(", ")}
              </p>
            )}

            <div className="restaurant-meta">

              {(restaurant.rating ||
                restaurant.avgRating) && (
                <span className="rating">
                  ⭐{" "}
                  {restaurant.rating ||
                    restaurant.avgRating}
                </span>
              )}

              {restaurant.costForTwo && (
                <span>
                  {restaurant.costForTwo}
                </span>
              )}

              {restaurant.costForTwoMessage && (
                <span>
                  {restaurant.costForTwoMessage}
                </span>
              )}

              {restaurant.deliveryTime && (
                <span>
                  🕒 {restaurant.deliveryTime}
                </span>
              )}

            </div>

           

          </div>

        </section>


        {/* Menu */}
        <section className="menu-section">

          <div className="menu-heading">
            <div>
              <span className="section-label">
                FOOD MENU
              </span>

              <h2>
                Explore our menu
              </h2>
            </div>

            <span className="category-count">
              {menu.length} Categories
            </span>
          </div>


          {menu.length === 0 ? (
            <div className="empty-menu">
              <p>No menu categories found.</p>
            </div>
          ) : (
            <div className="menu-categories">

              {menu.map((category, index) => (
                <div
                  className="menu-category"
                  key={
                    category.id ||
                    category.categoryId ||
                    category.title ||
                    index
                  }
                >

                  <div className="category-header">
                    <h3>
                      {category.title}
                    </h3>

                    {category.items?.length > 0 && (
                      <span>
                        {category.items.length} items
                      </span>
                    )}
                  </div>


                  {/* Normal Items */}

                  {category.items?.map((item) => (
                    <MenuItem
                      key={
                        item.id ||
                        item.menu_item_id ||
                        item.name
                      }
                      item={item}
                    />
                  ))}


                  {/* Nested Categories */}

                  {category.subcategories?.map(
                    (subcategory, subIndex) => (
                      <div
                        className="subcategory"
                        key={
                          subcategory.id ||
                          subcategory.title ||
                          subIndex
                        }
                      >

                        <h4>
                          {subcategory.title}
                        </h4>

                        {subcategory.items?.map(
                          (item) => (
                            <MenuItem
                              key={
                                item.id ||
                                item.menu_item_id ||
                                item.name
                              }
                              item={item}
                            />
                          )
                        )}

                      </div>
                    )
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
};


const MenuItem = ({ item }) => {
  return (
    <article className="menu-item">

      <div className="menu-item-content">

        <div className="veg-indicator">
          <span
            className={
              item.isVeg
                ? "veg-dot"
                : "nonveg-dot"
            }
          ></span>
        </div>

        <div className="menu-item-info">

          <h4>
            {item.name}
          </h4>

          {item.description && (
            <p className="menu-item-description">
              {item.description}
            </p>
          )}

          <div className="menu-item-bottom">

            {item.price !== undefined && (
              <strong className="menu-price">
                ₹{item.price}
              </strong>
            )}

            {item.rating && (
              <span className="item-rating">
                ⭐ {item.rating}
              </span>
            )}

            {item.hasVariants && (
              <span className="item-option">
                Options
              </span>
            )}

            {item.hasAddons && (
              <span className="item-option">
                Add-ons
              </span>
            )}

          </div>

        </div>

      </div>

      {item.imageUrl && (
        <div className="menu-item-image">

          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
          />

          <button
            type="button"
            className="add-button"
          >
            ADD
          </button>

        </div>
      )}

    </article>
  );
};

export default RestaurantMenu;