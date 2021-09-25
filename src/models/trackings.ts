import { define, types } from '../config/dynamo'
import * as Joi from 'joi'
var Tracking = define('Tracking', {
  hashKey: 'photoId',
  rangeKey: '_id',
  timestamps: true,
  schema: {
    _id: Joi.string(),
    photoId: Joi.string(),
    action: Joi.string(), // CREATE UPDATE VIEW
    userByName: Joi.string(),
    userById: Joi.string()
  }
});
export default Tracking