
## List of endpoints
POST /signin: Sign in a user.
POST /signup: Sign up a new user.
GET /: Get details of the authenticated user.
GET /tasks: Get tasks for the authenticated user.
GET /task/:id: Get a task by its ID.
GET /project: Get projects for the authenticated user.
POST /task: Create a new task.
PUT /task/:id: Update a task's status.
GET /manager/allUsers: Get all users whose username starts with the provided name.
GET /manager: Get details of the authenticated manager.
GET /manager/projects: Get projects managed by the authenticated manager.
GET /manager/tasks: Get tasks managed by the authenticated manager.
POST /manager/signIn: Sign in a manager.
POST /manager/signUp: Sign up a new manager.
POST /manager/project: Create a new project.
DELETE /manager/project: Delete a project.
POST /manager/task: Create a new task.
DELETE /manager/task/:id: Delete a task.

## Endpoints

### 1. Sign In

**URL**: `/signin`  
**Method**: `POST`  
**Description**: Sign in a user.

**Input**:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Output**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "your_jwt_token_here"
}
```

### 2. Sign Up

**URL**: `/signup`  
**Method**: `POST`  
**Description**: Sign up a new user.

**Input**:
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Output**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "your_jwt_token_here"
}
```

### 3. Get User Details

**URL**: `/`  
**Method**: `GET`  
**Description**: Get details of the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
]
```

### 4. Get Tasks

**URL**: `/tasks`  
**Method**: `GET`  
**Description**: Get tasks for the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write and review the project documentation.",
    "startDate": "2023-10-10T00:00:00.000Z",
    "deadline": "2023-12-31T00:00:00.000Z",
    "priority": 1,
    "projectId": null,
    "username": "john_doe",
    "status": "OPEN"
  }
]
```

### 5. Get Task by ID

**URL**: `/task/:id`  
**Method**: `GET`  
**Description**: Get a task by its ID.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "OPEN"
}
```

### 6. Get Projects

**URL**: `/project`  
**Method**: `GET`  
**Description**: Get projects for the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "name": "Project 1",
    "start": "2023-10-10T00:00:00.000Z",
    "end": "2023-12-31T00:00:00.000Z",
    "description": "Project description",
    "managerUsername": "manager1"
  }
]
```

### 7. Create Task

**URL**: `/task`  
**Method**: `POST`  
**Description**: Create a new task.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "username": "john_doe",
  "title": "Complete project documentation",
  "taskDesc": "Write and review the project documentation.",
  "endDate": "2023-12-31",
  "priority": 1
}
```

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "OPEN"
}
```

### 8. Update Task

**URL**: `/task/:id`  
**Method**: `PUT`  
**Description**: Update a task's status.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "status": "COMPLETED"
}
```

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "COMPLETED"
}
```

## Notes

- Ensure you have a valid JWT token for the `Authorization` header.
- Adjust the port and URL as necessary based on your server configuration.
- The 

username

 field in the request body should match the authenticated user's username.

satish141017: how should i copy and paste to my readme

GitHub Copilot: To copy and paste the provided code into your README file, you can follow this format:

```markdown
# User API Documentation

This API allows you to manage users, tasks, and projects. Below are the endpoints, their inputs, and expected outputs.

## Endpoints

### 1. Sign In

**URL**: `/signin`  
**Method**: `POST`  
**Description**: Sign in a user.

**Input**:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Output**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "your_jwt_token_here"
}
```

### 2. Sign Up

**URL**: `/signup`  
**Method**: `POST`  
**Description**: Sign up a new user.

**Input**:
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Output**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "your_jwt_token_here"
}
```

### 3. Get User Details

**URL**: `/`  
**Method**: `GET`  
**Description**: Get details of the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
]
```

### 4. Get Tasks

**URL**: `/tasks`  
**Method**: `GET`  
**Description**: Get tasks for the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write and review the project documentation.",
    "startDate": "2023-10-10T00:00:00.000Z",
    "deadline": "2023-12-31T00:00:00.000Z",
    "priority": 1,
    "projectId": null,
    "username": "john_doe",
    "status": "OPEN"
  }
]
```

### 5. Get Task by ID

**URL**: `/task/:id`  
**Method**: `GET`  
**Description**: Get a task by its ID.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "OPEN"
}
```

### 6. Get Projects

**URL**: `/project`  
**Method**: `GET`  
**Description**: Get projects for the authenticated user.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "name": "Project 1",
    "start": "2023-10-10T00:00:00.000Z",
    "end": "2023-12-31T00:00:00.000Z",
    "description": "Project description",
    "managerUsername": "manager1"
  }
]
```

### 7. Create Task

**URL**: `/task`  
**Method**: `POST`  
**Description**: Create a new task.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "username": "john_doe",
  "title": "Complete project documentation",
  "taskDesc": "Write and review the project documentation.",
  "endDate": "2023-12-31",
  "priority": 1
}
```

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "OPEN"
}
```

### 8. Update Task

**URL**: `/task/:id`  
**Method**: `PUT`  
**Description**: Update a task's status.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "status": "COMPLETED"
}
```

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": null,
  "username": "john_doe",
  "status": "COMPLETED"
}
```

## Notes

- Ensure you have a valid JWT token for the `Authorization` header.
- Adjust the port and URL as necessary based on your server configuration.
- The 

------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------

# Manager API Documentation

This API allows you to manage managers, users, tasks, and projects. Below are the endpoints, their inputs, and expected outputs.

## Endpoints

### 1. Get All Users

**URL**: `/allUsers`  
**Method**: `GET`  
**Description**: Get all users whose username starts with the provided name.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "name": "john"
}
```

**Output**:
```json
[
  {
    "username": "john_doe"
  }
]
```

### 2. Get Manager Details

**URL**: `/`  
**Method**: `GET`  
**Description**: Get details of the authenticated manager.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
{
  "username": "manager1",
  "email": "manager1@example.com",
  "firstName": "Manager",
  "lastName": "One"
}
```

### 3. Get Projects Managed by Manager

**URL**: `/projects`  
**Method**: `GET`  
**Description**: Get projects managed by the authenticated manager.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "name": "Project 1"
  }
]
```

### 4. Get Tasks Managed by Manager

**URL**: `/tasks`  
**Method**: `GET`  
**Description**: Get tasks managed by the authenticated manager.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write and review the project documentation.",
    "startDate": "2023-10-10T00:00:00.000Z",
    "deadline": "2023-12-31T00:00:00.000Z",
    "priority": 1,
    "projectId": 1,
    "username": "john_doe",
    "status": "OPEN"
  }
]
```

### 5. Manager Sign In

**URL**: `/signIn`  
**Method**: `POST`  
**Description**: Sign in a manager.

**Input**:
```json
{
  "username": "manager1",
  "password": "password123"
}
```

**Output**:
```json
{
  "username": "manager1",
  "email": "manager1@example.com",
  "firstName": "Manager",
  "lastName": "One",
  "token": "your_jwt_token_here"
}
```

### 6. Manager Sign Up

**URL**: `/signUp`  
**Method**: `POST`  
**Description**: Sign up a new manager.

**Input**:
```json
{
  "username": "manager1",
  "email": "manager1@example.com",
  "firstName": "Manager",
  "lastName": "One",
  "password": "password123"
}
```

**Output**:
```json
{
  "username": "manager1",
  "email": "manager1@example.com",
  "firstName": "Manager",
  "lastName": "One",
  "token": "your_jwt_token_here"
}
```

### 7. Create Project

**URL**: `/project`  
**Method**: `POST`  
**Description**: Create a new project.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "projectName": "Project 1",
  "projectDesc": "Project description",
  "endDate": "2023-12-31"
}
```

**Output**:
```json
{
  "id": 1,
  "name": "Project 1",
  "end": "2023-12-31T00:00:00.000Z",
  "managerUsername": "manager1",
  "description": "Project description"
}
```

### 8. Delete Project

**URL**: `/project`  
**Method**: `DELETE`  
**Description**: Delete a project.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "projectId": 1
}
```

**Output**:
```json
{
  "id": 1,
  "name": "Project 1",
  "end": "2023-12-31T00:00:00.000Z",
  "managerUsername": "manager1",
  "description": "Project description"
}
```

### 9. Create Task

**URL**: `/task`  
**Method**: `POST`  
**Description**: Create a new task.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Input**:
```json
{
  "username": "john_doe",
  "projectId": 1,
  "title": "Complete project documentation",
  "taskDesc": "Write and review the project documentation.",
  "endDate": "2023-12-31",
  "priority": 1
}
```

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": 1,
  "username": "john_doe",
  "status": "OPEN"
}
```

### 10. Delete Task

**URL**: `/task/:id`  
**Method**: `DELETE`  
**Description**: Delete a task.

**Headers**:
- `Authorization`: `Bearer your_jwt_token_here`

**Output**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write and review the project documentation.",
  "startDate": "2023-10-10T00:00:00.000Z",
  "deadline": "2023-12-31T00:00:00.000Z",
  "priority": 1,
  "projectId": 1,
  "username": "john_doe",
  "status": "OPEN"
}
```

## Notes

- Ensure you have a valid JWT token for the `Authorization` header.
- Adjust the port and URL as necessary based on your server configuration.
- The 


