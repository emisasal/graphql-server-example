# GraphQL Tutorial: From Basics to Advanced

This tutorial will take you through GraphQL fundamentals step by step using this book management system.

## 📋 Prerequisites

1. Basic understanding of APIs
2. Familiarity with JSON
3. Node.js installed on your machine

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open Apollo Studio:**
   - Navigate to `http://localhost:4000` in your browser
   - Apollo Studio will open automatically

3. **Your first query:**
   Copy this into the left panel:
   ```graphql
   {
     books {
       title
     }
   }
   ```
   Click the "Run" button (▶️)

Congratulations! You just executed your first GraphQL query! 🎉

---

## 📖 Chapter 1: Understanding GraphQL Basics

### What makes GraphQL different?

Unlike REST APIs where you get fixed data structures, GraphQL lets you:
- **Ask for exactly what you need** - no over-fetching
- **Get multiple resources in one request**
- **Strongly typed** - catch errors before runtime

### The GraphQL Schema

A schema defines:
- **Types** - What data looks like
- **Queries** - How to read data  
- **Mutations** - How to modify data

### Exercise 1.1: Explore the Schema
Click the "Schema" tab in Apollo Studio to see all available types and operations.

### Exercise 1.2: Basic Queries
Try these progressively:

```graphql
# Just titles
{
  books {
    title
  }
}
```

```graphql  
# Add more fields
{
  books {
    id
    title
    genre
    publishedYear
  }
}
```

```graphql
# Include author information
{
  books {
    title
    author {
      name
      birthYear
    }
  }
}
```

**Key Learning:** Notice how you specify exactly which fields you want!

---

## 📖 Chapter 2: Working with Arguments

Arguments let you filter and customize your queries.

### Exercise 2.1: Find a Specific Book
```graphql
{
  findBook(title: "1984") {
    title
    author {
      name
    }
    publishedYear
    summary
  }
}
```

### Exercise 2.2: Filter by Genre
```graphql
{
  booksByGenre(genre: FICTION) {
    title
    author {
      name
    }
    publishedYear
  }
}
```

### Exercise 2.3: Search Functionality
```graphql
{
  searchBooks(query: "American") {
    title
    author {
      name
    }
    summary
  }
}
```

**Key Learning:** Arguments make queries dynamic and powerful!

---

## 📖 Chapter 3: Understanding Types

### Scalar Types
- `String` - Text data
- `Int` - Integer numbers  
- `Boolean` - true/false
- `ID` - Unique identifier
- `Float` - Decimal numbers

### Object Types
Custom types like `Book` and `Author` that have fields.

### Enum Types
Predefined values like `Genre` (FICTION, MYSTERY, etc.)

### Exercise 3.1: Explore Type Relationships
```graphql
{
  authorById(id: "3") {
    name
    bio
    birthYear
    books {
      title
      genre
      publishedYear
    }
  }
}
```

**Key Learning:** Types can reference other types, creating relationships!

---

## 📖 Chapter 4: Variables and Dynamic Queries

Variables make queries reusable and dynamic.

### Exercise 4.1: Using Variables

**Query:**
```graphql
query GetBooksByYear($year: Int!) {
  booksByYear(year: $year) {
    title
    author {
      name
    }
    genre
  }
}
```

**Variables (bottom panel):**
```json
{
  "year": 1949
}
```

Try changing the year to 1960, 1925, etc.

### Exercise 4.2: Optional Variables
```graphql
query SearchWithFilter($searchTerm: String!, $genre: Genre) {
  searchBooks(query: $searchTerm, genre: $genre) {
    title
    author {
      name
    }
    summary
  }
}
```

**Variables:**
```json
{
  "searchTerm": "American",
  "genre": "FICTION"
}
```

**Key Learning:** Variables make queries flexible and reusable!

---

## 📖 Chapter 5: Mutations - Changing Data

Mutations modify data (create, update, delete).

### Exercise 5.1: Create an Author
```graphql
mutation CreateAuthor($authorInput: AuthorInput!) {
  addAuthor(input: $authorInput) {
    id
    name
    bio
    birthYear
  }
}
```

**Variables:**
```json
{
  "authorInput": {
    "name": "J.K. Rowling",
    "bio": "British author of Harry Potter series",
    "birthYear": 1965
  }
}
```

### Exercise 5.2: Add a Book
```graphql
mutation CreateBook($bookInput: BookInput!) {
  addBook(input: $bookInput) {
    id
    title
    author {
      name
    }
    fullData
  }
}
```

**Variables (use the author ID from previous mutation):**
```json
{
  "bookInput": {
    "title": "Harry Potter and the Philosopher's Stone",
    "authorId": "6",
    "genre": "FANTASY",
    "publishedYear": 1997,
    "pages": 223,
    "summary": "A young wizard discovers his magical heritage."
  }
}
```

### Exercise 5.3: Update Data
```graphql
mutation UpdateBookInfo($id: ID!, $updates: BookUpdateInput!) {
  updateBook(id: $id, input: $updates) {
    id
    title
    pages
    summary
    isAvailable
  }
}
```

**Variables:**
```json
{
  "id": "1",
  "updates": {
    "pages": 195,
    "summary": "An updated summary about women's independence in 19th century."
  }
}
```

**Key Learning:** Mutations return data, so you can see the changes immediately!

---

## 📖 Chapter 6: Fragments - Reusable Fields

Fragments help avoid repeating the same field selections.

### Exercise 6.1: Basic Fragment
```graphql
fragment BookInfo on Book {
  id
  title
  genre
  publishedYear
  isAvailable
}

{
  availableBooks {
    ...BookInfo
    author {
      name
    }
  }
}
```

### Exercise 6.2: Nested Fragments
```graphql
fragment AuthorDetails on Author {
  id
  name
  bio
  birthYear
}

fragment CompleteBookInfo on Book {
  id
  title
  genre
  publishedYear
  pages
  summary
  isAvailable
  author {
    ...AuthorDetails
  }
}

{
  bookById(id: "3") {
    ...CompleteBookInfo
  }
}
```

**Key Learning:** Fragments promote code reuse and maintainability!

---

## 📖 Chapter 7: Advanced Queries

### Exercise 7.1: Multiple Queries in One Request
```graphql
{
  totalBooks: bookCount
  
  fictionBooks: booksByGenre(genre: FICTION) {
    title
    author {
      name
    }
  }
  
  availableCount: availableBooks {
    id
  }
  
  mysteryBooks: booksByGenre(genre: MYSTERY) {
    title
    author {
      name
    }
  }
}
```

### Exercise 7.2: Aliases for Different Filters
```graphql
{
  oldBooks: booksByYear(year: 1899) {
    title
    author {
      name
    }
  }
  
  classicBooks: booksByYear(year: 1949) {
    title
    author {
      name
    }
  }
  
  modernBooks: booksByYear(year: 1985) {
    title
    author {
      name
    }
  }
}
```

**Key Learning:** You can run multiple queries and use aliases to avoid conflicts!

---

## 📖 Chapter 8: Pagination

When you have lots of data, pagination helps manage it.

### Exercise 8.1: Basic Pagination
```graphql
{
  booksPaginated(first: 2) {
    edges {
      node {
        title
        author {
          name
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

### Exercise 8.2: Get Next Page
Use the `endCursor` from the previous result:
```graphql
{
  booksPaginated(first: 2, after: "2") {
    edges {
      node {
        title
        author {
          name
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

**Key Learning:** Cursor-based pagination is efficient for large datasets!

---

## 📖 Chapter 9: Error Handling

GraphQL provides detailed error information.

### Exercise 9.1: Trigger a Validation Error
Try adding a book with a duplicate title:
```graphql
mutation {
  addBook(input: {
    title: "1984"
    authorId: "3" 
    genre: SCIENCE_FICTION
  }) {
    id
    title
  }
}
```

Look at the error response - it shows exactly what went wrong!

### Exercise 9.2: Invalid Reference Error  
Try adding a book with non-existent author:
```graphql
mutation {
  addBook(input: {
    title: "Test Book"
    authorId: "999"
    genre: FICTION
  }) {
    id
    title
  }
}
```

**Key Learning:** GraphQL errors are descriptive and help debug issues!

---

## 📖 Chapter 10: Real-World Patterns

### Exercise 10.1: Dashboard Query
```graphql
fragment StatsFragment on Query {
  totalBooks: bookCount
  
  availableBooksCount: availableBooks {
    id
  }
}

query Dashboard {
  ...StatsFragment
  
  recentlyAdded: books {
    id
    title
    author {
      name
    }
  }
  
  genreBreakdown: books {
    genre
  }
}
```

### Exercise 10.2: Author Management
```graphql
query AuthorManagement {
  authors {
    id
    name
    birthYear
    bookCount: books {
      id
    }
    latestBook: books {
      title
      publishedYear
    }
  }
}
```

---

## 🎯 Practice Challenges

Now that you've learned the basics, try these challenges:

### Beginner Challenges
1. Find all books published after 1950
2. Get all authors born in the 20th century (1900-1999)
3. Add a new mystery author and book
4. Update a book's availability status

### Intermediate Challenges  
5. Create a query that shows genre distribution
6. Find books with more than 300 pages
7. Use fragments to create a "library card" view for books
8. Implement a "featured authors" query showing authors with multiple books

### Advanced Challenges
9. Create a complex search that filters by multiple criteria
10. Use pagination to create a "browse books" interface
11. Design a mutation workflow for updating author information
12. Handle error scenarios gracefully in your queries

---

## 🚀 Next Steps

Congratulations! You now understand GraphQL fundamentals. Here's what to explore next:

### Intermediate Topics
- **Subscriptions** - Real-time data updates
- **DataLoader** - Efficient data fetching
- **Custom Scalars** - Date, Email, URL types
- **Directives** - @include, @skip, custom directives

### Advanced Topics  
- **Schema Federation** - Combining multiple GraphQL services
- **Authorization** - Field-level permissions
- **Caching** - Query result caching
- **Performance** - Query complexity analysis

### Tools & Ecosystem
- **Apollo Client** - Frontend GraphQL client
- **Relay** - Facebook's GraphQL client
- **GraphQL Code Generator** - Generate types from schema
- **GraphQL Playground** - Advanced query IDE

## 📚 Additional Resources

- [GraphQL Official Tutorial](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [The Road to GraphQL Book](https://roadtoreact.com/the-road-to-graphql-book/)

Happy GraphQL learning! 🎉
