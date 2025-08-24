import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { initialAuthors, initialBooks, resetData, validateBookData, validateAuthorData, createValidationError } from './data.js';

// Helper functions for validation and utilities
const validateISBN = (isbn: string): boolean => {
  // Basic ISBN validation (simplified)
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return cleanISBN.length === 10 || cleanISBN.length === 13;
};

const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year > 0 && year <= currentYear;
};

const formatBookData = (book: any, author: any): string => {
  return `${book.title} by ${author?.name || 'Unknown Author'} (${book.publishedYear || 'Unknown Year'})`;
};

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # Enum for book genres - demonstrates enum types
  enum Genre {
    FICTION
    NON_FICTION
    MYSTERY
    ROMANCE
    SCIENCE_FICTION
    FANTASY
    BIOGRAPHY
    HISTORY
  }

  # Author type - demonstrates object relationships
  type Author {
    id: ID!
    name: String!
    bio: String
    birthYear: Int
    books: [Book!]!  # One-to-many relationship
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String!
    author: Author!     # Changed to Author object instead of string
    genre: Genre
    publishedYear: Int
    pages: Int
    isbn: String
    isAvailable: Boolean!
    fullData: String!   # Computed field: "title by author"
    summary: String
  }

  # Input types for mutations - demonstrates input validation
  input BookInput {
    title: String!
    authorId: ID!
    genre: Genre
    publishedYear: Int
    pages: Int
    isbn: String
    summary: String
  }

  input AuthorInput {
    name: String!
    bio: String
    birthYear: Int
  }

  input BookUpdateInput {
    title: String
    authorId: ID
    genre: Genre
    publishedYear: Int
    pages: Int
    isbn: String
    summary: String
    isAvailable: Boolean
  }

  # Pagination types
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type BookEdge {
    node: Book!
    cursor: String!
  }

  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    # Basic queries
    books: [Book!]!
    bookCount: Int!
    findBook(title: String!): Book
    bookById(id: ID!): Book
    
    # Author queries
    authors: [Author!]!
    authorById(id: ID!): Author
    authorByName(name: String!): Author
    
    # Advanced queries with arguments
    booksByGenre(genre: Genre!): [Book!]!
    booksByAuthor(authorId: ID!): [Book!]!
    booksByYear(year: Int!): [Book!]!
    availableBooks: [Book!]!
    
    # Pagination example
    booksPaginated(first: Int, after: String, last: Int, before: String): BookConnection!
    
    # Search functionality
    searchBooks(query: String!, genre: Genre): [Book!]!
  }

  # Mutations for CRUD operations
  type Mutation {
    # Book mutations
    addBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookUpdateInput!): Book!
    deleteBook(id: ID!): Boolean!
    toggleBookAvailability(id: ID!): Book!
    
    # Author mutations
    addAuthor(input: AuthorInput!): Author!
    updateAuthor(id: ID!, input: AuthorInput!): Author!
    deleteAuthor(id: ID!): Boolean!
    
    # Utility mutations for learning
    resetData: String!
  }
`

// Sample data - In a real application, this would come from a database
const authors = [...initialAuthors];
const books = [...initialBooks];

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
  Query: {
    // Basic book queries
    books: () => books,
    bookCount: () => books.length,
    findBook: (parent, args) => {
      const { title } = args
      return books.find((book) => book.title === title)
    },
    bookById: (parent, args) => {
      return books.find(book => book.id === parseInt(args.id))
    },

    // Author queries
    authors: () => authors,
    authorById: (parent, args) => {
      return authors.find(author => author.id === parseInt(args.id))
    },
    authorByName: (parent, args) => {
      return authors.find(author => author.name.toLowerCase().includes(args.name.toLowerCase()))
    },

    // Advanced queries
    booksByGenre: (parent, args) => {
      return books.filter(book => book.genre === args.genre)
    },
    booksByAuthor: (parent, args) => {
      return books.filter(book => book.authorId === parseInt(args.authorId))
    },
    booksByYear: (parent, args) => {
      return books.filter(book => book.publishedYear === args.year)
    },
    availableBooks: () => {
      return books.filter(book => book.isAvailable)
    },

    // Search functionality
    searchBooks: (parent, args) => {
      const { query, genre } = args
      let results = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.summary.toLowerCase().includes(query.toLowerCase())
      )
      
      if (genre) {
        results = results.filter(book => book.genre === genre)
      }
      
      return results
    },

    // Pagination example (simplified cursor-based pagination)
    booksPaginated: (parent, args) => {
      const { first = 2, after, last, before } = args
      let startIndex = 0
      let endIndex = books.length

      if (after) {
        const afterIndex = books.findIndex(book => book.id.toString() === after)
        startIndex = afterIndex + 1
      }

      if (before) {
        const beforeIndex = books.findIndex(book => book.id.toString() === before)
        endIndex = beforeIndex
      }

      if (first) {
        endIndex = Math.min(startIndex + first, endIndex)
      }

      if (last) {
        startIndex = Math.max(endIndex - last, startIndex)
      }

      const slicedBooks = books.slice(startIndex, endIndex)
      
      return {
        edges: slicedBooks.map(book => ({
          node: book,
          cursor: book.id.toString()
        })),
        pageInfo: {
          hasNextPage: endIndex < books.length,
          hasPreviousPage: startIndex > 0,
          startCursor: slicedBooks[0]?.id.toString(),
          endCursor: slicedBooks[slicedBooks.length - 1]?.id.toString()
        },
        totalCount: books.length
      }
    }
  },

  Mutation: {
    // Book mutations
    addBook: (parent, args) => {
      const { input } = args
      
      // Comprehensive validation
      if (books.find(book => book.title.toLowerCase() === input.title.toLowerCase())) {
        throw new GraphQLError('Book title must be unique', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'title', value: input.title },
          },
        });
      }

      const author = authors.find(author => author.id === parseInt(input.authorId));
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'authorId', value: input.authorId },
          },
        });
      }

      // Validate optional fields
      if (input.isbn && !validateISBN(input.isbn)) {
        throw new GraphQLError('Invalid ISBN format', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'isbn', value: input.isbn },
          },
        });
      }

      if (input.publishedYear && !validateYear(input.publishedYear)) {
        throw new GraphQLError('Invalid publication year', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'publishedYear', value: input.publishedYear },
          },
        });
      }

      if (input.pages && input.pages <= 0) {
        throw new GraphQLError('Pages must be a positive number', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'pages', value: input.pages },
          },
        });
      }

      const newBook = { 
        id: Math.max(...books.map(b => b.id)) + 1,
        authorId: parseInt(input.authorId),
        isAvailable: true,
        ...input
      }
      books.push(newBook)
      return newBook
    },

    updateBook: (parent, args) => {
      const { id, input } = args
      const bookIndex = books.findIndex(book => book.id === parseInt(id))
      
      if (bookIndex === -1) {
        throw new GraphQLError('Book not found', {
          extensions: { code: ApolloServerErrorCode.BAD_REQUEST }
        });
      }

      // Update only provided fields
      const updatedBook = { ...books[bookIndex], ...input }
      if (input.authorId) {
        updatedBook.authorId = parseInt(input.authorId)
      }
      
      books[bookIndex] = updatedBook
      return updatedBook
    },

    deleteBook: (parent, args) => {
      const bookIndex = books.findIndex(book => book.id === parseInt(args.id))
      if (bookIndex === -1) {
        return false
      }
      books.splice(bookIndex, 1)
      return true
    },

    toggleBookAvailability: (parent, args) => {
      const book = books.find(book => book.id === parseInt(args.id))
      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: { code: ApolloServerErrorCode.BAD_REQUEST }
        });
      }
      book.isAvailable = !book.isAvailable
      return book
    },

    // Author mutations
    addAuthor: (parent, args) => {
      const { input } = args
      
      // Validation
      if (authors.find(author => author.name.toLowerCase() === input.name.toLowerCase())) {
        throw new GraphQLError('Author name must be unique', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'name', value: input.name },
          },
        });
      }

      if (input.birthYear && !validateYear(input.birthYear)) {
        throw new GraphQLError('Invalid birth year', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'birthYear', value: input.birthYear },
          },
        });
      }

      if (input.name.trim().length < 2) {
        throw new GraphQLError('Author name must be at least 2 characters', {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            invalidArgs: { field: 'name', value: input.name },
          },
        });
      }

      const newAuthor = { 
        id: Math.max(...authors.map(a => a.id)) + 1,
        ...input,
        name: input.name.trim()
      }
      authors.push(newAuthor)
      return newAuthor
    },

    updateAuthor: (parent, args) => {
      const { id, input } = args
      const authorIndex = authors.findIndex(author => author.id === parseInt(id))
      
      if (authorIndex === -1) {
        throw new GraphQLError('Author not found', {
          extensions: { code: ApolloServerErrorCode.BAD_REQUEST }
        });
      }

      const updatedAuthor = { ...authors[authorIndex], ...input }
      authors[authorIndex] = updatedAuthor
      return updatedAuthor
    },

    deleteAuthor: (parent, args) => {
      const authorIndex = authors.findIndex(author => author.id === parseInt(args.id))
      if (authorIndex === -1) {
        return false
      }
      
      // Check if author has books
      const hasBooks = books.some(book => book.authorId === parseInt(args.id))
      if (hasBooks) {
        throw new GraphQLError('Cannot delete author with existing books', {
          extensions: { code: ApolloServerErrorCode.BAD_REQUEST }
        });
      }
      
      authors.splice(authorIndex, 1)
      return true
    },
    
    // Utility mutations for learning
    resetData: () => {
      const result = resetData(authors, books);
      return `Data reset successfully! Restored ${result.authors} authors and ${result.books} books.`;
    }
  },

  // Type resolvers for relationships and computed fields
  Book: {
    author: (parent) => {
      return authors.find(author => author.id === parent.authorId)
    },
    fullData: (parent) => {
      const author = authors.find(author => author.id === parent.authorId)
      return formatBookData(parent, author)
    },
  },

  Author: {
    books: (parent) => {
      return books.filter(book => book.authorId === parent.id)
    }
  }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
