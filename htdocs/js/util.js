/**
 * 汎用関数ライブラリ
 *
 * @version 1.0.0
 * @author M.katsube <katsubemakito@gmail.com>
 * @copyright 2019 M.katsube
 */

/**
 * RESTful APIをリクエスト
 *
 * @param  {string}   api      リクエストするAPIのURL
 * @param  {function} callback 成功時に実行するcallback
 * @return {void}
 */
function requestAPI(api, callback){
  const req = new XMLHttpRequest();
  req.open("GET", api, false);
  req.onreadystatechange = () => {
    if( req.status === 200 || req.status === 304 ){
    	const text = req.responseText;    // サーバから渡された値を取り出す
      const json = JSON.parse(text);    // JSで利用できるよう変換

      // エラー処理
      if(json["status"] === false){
          alert("エラーが発生しました");
          console.log(json);
          return(false);
      }

      // callbackを実行
      callback(json["value"]);
    }
  }
  req.send();
}
