import { define , types} from '../config/dynamo'
import * as Joi from 'joi'
var Photo = define('Photo', {
    hashKey : '_id',
    timestamps: true,
    schema : {
      _id  : Joi.string(),
      url  : Joi.string(),
      name : Joi.string(),
      size : Joi.number(),
      meta : Joi.object().optional(),
      tags : types.stringSet(),
      createdByName: Joi.string(),
      createdById: Joi.string()
    }
});
export default Photo

