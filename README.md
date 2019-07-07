# オンラインペイント
## What is this
日本工学院八王子専門学校 ゲーム科4年生向けのPHP実習のサンプルです。

## Quick Start
### Install
Node.jsがインストールされたサーバにリポジトリcloneするか、ダウンロードしたファイルを設置してください。
```
$ git clone https://github.com/katsube/neec-paint paint
```

必要なライブラリをインストールします。
```
$ cd paint
$ npm install
```

server.jsをテキストエディタ(viなど)で開き、以下の`3000`となっているポート番号を適宜設定してください。
```javascript
//--------------------------------------
// モジュール読み込み
//--------------------------------------
const port = 3000;
const app  = require("express")();
const http = require("http").Server(app);
const io   = require("socket.io")(http);
```

### Run
server.jsを起動します。
```
$ node server.js
```

### How to use
通常プレイは設置したサーバの指定ポートへアクセスします。
```
http://example.com:3000/
```
※`example.com`は自分のドメインに置き換えてください。

## Reference
* [2019年度前期リポジトリ](https://github.com/katsube/neec2019A)
