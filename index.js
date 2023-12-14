const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const { v4 } = require("uuid");

const json = fs.readFileSync("./database/users.json", "utf8");
const users = JSON.parse(json);

const typeDefs = gql`
  type User {
    name: String!
    phone: String
    age: Int!
    city: String!
    id: ID
  }

  type Query {
    usersCount: Int
    getAllUsers: [User]!
    getUserById(id: String!): User
  }

  type Mutation {
    createUser(name: String!, phone: String, age: Int!, city: String!): User
    updateUser(
      id: String
      name: String
      phone: String
      age: Int
      city: String
    ): User
    deleteUser(id: String): User
  }
`;

const resolvers = {
  Query: {
    usersCount: () => users.length,
    getAllUsers: () => users,
    getUserById: (root, args) => users.find((user) => user.id === args.id),
  },
  Mutation: {
    createUser: (root, args) => {
      const user = { ...args, id: v4() };
      users.push(user);
      return user;
    },
    updateUser: (root, args) => {
      let user = users.find((user) => user.id === args.id);
      if (user) {
        user = Object.assign(user, args);
        return user;
      }
      return null;
    },
    deleteUser: (root, args) => {
      let user = users.find((user) => user.id === args.id);
      if (user) {
        users.splice(users.indexOf(user), 1);
        return user;
      }
      return null;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  {
    console.log(`🚀 Server ready at ${url}`);
  }
});
