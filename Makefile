dev:
	@echo "Starting client and server..."
	cd client && npm start &
	cd server && npm run buildDevServerless &
	cd server && netlify dev
