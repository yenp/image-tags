## Description

- [Nest](https://github.com/nestjs/nest) framework TypeScript.
- AWS stack using
  - Dynamodb
  - API Gateway
  - S3
  - Cognito (be secure against anonymous access) - Don't work for localhost


## API URL

#### Register / Login Cognito User
- /users/register - POST
- /users/login - POST
#### Photos
- /photos - GET, POST 
- /photos/:id - GET, PATCH, DELETE
#### Trackings
- /photos/:photoId - GET

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Demo Users
- j1@gmail.com
- a1@gmail.com
- s1@gmail.com

```bash
# Password
Test123!@#
```

## NOTE

- The folder public / views that are for UI demo, its not include in project idea need.


## Test

```bash
# unit tests
$ npm run test:watch

# test coverage
$ npm run test:cov
```


## Deployment

Use serverless.com service

```bash
# deploy
$ sls deploy

```


## License

Nest is [MIT licensed](LICENSE).
