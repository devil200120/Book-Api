import BookCard from "./BookCard";
import {
  BookOpenIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const BookList = ({
  books,
  isLoading,
  error,
  searchQuery,
  onBookClick,
  showFilterToggle = false,
  onToggleFilters,
  filtersVisible = false,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto animate-fade-in">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="loading-spinner h-12 w-12"></div>
          </div>
          <h2 className="text-2xl font-display font-semibold text-secondary-700 mb-4">
            Searching for books...
          </h2>
          <p className="text-secondary-500">
            Please wait while we find the best books for you
          </p>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-12">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white/50 rounded-2xl p-3 sm:p-4">
                  <div className="h-48 sm:h-52 md:h-56 lg:h-60 bg-secondary-200 rounded-xl mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-2 sm:h-3 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-secondary-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect p-12 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-secondary-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-lg text-secondary-600 mb-6">{error}</p>
          <p className="text-secondary-500">
            Please try searching again or check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  // No Results State
  if (!isLoading && books.length === 0 && searchQuery) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="glass-effect p-12 text-center">
          <BookOpenIcon className="h-16 w-16 text-secondary-400 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-secondary-800 mb-4">
            No books found
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            We couldn't find any books matching{" "}
            <span className="font-semibold text-primary-600">
              "{searchQuery}"
            </span>
          </p>
          <div className="text-secondary-500 space-y-2">
            <p>Try searching with:</p>
            <ul className="text-sm space-y-1">
              <li>• Different keywords or book titles</li>
              <li>• Author names</li>
              <li>• Simpler or more specific terms</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Results Found State
  if (books.length > 0) {
    return (
      <div className="w-full max-w-7xl mx-auto animate-fade-in">
        {/* Results Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-secondary-800">
              Search Results
            </h2>
            {showFilterToggle && (
              <button
                onClick={onToggleFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filtersVisible
                    ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                    : "bg-white/70 text-gray-600 border-2 border-white/20 hover:bg-white/90"
                }`}
              >
                <FunnelIcon className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {filtersVisible ? "Hide Filters" : "Show Filters"}
                </span>
              </button>
            )}
          </div>
          <p className="text-base sm:text-lg text-secondary-600">
            Found{" "}
            <span className="font-semibold text-primary-600">
              {books.length}
            </span>{" "}
            books on this page
            {searchQuery && (
              <span>
                {" "}
                for{" "}
                <span className="font-semibold text-primary-600">
                  "{searchQuery}"
                </span>
              </span>
            )}
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {books.map((book, index) => (
            <div
              key={`${book.key}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BookCard book={book} onBookClick={onBookClick} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Welcome State (No search yet)
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center py-16">
        <div className="mb-8">
          <BookOpenIcon className="h-24 w-24 text-primary-400 mx-auto mb-6 animate-bounce-gentle" />
          <h2 className="text-4xl font-display font-bold text-secondary-800 mb-4">
            Welcome to Book Finder
          </h2>
          <p className="text-xl text-secondary-600 mb-8">
            Start your literary journey by searching for your favorite books
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-effect p-6 text-center hover:bg-white/30 transition-all duration-300">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-secondary-800 mb-2">
              Smart Search
            </h3>
            <p className="text-sm text-secondary-600">
              Find books by title, author, or keywords
            </p>
          </div>

          <div className="glass-effect p-6 text-center hover:bg-white/30 transition-all duration-300">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-semibold text-secondary-800 mb-2">
              Millions of Books
            </h3>
            <p className="text-sm text-secondary-600">
              Access to Open Library's vast collection
            </p>
          </div>

          <div className="glass-effect p-6 text-center hover:bg-white/30 transition-all duration-300">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold text-secondary-800 mb-2">
              Beautiful Design
            </h3>
            <p className="text-sm text-secondary-600">
              Elegant and responsive user interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
