import { useSearchParams } from "react-router";
import "./Pagination.scss";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const currentParams = Object.fromEntries(searchParams.entries());

  const handlePageChange = (newPage) => {
    setSearchParams({ ...currentParams, page: newPage });
  };

  return (
    <div className="pagination">
      <div className="pagination__buttons">
        <button
          className="pagination__button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <FiChevronLeft />
          Prev
        </button>
        <button
          className="pagination__button"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <FiChevronRight />
          Next
        </button>
      </div>
      <div className="pagination__info">
        <span>
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
