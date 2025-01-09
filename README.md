

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

username

 field in the request body should match the authenticated user's username.
```

You can copy and paste this Markdown content into your `README.md` file. This will provide a clear and structured documentation of your API endpoints, including the input and output examples.
You can copy and paste this Markdown content into your `README.md` file. This will provide a clear and structured documentation of your API endpoints, including the input and output examples.