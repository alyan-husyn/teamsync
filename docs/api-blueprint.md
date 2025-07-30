# Classroom Platform API Blueprint - Current Implementation

## Table of Contents
1. [Authentication](#authentication)
2. [Chatroom Management](#chatroom-management)
3. [Post Management](#post-management)
4. [Error Handling](#error-handling)

---

## Authentication

### 1. Sign In (Used in app/page.tsx)
**Endpoint:** `POST /api/auth/signin`

**Request Body:**
\`\`\`json
{
  "username": "string",
  "password": "string",
  "role": "admin | user"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "username": "string",
      "role": "admin | user"
    },
    "token": "JWT string"
  }
}
\`\`\`

**Frontend Usage:**
- Used in `app/page.tsx` for login functionality
- Hardcoded credentials: admin/admin123, user/user123
- Currently handled by `useAuth` context with localStorage

---

## Chatroom Management

### 1. Get All Chatrooms (Used in app/content-types/page.tsx)
**Endpoint:** `GET /api/chatrooms`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "chatrooms": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "memberCount": "number",
        "postCount": "number",
        "members": [
          {
            "id": "string",
            "name": "string",
            "role": "admin | user",
            "isOnline": "boolean"
          }
        ],
        "createdAt": "Date"
      }
    ]
  }
}
\`\`\`

**Frontend Usage:**
- Used in `app/content-types/page.tsx` to display chatroom cards
- Currently handled by `useChatrooms` context with mock data

### 2. Get Chatroom Details (Used in app/content-types/[id]/page.tsx)
**Endpoint:** `GET /api/chatrooms/:chatroomId`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "chatroom": {
      "id": "string",
      "name": "string",
      "description": "string",
      "memberCount": "number",
      "postCount": "number",
      "members": [
        {
          "id": "string",
          "name": "string",
          "role": "admin | user",
          "isOnline": "boolean"
        }
      ],
      "createdAt": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `app/content-types/[id]/page.tsx` to get chatroom details
- Currently handled by `useChatrooms` context

### 3. Create Chatroom (Used in app/content-types/page.tsx)
**Endpoint:** `POST /api/chatrooms`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "string",
  "description": "string"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Chatroom created successfully",
  "data": {
    "chatroom": {
      "id": "string",
      "name": "string",
      "description": "string",
      "memberCount": 1,
      "postCount": 0,
      "members": [
        {
          "id": "string",
          "name": "string",
          "role": "admin",
          "isOnline": true
        }
      ],
      "createdAt": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `app/content-types/page.tsx` create chatroom dialog
- Only available for admin users
- Currently handled by `useChatrooms` context

---

## Post Management (Stream Tab)

### 1. Get Posts in Chatroom (Used in components/classroom-stream.tsx)
**Endpoint:** `GET /api/chatrooms/:chatroomId/posts`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "string",
        "chatroomId": "string",
        "content": "string",
        "author": "string",
        "tag": "Blog | Social | Landing Page | General",
        "attachment": "string (optional)",
        "status": "pending | approved | rejected | needs-work",
        "reactions": [
          {
            "emoji": "string",
            "user": "string"
          }
        ],
        "comments": [
          {
            "content": "string",
            "user": "string",
            "timestamp": "Date"
          }
        ],
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    ]
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` to display posts
- Currently handled by `usePosts` context with mock data

### 2. Create Post (Used in components/classroom-stream.tsx)
**Endpoint:** `POST /api/chatrooms/:chatroomId/posts`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "content": "string",
  "tag": "Blog | Social | Landing Page | General",
  "attachment": "string (optional)"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "string",
      "chatroomId": "string",
      "content": "string",
      "author": "string",
      "tag": "string",
      "attachment": "string",
      "status": "pending",
      "reactions": [],
      "comments": [],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` create post form
- Currently handled by `usePosts` context

### 3. Update Post (Used in components/classroom-stream.tsx)
**Endpoint:** `PUT /api/posts/:postId`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "content": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "post": {
      "id": "string",
      "content": "string",
      "updatedAt": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` edit post functionality
- Only available for post author
- Currently handled by `usePosts` context

### 4. Update Post Status (Used in components/classroom-stream.tsx)
**Endpoint:** `PUT /api/posts/:postId/status`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "status": "approved | rejected | needs-work"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Post status updated successfully",
  "data": {
    "post": {
      "id": "string",
      "status": "string",
      "updatedAt": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` admin dropdown actions
- Only available for admin users
- Currently handled by `usePosts` context

### 5. Add Reaction to Post (Used in components/classroom-stream.tsx)
**Endpoint:** `POST /api/posts/:postId/reactions`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "emoji": "string"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Reaction added successfully",
  "data": {
    "reaction": {
      "emoji": "string",
      "user": "string"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` reaction dialog
- Currently handled by `usePosts` context

### 6. Add Comment to Post (Used in components/classroom-stream.tsx)
**Endpoint:** `POST /api/posts/:postId/comments`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "content": "string"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "content": "string",
      "user": "string",
      "timestamp": "Date"
    }
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-stream.tsx` comment dialog
- Currently handled by `usePosts` context

---

## Member Management (People Tab)

### 1. Get Chatroom Members (Used in components/classroom-people.tsx)
**Endpoint:** `GET /api/chatrooms/:chatroomId/members`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "string",
        "name": "string",
        "role": "admin | user",
        "isOnline": "boolean"
      }
    ],
    "teachers": [
      {
        "id": "string",
        "name": "string",
        "role": "admin",
        "isOnline": "boolean"
      }
    ],
    "students": [
      {
        "id": "string",
        "name": "string",
        "role": "user",
        "isOnline": "boolean"
      }
    ]
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-people.tsx` to display teachers and students
- Currently handled by `useChatrooms` context

### 2. Remove Member from Chatroom (Used in components/classroom-people.tsx)
**Endpoint:** `DELETE /api/chatrooms/:chatroomId/members/:memberId`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Member removed successfully"
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-people.tsx` admin dropdown action
- Only available for admin users
- Currently handled by `useChatrooms` context

---

## Activity Management (Activity Tab)

### 1. Get User Activity in Chatroom (Used in components/classroom-activity.tsx)
**Endpoint:** `GET /api/chatrooms/:chatroomId/activity`

**Headers:**
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

**Query Parameters:**
\`\`\`
type: reaction | comment | status (optional filter)
tag: Blog | Social | Landing Page | General (optional filter)
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "string",
        "type": "reaction | comment | status",
        "postId": "string",
        "postTitle": "string",
        "postTag": "string",
        "user": "string",
        "content": "string",
        "timestamp": "Date"
      }
    ]
  }
}
\`\`\`

**Frontend Usage:**
- Used in `components/classroom-activity.tsx` to show user's post activity
- Filtered by activity type and tag
- Currently generated from posts data in `usePosts` context

---

## Error Handling

### Standard Error Response Format
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "timestamp": "ISO 8601 timestamp"
}
\`\`\`

### Common Error Codes Used in Frontend

#### Authentication Errors (401)
- `AUTH_TOKEN_INVALID`: Invalid or expired token
- `AUTH_CREDENTIALS_INVALID`: Invalid username/password

#### Authorization Errors (403)
- `AUTH_INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `AUTH_ADMIN_REQUIRED`: Admin role required for this action

#### Validation Errors (400)
- `VALIDATION_REQUIRED_FIELD`: Required field missing
- `VALIDATION_LENGTH_EXCEEDED`: Field length limit exceeded

#### Resource Errors (404)
- `CHATROOM_NOT_FOUND`: Chatroom not found
- `POST_NOT_FOUND`: Post not found

---

## Current Implementation Notes

### Context-Based State Management
The frontend currently uses React Context for state management:

- **AuthContext** (`lib/auth-context.tsx`): Handles user authentication and localStorage
- **ChatroomContext** (`lib/chatroom-context.tsx`): Manages chatroom data and operations
- **PostsContext** (`lib/posts-context.tsx`): Handles posts, reactions, and comments

### Mock Data
All data is currently mocked in the context providers. When implementing the actual API:

1. Replace context methods with API calls
2. Add proper error handling
3. Implement loading states
4. Add optimistic updates for better UX

### Authentication Flow
- Login form in `app/page.tsx`
- Hardcoded credentials (admin/admin123, user/user123)
- JWT token stored in localStorage
- Protected routes check authentication in useEffect

This revised blueprint only includes the endpoints that are actually referenced and used in the current frontend implementation.
