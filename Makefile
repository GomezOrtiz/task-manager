up:
		@docker-compose up -d

logs:
		@docker-compose logs -f app

down:
		@docker-compose down

status:
		@docker ps -a

cleanup:
		@docker rmi $$(docker images -f "dangling=true" -q)

test:
		npm run test

ping-db:
		@docker exec task-manager-postgres pg_isready --dbname=taskmanager --host=localhost --port=5432 --username=taskmanager

.PHONY: up logs down status cleanup test ping-db
