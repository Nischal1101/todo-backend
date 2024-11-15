# Todo Enhanced Backend

This is the backend for the Todo Enhanced application. It is built using Node.js, Express, and TypeScript.

## Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

## Setup Instructions

1. **Clone the repository:**

    ```sh
    git clone https://github.com/nischal1101/todo-enhanced.git
    cd todo-enhanced/todo-backend
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and copy variables from .env.sample:

    ```env
    PORT=8000
    DATABASE_URL=your_database_url(postgres)
    JWT_SECRET=your_jwt_secret
    ```

4. **Run database migrations:**

    ```sh
     npm run db:generate
    ```

    ```sh
     npm run db:migrate
    ```

5. **Start the development server:**

    ```sh
    npm run server
    ```

## API Endpoints

-   `GET /todos` - Get all todos
-   `GET /:todoid` - Get a specific todo by ID
-   `POST /` - Create a new todo (requires authentication)
-   `PUT /:id` - Update a specific todo by ID (requires authentication)
-   `DELETE /:id` - Delete a specific todo by ID (requires authentication)

### Users

-   `GET /` - Get all users (requires admin authentication)
-   `DELETE /:userid` - Delete a specific user by ID (requires admin authentication)

### Auth

-   `GET /self` - Get authenticated user's information
-   `POST /register` - Register a new user
-   `POST /login` - Login a user
-   `POST /logout` - Logout a user (requires authentication)
