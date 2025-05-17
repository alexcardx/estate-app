import "./NoResults.scss";
import { FiSearch } from "react-icons/fi";

const NoResults = () => {
  return (
    <div className="no-results">
      <FiSearch className="no-results__icon" />
      <p className="no-results__title">Nothing found</p>
      <p className="no-results__subtitle">
        Try adjusting your filters and search again.
      </p>
    </div>
  );
};

export default NoResults;
