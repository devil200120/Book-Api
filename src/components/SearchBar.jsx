import { useState } from "react";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const SearchBar = ({ onSearch, isLoading, hasResults }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        {/* Logo/Icon */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl md:rounded-2xl shadow-2xl mb-4 md:mb-6 animate-bounce-gentle">
            <BookOpenIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6 animate-slide-up">
          <span className="text-gradient">📚 Book Finder</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary-600 font-medium mb-4 md:mb-6 px-4 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Discover millions of books from the Open Library
        </p>

        {/* Feature badges */}
        <div
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 animate-slide-up px-4"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center glass-effect px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-secondary-700 rounded-full">
            <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-primary-500" />
            Free & Open Source
          </div>
          <div className="flex items-center glass-effect px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-secondary-700 rounded-full">
            <BookOpenIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-primary-500" />
            Millions of Books
          </div>
        </div>

        <div
          className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mt-3 md:mt-4 rounded-full animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>

      {/* Search Section */}
      <div
        className="relative animate-slide-up px-2 md:px-0"
        style={{ animationDelay: "0.8s" }}
      >
        <form onSubmit={handleSubmit} className="relative group">
          <div
            className={`glass-effect p-1.5 md:p-2 transition-all duration-500 hover:bg-white/40 ${
              isFocused ? "bg-white/50 scale-105 shadow-2xl" : ""
            }`}
          >
            {/* Search Input Container */}
            <div className="relative flex items-center">
              {/* Search Icon */}
              <div className="absolute left-3 md:left-4 z-10">
                <MagnifyingGlassIcon
                  className={`h-5 w-5 md:h-6 md:w-6 transition-all duration-300 ${
                    isFocused
                      ? "text-primary-600 scale-110"
                      : "text-primary-500"
                  }`}
                />
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Search books..."
                className="input-primary pl-10 pr-20 py-3 md:pl-14 md:pr-36 md:py-4 text-base md:text-lg font-medium placeholder:text-base md:placeholder:text-lg placeholder:font-normal w-full"
                disabled={isLoading}
              />

              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={`absolute right-1.5 md:right-2 flex items-center px-4 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-300 text-sm md:text-base ${
                  isLoading || !query.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-primary-700 hover:to-primary-800 hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-1.5 md:space-x-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Searching...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <span className="hidden sm:inline">Search Books</span>
                )}
                {!isLoading && (
                  <MagnifyingGlassIcon className="w-4 h-4 sm:hidden" />
                )}
              </button>
            </div>

            {/* Auto-suggestions Dropdown */}
            {showSuggestions && !isLoading && !hasResults && query === "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[9999] animate-slide-up max-h-80 overflow-y-auto">
                <div className="p-3 md:p-4 bg-white">
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 font-medium">
                    ✨ Popular searches:
                  </p>
                  <div className="space-y-1 md:space-y-2">
                    {[
                      "Harry Potter",
                      "The Great Gatsby",
                      "To Kill a Mockingbird",
                      "1984 by George Orwell",
                      "Pride and Prejudice",
                      "The Lord of the Rings",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(suggestion);
                        }}
                        className="w-full text-left px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all duration-200 flex items-center space-x-2 md:space-x-3 group border-b border-gray-100 last:border-b-0"
                      >
                        <MagnifyingGlassIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0" />
                        <span className="group-hover:font-medium truncate">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Search Tips */}
        <div
          className="mt-4 md:mt-6 text-center animate-fade-in px-4"
          style={{ animationDelay: "1s" }}
        >
          <p className="text-secondary-500 text-xs md:text-sm">
            💡 <span className="font-medium">Pro tip:</span>{" "}
            <span className="hidden sm:inline">
              Try searching by book title, author name, or even topics like
              "romance" or "science fiction"
            </span>
            <span className="sm:hidden">Search by title, author, or genre</span>
          </p>
        </div>
      </div>

      {/* Quick Search Suggestions */}
      <div
        className="mt-6 md:mt-8 text-center animate-fade-in px-4"
        style={{ animationDelay: "1.2s" }}
      >
        <p className="text-xs md:text-sm text-secondary-500 mb-3 md:mb-4 font-medium">
          🔥 Trending searches:
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {[
            "Harry Potter",
            "Lord of the Rings",
            "1984",
            "Pride and Prejudice",
            "The Alchemist",
            "Dune",
          ].map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-white/50 hover:bg-white/70 rounded-full text-xs md:text-sm text-secondary-700 hover:text-primary-600 transition-all duration-300 border border-white/30 hover:border-primary-300 hover:scale-105 font-medium"
              style={{ animationDelay: `${1.4 + index * 0.1}s` }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
