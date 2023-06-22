[Home Page](./00_Documentation.md)
# Docker

3 containers running with docker-compose

## Containers
- Front: *React*
- Back: *NestJS*
- Database: *PostgreSQL*

All containers are build from latest node version (alpine version is lighter).

### React
- Port 3000

### NestJS
- Port 4000

### PostgreSQL
- Port 5432

Official docker image: [docs/postgres/README.md at master · docker-library/docs · GitHub](https://github.com/docker-library/docs/blob/master/postgres/README.md) 

To verify that psql is working:
- `docker exec -it database_postgres sh`
- `psql -U username -d database_name`

#### Volume
Database volume cannot be mounted on NFS file system:
- In docker-compose the volume location is not specified ( `database_vol:`)
    - Result when doing: `docker volume inspect database_vol`
    - The Mountpoint location is assigned by docker-compose in `/goinfre`
```
[
    {
        "CreatedAt": "2023-06-22T11:20:57+02:00",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "docker",
            "com.docker.compose.version": "2.18.1",
            "com.docker.compose.volume": "database_vol"
        },
        "Mountpoint": "/goinfre/cpalusze/docker/volumes/docker_database_vol/_data",
        "Name": "docker_database_vol",
        "Options": null,
        "Scope": "local"
    }
]
```

[docs/postgres/README.md at master · docker-library/docs · GitHub](https://github.com/docker-library/docs/blob/master/postgres/README.md#pgdata)


---
## References
- [How to dockerize a React app with Nest JS server code...! - DEV Community](https://dev.to/heyvenatdev/how-to-dockerize-a-react-app-with-nest-js-server-code-4ka)
- [Setup & Dockerize a React / Nest Monorepo application | by Montacer Dkhilali | Medium](https://montacerdk.medium.com/setup-dockerize-a-react-nest-monorepo-application-7a800060bd63)