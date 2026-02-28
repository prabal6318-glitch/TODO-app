# DOTO — Full Stack Todo App

## Project Structure
```
DOTO APP/
├── config/         → MongoDB connection
├── controllers/    → CRUD logic
├── frontend/       → Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── model/          → Mongoose schema
├── routes/         → Express routes
├── .env            → Environment variables
└── Server6.js      → Express server (port 8005)
```

## API Endpoints
| Method | Endpoint                        | Description     |
|--------|---------------------------------|-----------------|
| GET    | `/api/v1/todos`                 | Get all todos   |
| GET    | `/api/v1/todos/:id`             | Get todo by ID  |
| POST   | `/api/v1/createTodo`            | Create todo     |
| PUT    | `/api/v1/updateTodo/:id`        | Update todo     |
| DELETE | `/api/v1/deleteTodo/:id`        | Delete todo     |

## Running the App

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` and set your MongoDB connection string:
```
MONGODB_URL=mongodb://localhost:27017/doto
PORT=8005
```

### 3. Start the backend
```bash
node Server6.js
# or
npx nodemon Server6.js
```

### 4. Open the frontend
Open `frontend/index.html` in your browser:
```bash
# macOS
open frontend/index.html

# Linux
xdg-open frontend/index.html

# Or serve with a simple HTTP server:
npx serve frontend
```

The frontend connects to `http://localhost:8005/api/v1`.
