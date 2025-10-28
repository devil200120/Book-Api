import { useState } from "react";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import BookDetailsModal from "./components/BookDetailsModal";
import FilterSection from "./components/FilterSection";
import Pagination from "./components/Pagination";
import { bookAPI, bookUtils } from "./services/bookAPI";

function App() {
  const [books, setBooks] = useState([]); // Current page books
  const [allBooksForFiltering, setAllBooksForFiltering] = useState([]); // All books for filtering
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [paginatedFilteredBooks, setPaginatedFilteredBooks] = useState([]); // Current page of filtered books
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filter pagination state
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(0);

  // Modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BOOKS_PER_PAGE = 20;

  // Fetch multiple pages of books for filtering
  const fetchBooksForFiltering = async (query, maxPages = 5) => {
    const allBooks = [];
    try {
      for (let page = 1; page <= maxPages; page++) {
        const result = await bookAPI.searchBooks(query, BOOKS_PER_PAGE, page);
        if (result.books.length === 0) break;
        allBooks.push(...result.books);
        
        // If we've reached the end of results, stop
        if (!result.hasNextPage) break;
      }
    } catch (error) {
      console.error("Error fetching books for filtering:", error);
    }
    return allBooks;
  };

  const handleSearch = async (query, page = 1) => {
    // Validate search query
    const validation = bookUtils.validateSearchQuery(query);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);
    setError(null);

    // If it's a new search (page 1), reset everything
    if (page === 1) {
      setSearchQuery(validation.query);
      setHasSearched(true);
      setCurrentPage(1);
      setFilteredCurrentPage(1);
      setShowFilters(false);
      setIsFiltering(false);
      
      // Fetch books for filtering (multiple pages)
      const booksForFiltering = await fetchBooksForFiltering(validation.query);
      setAllBooksForFiltering(booksForFiltering);
    }

    try {
      console.log("Searching for:", validation.query, "Page:", page);

      const result = await bookAPI.searchBooks(
        validation.query,
        BOOKS_PER_PAGE,
        page
      );

      console.log("Search result:", result);

      setBooks(result.books);
      setFilteredBooks(allBooksForFiltering.length > 0 ? allBooksForFiltering : result.books);
      setPaginatedFilteredBooks(result.books);
      setTotalResults(result.totalResults);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setHasNextPage(result.hasNextPage);
      setHasPrevPage(result.hasPrevPage);

      // If no books found, show appropriate message
      if (result.books.length === 0) {
        setError(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setBooks([]);
      setAllBooksForFiltering([]);
      setFilteredBooks([]);
      setPaginatedFilteredBooks([]);
      setTotalResults(0);
      setTotalPages(0);
      setCurrentPage(1);
      setFilteredCurrentPage(1);
      setHasNextPage(false);
      setHasPrevPage(false);
      setShowFilters(false);
      setIsFiltering(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilteredBooks = (filtered) => {
    setFilteredBooks(filtered);
    setIsFiltering(filtered.length !== allBooksForFiltering.length);
    
    // Reset to page 1 when filters change
    setFilteredCurrentPage(1);
    
    // Paginate filtered results
    const startIndex = 0; // Always start from page 1
    const endIndex = BOOKS_PER_PAGE;
    const paginatedBooks = filtered.slice(startIndex, endIndex);
    
    setPaginatedFilteredBooks(paginatedBooks);
    setFilteredTotalPages(Math.ceil(filtered.length / BOOKS_PER_PAGE));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePageChange = (newPage) => {
    if (isFiltering) {
      // Handle filtered pagination
      setFilteredCurrentPage(newPage);
      const startIndex = (newPage - 1) * BOOKS_PER_PAGE;
      const endIndex = startIndex + BOOKS_PER_PAGE;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
      setPaginatedFilteredBooks(paginatedBooks);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Handle normal pagination
      if (
        newPage < 1 ||
        newPage > totalPages ||
        newPage === currentPage ||
        isLoading
      ) {
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      handleSearch(searchQuery, newPage);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8">
          <div className="container mx-auto px-3 sm:px-4">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              hasResults={books.length > 0}
            />
          </div>
        </header>

        {/* Results Section */}
        <main className="pb-8 sm:pb-12 md:pb-16">
          <div className="container mx-auto px-3 sm:px-4">
            {/* Filter Section */}
            {hasSearched && allBooksForFiltering.length > 0 && (
              <FilterSection
                books={allBooksForFiltering}
                onFilteredBooks={handleFilteredBooks}
                isVisible={showFilters}
                onToggle={toggleFilters}
                searchQuery={searchQuery} // Pass searchQuery to detect new searches
              />
            )}

            <BookList
              books={isFiltering ? paginatedFilteredBooks : books}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              hasSearched={hasSearched}
              onBookClick={handleBookClick}
              showFilterToggle={hasSearched && allBooksForFiltering.length > 0}
              onToggleFilters={toggleFilters}
              filtersVisible={showFilters}
            />

            {/* Pagination */}
            {!isLoading && !error && (isFiltering ? paginatedFilteredBooks.length > 0 : books.length > 0) && (
              <Pagination
                currentPage={isFiltering ? filteredCurrentPage : currentPage}
                totalPages={isFiltering ? filteredTotalPages : totalPages}
                hasNextPage={isFiltering ? (filteredCurrentPage < filteredTotalPages) : hasNextPage}
                hasPrevPage={isFiltering ? (filteredCurrentPage > 1) : hasPrevPage}
                onPageChange={handlePageChange}
                totalResults={isFiltering ? filteredBooks.length : totalResults}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 sm:py-8 text-center">
          <div className="glass-effect max-w-4xl mx-auto p-4 sm:p-6 mx-3 sm:mx-4">
            <p className="text-secondary-600 text-xs sm:text-sm">
              📚{" "}
              <span className="font-semibold text-gradient">Book Finder</span> -
              Powered by{" "}
              <a
                href="https://openlibrary.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors duration-300"
              >
                Open Library API
              </a>
            </p>
            <p className="text-xs text-secondary-500 mt-2">
              Discover millions of books from libraries around the world ✨
            </p>
          </div>
        </footer>
      </div>

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
