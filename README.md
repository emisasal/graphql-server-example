# GraphQL Server Example

A simple GraphQL server built with Apollo Server and Node.js that demonstrates basic query and mutation operations for managing a book collection.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **Query Operations**: Retrieve books, count books, and find specific books
- **Mutation Operations**: Add new books with validation
- **Type Safety** with TypeScript
- **Error Handling** with custom GraphQL errors
- **Computed Fields** for derived data
- **Advanced Learning Examples**: Comprehensive tutorials and examples

## 📚 Learning Resources

This project includes comprehensive learning materials perfect for mastering GraphQL:

- **[TUTORIAL.md](TUTORIAL.md)** - 📖 Complete step-by-step GraphQL tutorial from basics to advanced
- **[LEARNING_GUIDE.md](LEARNING_GUIDE.md)** - 🎯 Detailed learning objectives with structured examples  
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - 🧪 Systematic testing approaches and validation
- **[examples.md](examples.md)** - ⚡ Ready-to-copy interactive examples for Apollo Studio
- **[CHEAT_SHEET.md](CHEAT_SHEET.md)** - 📋 Quick reference for GraphQL syntax and patterns

**Perfect for learning GraphQL fundamentals!** 🎓

### 🎯 Learning Path

1. **Start with [TUTORIAL.md](TUTORIAL.md)** - Follow the step-by-step guide
2. **Practice with [examples.md](examples.md)** - Copy examples into Apollo Studio  
3. **Test systematically with [TESTING_GUIDE.md](TESTING_GUIDE.md)** - Validate your understanding
4. **Reference [CHEAT_SHEET.md](CHEAT_SHEET.md)** - Quick syntax lookup
5. **Deep dive with [LEARNING_GUIDE.md](LEARNING_GUIDE.md)** - Advanced concepts

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/emisasal/graphql-server-example.git
   cd graphql-server-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Server

1. Compile TypeScript:
   ```bash
   npm run compile
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will be available at `http://localhost:4000`

## 📊 GraphQL Schema

### Types

#### Book
```graphql
type Book {
  id: ID!
  title: String!
  author: Author!        # Relationship to Author type
  genre: Genre           # Enum type
  publishedYear: Int
  pages: Int
  isbn: String
  isAvailable: Boolean!
  fullData: String!      # Computed field: "title by author"
  summary: String
}
```

#### Author
```graphql
type Author {
  id: ID!
  name: String!
  bio: String
  birthYear: Int
  books: [Book!]!        # One-to-many relationship
}
```

#### Enums
```graphql
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
```

### Queries

#### Get all books with author details
```graphql
query {
  books {
    id
    title
    author {
      name
      bio
    }
    genre
    isAvailable
  }
}
```

#### Find book by title
```graphql
query {
  findBook(title: "1984") {
    id
    title
    author {
      name
      birthYear
    }
    publishedYear
    summary
  }
}
```

#### Filter books by genre
```graphql
query {
  booksByGenre(genre: SCIENCE_FICTION) {
    title
    author {
      name
    }
    publishedYear
  }
}
```

#### Search books
```graphql
query {
  searchBooks(query: "dystopian", genre: SCIENCE_FICTION) {
    title
    author {
      name
    }
    summary
  }
}
```

### Mutations

#### Add a new author
```graphql
mutation {
  addAuthor(input: {
    name: "Isaac Asimov"
    bio: "American science fiction writer"
    birthYear: 1920
  }) {
    id
    name
    bio
  }
}
```

#### Add a new book
```graphql
mutation {
  addBook(input: {
    title: "Foundation"
    authorId: "6"
    genre: SCIENCE_FICTION
    publishedYear: 1951
    pages: 244
    summary: "A galactic empire in decline and the science of psychohistory."
  }) {
    id
    title
    author {
      name
    }
    fullData
  }
}
```

#### Update book information
```graphql
mutation {
  updateBook(id: "1", input: {
    pages: 200
    summary: "Updated summary of the book"
  }) {
    id
    title
    pages
    summary
  }
}
```

#### Reset data for fresh start
```graphql
mutation {
  resetData
}
```

## 🧪 Testing the API

### Using Apollo Studio (Recommended)

1. Start the server
2. Open your browser and navigate to `http://localhost:4000`
3. Apollo Studio will open automatically
4. Try the example queries and mutations above

### Using curl

#### Get all books:
```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "{ books { id title author fullData } }"}'
```

#### Add a new book:
```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { addBook(title: \"New Book\", author: \"New Author\") { id title author fullData } }"}'
```

## 📁 Project Structure

```
graphql-server-example/
├── src/
│   └── index.ts          # Main server file with schema and resolvers
├── dist/                 # Compiled JavaScript files
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── LICENSE               # License file
└── README.md            # This file
```

## 🔧 Available Scripts

- `npm run compile` - Compile TypeScript to JavaScript
- `npm start` - Compile and start the server
- `npm run dev` - Start TypeScript compiler in watch mode
- `npm run serve` - Start the server (requires compiled files)
- `npm run build` - Clean and compile the project
- `npm run clean` - Remove compiled files

## 📚 Sample Data

The server comes with sample book data:

- "The Awakening" by Kate Chopin
- "City of Glass" by Paul Auster
- "1984" by George Orwell
- "To Kill a Mockingbird" by Harper Lee
- "The Great Gatsby" by F. Scott Fitzgerald

## ⚠️ Error Handling

The API includes validation for:

- **Duplicate book titles**: Returns a GraphQL error if you try to add a book with an existing title
- **Required fields**: Ensures all required fields are provided

Example error response:
```json
{
  "errors": [
    {
      "message": "Book title must be unique",
      "extensions": {
        "code": "BAD_REQUEST",
        "invalidArgs": "Existing Book Title"
      }
    }
  ]
}
```

## 🛡️ Technologies Used

- **Apollo Server** - GraphQL server implementation
- **GraphQL** - Query language for APIs
- **TypeScript** - Type-safe JavaScript
- **Node.js** - JavaScript runtime

## 📈 Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] User authentication and authorization
- [ ] Book categories and genres
- [ ] Pagination for large datasets
- [ ] Input validation with custom scalars
- [ ] Subscriptions for real-time updates
- [ ] Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
