import { Injectable } from '@nestjs/common';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { poolData } from '../config/cognito'


@Injectable()
export class UsersService {

  async create(createUser: any) {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: createUser.name }));
    var mySignup = new Promise(function (resolve, reject) {
      userPool.signUp(createUser.email, createUser.password, attributeList, null, function (err, result: any) {
        resolve({ err, result })
      });
    });
    return await mySignup;
  }

  login(userObj: any) {
    return new Promise(async (resolve) => {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: userObj.email,
        Password: userObj.password,
      });

      var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: userObj.email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          resolve({
            payload: result.getIdToken().payload,
            accessToken: result.getAccessToken().getJwtToken(),
            cognitoToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          })
        },
        onFailure: function (err) {
          resolve(err);
        }
      });
    })
  }

}
