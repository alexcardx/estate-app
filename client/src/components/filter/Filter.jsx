import "./Filter.scss";
import search from "../../assets/search.png";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { cities } from "../../constants/index";
import { propertyOptions } from "../../constants/index";
import { typeOptions } from "../../constants/index";
import { useSearchParams } from "react-router";
import { FaMapMarkedAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";

const Filter = ({ showMap, setShowMap }) => {
  const [showFilters, setShowFilters] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minPrice: searchParams.get("minPrice") || "",
    type: searchParams.get("type") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== "" && value !== 0)
    );

    setSearchParams(filtered);
  };

  return (
    <>
      <div className="search-heading">
        <h1>
          Search results for <b>{searchParams.get("city")}</b>
        </h1>
        <div className="search-buttons">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="toggleMapBtn"
          >
            <FaMapMarkedAlt />
            {showMap ? (
              <FaChevronUp style={{ marginLeft: "8px" }} />
            ) : (
              <FaChevronDown style={{ marginLeft: "8px" }} />
            )}
          </button>
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {showFilters && (
        <form className="filter" onSubmit={handleSubmit}>
          <div className="item">
            <label htmlFor="city-filter">City</label>
            <select
              id="city-filter"
              value={query.city}
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, city: e.target.value }))
              }
            >
              <option value="">Any</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="item">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={query.type}
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, type: e.target.value }))
              }
              className="typeOptions"
            >
              <option value="">Any</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              id="property"
              value={query.property}
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, property: e.target.value }))
              }
            >
              <option value="">Any</option>
              {propertyOptions.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </select>
          </div>

          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              min={0}
              value={query.minPrice}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  minPrice: e.target.value === "" ? "" : +e.target.value,
                }))
              }
              placeholder="any"
            />
          </div>

          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              min={0}
              value={query.maxPrice}
              onChange={(e) =>
                setQuery((prev) => ({
                  ...prev,
                  maxPrice: e.target.value === "" ? "" : +e.target.value,
                }))
              }
              placeholder="any"
            />
          </div>

          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              type="number"
              id="bedroom"
              value={query.bedroom}
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, bedroom: e.target.value }))
              }
              placeholder="any"
            />
          </div>

          <div className="filter-search-btn">
            <button type="submit">
              <img src={search} alt="search" />
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Filter;
