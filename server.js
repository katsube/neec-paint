/**
 * Socket.ioを使用したお絵描きアプリ
 * https://socket.io/get-started/chat/
 */

//--------------------------------------
// 定数
//--------------------------------------
const DOCUMENT_ROOT = __dirname + "/htdocs/";

//--------------------------------------
// モジュール読み込み
//--------------------------------------
const port = 3000;
const app  = require("express")();
const http = require("http").Server(app);
const io   = require("socket.io")(http);

//--------------------------------------
// グローバル変数
//--------------------------------------
let USER = 0;
let HISTORY = [];


//--------------------------------------
// HTTPサーバ
//--------------------------------------
// Web
app.get("/", (req, res)=>{
  res.sendFile( DOCUMENT_ROOT + "index.html");
});
app.get("/solo", (req, res)=>{
  res.sendFile( DOCUMENT_ROOT + "solo.html");
});
app.get("/multi", (req, res)=>{
  res.sendFile( DOCUMENT_ROOT + "multi.html");
});
app.get("/:dir/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + req.params.dir + "/" + req.params.file);
});

// API
app.get("/api/history/get", (req, res)=>{
  const param = {
    status: true,
    value: HISTORY
  };

  res.send( JSON.stringify(param) );
});

// 起動
http.listen(port, ()=>{
  console.log(`listening on *:${port}`);
});

//--------------------------------------
// Socket.io
//--------------------------------------
io.on("connection", (socket)=>{
  // ログインしたらユーザー数を加算
  USER++;
  io.emit("sysmessage", {msg:`新しいユーザーが入室。現在${USER}人が接続中`, time:time()});
  console.log(`新しいユーザーが入室。現在${USER}人が接続中`);

  //------------------------
  // 描画 or 消しゴム
  //------------------------
  socket.on("action", (data)=>{
    // 操作を記録
    HISTORY.push(data);

    // 送信者以外に送信
    socket.broadcast.emit("action", data);
    console.log(data);
  });

  //------------------------
  // 切断
  //------------------------
  socket.on("disconnect", ()=>{
    USER--;
    io.emit("sysmessage", {msg:`ユーザーが退室。現在${USER}人が接続中`, time:time()});
    console.log(`ユーザーが退室。現在${USER}人が接続中`);

    // 全員ログアウトしたら履歴をクリア
    if( USER === 0){
      HISTORY = [];
      console.log("ユーザーが全員退室。履歴データをクリアしました");
    }
  });
});


/**
 * 現在のUNIX TIMEを返却
 *
 * @return {string}
 */
function time(){
  return(
    new Date().getTime()
  );
}