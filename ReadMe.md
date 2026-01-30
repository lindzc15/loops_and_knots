# Loops & Knots
Loops & Knots is a web application designed to allow users to keep track of their favorite patterns and yarns
for crocheting and knitting. Users can browse, search, and filter yarns and patterns. They can then save these
patterns in their own library.

## Installation requirements

### Backend
The required dependencies are listed in `backend/requirements.txt`. To install, run these commands from the project root:
 ```
 cd backend
 pip install -r requirements.txt
 ```

### Database
To intially start up the database, docker needs to first be installed. Then run these commands from the project root:
```
docker compose -f docker-compose.yaml up -d
```

To ensure the database is up to date with the current version, run the following command from the project root:
```
cd backend
alembic upgrade head
```

### Frontend
To install the required dependencies, run the these commands from the project root:
```
cd frontend
npm install
```

## Running the application

### Backend
The backend runs on `port 8000` and is specified when running the server. It can be called at `http://127.0.0.1:8000`. To run the backend, run these commands from the project root:
```
cd backend
uvicorn main:app --reload --port 8000
```

### Database
The database runs on `port 5434`, and is specified in `docker-compose.yaml`. I am using PostgreSQL

### Frontend
The frontend runs on `http://localhost:3001/`, with the port specified in `frontend/vite.config.js`. To run the frontend, run these commands from the project root:
```
cd frontend
npm run dev
```