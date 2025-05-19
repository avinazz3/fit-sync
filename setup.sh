#!/bin/bash

# Color codes for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setting up FitSync Project ===${NC}"

# Check Node.js version
NODE_VERSION=$(node -v)
if [[ ${NODE_VERSION:1:2} -lt 18 ]]; then
  echo -e "${YELLOW}Note: Using Node.js ${NODE_VERSION}. Some features may work better with v18+.${NC}"
fi

# Setup Backend
echo -e "${BLUE}Setting up Python backend...${NC}"
cd backend

# Create Python virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt
pip install uvicorn

echo -e "${GREEN}Backend setup complete!${NC}"
deactivate
cd ..

# Setup Frontend with node virtual environment approach
echo -e "${BLUE}Setting up JavaScript frontend...${NC}"
cd frontend

# Create node_modules directory as our "virtual environment"
if [ ! -d "node_modules" ]; then
  echo "Creating node modules directory..."
  mkdir -p node_modules
fi

# Install frontend dependencies from requirements.txt
echo "Installing frontend dependencies from requirements.txt..."
npm install -g $(cat requirements.txt)
npm install --save $(cat requirements.txt)

echo -e "${GREEN}Frontend setup complete!${NC}"
cd ..

echo -e "${BLUE}=== Setup Complete! ===${NC}"
echo -e "To run the backend: ${GREEN}cd backend && source .venv/bin/activate && uvicorn main:app --reload${NC}"
echo -e "To run the frontend: ${GREEN}cd frontend && npm run dev${NC}"
echo ""
echo -e "${YELLOW}Note: This setup uses a simplified approach with requirements.txt for both frontend and backend.${NC}"
