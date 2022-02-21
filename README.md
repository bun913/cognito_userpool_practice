# Cognitoのユーザープールを触ってみる

業務でCogntioを使う機会がまだないので、先に触ってみる。

## 前準備

以下環境変数を設定しておく必要がある。

```bash
export userPoolID=${ユーザープールのID}
export CLIENTID=${ユーザープールで作成したアプリクライアントのID}
export USER_NAME=${ユーザープールで作成したユーザー名}
export PASS=${ユーザープールのユーザーのパスワード}
# ユーザープールから作成したユーザーの場合パスワードの変更が必要なため
export newPassword=${設定したい新規パスワード}
```

また aws-cli に実行ユーザーに適切な権限を付与している必要がある。

```bash
aws configure
# access-keyなどの設定
```


## ユーザープールの作成等

WIP

## 使い方

(WIP)まだ途中

### クライアント側

```bash
# yarn
yarn install
# 単にJWTを表示させる場合
node client.js
# TODO: 現段階ではコンソールに表示。のちほどサーバー側に送信するように変更する
> 取得できたtokenが表示される
```

### サーバー側

```bash
pip install -r requirements.txt
# TODO: 現在はjwtトークン検証の部分しか作成していないため後程サーバーを立てる
python server.py
```