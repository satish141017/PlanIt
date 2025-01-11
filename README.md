
# PlanIt

PlanIt is a task management API built with Express and Prisma. It allows users to manage tasks and projects, with authentication and authorization using JWT.


## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd PlanIt
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    Create a [.env](http://_vscodecontentref_/9) file in the root directory and add the following:
    ```env
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    PORT=your_port
    ```

4. Run Prisma migrations:
    ```sh
    npx prisma migrate dev
    ```

## Scripts

- `npm run build`: Compiles TypeScript files to JavaScript.
- `npm start`: Starts the server.

## API Endpoints

### User Routes

- `GET /users`: Fetch user details.
- `PUT /users/updatepassword`: Update user password.
- `PUT /users/update`: Update user details.
- `POST /users/signin`: Sign in a user.
- `POST /users/signup`: Sign up a new user.
- `GET /users/tasks`: Fetch tasks assigned to the user.
- `GET /users/task/:id`: Fetch a specific task by ID.
- `GET /users/project`: Fetch projects associated with the user.
- `PUT /users/task/:id/update`: Update a task.
- `GET /users/project/:projectId`: Fetch a specific project by ID.
- `GET /users/project/:projectId/tasks`: Fetch tasks associated with a specific project.

### Manager Routes

- `GET /manager`: Fetch manager details.
- `PUT /manager/updatepassword`: Update manager password.
- `PUT /manager/update`: Update manager details.
- `POST /manager/signin`: Sign in a manager.
- `POST /manager/signup`: Sign up a new manager.
- `GET /manager/tasks`: Fetch tasks assigned to the manager.
- `GET /manager/task/:id`: Fetch a specific task by ID.
- `GET /manager/project`: Fetch projects managed by the manager.
- `PUT /manager/task/:id/update`: Update a task.
- `GET /manager/project/:projectId`: Fetch a specific project by ID.
- `GET /manager/project/:projectId/tasks`: Fetch tasks associated with a specific project.

## Middleware

- [authTokenMiddleware](http://_vscodecontentref_/10): Middleware to authenticate JWT tokens.
- [signJwt](http://_vscodecontentref_/11): Function to sign JWT tokens.

## Prisma Schema

The Prisma schema is defined in [schema.prisma](http://_vscodecontentref_/12).


# API Endpoints for /user

## 1. **GET /user/**
Fetches user details based on the username.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`
- Body: 
  ```json
  {
    "username": "string"  // Optional, username can also be fetched from the token.
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  [
    {
      "id": "integer",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    }
  ]
  ```

## 2. **PUT /user/updatepassword**
Updates the password for the logged-in manager.

**Request:**
- Method: `PUT`
- Headers: `Authorization: Bearer <auth_token>`
- Body:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "message": "Password updated successfully."
  }
  ```

## 3. **PUT /user/update**
Updates the user details for the logged-in manager.

**Request:**
- Method: `PUT`
- Headers: `Authorization: Bearer <auth_token>`
- Body:
  ```json
  {
    "username": "string",
    "firstName": "string",
    "lastName": "string"
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
  ```

## 4. **POST /user/signin**
Sign in a manager and get a token.

**Request:**
- Method: `POST`
- Body:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "token": "string" // JWT token
  }
  ```

## 5. **POST /user/signup**
Create a new manager and get a token.

**Request:**
- Method: `POST`
- Body:
  ```json
  {
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "password": "string"
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "token": "string" // JWT token
  }
  ```

## 6. **GET /user/tasks**
Fetch all tasks of the logged-in manager.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "username": "string",
    "tasks": [
      {
        "id": "integer",
        "title": "string",
        "status": "string",
        "priority": "string",
        "deadline": "string",
        "description": "string"
      }
    ]
  }
  ```

## 7. **GET /user/task/:id**
Fetch a specific task by ID for the logged-in manager.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`
- Parameters: 
  - `id` - Task ID to fetch.

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "title": "string",
    "status": "string",
    "priority": "string",
    "deadline": "string",
    "description": "string"
  }
  ```

## 8. **GET /user/project**
Fetch all projects of the logged-in manager.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`

**Response:**
- Status: `200 OK`
- Body:
  ```json
  [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "end": "string"
    }
  ]
  ```

## 9. **PUT /user/task/:id/update**
Update a specific task by ID for the logged-in manager.

**Request:**
- Method: `PUT`
- Headers: `Authorization: Bearer <auth_token>`
- Parameters: 
  - `id` - Task ID to update.
- Body:
  ```json
  {
    "status": "string",
    "priority": "string",
    "title": "string",
    "taskDesc": "string",
    "endDate": "string"
  }
  ```

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "title": "string",
    "status": "string",
    "priority": "string",
    "deadline": "string",
    "description": "string"
  }
  ```

## 10. **GET /user/project/:projectId**
Fetch details of a specific project by ID for the logged-in manager.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`
- Parameters:
  - `projectId` - Project ID to fetch.

**Response:**
- Status: `200 OK`
- Body:
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "end": "string"
  }
  ```

## 11. **GET /user/project/:projectId/tasks**
Fetch tasks of a specific project by project ID for the logged-in manager.

**Request:**
- Method: `GET`
- Headers: `Authorization: Bearer <auth_token>`
- Parameters:
  - `projectId` - Project ID to fetch tasks for.

**Response:**
- Status: `200 OK`
- Body:
  ```json
  [
    {
      "id": "integer",
      "title": "string",
      "status": "string",
      "priority": "string",
      "deadline": "string",
      "description": "string"
    }
  ]
  ```

```






# Management System API

This API provides routes to manage users, projects, and tasks for a management system. All routes are prefixed with `/manager`.

## Routes

### `GET /manager/`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Optional `username` field in the body or use the `username` from the token.

#### Response:
```json
[
  {
    "id": <number>,
    "username": <string>,
    "email": <string>,
    "firstName": <string>,
    "lastName": <string>
  }
]
```

---

### `PUT /manager/updatepassword`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "oldPassword": <string>,
  "newPassword": <string>
}
```

#### Response:
```json
{
  "message": "Password updated successfully."
}
```

---

### `PUT /manager/update`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "username": <string>,
  "firstName": <string>,
  "lastName": <string>
}
```

#### Response:
```json
{
  "id": <number>,
  "username": <string>,
  "email": <string>,
  "firstName": <string>,
  "lastName": <string>
}
```

---

### `POST /manager/signin`

#### Request:
- **Body**:
```json
{
  "username": <string>,
  "password": <string>
}
```

#### Response:
```json
{
  "id": <number>,
  "username": <string>,
  "email": <string>,
  "firstName": <string>,
  "lastName": <string>,
  "token": <string>
}
```

---

### `POST /manager/signup`

#### Request:
- **Body**:
```json
{
  "username": <string>,
  "email": <string>,
  "firstName": <string>,
  "lastName": <string>,
  "password": <string>
}
```

#### Response:
```json
{
  "id": <number>,
  "username": <string>,
  "email": <string>,
  "firstName": <string>,
  "lastName": <string>,
  "token": <string>
}
```

---

### `GET /manager/tasks`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Optional `username` field.

#### Response:
```json
{
  "id": <number>,
  "username": <string>,
  "tasks": [
    {
      "id": <number>,
      "status": <string>,
      "priority": <string>,
      "title": <string>,
      "description": <string>,
      "deadline": <string>,
      "projectId": <number>
    }
  ]
}
```

---

### `GET /manager/task/:id`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `id` (task ID)

#### Response:
```json
{
  "id": <number>,
  "status": <string>,
  "priority": <string>,
  "title": <string>,
  "description": <string>,
  "deadline": <string>,
  "projectId": <number>
}
```

---

### `GET /manager/project`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Optional `username` field.

#### Response:
```json
{
  "id": <number>,
  "name": <string>,
  "description": <string>,
  "end": <string>
}
```

---

### `PUT /manager/task/:id/update`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `id` (task ID)
- **Body**:
```json
{
  "status": <string>,
  "priority": <string>,
  "title": <string>,
  "taskDesc": <string>,
  "endDate": <string>
}
```

#### Response:
```json
{
  "id": <number>,
  "status": <string>,
  "priority": <string>,
  "title": <string>,
  "description": <string>,
  "deadline": <string>,
  "projectId": <number>
}
```

---

### `GET /manager/project/:projectId`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `projectId` (project ID)

#### Response:
```json
{
  "id": <number>,
  "name": <string>,
  "description": <string>,
  "end": <string>,
  "tasks": [
    {
      "id": <number>,
      "status": <string>,
      "priority": <string>,
      "title": <string>,
      "description": <string>,
      "deadline": <string>,
      "projectId": <number>
    }
  ]
}
```

---

### `GET /manager/project/:projectId/tasks`

#### Request:
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `projectId` (project ID)

#### Response:
```json
[
  {
    "id": <number>,
    "status": <string>,
    "priority": <string>,
    "title": <string>,
    "description": <string>,
    "deadline": <string>,
    "projectId": <number>
  }
]
```

---
```

This should cover all the routes and their request/response formats for your API. Let me know if you need further modifications!








## License




This project is licensed under the ISC License.