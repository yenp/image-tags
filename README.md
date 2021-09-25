## Description

- [Nest](https://github.com/nestjs/nest) framework TypeScript.
- AWS stack using
  - Dynamodb
  - API Gateway
  - Lambda function
  - S3
  - Cognito (be secure against anonymous access) - Don't work for localhost


## API URL

#### Register / Login Cognito User
- /users/register - POST
- /users/login - POST
#### Photos
- /photos/sign - POST ( for s3 presigned url before upload )
- /photos - GET, POST 
- /photos/:id - GET, PATCH, DELETE
#### Trackings
- /trackings/:photoId - GET

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

- The folder public / views that are for UI demo, its not include in project idea needed.
- S3 setting ACL to public-read to test
- .env is local variable to test


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
