DOCKER_COMPOSE := docker-compose -f ./docker-compose.yml

_END			:=	\033[0m
_GREEN			:=	\033[32m

all: start

setEnv:
	sh ./setEnv.sh

build:
	mkdir -p ./App
	mkdir -p ./App/Nest
	mkdir -p ./App/Next
	${DOCKER_COMPOSE} build

start: build
	@echo "$(_GREEN)Start containers$(_END)"
	${DOCKER_COMPOSE} up -d

start_debug: build
	@echo "$(_GREEN)Start containers$(_END)"
	${DOCKER_COMPOSE} up

stop:
	@echo "$(_GREEN)Stop containers$(_END)"
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) stop

clean: stop
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans
	@echo "$(_GREEN)Removes images, containers and volumes$(_END)"

ls:
	@echo "$(_GREEN)------------------------List running containers-------------------------$(_END)"
	$(DOCKER_COMPOSE) ps
	@echo "$(_GREEN)------------------------------List images-------------------------------$(_END)"
	docker images
	@echo "$(_GREEN)------------------------------List volumes------------------------------$(_END)"
	docker volume ls

re: clean all

prune: stop
	@echo "$(_GREEN)Removes all unused images, containers, networks and volumes$(_END)"
	docker system prune -f -a

.PHONY: all build start stop ls clean re prune