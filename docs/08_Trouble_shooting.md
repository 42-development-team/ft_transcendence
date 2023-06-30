# TROUBLE SHOOTING

## If (! Network transcendence  Resource is still in use)
`docker stop back`

`docker stop front`

`docker stop database`

`docker network rm transcendence`


##If  ✘ Container database  Error while Stopping - Error response from daemon: cannot stop container: 1d1866973c822327c8105d11be1489016effb71fe24e7abc6e90836d5832640c: permission denied

`sudo systemctl restart docker.socket docker.service` => if cannot stop or restart a container

`sudo lsof -i :port_number` -> to check if a certain port is already listening for other process that not allow our containers/process to be listened for (not starting). In the case : sudo kill process_running_pid