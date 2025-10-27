import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  totalResults = 0,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 mb-8 animate-fade-in">
      {/* Results Info */}
      <div className="text-center mb-6">
        <p className="text-sm text-secondary-600">
          Showing page{" "}
          <span className="font-semibold text-primary-600">{currentPage}</span>{" "}
          of{" "}
          <span className="font-semibold text-primary-600">{totalPages}</span>
          {totalResults > 0 && (
            <span>
              {" "}
              • Total:{" "}
              <span className="font-semibold text-primary-600">
                {totalResults.toLocaleString()}
              </span>{" "}
              books
            </span>
          )}
        </p>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || isLoading}
          className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
            !hasPrevPage || isLoading
              ? "bg-secondary-100 text-secondary-400 cursor-not-allowed"
              : "bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 shadow-md hover:shadow-lg transform hover:scale-105"
          }`}
          title="First page"
        >
          <ChevronDoubleLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 ${
            !hasPrevPage || isLoading
              ? "bg-secondary-100 text-secondary-400 cursor-not-allowed"
              : "bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 shadow-md hover:shadow-lg transform hover:scale-105"
          }`}
        >
          <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base font-medium">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-secondary-400 text-sm sm:text-base"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`min-w-[2.5rem] sm:min-w-[3rem] h-10 sm:h-12 px-2 sm:px-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105"
                    : isLoading
                    ? "bg-secondary-100 text-secondary-400 cursor-not-allowed"
                    : "bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 ${
            !hasNextPage || isLoading
              ? "bg-secondary-100 text-secondary-400 cursor-not-allowed"
              : "bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 shadow-md hover:shadow-lg transform hover:scale-105"
          }`}
        >
          <span className="text-sm sm:text-base font-medium">Next</span>
          <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || isLoading}
          className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
            !hasNextPage || isLoading
              ? "bg-secondary-100 text-secondary-400 cursor-not-allowed"
              : "bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-600 shadow-md hover:shadow-lg transform hover:scale-105"
          }`}
          title="Last page"
        >
          <ChevronDoubleRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2 text-primary-600">
            <div className="loading-spinner w-5 h-5"></div>
            <span className="text-sm font-medium">
              Loading page {currentPage}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
