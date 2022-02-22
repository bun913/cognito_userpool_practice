import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import axios from 'axios';

class Auth {
  constructor(userPoolId, clientId) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
    this.userPool = userPool;
  }

  async login(userName, password) {
    const authData = {
      Username: userName,
      Password: password,
    };
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authData);
    const userData = {
      Username: userName,
      Pool: this.userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          resolve(result);
        },
        onFailure: async (err) => {
          reject(err);
        },
        newPasswordRequired: async function (_userAtt, _reqAtt) {
          const newPassword = process.env.newPassword;
          const result = cognitoUser.completeNewPasswordChallenge(
            newPassword,
            { gender: 'Male', name: 'test' },
            this
          );
          resolve(result);
        },
      });
    });
  }
}

class BaseRequest {
  constructor(idToken) {
    const axiosBase = axios.create({
      baseURL: 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      responseType: 'json',
    });
    this.requestClient = axiosBase;
  }

  async hello(option = null) {
    try {
      const res = await this.requestClient.get('/', option);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
}

async function auth() {
  const auth = new Auth(process.env.userPoolID, process.env.CLIENTID);
  const authResult = await auth.login(process.env.USER_NAME, process.env.PASS);
  return authResult;
}

async function requestServer() {
  const authToken = await auth();
  const idToken = authToken.idToken.jwtToken;
  const request = new BaseRequest(idToken);
  return request.hello();
}

const helloResult = await requestServer();
console.log(helloResult);
