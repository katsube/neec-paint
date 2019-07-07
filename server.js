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
// Webサーバ
//--------------------------------------
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
http.listen(port, ()=>{
  console.log(`listening on *:${port}`);
});

//--------------------------------------
// Socket.io
//--------------------------------------
io.on("connection", (socket)=>{
  socket.on("action", (data)=>{
    socket.broadcast.emit("action", data);
    console.log(data);
  });
});