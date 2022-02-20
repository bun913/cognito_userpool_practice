import os
import jwt


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
    auth = Auth('${clientで取得できたidトークンのjwtをここに記載}')
    result = auth.verify()
    if result:
        print('Valid token!!')
