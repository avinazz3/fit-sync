install-backend:

setup: install-frontend install-backend

# Install commands
install-frontend:
	cd frontend && npm install --legacy-peer-deps

install-backend:
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Run commands
run-frontend:
	cd frontend && npm run dev

run-backend:
	cd backend && source .venv/bin/activate && python -m uvicorn main:app --reload

# Combined commands
run-all:
	@echo "Starting backend server..."
	@cd backend && source .venv/bin/activate && python -m uvicorn main:app --reload & \
	@echo "Starting frontend server..."
	@cd frontend && npm run dev

.DEFAULT_GOAL := setup
