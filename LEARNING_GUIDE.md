# GraphQL Learning Guide

This guide provides step-by-step examples to learn GraphQL fundamentals using this server.

## 🎯 Learning Objectives

After working through this guide, you'll understand:
- Basic GraphQL queries and mutations
- Type system (objects, scalars, enums, interfaces)
- Relationships between types
- Input types and validation
- Arguments and variables
- Fragments and directives
- Pagination patterns
- Error handling

## 📚 Prerequisites

1. Start the server: `npm start`
2. Open Apollo Studio: `http://localhost:4000`
3. Try the examples below in order

---

## 1. Basic Queries

### 1.1 Get All Books
```graphql
query GetAllBooks {
  books {
    id
    title
    author {
      name
    }
  }
}
```

### 1.2 Get Book Count
```graphql
query GetBookCount {
  bookCount
}
```

### 1.3 Find Specific Book
```graphql
query FindBook {
  findBook(title: "1984") {
    id
    title
    author {
      name
      birthYear
    }
    publishedYear
    pages
  }
}
```

---

## 2. Working with Relationships

### 2.1 Author with Their Books
```graphql
query AuthorWithBooks {
  authorByName(name: "George Orwell") {
    id
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

### 2.2 Book with Full Author Details
```graphql
query BookWithAuthor {
  bookById(id: "3") {
    title
    genre
    isAvailable
    author {
      name
      bio
      birthYear
    }
  }
}
```

---

## 3. Using Enums and Filters

### 3.1 Books by Genre
```graphql
query BooksByGenre {
  booksByGenre(genre: FICTION) {
    title
    author {
      name
    }
    publishedYear
  }
}
```

### 3.2 Available Books Only
```graphql
query AvailableBooks {
  availableBooks {
    title
    author {
      name
    }
    isAvailable
  }
}
```

---

## 4. Variables and Arguments

### 4.1 Using Variables (try with different years)
```graphql
query BooksByYear($year: Int!) {
  booksByYear(year: $year) {
    title
    author {
      name
    }
    genre
  }
}
```

**Variables (bottom panel in Apollo Studio):**
```json
{
  "year": 1949
}
```

### 4.2 Search with Optional Genre Filter
```graphql
query SearchBooks($query: String!, $genre: Genre) {
  searchBooks(query: $query, genre: $genre) {
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
  "query": "American",
  "genre": "FICTION"
}
```

---

## 5. Fragments for Code Reuse

### 5.1 Basic Fragment
```graphql
fragment BookDetails on Book {
  id
  title
  genre
  publishedYear
  pages
  isAvailable
}

query BooksWithFragments {
  books {
    ...BookDetails
    author {
      name
    }
  }
}
```

### 5.2 Nested Fragments
```graphql
fragment AuthorInfo on Author {
  id
  name
  bio
  birthYear
}

fragment FullBookDetails on Book {
  id
  title
  genre
  publishedYear
  pages
  isbn
  summary
  isAvailable
  fullData
  author {
    ...AuthorInfo
  }
}

query CompleteBookInfo {
  bookById(id: "1") {
    ...FullBookDetails
  }
}
```

---

## 6. Mutations - Creating Data

### 6.1 Add New Author
```graphql
mutation AddAuthor($input: AuthorInput!) {
  addAuthor(input: $input) {
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
  "input": {
    "name": "Jane Austen",
    "bio": "English novelist known for romantic fiction",
    "birthYear": 1775
  }
}
```

### 6.2 Add New Book
```graphql
mutation AddBook($input: BookInput!) {
  addBook(input: $input) {
    id
    title
    genre
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
  "input": {
    "title": "Pride and Prejudice",
    "authorId": "6",
    "genre": "ROMANCE",
    "publishedYear": 1813,
    "pages": 432,
    "isbn": "978-0141439518",
    "summary": "A romantic novel of manners set in Georgian England."
  }
}
```

---

## 7. Mutations - Updating Data

### 7.1 Update Book Information
```graphql
mutation UpdateBook($id: ID!, $input: BookUpdateInput!) {
  updateBook(id: $id, input: $input) {
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
  "input": {
    "pages": 200,
    "summary": "Updated summary: A pioneering feminist novel exploring themes of independence and self-discovery."
  }
}
```

### 7.2 Toggle Book Availability
```graphql
mutation ToggleAvailability($id: ID!) {
  toggleBookAvailability(id: $id) {
    id
    title
    isAvailable
  }
}
```

**Variables:**
```json
{
  "id": "3"
}
```

---

## 8. Pagination

### 8.1 Basic Pagination
```graphql
query BooksPaginated($first: Int, $after: String) {
  booksPaginated(first: $first, after: $after) {
    edges {
      node {
        id
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

**Variables (get first 2 books):**
```json
{
  "first": 2
}
```

**Variables (get next 2 books - use endCursor from previous result):**
```json
{
  "first": 2,
  "after": "2"
}
```

---

## 9. Error Handling

### 9.1 Try Adding Duplicate Book (will cause error)
```graphql
mutation AddDuplicateBook {
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

### 9.2 Try Deleting Author with Books (will cause error)
```graphql
mutation DeleteAuthorWithBooks {
  deleteAuthor(id: "3")
}
```

---

## 10. Complex Queries

### 10.1 Multiple Queries in One Request
```graphql
query Dashboard {
  totalBooks: bookCount
  availableBooksCount: availableBooks {
    id
  }
  fictionBooks: booksByGenre(genre: FICTION) {
    title
    author {
      name
    }
  }
  recentBooks: booksByYear(year: 1960) {
    title
    author {
      name
    }
  }
}
```

### 10.2 Conditional Fields with Directives
```graphql
query BooksWithConditionalFields($includeAuthorBio: Boolean!, $includeISBN: Boolean!) {
  books {
    id
    title
    genre
    author {
      name
      bio @include(if: $includeAuthorBio)
    }
    isbn @include(if: $includeISBN)
  }
}
```

**Variables:**
```json
{
  "includeAuthorBio": true,
  "includeISBN": false
}
```

---

## 🧪 Practice Exercises

Try these exercises to test your understanding:

1. **Create a complete author** with bio and birth year, then add a book by that author
2. **Search for books** containing "American" in the summary
3. **Use fragments** to create reusable field sets for authors and books
4. **Implement pagination** to browse through all books 2 at a time
5. **Update a book's availability** and verify the change
6. **Try error scenarios** like adding duplicate titles or invalid data
7. **Create complex queries** that fetch multiple related data points

## 📖 Key GraphQL Concepts Demonstrated

- **Types**: Object types (Book, Author), Scalar types (String, Int, Boolean, ID)
- **Enums**: Genre enumeration for type safety
- **Input Types**: Structured input for mutations
- **Relationships**: One-to-many between Author and Books
- **Resolvers**: Functions that fetch data for each field
- **Arguments**: Parameters for queries and mutations
- **Variables**: Dynamic values passed to operations
- **Fragments**: Reusable field selections
- **Directives**: Conditional field inclusion
- **Pagination**: Cursor-based pagination pattern
- **Error Handling**: GraphQL error responses
- **Validation**: Input validation and business rules

## 🎯 Next Steps

After mastering these basics, explore:
- GraphQL subscriptions for real-time updates
- DataLoader for solving N+1 query problems
- Schema stitching and federation
- Custom scalars (Date, Email, URL)
- Authorization and authentication
- Database integration
- Testing GraphQL APIs
