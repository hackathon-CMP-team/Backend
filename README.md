## Running the app

### first build the docker file

```bach
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

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# License

[MIT licensed](LICENSE).
