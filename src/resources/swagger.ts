export const swaggerConfig = {
    "swagger": "2.0",
    "info": {
        "description": "This is a basic backend messaging API with Express/TypeScript.",
        "version": "1.0.0",
        "title": "Messaging API"
    },
    "host": "localhost:3000",
    "basePath": "/",
    "schemes": [
        "http"
    ],
    "paths": {
        "/messages": {
            "post": {
                "tags": [
                    "messages"
                ],
                "summary": "Sends a new message",
                "description": "Sends a new message and returns the messageId generated",
                "operationId": "addMessage",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Message object to be added",
                        "required": true,
                        "paramType": "body",
                        "schema": {
                            "$ref": "#/definitions/Message"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Message sent"
                    },
                    "404": {
                        "description": "User(s) not found"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "get": {
                "tags": [
                    "messages"
                ],
                "summary": "gets all messages from all senders",
                "description": "Retrieves all messages sent for all users within last 30 days and/or limited to 100 messages",
                "operationId": "getAllMessages",
                "consumes": [
                    "application/json",
                    "application/xml"
                ],
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/messages/{username}": {
            "get": {
                "tags": [
                    "messages"
                ],
                "summary": "Retrieves all messages for a user or filtered by sender",
                "description": "retrieves all messages for a user or filtered by sender within last 30 days and/or limited to 100 messages",
                "operationId": "getUserMessages",
                "consumes": [
                    "application/json",
                    "application/xml"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "in": "path",
                        "name": "username",
                        "required": true,
                        "type": "string",
                        "paramType": "path"
                    },
                    {
                        "in": "query",
                        "name": "sender",
                        "type": "string",
                        "paramType": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        }
    },
    "definitions": {
        "Message": {
            "type": "object",
            "properties": {
                "senderUsername": {
                    "type": "string"
                },
                "recipientUsername": {
                    "type": "string"
                },
                "messageBody": {
                    "type": "string"
                }
            }
        }
    }
}