# Quick Start Guide

Get up and running with GraphQL in 5 minutes! 🚀

## ⚡ Lightning Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open Apollo Studio
# Navigate to: http://localhost:4000
```

## 🎯 Your First 3 Queries

### 1. Get All Books
Copy this into Apollo Studio:
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

### 2. Search for a Book
```graphql
{
  findBook(title: "1984") {
    title
    author {
      name
    }
    summary
    publishedYear
  }
}
```

### 3. Add a New Author
```graphql
mutation {
  addAuthor(input: {
    name: "Your Name"
    bio: "Learning GraphQL"
    birthYear: 2000
  }) {
    id
    name
  }
}
```

## 🎓 What's Next?

1. **Follow the full tutorial**: Open [TUTORIAL.md](TUTORIAL.md)
2. **Try more examples**: Check [examples.md](examples.md)
3. **Test systematically**: Use [TESTING_GUIDE.md](TESTING_GUIDE.md)

## ❓ Need Help?

- **Apollo Studio not opening?** Make sure server is running on port 4000
- **Compilation errors?** Run `npm run clean && npm run compile`
- **Want to reset data?** Run this mutation: `mutation { resetData }`

**Happy GraphQL learning!** 🎉
