import { buildSchema } from 'graphql';

export default buildSchema(`
    type Timer {
        _id: ID!
        isRunning: Boolean!
        startedAt: Int!
        resumedAt: Int
        remains: Int!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        timers: [Timer!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        user: User!
        timer(id: ID!): Timer!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        updateStatus(status: String!): User!
        createTimer(startTime: Int!): Timer!
        pauseTimer(id: ID!): Timer!
        resumeTimer(id: ID!): Timer!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
