# Fintilty Full-Stack Task

This project is a complete full-stack fintilty task management application built with a Node.js/Express backend and a Vue.js frontend. The system includes a custom dashboard where administrators can create new users, and those users can log in to access the application. At the current stage, all users can view all available projects and their associated tasks, without any user-based restrictions. User authentication details are stored in localStorage, while all project and task data is maintained in memory as per the task requirements.

The backend follows a clean architecture with a dedicated service layer to handle business logic and exposes a well-structured RESTful API for all operations. The application includes complete CRUD functionality for both Projects and Tasks, with a clear one-to-many relationship between a project and its tasks. It also supports task status updates, enabling users to mark tasks as pending or completed. 

Follow the steps below to run the application. For reference, several screenshots of the web interface are available in the screenshots folder located in the project root.

## Getting Started
### Backend Setup

- Navigate to backend directory and install dependencies and run developemnt server
```bash
cd backend
npm install
npm run dev
```
The API will be available at `http://localhost:3000`

### Frontend Setup

- Navigate to frontend directory and install dependencies and run server
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5252`

