/**
 * お絵描きクラス(canvas)
 *
 * @version 1.0.0
 * @author M.Katsube <katsubemakito@gmail.com>
 */
class DrawBoard {
  /**
   * コンストラクタ
   *
   * @constructor
   * @param {string}   canvas_id  canvasタグのselector(id)
   * @param {object}   [option]   線の太さと色を指定
   */
  constructor(canvas_id, option={color:"black", width:5}){
    //--------------------------------
    // プロパティ初期化
    //--------------------------------
    this.canvas = document.querySelector(canvas_id);
    this.ctx    = this.canvas.getContext("2d");
    this.rect   = this.canvas.getBoundingClientRect();
    this.status = {
      isDraw: false,
      mode: "pencil",   // 鉛筆(pencil) or 消しゴム(erase)
      line: {
        color: option.color,      // 線の色
        width: option.width       // 線の太さ
      },
      // 直前の座標を保管
      pos: {
        x:0, y:0
      }
    };
    // 描画実行時に指定処理を行う
    this.callback = (opt)=>{};

    //--------------------------------
    // イベント処理
    //--------------------------------
    this.canvas.addEventListener("mousedown", (e)=>{this.eventMouseDown(e)});  // マウスのボタンを押した瞬間
    this.canvas.addEventListener("mousemove", (e)=>{this.eventMouseMove(e)});  // マウスを移動
    this.canvas.addEventListener("mouseup",   (e)=>{this.eventMouseUp(e)});    // アウスのボタンから指を離した
  }

  /**
   * 描画モードをセット
   *
   * @param {string} mode  "pencil" or "erase"
   * @return {boolean}
   */
  setMode(mode){
    switch(mode){
      case "pencil":
      case "erase":
        this.status.mode = mode;
        return(true);
      default:
        return(false);
    }
  }
  /**
   * 描画モードを返却
   *
   * @return {string}
   */
  getMode(){
    return(this.status.mode);
  }

  /**
   * 線の色をセット
   *
   * @param {string} color RGB, 色名など
   * @return {boolean}
   */
  setLineColor(color){
    if( typeof(color) === "string" ){     // 引数が文字列型であれば
      this.status.line.color = color;
      return(true);
    }
    return(false);
  }
  /**
   * 線の色を返却
   *
   * @return {string}
   */
  getLineColor(){
    return(this.status.line.color);
  }

  /**
   * 線の太さをセット
   *
   * @param {integer} size px数で太さを指定
   * @return {boolean}
   */
  setLineWidth(size){
    const num = Number(size);           // 整数型にキャスト
    if( typeof( num ) === "number" ){   // 引数が整数型であれば
      this.status.line.width = num;
      return(true);
    }
    return(false);
  }
  /**
   * 線の太さを返却
   *
   * @return {integer}
   */
  getLineWidth(){
    return(this.status.line.width);
  }

  /**
   * 描画実行後に実施したい処理をセット
   *
   * @param {function} cb  実行したい関数
   * @return {boolean}
   */
  setCallback(cb){
    if( typeof(cb) === "function" ){
      this.callback = cb;
      return(true);
    }
    return(false);
  }


  /**
   * 【イベント】マウスボタン押下
   *
   * @param {object} e イベント情報
   * @return {void}
   */
  eventMouseDown(e){
    this.status.pos.x = e.clientX - this.rect.left;   // クリックされた座標Xを計算
    this.status.pos.y = e.clientY - this.rect.top;    // 〃            座標Yを計算
    this.status.isDraw = true;  // 描画モードをON

    // CSS
    this.canvas.style.cursor = "pointer";     // マウスカーソルの形を変更
  }

  /**
   * 【イベント】マウスカーソルを移動
   *
   * @param {object} e イベント情報
   * @return {void}
   */
  eventMouseMove(e){
    // マウスボタンが押されている状態のときのみ以下を実行
    if( this.status.isDraw ){
      const x1 = this.status.pos.x;           // 前回のX座標
      const y1 = this.status.pos.y;           // 前回のY座標
      const x2 = e.clientX - this.rect.left;  // 今回のX座標
      const y2 = e.clientY - this.rect.top;   // 今回のY座標

      // 鉛筆モード
      if( this.status.mode === "pencil" ){
        this.drawLine(x1, y1, x2, y2);
      }
      // 消しゴムモード
      else if( this.status.mode === "erase" ){
        this.eraseLine(x1, y1, x2, y2);
      }

      // 今回の座標をプロパティ内に記録
      this.status.pos.x = x2;
      this.status.pos.y = y2;
      console.log(this.status.pos);
    }
  }

  /**
   * 【イベント】マウスボタンから指を離す
   *
   * @param {object} e イベント情報
   * @return {void}
   */
  eventMouseUp(e){
    // 描画モードをOFF
    this.status.isDraw = false;

    // CSS
    this.canvas.style.cursor = "auto";   // マウスカーソルを元の形に戻す
  }

  /**
   * 線を描画する
   *
   * @param {integer} x1 始点x
   * @param {integer} y1 始点y
   * @param {integer} x2 終点x
   * @param {integer} y2 終点y
   * @param {integer} [size]  線の幅。省略時はプロパティ値が採用される
   * @param {integer} [color] 線の色。省略時はプロパティ値が採用される
   * @param {boolena} [cbrun] Callbackを実行するか
   * @return {void}
   */
  drawLine(x1, y1, x2, y2, size=null, color=null, cbrun=true){
    const ctx = this.ctx;

    // 線の設定
    size  = (size===null)?   this.status.line.width:size;
    color = (color===null)?  this.status.line.color:color;
    ctx.lineWidth   = size;   // 太さ
    ctx.strokeStyle = color;  // 色

    // 線の描画
    ctx.beginPath();
    ctx.moveTo(x1, y1);     // 始点に移動
    ctx.lineTo(x2, y2);     // 終点まで線を描画
    ctx.stroke();           // 塗り潰す
    ctx.closePath();

    // 指定されたcallback関数を実行
    if( cbrun ){
      this.callback({
        mode: "pencil",
        line: { size:size, color:color },
        pos: { x1:x1, y1:y1, x2:x2, y2:y2 }
      });
    }
  }

 /**
   * 指定範囲を削除する
   *
   * @param {integer} x1 始点x
   * @param {integer} y1 始点y
   * @param {integer} x2 終点x
   * @param {integer} y2 終点y
   * @param {integer} [size]  線の幅。省略時はプロパティ値が採用される
   * @param {boolean} [cbrun] callbackを実行するか
   * @return {void}
   */
  eraseLine(x1, y1, x2, y2, size=null, cbrun=true){
    const ctx = this.ctx;

    // 領域のサイズを計算
    size = (size===null)?  this.status.line.width:size;
    const width  = Math.abs(x1-x2) * size;    // 横幅
    const height = Math.abs(y1-y2) * size;    // 高さ

    // 指定領域を削除する
    ctx.clearRect(x1, y1, width, height);

    // 指定されたcallback関数を実行
    if( cbrun ){
      this.callback({
        mode: "erase",
        line: { size:size },
        pos: { x1:x1, y1:y1, x2:x2, y2:y2 }
      });
    }
  }
}