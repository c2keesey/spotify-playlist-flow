dev:
	@echo "Starting client and server..."
	cd client && npm start &
	cd server && npm run buildServerless &
	cd server && netlify dev
