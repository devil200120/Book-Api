import { useState, useEffect } from "react";
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const FilterSection = ({ books, onFilteredBooks, isVisible, onToggle, searchQuery }) => {
  const [filters, setFilters] = useState({
    yearRange: { min: "", max: "" },
    authors: [],
    languages: [],
    publishers: [],
    subjects: [],
    hasISBN: null,
    hasCover: null,
  });

  const [availableFilters, setAvailableFilters] = useState({
    years: [],
    authors: [],
    languages: [],
    publishers: [],
    subjects: [],
  });

  const [previousSearchQuery, setPreviousSearchQuery] = useState(searchQuery);

  // Reset filters when search query changes (new search)
  useEffect(() => {
    if (searchQuery !== previousSearchQuery) {
      setFilters({
        yearRange: { min: "", max: "" },
        authors: [],
        languages: [],
        publishers: [],
        subjects: [],
        hasISBN: null,
        hasCover: null,
      });
      setPreviousSearchQuery(searchQuery);
    }
  }, [searchQuery, previousSearchQuery]);

  // Extract unique filter options from books
  useEffect(() => {
    if (!books || books.length === 0) return;

    const years = [
      ...new Set(books.map((book) => book.first_publish_year).filter(Boolean)),
    ].sort((a, b) => b - a);
    const authors = [
      ...new Set(books.flatMap((book) => book.author_name || [])),
    ]
      .slice(0, 15)
      .sort();
    const languages = [...new Set(books.flatMap((book) => book.language || []))]
      .slice(0, 10)
      .sort();
    const publishers = [
      ...new Set(books.flatMap((book) => book.publisher || [])),
    ]
      .slice(0, 15)
      .sort();
    const subjects = [...new Set(books.flatMap((book) => book.subject || []))]
      .slice(0, 20)
      .sort();

    setAvailableFilters({
      years,
      authors,
      languages,
      publishers,
      subjects,
    });
  }, [books]);

  // Apply filters and notify parent
  useEffect(() => {
    if (!books) return;

    let filtered = books.filter((book) => {
      // Year range filter
      if (
        filters.yearRange.min &&
        book.first_publish_year < parseInt(filters.yearRange.min)
      )
        return false;
      if (
        filters.yearRange.max &&
        book.first_publish_year > parseInt(filters.yearRange.max)
      )
        return false;

      // Author filter
      if (filters.authors.length > 0) {
        const bookAuthors = book.author_name || [];
        if (!filters.authors.some((author) => bookAuthors.includes(author)))
          return false;
      }

      // Language filter
      if (filters.languages.length > 0) {
        const bookLanguages = book.language || [];
        if (!filters.languages.some((lang) => bookLanguages.includes(lang)))
          return false;
      }

      // Publisher filter
      if (filters.publishers.length > 0) {
        const bookPublishers = book.publisher || [];
        if (!filters.publishers.some((pub) => bookPublishers.includes(pub)))
          return false;
      }

      // Subject filter
      if (filters.subjects.length > 0) {
        const bookSubjects = book.subject || [];
        if (!filters.subjects.some((subj) => bookSubjects.includes(subj)))
          return false;
      }

      // ISBN filter
      if (filters.hasISBN === true && (!book.isbn || book.isbn.length === 0))
        return false;
      if (filters.hasISBN === false && book.isbn && book.isbn.length > 0)
        return false;

      // Cover filter
      if (filters.hasCover === true && !book.cover_i) return false;
      if (filters.hasCover === false && book.cover_i) return false;

      return true;
    });

    onFilteredBooks(filtered);
  }, [filters, books, onFilteredBooks]);

  const handleYearChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      yearRange: { ...prev.yearRange, [type]: value },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      yearRange: { min: "", max: "" },
      authors: [],
      languages: [],
      publishers: [],
      subjects: [],
      hasISBN: null,
      hasCover: null,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.yearRange.min || filters.yearRange.max) count++;
    if (filters.authors.length > 0) count++;
    if (filters.languages.length > 0) count++;
    if (filters.publishers.length > 0) count++;
    if (filters.subjects.length > 0) count++;
    if (filters.hasISBN !== null) count++;
    if (filters.hasCover !== null) count++;
    return count;
  };

  return (
    <div
      className={`overflow-hidden transition-all duration-700 ease-in-out transform ${
        isVisible
          ? "max-h-[2000px] opacity-100 translate-y-0 scale-100"
          : "max-h-0 opacity-0 -translate-y-2 scale-95"
      }`}
    >
      <div
        className={`bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 mx-1 sm:mx-0 transition-all duration-500 ease-out transform ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"
        }`}
      >
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Filter Results
            </h3>
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full transition-all duration-300 animate-pulse">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-all duration-300 px-2 py-1 rounded hover:bg-red-50 hover:scale-105 active:scale-95"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
            >
              <XMarkIcon className="w-4 h-4 transition-transform duration-300 hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Info note about filtering */}
        <div className="mb-3 sm:mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Smart Filtering:</strong> Filters are applied across multiple pages of results and then paginated for easy browsing.
          </p>
        </div>

        {/* Filter Controls in Row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {/* Publication Year Filter */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <label className="text-xs font-medium text-gray-700">Year Range</label>
            </div>
            <div className="flex space-x-1">
              <input
                type="number"
                placeholder="From"
                value={filters.yearRange.min}
                onChange={(e) => handleYearChange("min", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="number"
                placeholder="To"
                value={filters.yearRange.max}
                onChange={(e) => handleYearChange("max", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Authors Filter */}
          {availableFilters.authors.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                <label className="text-xs font-medium text-gray-700">Authors</label>
              </div>
              <select
                value={filters.authors[0] || ""}
                onChange={(e) => {
                  const selectedAuthor = e.target.value;
                  setFilters(prev => ({ 
                    ...prev, 
                    authors: selectedAuthor ? [selectedAuthor] : [] 
                  }));
                }}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="">All Authors</option>
                {availableFilters.authors.slice(0, 15).map((author) => (
                  <option key={author} value={author} className="text-xs">
                    {author}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Languages Filter */}
          {availableFilters.languages.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <GlobeAltIcon className="w-3.5 h-3.5 text-gray-500" />
                <label className="text-xs font-medium text-gray-700">Languages</label>
              </div>
              <select
                value={filters.languages[0] || ""}
                onChange={(e) => {
                  const selectedLanguage = e.target.value;
                  setFilters(prev => ({ 
                    ...prev, 
                    languages: selectedLanguage ? [selectedLanguage] : [] 
                  }));
                }}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="">All Languages</option>
                {availableFilters.languages.slice(0, 10).map((language) => (
                  <option key={language} value={language} className="text-xs">
                    {language.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Publishers Filter */}
          {availableFilters.publishers.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <BuildingLibraryIcon className="w-3.5 h-3.5 text-gray-500" />
                <label className="text-xs font-medium text-gray-700">Publishers</label>
              </div>
              <select
                value={filters.publishers[0] || ""}
                onChange={(e) => {
                  const selectedPublisher = e.target.value;
                  setFilters(prev => ({ 
                    ...prev, 
                    publishers: selectedPublisher ? [selectedPublisher] : [] 
                  }));
                }}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="">All Publishers</option>
                {availableFilters.publishers.slice(0, 15).map((publisher) => (
                  <option key={publisher} value={publisher} className="text-xs">
                    {publisher}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Second Row for Subjects and Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
          {/* Subjects Filter */}
          {availableFilters.subjects.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <TagIcon className="w-3.5 h-3.5 text-gray-500" />
                <label className="text-xs font-medium text-gray-700">Subjects/Genres</label>
              </div>
              <select
                value={filters.subjects[0] || ""}
                onChange={(e) => {
                  const selectedSubject = e.target.value;
                  setFilters(prev => ({ 
                    ...prev, 
                    subjects: selectedSubject ? [selectedSubject] : [] 
                  }));
                }}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="">All Subjects</option>
                {availableFilters.subjects.slice(0, 20).map((subject) => (
                  <option key={subject} value={subject} className="text-xs">
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ISBN Availability */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">ISBN Status</label>
            <select
              value={filters.hasISBN === null ? 'all' : filters.hasISBN.toString()}
              onChange={(e) => {
                const value = e.target.value === 'all' ? null : e.target.value === 'true';
                setFilters(prev => ({ ...prev, hasISBN: value }));
              }}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Books</option>
              <option value="true">Has ISBN</option>
              <option value="false">No ISBN</option>
            </select>
          </div>

          {/* Cover Availability */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Cover Status</label>
            <select
              value={filters.hasCover === null ? 'all' : filters.hasCover.toString()}
              onChange={(e) => {
                const value = e.target.value === 'all' ? null : e.target.value === 'true';
                setFilters(prev => ({ ...prev, hasCover: value }));
              }}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Books</option>
              <option value="true">Has Cover</option>
              <option value="false">No Cover</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
