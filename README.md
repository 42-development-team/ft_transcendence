<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<a href="https://github.com/42-development-team/ft_transcendence">
	<img src="https://static.thenounproject.com/png/397950-200.png" alt="logo" width="80" height="80">
</a>
<h3 align="center">ft_transcendence</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#env">env</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
[![ft_transcendence Screen Shot][home-screenshot]](https://github.com/42-development-team/ft_transcendence)

[![ft_transcendence profile Screen Shot][profile-screenshot]](https://github.com/42-development-team/ft_transcendence)

### Built With

* [![Next][Next.js]][Next-url]
* [![Nest][Nest.js]][Nest-url]
* [![Postgresql][Postgresql]][Postgresql-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Socket.io][Socket.io]][Socket.io-url]
* [![Tailwindcss][Tailwindcss]][Tailwindcss-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started
### Prerequisites

* Install Docker engine: 
	* [Install Docker Engine | Docker Docs](https://docs.docker.com/engine/install/)
* Install Docker-compose: 
	* [Overview of installing Docker Compose | Docker Docs](https://docs.docker.com/compose/install/)

### Installation

1. Get a 42 API Key: [42's API documentation](https://api.intra.42.fr/apidoc)
2. Get a cloudinary access: [Image and Video Upload, Storage, Optimization and CDN](https://cloudinary.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/42-development-team/ft_transcendence.git
   ```
3. Configure `.env` at the project root
4. Run the Makefile
	```sh
	make
	```


### env
```sh
## PORTS
FRONT_PORT=3000
BACK_PORT=4000
DB_PORT=5432

## PostgreSQL
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_DB=""

URL_ARGUMENTS="sslmode=prefer"
DATABASE_CONTAINER_NAME="database"
DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_CONTAINER_NAME}:${DB_PORT}/${POSTGRES_DB}?schema=public"

IP=""

# NEXT
NEXT_PUBLIC_URL_BACK="http://${IP}:${BACK_PORT}"
NEXT_PUBLIC_URL_FRONT="http://${IP}:${FRONT_PORT}"

## 42 API
TRANSCENDENCE_TOKEN=""
TRANSCENDENCE_SECRET=""
REDIRECT_URL="http://${IP}:${BACK_PORT}/auth/42/callback"

JWT_SECRET=""
AUTH_FACTOR_APP_NAME=""

# CLOUDINARY - HANDLING AVATAR
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/42-development-team/ft_transcendence.svg?style=for-the-badge
[contributors-url]: https://github.com/42-development-team/ft_transcendence/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/42-development-team/ft_transcendence.svg?style=for-the-badge
[forks-url]: https://github.com/42-development-team/ft_transcendence/network/members
[stars-shield]: https://img.shields.io/github/stars/42-development-team/ft_transcendence.svg?style=for-the-badge
[stars-url]: https://github.com/42-development-team/ft_transcendence/stargazers

[home-screenshot]: screenshots/home.png
[profile-screenshot]: screenshots/profile_dark.png
[home-chat-screenshot]: screenshots/home_chat_open.png
[profile-light-screenshot]: screenshots/profile_light.png

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Nest.js]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Nest-url]: http://nestjs.com/
[Postgresql]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgresql-url]: https://www.postgresql.org/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Tailwindcss]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwindcss-url]: https://tailwindcss.com/
[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[Socket.io-url]: https://socket.io/
