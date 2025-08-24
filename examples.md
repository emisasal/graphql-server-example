# GraphQL Interactive Examples

Copy and paste these examples directly into Apollo Studio at `http://localhost:4000`

## 🚀 Quick Start Examples

### Example 1: Basic Book Query
```graphql
{
  books {
    id
    title
    author {
      name
    }
    genre
    isAvailable
  }
}
```

### Example 2: Search Books
```graphql
{
  searchBooks(query: "dystopian") {
    title
    author {
      name
    }
    summary
    publishedYear
  }
}
```

### Example 3: Add New Author
```graphql
mutation {
  addAuthor(input: {
    name: "Agatha Christie"
    bio: "British mystery writer"
    birthYear: 1890
  }) {
    id
    name
    bio
  }
}
```

### Example 4: Add Book by New Author
```graphql
mutation {
  addBook(input: {
    title: "Murder on the Orient Express"
    authorId: "6"
    genre: MYSTERY
    publishedYear: 1934
    pages: 256
    summary: "A classic murder mystery on a luxury train."
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

### Example 5: Get Author with All Books
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
      isAvailable
    }
  }
}
```

### Example 6: Update Book Availability
```graphql
mutation {
  toggleBookAvailability(id: "3") {
    id
    title
    isAvailable
  }
}
```

### Example 7: Paginated Books
```graphql
{
  booksPaginated(first: 3) {
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
      endCursor
    }
    totalCount
  }
}
```

### Example 8: Filter by Genre and Year
```graphql
{
  fiction: booksByGenre(genre: FICTION) {
    title
    author {
      name
    }
    publishedYear
  }
  
  classicBooks: booksByYear(year: 1949) {
    title
    author {
      name
    }
  }
}
```

### Example 9: Complex Query with Fragments
```graphql
fragment AuthorDetails on Author {
  id
  name
  bio
  birthYear
}

fragment BookSummary on Book {
  id
  title
  genre
  publishedYear
  isAvailable
}

{
  authors {
    ...AuthorDetails
    books {
      ...BookSummary
    }
  }
}
```

### Example 10: Variable-based Search
```graphql
query SearchWithVariables($searchTerm: String!, $filterGenre: Genre) {
  results: searchBooks(query: $searchTerm, genre: $filterGenre) {
    title
    author {
      name
    }
    genre
    summary
  }
}
```

**Use these variables:**
```json
{
  "searchTerm": "American",
  "filterGenre": "FICTION"
}
```

## 🎯 Try These Learning Challenges

1. **Challenge 1**: Create a new author and add 2 books by them
2. **Challenge 2**: Find all mystery books and check their availability
3. **Challenge 3**: Update a book's details (pages, summary, etc.)
4. **Challenge 4**: Use pagination to browse books 2 at a time
5. **Challenge 5**: Search for books with "love" in the summary

## 🛠️ Testing Error Scenarios

### Duplicate Book Title (should fail)
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

### Invalid Author ID (should fail)
```graphql
mutation {
  addBook(input: {
    title: "New Book"
    authorId: "999"
    genre: FICTION
  }) {
    id
    title
  }
}
```

### Delete Author with Books (should fail)
```graphql
mutation {
  deleteAuthor(id: "3")
}
```

## 📊 Data Exploration Queries

### Get Complete Database Overview
```graphql
{
  stats: bookCount
  
  allAuthors: authors {
    id
    name
    bookCount: books {
      id
    }
  }
  
  availableBooks: availableBooks {
    title
    author {
      name
    }
  }
  
  genreDistribution: books {
    genre
  }
}
```

### Books by Decade
```graphql
{
  books1800s: booksByYear(year: 1899) { title, author { name } }
  books1900s: booksByYear(year: 1949) { title, author { name } }
  books1960s: booksByYear(year: 1960) { title, author { name } }
  books1980s: booksByYear(year: 1985) { title, author { name } }
}
```
