import { useState } from "react";
import { HeartIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const BookCard = ({ book, onBookClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Extract book data
  const title = book.title || "Unknown Title";
  const authors = book.author_name
    ? book.author_name.slice(0, 2)
    : ["Unknown Author"];
  const firstPublishYear = book.first_publish_year || "Unknown Year";
  const coverId = book.cover_i;
  const pageCount = book.number_of_pages_median;
  const isbn = book.isbn?.[0];

  // Generate cover URL
  const getCoverUrl = (id, size = "M") => {
    return id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null;
  };

  const coverUrl = getCoverUrl(coverId);
  const defaultCover =
    "https://via.placeholder.com/200x300/e2e8f0/64748b?text=No+Cover";

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div
      className="card-elegant overflow-hidden group cursor-pointer hover:rotate-1 h-full flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative flex-1 flex flex-col">
        {/* Book Cover */}
        <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading-spinner w-6 h-6 sm:w-8 sm:h-8"></div>
            </div>
          )}

          <img
            src={!imageError && coverUrl ? coverUrl : defaultCover}
            alt={`Cover of ${title}`}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Click to view indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-semibold text-gray-800 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Click to view details
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={toggleLike}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/30"
          >
            {isLiked ? (
              <HeartIconSolid className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </button>

          {/* Year Badge */}
          {firstPublishYear !== "Unknown Year" && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              {firstPublishYear}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            {/* Title */}
            <h3 className="font-display font-bold text-sm sm:text-base md:text-lg text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem]">
              {title}
            </h3>

            {/* Authors */}
            <div className="flex items-start text-secondary-600 mb-2 sm:mb-3">
              <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium line-clamp-2 min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem]">
                {authors.join(", ")}
              </p>
            </div>
          </div>

          {/* Footer section */}
          <div>
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-secondary-500 mb-2 sm:mb-3 md:mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-xs">{firstPublishYear}</span>
              </div>

              {pageCount && (
                <div className="flex items-center hidden sm:flex">
                  <span className="text-xs">{pageCount} pages</span>
                </div>
              )}
            </div>

            {/* Progress Bar Animation */}
            <div className="h-0.5 sm:h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
            </div>
          </div>
        </div>

        {/* Hover Effect - Book Details Popup */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 border-t border-white/50 hidden sm:block">
          <div className="text-xs text-secondary-600 space-y-1">
            {isbn && (
              <p>
                <span className="font-semibold">ISBN:</span> {isbn}
              </p>
            )}
            <p>
              <span className="font-semibold">Click to view more details</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
