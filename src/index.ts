import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String
    author: String
    fullData: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    bookCount: Int!
    findBook(title: String!): Book
  }
`

const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
  },
  { id: 3, title: "1984", author: "George Orwell" },
  { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
]

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    bookCount: () => books.length,
    findBook: (parent, args) => {
      const { title } = args
      return books.find((book) => book.title === title)
    },
  },
  // Adding a new resolver for Mutation type
  Mutation: {
    addBook: (parent, args) => {
        if (books.find(book => book.title === args.title)) {
            throw new GraphQLError('Book title must be unique', {
                extensions: {
                    code: ApolloServerErrorCode.BAD_REQUEST,
                    invalidArgs: args.title,
                },
            });
        }
      const newBook = { id: books.length + 1, ...args }
      books.push(newBook) // In a real application, you'd likely persist this to a database
      return newBook
    },
  },
  // Adding additional resolvers with existing combined values
  // Must be added to the parent type (e.g., Book)
  Book: {
    fullData: (parent) => `${parent.title} by ${parent.author}`,
  },
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
