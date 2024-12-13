# MLB API Project

This project is a web application that provides information about MLB teams and players using the MLB Stats API. It is built with Node.js, Express, and MongoDB, and is containerized using Docker.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)

### Cloning the Repository

To clone the repository, run the following command:

```sh
git clone <repo-url>
cd <repo-directory>
```

### Setting Up the Container

In repo-directory:

```sh
cd 'Final Project'
docker-compose build
docker-compose up
```

### Accessing the Webpage

Navigate to http://localhost:3000 and log in (user: jamie, password: password)

(Login functionality is purely for demo, securing an open source API is not overly necessary)

### Navigating the Webpage

Simple: Select a team, then select a player.

Enjoy!

### Additional Deliverables

- www/team_ids.json: A JSON version of the MongoDB database
- Final Project Report.docx: A final report on the project
