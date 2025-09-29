# TradeTalents Database Schema

This document describes the MongoDB database schema for the TradeTalents application.

## Overview

The database consists of four main collections:
1. Users
2. Sessions
3. Skills
4. Messages

## Users Collection

### Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  university: String,
  credits: Number,
  bio: String,
  skills: [ObjectId], // References to Skills
  sessions: [ObjectId], // References to Sessions
  role: String, // 'student', 'tutor', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| name | String | Yes | User's full name |
| email | String | Yes | User's email (unique) |
| password | String | Yes | Hashed password |
| university | String | Yes | User's university |
| credits | Number | No | User's credit balance (default: 0) |
| bio | String | No | User's biography |
| skills | Array of ObjectId | No | References to user's skills |
| sessions | Array of ObjectId | No | References to user's sessions |
| role | String | No | User role (default: 'student') |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Sessions Collection

### Schema

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  tutor: ObjectId, // Reference to User
  students: [ObjectId], // References to Users
  startTime: Date,
  endTime: Date,
  price: Number,
  maxStudents: Number,
  status: String, // 'upcoming', 'ongoing', 'completed', 'cancelled'
  createdAt: Date,
  updatedAt: Date
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| title | String | Yes | Session title |
| description | String | Yes | Session description |
| tutor | ObjectId | Yes | Reference to tutor (User) |
| students | Array of ObjectId | No | References to enrolled students |
| startTime | Date | Yes | Session start time |
| endTime | Date | Yes | Session end time |
| price | Number | Yes | Session price in credits |
| maxStudents | Number | No | Maximum students (default: 10) |
| status | String | No | Session status (default: 'upcoming') |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Skills Collection

### Schema

```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  description: String,
  level: String, // 'Beginner', 'Intermediate', 'Advanced'
  tags: [String],
  tutor: ObjectId, // Reference to User
  rating: Number,
  students: Number,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| name | String | Yes | Skill name |
| category | String | Yes | Skill category |
| description | String | Yes | Skill description |
| level | String | Yes | Skill level |
| tags | Array of String | No | Skill tags |
| tutor | ObjectId | Yes | Reference to tutor (User) |
| rating | Number | No | Average rating (0-5) |
| students | Number | No | Number of students |
| price | Number | Yes | Price in credits |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Messages Collection

### Schema

```javascript
{
  _id: ObjectId,
  session: ObjectId, // Reference to Session
  sender: ObjectId, // Reference to User
  content: String,
  isTutor: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| session | ObjectId | Yes | Reference to session |
| sender | ObjectId | Yes | Reference to sender (User) |
| content | String | Yes | Message content |
| isTutor | Boolean | No | Whether sender is tutor (default: false) |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Last update timestamp |

## Relationships

### User - Session
- One-to-many: A user (tutor) can create many sessions
- Many-to-many: Users can enroll in multiple sessions as students

### User - Skill
- One-to-many: A user (tutor) can create many skills
- Many-to-many: Users can have multiple skills

### Session - Message
- One-to-many: A session can have many messages

### User - Message
- One-to-many: A user can send many messages

## Indexes

### Users
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "name": 1 })
db.users.createIndex({ "university": 1 })
```

### Sessions
```javascript
db.sessions.createIndex({ "tutor": 1 })
db.sessions.createIndex({ "startTime": 1 })
db.sessions.createIndex({ "status": 1 })
```

### Skills
```javascript
db.skills.createIndex({ "name": 1 })
db.skills.createIndex({ "category": 1 })
db.skills.createIndex({ "tutor": 1 })
db.skills.createIndex({ "tags": 1 })
```

### Messages
```javascript
db.messages.createIndex({ "session": 1 })
db.messages.createIndex({ "sender": 1 })
db.messages.createIndex({ "createdAt": 1 })
```

## Sample Data

### User Document
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$...",
  university: "Example University",
  credits: 100,
  bio: "Computer Science student with expertise in web development",
  skills: [
    ObjectId("507f191e810c19729de860ea"),
    ObjectId("507f191e810c19729de860eb")
  ],
  sessions: [
    ObjectId("507f191e810c19729de860ec")
  ],
  role: "student",
  createdAt: ISODate("2023-01-01T00:00:00Z"),
  updatedAt: ISODate("2023-01-01T00:00:00Z")
}
```

### Session Document
```javascript
{
  _id: ObjectId("507f191e810c19729de860ec"),
  title: "JavaScript Fundamentals",
  description: "Learn the basics of JavaScript programming",
  tutor: ObjectId("507f1f77bcf86cd799439011"),
  students: [
    ObjectId("507f1f77bcf86cd799439012")
  ],
  startTime: ISODate("2023-06-01T10:00:00Z"),
  endTime: ISODate("2023-06-01T11:00:00Z"),
  price: 25,
  maxStudents: 10,
  status: "upcoming",
  createdAt: ISODate("2023-05-01T00:00:00Z"),
  updatedAt: ISODate("2023-05-01T00:00:00Z")
}
```

### Skill Document
```javascript
{
  _id: ObjectId("507f191e810c19729de860ea"),
  name: "JavaScript",
  category: "Programming",
  description: "A programming language that conforms to the ECMAScript specification",
  level: "Beginner",
  tags: ["web", "frontend", "programming"],
  tutor: ObjectId("507f1f77bcf86cd799439011"),
  rating: 4.8,
  students: 120,
  price: 25,
  createdAt: ISODate("2023-04-01T00:00:00Z"),
  updatedAt: ISODate("2023-04-01T00:00:00Z")
}
```

### Message Document
```javascript
{
  _id: ObjectId("507f191e810c19729de860ed"),
  session: ObjectId("507f191e810c19729de860ec"),
  sender: ObjectId("507f1f77bcf86cd799439012"),
  content: "Looking forward to this session!",
  isTutor: false,
  createdAt: ISODate("2023-05-30T00:00:00Z"),
  updatedAt: ISODate("2023-05-30T00:00:00Z")
}
```