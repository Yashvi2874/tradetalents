# TradeTalents API Documentation

This document provides detailed information about the TradeTalents API endpoints.

## Authentication

All API requests requiring authentication must include a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register User

**POST** `/api/auth/register`

Registers a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "university": "string"
}
```

**Response:**
```json
{
  "success": true,
  "_id": "string",
  "name": "string",
  "email": "string",
  "university": "string",
  "credits": "number",
  "token": "string"
}
```

### Login User

**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "_id": "string",
  "name": "string",
  "email": "string",
  "university": "string",
  "credits": "number",
  "token": "string"
}
```

### Get Current User

**GET** `/api/auth/me`

Retrieves the currently authenticated user's information.

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "university": "string",
  "credits": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## User Profile

### Get Profile

**GET** `/api/users/profile`

Retrieves the authenticated user's profile information.

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "university": "string",
  "credits": "number",
  "bio": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Update Profile

**PUT** `/api/users/profile`

Updates the authenticated user's profile information.

**Request Body:**
```json
{
  "name": "string",
  "university": "string",
  "bio": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "university": "string",
  "credits": "number",
  "bio": "string"
}
```

## User Skills

### Get User Skills

**GET** `/api/users/skills`

Retrieves the authenticated user's skills.

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "category": "string",
    "description": "string",
    "level": "string",
    "tags": ["string"],
    "tutor": {
      "_id": "string",
      "name": "string"
    },
    "rating": "number",
    "students": "number",
    "price": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Add Skill to User

**POST** `/api/users/skills`

Adds a skill to the authenticated user's profile.

**Request Body:**
```json
{
  "skillId": "string"
}
```

**Response:**
```json
{
  "message": "Skill added successfully"
}
```

## Sessions

### Get All Sessions

**GET** `/api/sessions`

Retrieves all sessions for the authenticated user (both as tutor and student).

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "tutor": {
      "_id": "string",
      "name": "string"
    },
    "students": [
      {
        "_id": "string",
        "name": "string"
      }
    ],
    "startTime": "date",
    "endTime": "date",
    "price": "number",
    "maxStudents": "number",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Get Session by ID

**GET** `/api/sessions/:id`

Retrieves a specific session by ID.

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "tutor": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "students": [
    {
      "_id": "string",
      "name": "string"
    }
  ],
  "startTime": "date",
  "endTime": "date",
  "price": "number",
  "maxStudents": "number",
  "status": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Create Session

**POST** `/api/sessions`

Creates a new session (tutors only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startTime": "date",
  "endTime": "date",
  "price": "number",
  "maxStudents": "number"
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "tutor": {
    "_id": "string",
    "name": "string"
  },
  "startTime": "date",
  "endTime": "date",
  "price": "number",
  "maxStudents": "number",
  "status": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Update Session

**PUT** `/api/sessions/:id`

Updates an existing session (tutors only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startTime": "date",
  "endTime": "date",
  "price": "number",
  "maxStudents": "number",
  "status": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "tutor": {
    "_id": "string",
    "name": "string"
  },
  "students": [
    {
      "_id": "string",
      "name": "string"
    }
  ],
  "startTime": "date",
  "endTime": "date",
  "price": "number",
  "maxStudents": "number",
  "status": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Delete Session

**DELETE** `/api/sessions/:id`

Deletes a session (tutors only).

**Response:**
```json
{
  "message": "Session removed"
}
```

### Join Session

**POST** `/api/sessions/:id/join`

Joins a session as a student.

**Response:**
```json
{
  "message": "Successfully joined session",
  "session": {
    // Session object
  },
  "remainingCredits": "number"
}
```

## Skills

### Get All Skills

**GET** `/api/skills`

Retrieves all skills with optional filtering and sorting.

**Query Parameters:**
- `category` (string): Filter by category
- `search` (string): Search by name, description, or tags
- `sortBy` (string): Sort by 'popular', 'rating', 'price-low', or 'price-high'

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "category": "string",
    "description": "string",
    "level": "string",
    "tags": ["string"],
    "tutor": {
      "_id": "string",
      "name": "string"
    },
    "rating": "number",
    "students": "number",
    "price": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Get Skill by ID

**GET** `/api/skills/:id`

Retrieves a specific skill by ID.

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "level": "string",
  "tags": ["string"],
  "tutor": {
    "_id": "string",
    "name": "string",
    "university": "string"
  },
  "rating": "number",
  "students": "number",
  "price": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Create Skill

**POST** `/api/skills`

Creates a new skill (tutors only).

**Request Body:**
```json
{
  "name": "string",
  "category": "string",
  "description": "string",
  "level": "string",
  "tags": ["string"],
  "price": "number"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "level": "string",
  "tags": ["string"],
  "tutor": {
    "_id": "string",
    "name": "string"
  },
  "rating": "number",
  "students": "number",
  "price": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Update Skill

**PUT** `/api/skills/:id`

Updates an existing skill (tutors only).

**Request Body:**
```json
{
  "name": "string",
  "category": "string",
  "description": "string",
  "level": "string",
  "tags": ["string"],
  "price": "number"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "level": "string",
  "tags": ["string"],
  "tutor": {
    "_id": "string",
    "name": "string"
  },
  "rating": "number",
  "students": "number",
  "price": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Delete Skill

**DELETE** `/api/skills/:id`

Deletes a skill (tutors only).

**Response:**
```json
{
  "message": "Skill removed"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error