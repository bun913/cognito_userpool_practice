import os
import jwt
from flask import Flask, request, jsonify, make_response
app = Flask(__name__)

@app.route('/')
def hello():
    # JSON形式以外は拒否(今回の検証とはあまり関係ない)
    if not request.headers.get("Content-Type") == 'application/json':
        erro_message = {'error': 'not supported Content-Type'}
        return make_response(jsonify(erro_message), 400)
    # ヘッダーからjwt tokenを取得できなかったら401
    token_header = request.headers.get("Authorization")
    if not token_header:
        error_message = {'error': 'not Authorized'}
        return make_response(jsonify(error_message), 401)
    # 検証
    auth_token = token_header.split(' ')[1]
    try:
        auth = Auth(auth_token)
        auth_result = auth.verify()
        if auth_result is True:
            message = {"result": 'OK'}
            return make_response(jsonify(message), 200)
    # FIXME: 例外補足は最小限に
    except Exception:
        error_message = {'error': 'Invaid token'}
        return make_response(jsonify(error_message), 401)

class Auth:

    region = 'ap-northeast-1'

    def __init__(self, token) -> None:
        self.token = token
        user_pool_id = os.environ['userPoolID']
        self.client_id = os.environ['CLIENTID']
        self.issuer = f'https://cognito-idp.{self.region}.amazonaws.com/{user_pool_id}'
        jwks_url = f'{self.issuer}/.well-known/jwks.json'
        jwks_client = jwt.PyJWKClient(jwks_url)
        self.signing_key = jwks_client.get_signing_key_from_jwt(token)

    def verify(self):
        token = jwt.decode(
            self.token,
            self.signing_key.key,
            algorithms=["RS256"],
            audience=self.client_id,
            issuser=self.issuer
        )
        # decodeしたtokenと比較
        if token['token_use'] != 'id':
            raise Exception('Invalid token_use')
        return True


if __name__ == '__main__':
    app.run(debug=True)
