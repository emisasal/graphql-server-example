# GraphQL Testing Guide

This guide provides systematic testing approaches for learning GraphQL concepts.

## 🧪 Test Categories

### 1. Basic Query Tests

#### Test 1.1: Simple Field Selection
```graphql
{
  books {
    title
  }
}
```
**Expected**: List of all book titles
**Learning**: Basic field selection

#### Test 1.2: Nested Field Selection
```graphql
{
  books {
    title
    author {
      name
    }
  }
}
```
**Expected**: Books with author names
**Learning**: Object relationships

### 2. Argument Tests

#### Test 2.1: Required Arguments
```graphql
{
  findBook(title: "1984") {
    id
    title
    author {
      name
    }
  }
}
```
**Expected**: Single book or null
**Learning**: Required arguments

#### Test 2.2: Optional Arguments
```graphql
{
  searchBooks(query: "American", genre: FICTION) {
    title
    summary
  }
}
```
**Expected**: Filtered books
**Learning**: Optional arguments

### 3. Variable Tests

#### Test 3.1: Basic Variables
```graphql
query GetBook($bookTitle: String!) {
  findBook(title: $bookTitle) {
    title
    publishedYear
  }
}
```
**Variables**:
```json
{ "bookTitle": "The Great Gatsby" }
```

#### Test 3.2: Optional Variables
```graphql
query SearchWithOptionalGenre($query: String!, $genre: Genre) {
  searchBooks(query: $query, genre: $genre) {
    title
    genre
  }
}
```
**Variables**:
```json
{ "query": "love" }
```

### 4. Fragment Tests

#### Test 4.1: Simple Fragment
```graphql
fragment BasicBookInfo on Book {
  id
  title
  genre
}

{
  books {
    ...BasicBookInfo
  }
}
```

#### Test 4.2: Nested Fragments
```graphql
fragment AuthorInfo on Author {
  name
  birthYear
}

fragment BookWithAuthor on Book {
  title
  author {
    ...AuthorInfo
  }
}

{
  books {
    ...BookWithAuthor
  }
}
```

### 5. Mutation Tests

#### Test 5.1: Create Author
```graphql
mutation CreateTestAuthor {
  addAuthor(input: {
    name: "Test Author"
    bio: "A test author for learning"
    birthYear: 1980
  }) {
    id
    name
    bio
  }
}
```

#### Test 5.2: Create Book
```graphql
mutation CreateTestBook($authorId: ID!) {
  addBook(input: {
    title: "Test Book"
    authorId: $authorId
    genre: FICTION
    pages: 200
    summary: "A book for testing"
  }) {
    id
    title
    author {
      name
    }
  }
}
```

### 6. Error Testing

#### Test 6.1: Duplicate Title Error
```graphql
mutation {
  addBook(input: {
    title: "1984"
    authorId: "1"
    genre: FICTION
  }) {
    id
    title
  }
}
```
**Expected**: GraphQL error about duplicate title

#### Test 6.2: Invalid Author Error
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
**Expected**: GraphQL error about author not found

#### Test 6.3: Invalid ISBN Error
```graphql
mutation {
  addBook(input: {
    title: "ISBN Test Book"
    authorId: "1"
    genre: FICTION
    isbn: "invalid-isbn"
  }) {
    id
    title
  }
}
```
**Expected**: GraphQL error about invalid ISBN

### 7. Advanced Query Tests

#### Test 7.1: Multiple Queries with Aliases
```graphql
{
  fictionBooks: booksByGenre(genre: FICTION) {
    title
    author { name }
  }
  
  mysteryBooks: booksByGenre(genre: MYSTERY) {
    title
    author { name }
  }
  
  totalBooks: bookCount
}
```

#### Test 7.2: Pagination Test
```graphql
{
  firstPage: booksPaginated(first: 2) {
    edges {
      node { title }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Then use the endCursor for the next page:
```graphql
{
  secondPage: booksPaginated(first: 2, after: "2") {
    edges {
      node { title }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### 8. Conditional Directives Tests

#### Test 8.1: Include Directive
```graphql
query BooksWithConditionalAuthorBio($includeBio: Boolean!) {
  books {
    title
    author {
      name
      bio @include(if: $includeBio)
    }
  }
}
```
**Variables**:
```json
{ "includeBio": true }
```

#### Test 8.2: Skip Directive
```graphql
query BooksWithOptionalISBN($skipISBN: Boolean!) {
  books {
    title
    isbn @skip(if: $skipISBN)
    pages
  }
}
```

### 9. Complex Relationship Tests

#### Test 9.1: Author with Book Count
```graphql
{
  authors {
    name
    books {
      id
    }
  }
}
```
**Learning**: Count items in relationships

#### Test 9.2: Deep Nesting
```graphql
{
  authors {
    name
    books {
      title
      genre
      author {
        name
        birthYear
      }
    }
  }
}
```
**Learning**: Circular references (author -> books -> author)

### 10. Update and Delete Tests

#### Test 10.1: Update Book
```graphql
mutation UpdateTestBook($id: ID!) {
  updateBook(id: $id, input: {
    pages: 250
    summary: "Updated summary for testing"
  }) {
    id
    title
    pages
    summary
  }
}
```

#### Test 10.2: Toggle Availability
```graphql
mutation ToggleBookAvailability($id: ID!) {
  toggleBookAvailability(id: $id) {
    id
    title
    isAvailable
  }
}
```

#### Test 10.3: Delete Book
```graphql
mutation DeleteTestBook($id: ID!) {
  deleteBook(id: $id)
}
```

## 🎯 Testing Workflow

### Phase 1: Basic Understanding
1. Run Test 1.1 and 1.2 to understand field selection
2. Try Test 2.1 and 2.2 to learn about arguments
3. Practice Test 3.1 and 3.2 for variables

### Phase 2: Advanced Queries
1. Implement Test 4.1 and 4.2 for fragments
2. Execute Test 7.1 for aliases
3. Try Test 7.2 for pagination

### Phase 3: Data Modification
1. Run Test 5.1 to create an author
2. Use the returned ID in Test 5.2 to create a book
3. Practice Test 10.1 and 10.2 for updates

### Phase 4: Error Handling
1. Execute Test 6.1, 6.2, and 6.3 to understand errors
2. Observe error messages and codes
3. Learn from validation feedback

### Phase 5: Advanced Concepts
1. Test conditional directives (Test 8.1, 8.2)
2. Explore complex relationships (Test 9.1, 9.2)
3. Practice complete CRUD operations

## 📊 Test Results Validation

### Successful Query Indicators
- Data field contains expected information
- No errors array in response
- Correct data types returned
- Relationships properly resolved

### Error Response Validation
- Errors array present
- Descriptive error messages
- Proper error codes (BAD_REQUEST, etc.)
- Extensions field with additional details

### Performance Considerations
- Query execution time
- Amount of data transferred
- Number of resolver calls

## 🔍 Debugging Tips

### Common Issues
1. **Field doesn't exist**: Check schema documentation
2. **Required argument missing**: Review query arguments
3. **Variable type mismatch**: Verify variable declarations
4. **Null values**: Check if fields are nullable

### Using Apollo Studio
1. Use Explorer tab to build queries visually
2. Check Schema tab for available fields
3. Use Variables panel for dynamic values
4. Review Response panel for results and errors

## 📈 Progressive Testing

Start with simple tests and gradually increase complexity:

1. **Beginner**: Tests 1-3
2. **Intermediate**: Tests 4-6
3. **Advanced**: Tests 7-10

Each test builds on previous knowledge and introduces new concepts systematically.

## 🏆 Testing Checklist

- [ ] Can query single fields
- [ ] Can query nested objects
- [ ] Can use arguments effectively
- [ ] Can work with variables
- [ ] Can create reusable fragments
- [ ] Can handle errors gracefully
- [ ] Can perform CRUD operations
- [ ] Can use pagination
- [ ] Can work with conditional directives
- [ ] Can debug issues independently

Complete this checklist to master GraphQL fundamentals! 🎓
