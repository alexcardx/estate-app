import { useState } from "react";
import "./SearchBar.scss";
import search from "../../assets/search.png";
import { typeOptions } from "../../constants";
import { cities } from "../../constants/index";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const [query, setQuery] = useState({
    type: "rent",
    city: "London",
    minPrice: "",
    maxPrice: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    navigate(`/posts?page=1&${searchParams.toString()}`);
  };
  return (
    <div className="searchBar">
      <div className="type">
        {typeOptions.map((type) => (
          <button
            key={type}
            onClick={() => setQuery({ ...query, type: type })}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <select
          className="city-filter"
          name="city-filter"
          id="city-filter"
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, city: e.target.value }))
          }
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
          <option value="">Any</option>
        </select>
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          value={query.minPrice}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              minPrice: e.target.value === "" ? "" : +e.target.value,
            }))
          }
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              maxPrice: e.target.value === "" ? "" : +e.target.value,
            }))
          }
        />
        <button>
          <img src={search} alt="search" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
