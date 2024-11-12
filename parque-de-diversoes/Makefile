all: stop start

stop:
	docker compose down

start:
	docker compose build --no-cache
	docker compose up -d
