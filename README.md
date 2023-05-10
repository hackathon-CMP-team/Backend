# Tap Cash

## Built With

- [Nest.js](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)
- [NodeMailer](https://nodemailer.com/about/)
- [jwt](https://jwt.io/)
- [jest](https://jestjs.io/)

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/download/)

### Installing

A step by step series of examples that tell you how to get a development env running

### Clone the repository

```bash
git clone git@github.com:hackathon-CMP-team/Backend.git
```

## Running the app

### first build the docker file

```bash
docker build -t cash-tab .
```

### run the application

```bash
docker run -p 3000:3000 cash-tab:latest
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

# License

[MIT licensed](LICENSE).
