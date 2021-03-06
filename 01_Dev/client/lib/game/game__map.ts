
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export function doesThisTypeExist(str_array:any, typeIdentifier:string): boolean
  {
    var exist_f:boolean = false;
    for(var i = 0; i < str_array.length; i++) {
      var matchN = 0;
      for(var j=0; j<typeIdentifier.length; j++) {
        if(str_array[i][j] === typeIdentifier[j]) {
          matchN++;
        }
      }
      if(matchN === typeIdentifier.length) {
        exist_f = true;
      }
    }
    return exist_f;
  }

  /**
   * タイプ文字の後ろにある[*]のパラメーター文字列を返す
   * @param str_array
   * @param typeIdentifier
   * @returns {any}
   */
  export function getTypeParameter(str_array:any, typeIdentifier:string): string
  {
    var exist_f:boolean = false;
    for(var i = 0; i < str_array.length; i++) {
      var matchN = 0;
      for(var j=0; j<typeIdentifier.length; j++) {
        if(str_array[i][j] === typeIdentifier[j]) {
          matchN++;
        }
      }
      if(matchN === typeIdentifier.length) {
        var tmp = str_array[i].split(']')[0];
        return tmp.split('[')[1];
      }
    }
    return ""
  }

  export class Map {
    protected _map:any;
    protected _typeMapData: any;
    protected _texMapData: any;
    protected _heightMapData: any;
    protected _scriptMapData: any;
    constructor(isCalledFromChild:boolean) {
      if(!isCalledFromChild) {
        throw new Error("This class is a abstract class.");
      }
    }
    private makeTexMapData(map: any) :void
    {


      this._texMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
      for (var i = 0; i < this.height + 2; i++) {
        this._texMapData[i] = new Array(this.width + 2); //２次元配列にする
      }
      var x = 0;
      var y = 0;
      var mapDataStr = map;
      var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
      for (var i=0; i<split_with_n.length-1; i++) { //行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
        var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
        for(var j=0; j<split_with_comma.length; j++) {
          var split_with_space = split_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
          var texId = parseInt(split_with_space[0], 10); // テクスチャIDを記憶する。 "10 Dk"だったら、10を数値として保存
          y = i+1;
          x = j+1;

          this._texMapData[y][x] = texId;
        }
      }

      console.log("テクスチャマップ：");
      /// マップデータのデバッグ表示
      var mapDataValueStr = "";
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
          mapDataValueStr += this._texMapData[i][j] + " ";
        }
        mapDataValueStr += "\n";
      }
      console.log(mapDataValueStr);

      // 端っこのチップはその内側のチップと同じテクスチャになってもらう
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
//                    if (i == 0 || i == this.height + 1 || j == 0 || j == this.width + 1) { //配列の端は0(壁)にする
//                        this.mapData[i][j] = -1;
//                    }
          if (i === 0) {
            this._texMapData[i][j] = this._texMapData[i+1][j];
          }
          if (i === this.height + 1) {
            this._texMapData[i][j] = this._texMapData[this.height][j];
          }
          if (j === 0) {
            this._texMapData[i][j] = this._texMapData[i][j+1];
          }
          if (j === this.width + 1) {
            this._texMapData[i][j] = this._texMapData[i][this.width];
          }
        }
      }

      console.log("テクスチャマップ：");
      /// マップデータのデバッグ表示
      var mapDataValueStr = "";
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
          mapDataValueStr += this._texMapData[i][j] + " ";
        }
        mapDataValueStr += "\n";
      }
      console.log(mapDataValueStr);

    }

    private makeTypeMapData(map: any) :void
    {


      this._typeMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
      for (var i = 0; i < this.height + 2; i++) {
        this._typeMapData[i] = new Array(this.width + 2); //２次元配列にする
        for (var j = 0; j < this.width + 2; j++) {
          if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) { //配列の端は[10,10]にして、実質的な壁にする
            this._typeMapData[i][j] = 'W';
          }
        }
      }
      var x = 0;
      var y = 0;
      var mapDataStr = map;
      var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
      for (var i=0; i<split_with_n.length-1; i++) { //行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
        var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
        for(var j=0; j<split_with_comma.length; j++) {
          var split_with_space = split_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
          y = i+1;
          x = j+1;

          /*
           var typesStr = "";
           for (var k=1; k<split_with_space.length; k++) {
           typesStr += split_with_space[k];
           }*/
          split_with_space.splice(0, 1); // 0番目を削除して詰める。つまり、テクスチャ番号を消して、タイルタイプ文字列のみの配列にする。

          this._typeMapData[y][x] = split_with_space;

        }
      }

      console.log("タイプマップ：");
      // マップデータのデバッグ表示
      var mapDataValueStr = "";
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
          mapDataValueStr += this._typeMapData[i][j] + ",";
        }
        mapDataValueStr += "\n";
      }
      console.log(mapDataValueStr);

    }

    private makeHeightMapData(map: any) :void
    {
      this._heightMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
      for (var i = 0; i < this.height + 2; i++) {
        this._heightMapData[i] = new Array(this.width + 2); //２次元配列にする
        for (var j = 0; j < this.width + 2; j++) {
          if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) { //配列の端は[10,10]にして、実質的な壁にする
            this._heightMapData[i][j] = [10, 10];
          }
        }
      }
      var x = 0;
      var y = 0;
      var mapDataStr = map;
      var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
      for (var i=0; i<split_with_n.length-1; i++) { //行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
        var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
        for(var j=0; j<split_with_comma.length; j++) {
          var split_with_space = split_with_comma[j].split(" "); // データを「床の高さ」と「天井の高さ」にスプリットする。
          var floorHeight = parseInt(split_with_space[0], 10); // 床の高さを取り出す
          var ceilingHeight = parseInt(split_with_space[1], 10); // 床の高さを取り出す
          y = i+1;
          x = j+1;

          if (doesThisTypeExist(this._typeMapData[y][x], 'W')) { // 壁のタイルだったら
            this._heightMapData[y][x] = [10, 10]; // 高さマップでも実質的な壁にする
          } else {
            this._heightMapData[y][x] = [floorHeight, ceilingHeight];
          }
        }
      }


      console.log("ハイトマップ：");
      // マップデータのデバッグ表示
      var mapDataValueStr = "";
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
          mapDataValueStr += this._heightMapData[i][j][0] + " " + this._heightMapData[i][j][1] + ",";
        }
        mapDataValueStr += "\n";
      }
      console.log(mapDataValueStr);

    }

    private makeScriptMapData(map: any) :void
    {
      this._scriptMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
      for (var i = 0; i < this.height + 2; i++) {
        this._scriptMapData[i] = new Array(this.width + 2); //２次元配列にする
        for (var j = 0; j < this.width + 2; j++) {
          if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) { //配列の端は[10,10]にして、実質的な壁にする
            this._scriptMapData[i][j] = '0';
          }
        }
      }
      var x = 0;
      var y = 0;
      var mapDataStr = map;
      var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
      for (var i=0; i<split_with_n.length-1; i++) { //行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
        var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
        for(var j=0; j<split_with_comma.length; j++) {
          y = i+1;
          x = j+1;
          var value = split_with_comma[j];
          this._scriptMapData[y][x] = value;
        }
      }

      console.log("スクリプトマップ：");
      // マップデータのデバッグ表示
      var mapDataValueStr = "";
      for (var i = 0; i < this.height + 2; i++) {
        for (var j = 0; j < this.width + 2; j++) {
          mapDataValueStr += this._scriptMapData[i][j] + ",";
        }
        mapDataValueStr += "\n";
      }
      console.log(mapDataValueStr);

    }




    public isCouldPassAt(x:number, y:number, h:number, h_f:number): boolean {
      var floorHeight = this.heightMapData[x][y][0];
      var ceilingHeight = this.heightMapData[x][y][1];

      if (h_f !== null) {
        // 浮動小数点を含む中途半端な高さだったら移動を許可しない
        if (h_f - Math.floor(h_f) > 0) {
          return false;
        }
      }

      if (flyMode_f) {
        // 自分より下の高さのタイルに移動できる判定処理（空中浮遊モード時に使用）
        if (h >= floorHeight) {
          if (h+1 <= ceilingHeight) {
            return true;
          }
        }
      } else {
        // 自分と同じ高さの床にしか移動できない判定処理
        if (h == floorHeight) {
          if (h+1 <= ceilingHeight) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * 稼働中のプラットフォームかどうか。指定されたマップチップの高さが浮動小数点値だったら、稼働中のプラットフォームと判断する
     */
    public isMovingPlatform(x:number, y:number):boolean {
      var floorHeight = this.heightMapData[x][y][0];
      if (floorHeight - Math.floor(floorHeight) > 0) {
        return true;
      } else {
        return false;
      }
    }

    public isThereScriptAt(x:number, y:number): boolean {
      var value = this.scriptMapData[x][y];
      if (value !== '0') {
        return true;
      } else {
        return false;
      }
    }

    public doScriptIfThereIsIt(x:number, y:number): boolean {
      var value = this.scriptMapData[x][y];
      if (value !== '0') {
        var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
        userFunctionsManager.execute(value, 'Map');
        return true;
      } else {
        return false;
      }
    }

    // オーバーライドされること前提
    public movePlatforms() {

    }

    protected set map(map:any) {
      this._map = map;
      this.makeTexMapData(map.type_array);
      this.makeTypeMapData(map.type_array);
      this.makeHeightMapData(map.height_array);
      this.makeScriptMapData(map.script_array);
    }
    get title():string {
      return this._map.title;
    }
    get width():number {
      return this._map.width;
    }
    get height():number {
      return this._map.height;
    }
    get texMapData(): any {
      return this._texMapData;
    }
    get typeMapData(): any {
      return this._typeMapData;
    }
    get heightMapData(): any {
      return this._heightMapData;
    }
    get scriptMapData(): any {
      return this._scriptMapData;
    }
  }
}

