DOCKER_COMPOSE := docker-compose -f Docker/docker-compose.yml

_END			:=	\033[0m
_GREEN			:=	\033[32m

all: start

build:
	${DOCKER_COMPOSE} build

start: build
	@echo "$(_GREEN)Start containers$(_END)"
	mkdir -p ./Backend
	mkdir -p ./Frontend
	${DOCKER_COMPOSE} up -d

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

#prune:
#@echo "$(_GREEN)Removes all unused images, containers, networks and volumes$(_END)"
#sudo docker system prune -f -a

.PHONY: all build start stop ls clean re