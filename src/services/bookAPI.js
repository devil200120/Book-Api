// Open Library API Service
const BASE_URL = 'https://openlibrary.org';

export const bookAPI = {
  // Search books by title with pagination support
  searchBooks: async (query, limit = 20, page = 1) => {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      const encodedQuery = encodeURIComponent(query.trim());
      const offset = (page - 1) * limit;
      const url = `${BASE_URL}/search.json?title=${encodedQuery}&limit=${limit}&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i,isbn,number_of_pages_median,subject,publisher,language`;
      
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.docs) {
        throw new Error('Invalid response format from API');
      }
      
      return {
        books: data.docs || [],
        totalResults: data.numFound || 0,
        currentPage: page,
        totalPages: Math.ceil((data.numFound || 0) / limit),
        hasNextPage: data.docs.length === limit && offset + limit < (data.numFound || 0),
        hasPrevPage: page > 1,
        query: query
      };
      
    } catch (error) {
      console.error('Error fetching books:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check your internet connection');
      }
      
      throw new Error(error.message || 'Failed to fetch books');
    }
  },

  // Get book details by ID (future enhancement)
  getBookDetails: async (bookId) => {
    try {
      const url = `${BASE_URL}/works/${bookId}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw new Error('Failed to fetch book details');
    }
  },

  // Search by author (future enhancement)
  searchByAuthor: async (authorName, limit = 20) => {
    try {
      const encodedAuthor = encodeURIComponent(authorName.trim());
      const url = `${BASE_URL}/search.json?author=${encodedAuthor}&limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error searching by author:', error);
      throw new Error('Failed to search by author');
    }
  },

  // Search by subject (future enhancement)
  searchBySubject: async (subject, limit = 20) => {
    try {
      const encodedSubject = encodeURIComponent(subject.trim());
      const url = `${BASE_URL}/search.json?subject=${encodedSubject}&limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error searching by subject:', error);
      throw new Error('Failed to search by subject');
    }
  }
};

// Utility functions for book data
export const bookUtils = {
  // Get cover image URL
  getCoverUrl: (coverId, size = 'M') => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  },

  // Get author cover URL
  getAuthorCoverUrl: (authorId, size = 'M') => {
    if (!authorId) return null;
    return `https://covers.openlibrary.org/a/id/${authorId}-${size}.jpg`;
  },

  // Format book data for consistent display
  formatBookData: (book) => {
    return {
      id: book.key,
      title: book.title || 'Unknown Title',
      authors: book.author_name || ['Unknown Author'],
      publishYear: book.first_publish_year || 'Unknown Year',
      coverId: book.cover_i,
      isbn: book.isbn?.[0],
      pageCount: book.number_of_pages_median,
      subjects: book.subject?.slice(0, 5) || [],
      publishers: book.publisher?.slice(0, 3) || [],
      languages: book.language || [],
      coverUrl: book.cover_i ? bookUtils.getCoverUrl(book.cover_i) : null
    };
  },

  // Validate search query
  validateSearchQuery: (query) => {
    if (!query || typeof query !== 'string') {
      return { isValid: false, error: 'Search query must be a string' };
    }
    
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length === 0) {
      return { isValid: false, error: 'Search query cannot be empty' };
    }
    
    if (trimmedQuery.length < 2) {
      return { isValid: false, error: 'Search query must be at least 2 characters long' };
    }
    
    if (trimmedQuery.length > 100) {
      return { isValid: false, error: 'Search query is too long (max 100 characters)' };
    }
    
    return { isValid: true, query: trimmedQuery };
  }
};

export default bookAPI;