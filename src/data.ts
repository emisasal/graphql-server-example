import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

// Initial seed data for the GraphQL server
export const initialAuthors = [
  { id: 1, name: "Kate Chopin", bio: "American author known for her feminist writings", birthYear: 1850 },
  { id: 2, name: "Paul Auster", bio: "American writer known for postmodern fiction", birthYear: 1947 },
  { id: 3, name: "George Orwell", bio: "English novelist and essayist, famous for dystopian fiction", birthYear: 1903 },
  { id: 4, name: "Harper Lee", bio: "American novelist known for To Kill a Mockingbird", birthYear: 1926 },
  { id: 5, name: "F. Scott Fitzgerald", bio: "American novelist of the Jazz Age", birthYear: 1896 },
];

export const initialBooks = [
  {
    id: 1,
    title: "The Awakening",
    authorId: 1,
    genre: "FICTION",
    publishedYear: 1899,
    pages: 183,
    isbn: "978-0486277868",
    isAvailable: true,
    summary: "A pioneering work of feminist literature that explores a woman's struggle for independence."
  },
  {
    id: 2,
    title: "City of Glass",
    authorId: 2,
    genre: "MYSTERY",
    publishedYear: 1985,
    pages: 158,
    isbn: "978-0140097313",
    isAvailable: true,
    summary: "A postmodern detective story that blurs the lines between reality and fiction."
  },
  {
    id: 3,
    title: "1984",
    authorId: 3,
    genre: "SCIENCE_FICTION",
    publishedYear: 1949,
    pages: 328,
    isbn: "978-0451524935",
    isAvailable: false,
    summary: "A dystopian vision of a totalitarian future where Big Brother watches everyone."
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    authorId: 4,
    genre: "FICTION",
    publishedYear: 1960,
    pages: 376,
    isbn: "978-0061120084",
    isAvailable: true,
    summary: "A story of racial injustice and childhood innocence in the American South."
  },
  {
    id: 5,
    title: "The Great Gatsby",
    authorId: 5,
    genre: "FICTION",
    publishedYear: 1925,
    pages: 180,
    isbn: "978-0743273565",
    isAvailable: true,
    summary: "A critique of the American Dream set in the Roaring Twenties."
  },
];

// Utility functions for data management
export const resetData = (authors: any[], books: any[]) => {
  // Clear existing data
  authors.length = 0;
  books.length = 0;
  
  // Restore initial data
  authors.push(...initialAuthors);
  books.push(...initialBooks);
  
  return { authors: authors.length, books: books.length };
};

// Learning data sets for different scenarios
export const learningDataSets = {
  minimal: {
    authors: [
      { id: 1, name: "Test Author", bio: "For learning purposes", birthYear: 2000 }
    ],
    books: [
      {
        id: 1,
        title: "Test Book",
        authorId: 1,
        genre: "FICTION",
        publishedYear: 2020,
        pages: 100,
        isbn: "978-0000000000",
        isAvailable: true,
        summary: "A simple book for testing GraphQL queries."
      }
    ]
  },
  
  diverse: {
    authors: [
      ...initialAuthors,
      { id: 6, name: "Agatha Christie", bio: "British mystery writer", birthYear: 1890 },
      { id: 7, name: "Isaac Asimov", bio: "American science fiction writer", birthYear: 1920 },
    ],
    books: [
      ...initialBooks,
      {
        id: 6,
        title: "Murder on the Orient Express",
        authorId: 6,
        genre: "MYSTERY",
        publishedYear: 1934,
        pages: 256,
        isbn: "978-0062693662",
        isAvailable: true,
        summary: "A classic murder mystery on a luxury train."
      },
      {
        id: 7,
        title: "Foundation",
        authorId: 7,
        genre: "SCIENCE_FICTION",
        publishedYear: 1951,
        pages: 244,
        isbn: "978-0553293357",
        isAvailable: true,
        summary: "A galactic empire in decline and the science of psychohistory."
      }
    ]
  }
};

// Data validation functions
export const validateBookData = (book: any) => {
  const errors = [];
  
  if (!book.title || book.title.trim().length < 1) {
    errors.push('Title is required');
  }
  
  if (!book.authorId) {
    errors.push('Author ID is required');
  }
  
  if (book.publishedYear && (book.publishedYear < 1 || book.publishedYear > new Date().getFullYear())) {
    errors.push('Invalid publication year');
  }
  
  if (book.pages && book.pages <= 0) {
    errors.push('Pages must be positive');
  }
  
  if (book.isbn && !validateISBN(book.isbn)) {
    errors.push('Invalid ISBN format');
  }
  
  return errors;
};

export const validateAuthorData = (author: any) => {
  const errors = [];
  
  if (!author.name || author.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (author.birthYear && (author.birthYear < 1 || author.birthYear > new Date().getFullYear())) {
    errors.push('Invalid birth year');
  }
  
  return errors;
};

// ISBN validation helper
const validateISBN = (isbn: string): boolean => {
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return cleanISBN.length === 10 || cleanISBN.length === 13;
};

// Error creation helper
export const createValidationError = (message: string, field: string, value: any) => {
  return new GraphQLError(message, {
    extensions: {
      code: ApolloServerErrorCode.BAD_REQUEST,
      invalidArgs: { field, value },
    },
  });
};
