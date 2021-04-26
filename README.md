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
- Jest
- Docker + Docker Compose
- Swagger

### Installation and running locally
1. Ensure [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed.
2. Run `docker-compose up`.
3. A Postgres container and API container will now start.
4. API is accessible at `localhost:3000`
5. Use Postman, `localhost:3000/api-docs`, or similar tool to execute calls.

### API
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

### Considerations for future work

