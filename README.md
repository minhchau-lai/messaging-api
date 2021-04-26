# messaging-api
This is a simple backend messaging API written with Node/Express + PostgreSQL storage.
### Business Requirements
##### In Scope

- Enables sending a short text-based message from one user to another.
- Consumers can retrieve all messages for a recipient user from a specific sender within the last 30 days, with a limit
 of 100 messages.
- Consumers can retrieve all messages from all senders within the last 30 days, with a limit of 100 messages.
- Extra functionality: consumers can retrieve all messages for a single recipient within the last 30 days, with a limit
 of 100 messages.

##### Out of Scope

- Conversations - while the client can request all messages for a user from a specific sender, there is no method currently
to also request all messages sent from the user to the sender.
- Authorization.
- Authentication.
- Registration - users cannot be added, but the database is pre-populated with a few users.
- Real time message updates (websocket). When the client sends a message, a success status and messageId is provided
to confirm the message is stored, but the client will have to handle delivery on their end via polling.

### Dependencies/Libraries
- Node + Express
- TypeScript
- PostgreSQL
- node-postgres
- Jest
- Docker + Docker Compose
- Swagger

### Installation and running locally
1. Ensure [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed.
2. Run `docker-compose up` in project directory.
3. A Postgres container and API container will now start.
4. API is accessible at `localhost:3000`
5. Use Postman, `localhost:3000/api-docs`, or similar tool to execute calls.

### Running Tests
1. Ensure [Node](https://nodejs.org/en/download/) is installed.
2. Run `npm install` in project directory.
3. Run `npm run test` or `npm run test -- --coverage`.

### API
#### Pre-existing Users in User Table
| username |
|----------|
|minhchau-lai|
|john-smith|
|alex.realperson|
#### Endpoints

Swagger API docs also available at `localhost:3000` when API is running.

#### `POST` /messages
Sends a new message.
###### Request Parameters

```
*required*

body: {
        "senderUsername": "string",
        "recipientUsername": "string",
        "messageBody": "string"
      }
```

###### Example Request Body
```json
    {
        "SenderUsername": "minhchau-lai",
        "recipientUsername": "john-smith",
        "messageBody": "some message"
    }
```

###### Response Codes
`201`: response object

`404`: Not Found

`500`: Internal Server Error

###### Response Object
```
    {
      "messages": {
        "message_id": string
      }
    }
```

###### Example Response
```json
{
  "messages": {
    "message_id": "e4942e3a-aa07-407c-b3a8-0db26b95caee"
  }
}
```

#### `GET` /messages
Get messages from all senders within the last 30 day with a limit of 100 messages.

###### Request Parameters
None required

###### Response Object
```
    {
      "messages": [
        {
          "message_id": "string",
          "sender_username": "string",
          "recipient_username": "string",
          "message_body": "string",
          "timestamp": "datetime"
        }
      ]
    }
```

###### Response Codes
`200`: response object

`500`: Internal Server Error

###### Example Response
```
{
  "messages": [
    {
      "message_id": "e4942e3a-aa07-407c-b3a8-0db26b95caee",
      "sender_username": "minhchau-lai",
      "recipient_username": "john-smith",
      "message_body": "some message",
      "timestamp": "2021-04-26T18:16:49.878Z"
    },
    {
      "message_id": "51302832-0c36-42f7-b784-5c959a0fc810",
      "sender_username": "minhchau-lai",
      "recipient_username": "john-smith",
      "message_body": "string",
      "timestamp": "2021-04-26T16:26:42.233Z"
    }
  ]
}
```
#### `GET` /messages/{user}
Gets messages for a user within the last 30 days with a limit of 100.

###### Parameters
`path`: `username: string` *required*

`query`: `sender: string` 

###### Example Request Path
`/messages/minhchau-lai`

###### Example Request Path with Query Param
`/messages/minhchau-lai?sender=john-smith`

###### Response Codes
`200`: response object

`500`: Internal Server Error

###### Response Object
```json
{
  "user": "string",
  "messages": [
    {
      "message_id": "string",
      "sender_username": "string",
      "recipient_username": "string",
      "message_body": "string",
      "timestamp": "datetime"
    }
  ]
}
```

###### Example Response
```json
{
  "user": "john-smith",
  "messages": [
    {
      "message_id": "52e068f2-b33e-423c-a529-ad6df244dfc9",
      "sender_username": "alex.realperson",
      "recipient_username": "john-smith",
      "message_body": "some message",
      "timestamp": "2021-04-26T18:44:45.334Z"
    },
    {
      "message_id": "e4942e3a-aa07-407c-b3a8-0db26b95caee",
      "sender_username": "minhchau-lai",
      "recipient_username": "john-smith",
      "message_body": "some message",
      "timestamp": "2021-04-26T18:16:49.878Z"
    }
  ]
}
```

### Design considerations
##### Technologies chosen
Node with Express was chosen because it is lightweight, performant for an API light on CPU-intensive processing,
and its widespread adoption. For database choice, with the current implementation there should be little performance
difference between a relational and NoSQL db, so Postgres was chosen for its ease of use, scalability up to a pretty solid load, 
and it is open-source. TypeScript is preferred over JavaScript due to fewer errors during development with type checking.
The application deploys with Docker for extremely easy setup with one command, and is easy to migrate to Kubernetes
in the future for scalability.

##### API Structure
The API is structured using a `router <-> provider <-> client <-> db` model. This provides a strong separation of concerns.
The router validates requests and forwards them to the appropriate provider. The providers contains all business logic.
Different providers handle different routes, reducing code bloat, ease of testing, and allows different routes to use 
different clients (perhaps if a particular endpoint needs to use Redis instead of Postgres). This also provides easy
extensibility, as more routers and providers can be added for different business concerns (such as user or conversation endpoints).

##### Testing
With all business logic in the providers, it is easy to use Jest to mock clients and unit test the business logic.
The main app itself and the router contain no business logic to unit test, and would need to be tested via integration tests.

##### Security
Because authentication and authorization are not within scope, there are few other security concerns. The main one
is protecting against SQL injection attacks. This is mitigated by using the node-postgres's built in parameterized queries
rather than string concatenation for query construction. 

### Current Shortcomings/Considerations For Future Work

- TSLint currently not configured
- Needs more type checks in places
- DB initialization query could be moved to a SQL file that executes via Docker entrypoint
- Integration tests using supertest can be added to test whole data flow through API via HTTP request. The unit tests
do not test the "messages within the last 30 days with a limit of 100" condition since that is handled by the database
and the response is mocked in unit tests. An integration test can handle this case. The timestamp is currently set by the API
rather than the user to avoid malicious manipulation, so instead of having to wait 30 days to test this, a different provider
that allows the timestamp to be passed as a param can be run instead when in a test environment.

