import { useState, useEffect } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const FilterSection = ({ books, onFilteredBooks, isVisible, onToggle }) => {
  const [filters, setFilters] = useState({
    yearRange: { min: '', max: '' },
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

  // Extract unique filter options from books
  useEffect(() => {
    if (!books || books.length === 0) return;

    const years = [...new Set(books.map(book => book.first_publish_year).filter(Boolean))].sort((a, b) => b - a);
    const authors = [...new Set(books.flatMap(book => book.author_name || []))].slice(0, 15).sort();
    const languages = [...new Set(books.flatMap(book => book.language || []))].slice(0, 10).sort();
    const publishers = [...new Set(books.flatMap(book => book.publisher || []))].slice(0, 15).sort();
    const subjects = [...new Set(books.flatMap(book => book.subject || []))].slice(0, 20).sort();

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

    let filtered = books.filter(book => {
      // Year range filter
      if (filters.yearRange.min && book.first_publish_year < parseInt(filters.yearRange.min)) return false;
      if (filters.yearRange.max && book.first_publish_year > parseInt(filters.yearRange.max)) return false;

      // Author filter
      if (filters.authors.length > 0) {
        const bookAuthors = book.author_name || [];
        if (!filters.authors.some(author => bookAuthors.includes(author))) return false;
      }

      // Language filter
      if (filters.languages.length > 0) {
        const bookLanguages = book.language || [];
        if (!filters.languages.some(lang => bookLanguages.includes(lang))) return false;
      }

      // Publisher filter
      if (filters.publishers.length > 0) {
        const bookPublishers = book.publisher || [];
        if (!filters.publishers.some(pub => bookPublishers.includes(pub))) return false;
      }

      // Subject filter
      if (filters.subjects.length > 0) {
        const bookSubjects = book.subject || [];
        if (!filters.subjects.some(subj => bookSubjects.includes(subj))) return false;
      }

      // ISBN filter
      if (filters.hasISBN === true && (!book.isbn || book.isbn.length === 0)) return false;
      if (filters.hasISBN === false && book.isbn && book.isbn.length > 0) return false;

      // Cover filter
      if (filters.hasCover === true && !book.cover_i) return false;
      if (filters.hasCover === false && book.cover_i) return false;

      return true;
    });

    onFilteredBooks(filtered);
  }, [filters, books, onFilteredBooks]);

  const handleArrayFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleYearChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      yearRange: { ...prev.yearRange, [type]: value }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      yearRange: { min: '', max: '' },
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
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'max-h-screen opacity-100 transform translate-y-0' 
          : 'max-h-0 opacity-0 transform -translate-y-4'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-3 sm:p-4 mb-4 sm:mb-6 transform transition-all duration-300 ease-out">
        {/* Filter Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Filter Results</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Publication Year Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5">
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <label className="text-xs sm:text-sm font-medium text-gray-700">Publication Year</label>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="From"
              value={filters.yearRange.min}
              onChange={(e) => handleYearChange('min', e.target.value)}
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="number"
              placeholder="To"
              value={filters.yearRange.max}
              onChange={(e) => handleYearChange('max', e.target.value)}
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Authors Filter */}
        {availableFilters.authors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Authors</label>
            </div>
            <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1 pr-1">
              {availableFilters.authors.slice(0, 10).map(author => (
                <label key={author} className="flex items-center space-x-1.5 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={filters.authors.includes(author)}
                    onChange={() => handleArrayFilter('authors', author)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="truncate">{author}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Languages Filter */}
        {availableFilters.languages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <GlobeAltIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Languages</label>
            </div>
            <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto pr-1">
              {availableFilters.languages.slice(0, 8).map(language => (
                <label key={language} className="flex items-center space-x-1.5 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => handleArrayFilter('languages', language)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="uppercase">{language}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Publishers Filter */}
        {availableFilters.publishers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <BuildingLibraryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Publishers</label>
            </div>
            <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1 pr-1">
              {availableFilters.publishers.slice(0, 10).map(publisher => (
                <label key={publisher} className="flex items-center space-x-1.5 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={filters.publishers.includes(publisher)}
                    onChange={() => handleArrayFilter('publishers', publisher)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="truncate">{publisher}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Subjects Filter */}
        {availableFilters.subjects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <label className="text-xs sm:text-sm font-medium text-gray-700">Subjects/Genres</label>
            </div>
            <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1 pr-1">
              {availableFilters.subjects.slice(0, 15).map(subject => (
                <label key={subject} className="flex items-center space-x-1.5 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={filters.subjects.includes(subject)}
                    onChange={() => handleArrayFilter('subjects', subject)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="truncate">{subject}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Availability Filters */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Availability</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-600 font-medium">ISBN Status:</div>
              <div className="space-y-0.5">
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="isbn"
                    checked={filters.hasISBN === true}
                    onChange={() => setFilters(prev => ({ ...prev, hasISBN: true }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>Has ISBN</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="isbn"
                    checked={filters.hasISBN === false}
                    onChange={() => setFilters(prev => ({ ...prev, hasISBN: false }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>No ISBN</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="isbn"
                    checked={filters.hasISBN === null}
                    onChange={() => setFilters(prev => ({ ...prev, hasISBN: null }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>All books</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600 font-medium">Cover Status:</div>
              <div className="space-y-0.5">
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="cover"
                    checked={filters.hasCover === true}
                    onChange={() => setFilters(prev => ({ ...prev, hasCover: true }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>Has Cover</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="cover"
                    checked={filters.hasCover === false}
                    onChange={() => setFilters(prev => ({ ...prev, hasCover: false }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>No Cover</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs">
                  <input
                    type="radio"
                    name="cover"
                    checked={filters.hasCover === null}
                    onChange={() => setFilters(prev => ({ ...prev, hasCover: null }))}
                    className="text-primary-600 focus:ring-primary-500 w-3 h-3"
                  />
                  <span>All books</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FilterSection;