# FitSync

FitSync is a fitness tracking application with a React + TypeScript frontend and a Python FastAPI backend.

## Project Structure

```
fit-sync/
├── backend/              # FastAPI server
│   ├── app/              # API endpoints and application logic
│   ├── main.py           # Entry point for the FastAPI app
│   ├── requirements.txt  # Python dependencies
│   └── .venv/            # Python virtual environment (created during setup)
├── frontend/             # React + TypeScript application
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── requirements.txt  # Node.js dependencies
│   └── node_modules/     # Node.js virtual environment (created during setup)
└── setup.sh             # Easy setup script
```

## Features

- Dashboard for fitness tracking overview
- Workout tracking and management
- User profiles
- Progress monitoring
- Responsive design for mobile and desktop

## Ultra-Simplified Setup

We've created a parallel virtual environment approach for both frontend and backend:

1. Make the setup script executable:

```bash
chmod +x setup.sh
```

2. Run the setup script:

```bash
./setup.sh
```

3. Start the backend server:

```bash
cd backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uvicorn main:app --reload
```

4. In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:5173
- API documentation: http://localhost:8000/docs

## Key Simplifications

- Both frontend and backend use a requirements.txt approach
- Backend uses a Python virtual environment (.venv)
- Frontend treats node_modules as its virtual environment
- Consistent activation and startup commands for both environments

## Requirements

- Python 3.8 or higher
- Node.js 16.x or higher
- npm
