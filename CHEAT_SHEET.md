# GraphQL Cheat Sheet

Quick reference for GraphQL operations and syntax.

## 🔍 Query Syntax

### Basic Query
```graphql
{
  fieldName {
    subField
  }
}
```

### Query with Arguments
```graphql
{
  fieldName(argument: "value") {
    subField
  }
}
```

### Query with Variables
```graphql
query QueryName($variable: Type!) {
  fieldName(argument: $variable) {
    subField
  }
}
```

## 🔧 Mutation Syntax

### Basic Mutation
```graphql
mutation {
  mutationName(input: {
    field: "value"
  }) {
    returnField
  }
}
```

### Mutation with Variables
```graphql
mutation MutationName($input: InputType!) {
  mutationName(input: $input) {
    returnField
  }
}
```

## 🧩 Fragments

### Inline Fragment
```graphql
{
  fieldName {
    ... on TypeName {
      specificField
    }
  }
}
```

### Named Fragment
```graphql
fragment FragmentName on TypeName {
  field1
  field2
}

{
  fieldName {
    ...FragmentName
  }
}
```

## 🎯 Directives

### Include/Skip
```graphql
{
  fieldName {
    conditionalField @include(if: $includeField)
    anotherField @skip(if: $skipField)
  }
}
```

## 📊 Common Patterns

### Aliases
```graphql
{
  first: fieldName(filter: "value1") {
    subField
  }
  second: fieldName(filter: "value2") {
    subField
  }
}
```

### Pagination
```graphql
{
  connection(first: 10, after: "cursor") {
    edges {
      node {
        field
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## 🔤 Scalar Types

- `String` - UTF‐8 character sequence
- `Int` - 32‐bit integer
- `Float` - Double-precision floating-point
- `Boolean` - true or false
- `ID` - Unique identifier

## 📋 Type Modifiers

- `String` - Nullable string
- `String!` - Non-null string
- `[String]` - Nullable list of nullable strings
- `[String!]` - Nullable list of non-null strings
- `[String]!` - Non-null list of nullable strings
- `[String!]!` - Non-null list of non-null strings

## ⚠️ Error Handling

### Error Response Structure
```json
{
  "data": null,
  "errors": [
    {
      "message": "Error description",
      "locations": [{"line": 2, "column": 3}],
      "path": ["fieldName"],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

## 🎨 Best Practices

### Query Design
- Request only needed fields
- Use fragments for reusability
- Leverage aliases for multiple similar queries
- Use variables for dynamic values

### Schema Design
- Use descriptive names
- Prefer specific types over generic ones
- Design for client needs
- Use enums for finite sets of values

### Performance
- Avoid deeply nested queries
- Use pagination for large datasets
- Implement query complexity analysis
- Use DataLoader for N+1 prevention

## 🚀 Quick Commands

### Server Operations
```bash
npm start          # Start server
npm run dev        # Development mode
npm run build      # Build project
```

### Apollo Studio
- Open: `http://localhost:4000`
- Schema tab: View available types
- Explorer: Build queries visually
- Variables: Bottom panel for query variables

## 📱 Mobile-Friendly Testing

### Using curl
```bash
# Simple query
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "{ books { title } }"}'

# Query with variables
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: ID!) { bookById(id: $id) { title } }",
    "variables": {"id": "1"}
  }'
```

### Using HTTPie
```bash
# Install: brew install httpie
http POST localhost:4000 query='{ books { title } }'
```

This cheat sheet covers the essential GraphQL syntax and patterns you'll use daily! 📖
