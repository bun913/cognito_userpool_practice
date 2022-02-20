import AmazonCognitoIdentity from 'amazon-cognito-identity-js';

class Auth {
  constructor(userPoolId, clientId) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
    this.userPool = userPool;
  }

  login(userName, password) {
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
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log(result);
      },
      onFailure: (err) => {
        console.log(err);
      },
      newPasswordRequired: function (_userAtt, _reqAtt) {
        // 初回コンソールで作ったユーザーのみパスワード変更が必要
        const newPassword = process.env.newPassword
        cognitoUser.completeNewPasswordChallenge(newPassword, {'gender': 'Male', 'name': 'test'}, this)
      }
    });
  }
}

const auth = new Auth(process.env.userPoolID, process.env.CLIENTID);
const result = auth.login(process.env.USER_NAME, process.env.PASS);
