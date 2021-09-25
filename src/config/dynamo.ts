import {define, types, AWS} from 'dynamodb'
import {config} from 'dotenv'
config()
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_ENV,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ENV,
    region: process.env.AWS_REGION,
});
export {define, types, AWS};