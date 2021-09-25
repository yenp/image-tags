import {config} from 'dotenv'
config()
const poolData = {
  UserPoolId: process.env.COGNITO_POOL_ID, // Your user pool id here    
  ClientId: process.env.COGNITO_CLIENT_ID // Your client id here
};
export {poolData};