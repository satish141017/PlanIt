
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
- `POST /users/task/create`: Create a new task for a specific project.
- `Delete /users/task/:id/delete`: Delete a specific task. if user assigned it.

### Manager Routes

### Manager Routes

- `GET /manager`: Fetch manager details.
- `POST /manager/signin`: Sign in a manager.
- `POST /manager/signup`: Sign up a new manager.
- `GET /manager/allUsers`: Fetch all users managed by the manager.
- `PUT /manager/updatepassword`: Update manager password.
- `PUT /manager/update`: Update manager details.
- `GET /manager/projects`: Fetch projects managed by the manager.
- `GET /manager/tasks`: Fetch all tasks across all projects managed by the manager.
- `GET /manager/project/:projectId/tasks`: Fetch tasks for a specific project managed by the manager.
- `POST /manager/project/create`: Create a new project.
- `DELETE /manager/project/:projectId/delete`: Delete a specific project managed by the manager.
- `POST /manager/project/:projectId/task/create`: Create a new task within a specific project.
- `DELETE /manager/project/:projectId/task/:taskId/delete`: Delete a specific task within a project managed by the manager.
- `PUT /manager/project/:projectId/task/:id/update`: Update a specific task within a project managed by the manager.
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
### `POST /user/task/create`

Create a new task for a specific project, assigned to a user.

#### Request
- **Request Body**:
    - `title` (required): The title of the task.
    - `taskDesc` (required): The description of the task.
    - `endDate` (required): The deadline for the task (in a valid date format).
    - `priority` (required): The priority level of the task (e.g., low, medium, high).
    - `projectId` (required): The ID of the project the task is part of.

#### Response
- **Success** (200 OK):
    ```json
    {
        "id": <taskId>,
        "title": "<taskTitle>",
        "description": "<taskDesc>",
        "deadline": "<endDate>",
        "priority": "<priority>",
        "projectId": <projectId>,
        "username": "<assignedUser>"
    }
    ```
```




-------------------------------------------------------------------------------------------------------




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

### `PUT /manager/project/:projectId/task/:id/update`

Update the details of a specific task within a project managed by the logged-in user.

#### Request
- **Request Parameters**:
    - `projectId` (required): The ID of the project the task belongs to.
    - `id` (required): The ID of the task to be updated.

- **Request Body** (at least one field must be provided for update):
    - `title`: The new title of the task (optional).
    - `taskDesc`: The new description of the task (optional).
    - `endDate`: The new deadline for the task in a valid date format (optional).
    - `priority`: The new priority of the task (optional).
    - `assignedUser`: The new user to whom the task will be assigned (optional).

#### Response
- **Success** (200 OK):
    ```json
    {
        "id": <taskId>,
        "title": "<updatedTaskTitle>",
        "description": "<updatedTaskDesc>",
        "deadline": "<updatedEndDate>",
        "priority": "<updatedPriority>",
        "projectId": <projectId>,
        "username": "<updatedAssignedUser>"
    }
    ```

- **Error** (400 Bad Request):
    - If the project or task ID is invalid:
    ```json
    {
        "error": "Invalid project or task ID."
    }
    ```

- **Error** (404 Not Found):
    - If the project is not found for the logged-in manager:
    ```json
    {
        "error": "Project not found with the given user."
    }
    ```

- **Error** (500 Internal Server Error):
    - If there was an error updating the task:
    ```json
    {
        "error": "Failed to update task.",
        "details": "<error_message>"
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


### `POST /manager/project/:projectId/task/create`

Create a new task for a specific project.

#### Request
- **URL Parameter**:
    - `projectId` (required): The ID of the project to create the task in.

- **Request Body**:
    - `title` (required): The title of the task.
    - `taskDesc` (required): The description of the task.
    - `endDate` (required): The deadline for the task (in a valid date format).
    - `priority` (required): The priority level of the task (e.g., low, medium, high).
    - `assignedUser` (optional): The username of the user to whom the task is assigned.

#### Response
- **Success** (200 OK):
    ```json
    {
        "id": <taskId>,
        "title": "<taskTitle>",
        "description": "<taskDesc>",
        "deadline": "<endDate>",
        "priority": "<priority>",
        "projectId": <projectId>,
        "username": "<assignedUser>"
    }
    ```

This should cover all the routes and their request/response formats for your API. Let me know if you need further modifications!





### `DELETE /manager/project/:projectId/task/:id/delete`

Delete a specific task within a project managed by the logged-in user.

#### Request
- **Request Parameters**:
    - `projectId` (required): The ID of the project the task belongs to.
    - `id` (required): The ID of the task to be deleted.

#### Response
- **Success** (200 OK):
    ```json
    {
        "id": <taskId>,
        "title": "<taskTitle>",
        "description": "<taskDesc>",
        "deadline": "<taskEndDate>",
        "priority": "<taskPriority>",
        "projectId": <projectId>,
        "username": "<assignedUser>"
    }
    ```

- **Error** (400 Bad Request):
    - If the project or task ID is invalid:
    ```json
    {
        "error": "Invalid project or task ID."
    }
    ```

- **Error** (404 Not Found):
    - If the project is not found for the logged-in manager:
    ```json
    {
        "error": "Project not found with the given user."
    }
    ```

- **Error** (500 Internal Server Error):
    - If there was an error deleting the task:
    ```json
    {
        "error": "Failed to delete task.",
        "details": "<error_message>"
    }
    ```
```







## License




This project is licensed under the ISC License.