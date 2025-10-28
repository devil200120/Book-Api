import { useState, useEffect } from "react";
import {
  XMarkIcon,
  HeartIcon,
  ShareIcon,
  BookOpenIcon,
  CalendarIcon,
  UserIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const BookDetailsModal = ({ book, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setImageLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  // Extract book data
  const title = book.title || "Unknown Title";
  const authors = book.author_name
    ? book.author_name.slice(0, 3)
    : ["Unknown Author"];
  const firstPublishYear = book.first_publish_year || "Unknown Year";
  const coverId = book.cover_i;
  const pageCount = book.number_of_pages_median;
  const isbn = book.isbn?.[0];
  const subjects = book.subject?.slice(0, 8) || [];
  const publishers = book.publisher?.slice(0, 3) || [];
  const languages = book.language?.slice(0, 3) || [];

  // Generate cover URL
  const getCoverUrl = (id, size = "L") => {
    return id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null;
  };

  const coverUrl = getCoverUrl(coverId);
  const defaultCover =
    "https://via.placeholder.com/400x600/e2e8f0/64748b?text=No+Cover";

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const shareBook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out "${title}"`,
          text: `Found this interesting book: ${title} by ${authors.join(
            ", "
          )}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${title} by ${authors.join(", ")}`);
      alert("Book details copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl transform transition-all duration-300 animate-slide-up overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Modal Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Book Cover Section - Mobile Optimized */}
            <div className="lg:w-2/5 bg-gradient-to-br from-gray-100 to-gray-200 p-3 sm:p-4 lg:p-6 xl:p-8 flex items-center justify-center min-h-[250px] sm:min-h-[300px] lg:min-h-0">
              <div className="relative w-full max-w-[200px] sm:max-w-xs lg:max-w-sm mx-auto">
                {/* Mobile-Optimized Loading State */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl shadow-2xl z-10">
                    <div className="text-center px-4 py-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/40 rounded-full mb-3 sm:mb-4">
                        <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 animate-pulse" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium px-2">
                        Loading book cover
                      </p>
                      <div className="mt-2 sm:mt-3 flex justify-center space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Cover Image */}
                <img
                  src={!imageError && coverUrl ? coverUrl : defaultCover}
                  alt={`Cover of ${title}`}
                  className={`w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-700 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />

                {/* Mobile-Optimized Floating Action Buttons */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 space-y-1 sm:space-y-2">
                  <button
                    onClick={toggleLike}
                    className="p-1.5 sm:p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 touch-manipulation"
                  >
                    {isLiked ? (
                      <HeartIconSolid className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-600" />
                    )}
                  </button>

                  <button
                    onClick={shareBook}
                    className="p-1.5 sm:p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 touch-manipulation"
                  >
                    <ShareIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 xl:p-12">
              <div className="space-y-4 sm:space-y-6">
                {/* Title and Year */}
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {title}
                  </h1>
                  {firstPublishYear !== "Unknown Year" && (
                    <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {firstPublishYear}
                    </div>
                  )}
                </div>

                {/* Authors */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                      Author(s)
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {authors.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {pageCount && (
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Pages
                        </p>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {pageCount}
                        </p>
                      </div>
                    </div>
                  )}

                  {isbn && (
                    <div className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">ISBN</p>
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm break-all">
                          {isbn}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Publishers */}
                {publishers.length > 0 && (
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <BuildingLibraryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                        Publisher(s)
                      </p>
                      <p className="text-sm sm:text-base text-gray-700">
                        {publishers.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {languages.length > 0 && (
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Language(s)
                      </p>
                      <p className="text-gray-700">{languages.join(", ")}</p>
                    </div>
                  </div>
                )}

                {/* Subjects/Tags */}
                {subjects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      Subjects & Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      Read More Details
                    </button>
                    <button
                      onClick={shareBook}
                      className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
                    >
                      Share Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
