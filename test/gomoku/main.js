//2017-07-21 周五 10:32 上午
class FxcGomoku{
  constructor(){
    this.nowData=[];
    this.eleCanvas=document.getElementById('fxc-gomoku');
    this.ctx=this.eleCanvas.getContext('2d');
    this.numCeilWidth=30; //单元格大小
    this.numPieceWidth=13;  //棋子大小,半径
    this.paddingLeft=40;  //左边距
    this.paddingTop=40; //上边距
    this.numTotalWidth=this.eleCanvas.width;

    this.numNowStep=0;
    this.firstPlayer='human';  //'human','computer'
    this.bIsPlayWithComputer=false;

    this.elesUndo=document.querySelectorAll('.undo a');
    this.arrStepData=[];
    this.eleNowStep=document.querySelector('.undo strong');

    this.bIsOver=false;
    this.arrWins=[];
    this.numAllWins=0;
    this.arrHumanWin=[];
    this.arrComputerWin=[];
  }

  //============初始化
  init(){
    this.initNowData();

    this.createArrWins();
    this.createArrHumanWinAndComputerWin();
    console.log(this.numAllWins);
    this.render();
    this.startChess();
    this.undo();
    this.redo();

  } //end of init
  render(){
    //=====第几步渲染
    this.eleNowStep.innerHTML=this.numNowStep;
    //=====清除画布 console.log(this.numTotalWidth);
    this.ctx.clearRect(0,0,this.numTotalWidth,this.numTotalWidth);
    //=====由nowData渲染出的棋局，可以使用canvas或dom
    for(var i=0;i<15;i++){
      for(var j=0;j<15;j++){
        //console.log(this.nowData[i][j]);
        var pieceIaJ15=this.nowData[i][j];
        objFxcGomoku.drawPiece(pieceIaJ15.piece,i,j,pieceIaJ15.numStep);
      }
    }
  }

  //===初始化棋局
  initNowData(){
    for(var i=0;i<15;i++){
      this.nowData[i]=[];
      for(var j=0;j<15;j++){
        this.nowData[i][j]={
          piece:'',
          numStep:0
        };
      }
    }
  }
  //============画棋子：颜色（black，white，空），ia（x轴a-b-c），j15（y轴15-14-13）
  drawPiece(strPiece,ia,j15,numStep){
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
    if(!strPiece){  //不画棋子
      return false;
    }
    var arrColorStop=[];
    var strColor='';
    var numFontLeft=0;
    if(strPiece==='black'){
      arrColorStop=['#090909','#636766'];
      strColor='#FFF';
    }else{
      arrColorStop=['#d3d3d3','#f9f9f9'];
      strColor='#000';
    }
    if(numStep<10){
      numFontLeft=-2;
    }else if(numStep<100){
      numFontLeft=-5;
    }else if(numStep<1000){
      numFontLeft=-8;
    }
    var arrPositionIaJ15=[this.numCeilWidth*ia+this.paddingLeft,this.numCeilWidth*j15+this.paddingTop];

    this.ctx.beginPath();
    this.ctx.arc(arrPositionIaJ15[0],arrPositionIaJ15[1],this.numPieceWidth,0,2*Math.PI);
    this.ctx.closePath();
    var gradient=this.ctx.createRadialGradient(arrPositionIaJ15[0]+3,arrPositionIaJ15[1]-3,this.numPieceWidth,arrPositionIaJ15[0]+3,arrPositionIaJ15[1]-3,0);
    gradient.addColorStop(0,arrColorStop[0]);
    gradient.addColorStop(1,arrColorStop[1]);
    this.ctx.fillStyle=gradient;
    this.ctx.fill();
    this.ctx.font='12px serif';
    this.ctx.fillStyle=strColor;
    this.ctx.fillText(numStep,arrPositionIaJ15[0]+numFontLeft,arrPositionIaJ15[1]+3);
  }
  //================开始下棋
  startChess(){
      //第一步永远是黑棋
    if(this.firstPlayer==='human'){
      this.humanChess('black');
    }else{
      this.computerChess('black');
    }
  }
  //=============人下
  humanChess(pieceColor){
    var gomokuThis=this;
    this.eleCanvas.onclick=function(e){
      var numOffsetX=e.offsetX;
      var numOffsetY=e.offsetY;
      gomokuThis.dealClick(pieceColor,numOffsetX,numOffsetY);
    };
  }
  //=============机器下
  computerChess(pieceColor){
    //电脑算法。。。
    //console.log("now computer"+this.numNowStep);
  }
  //============处理点击
  dealClick(pieceColor,numOffsetX,numOffsetY){
    var floatX=(numOffsetX-this.paddingLeft)/this.numCeilWidth;
    var floatY=(numOffsetY-this.paddingLeft)/this.numCeilWidth;
    var numXia=Math.round(floatX);
    var numYj15=Math.round(floatY);
    //console.log(numXia);

    if(numXia<0 || numXia>14 || numYj15<0 || numYj15>14){ //点击在棋盘外
      return false;
    }
    if(this.nowData[numXia][numYj15].piece){  //有子，不能下
      return false;
    }

    //步数自增
    this.numNowStep++;

    //和电脑玩则一直是下黑棋，否则黑白切换
    var strPiece=this.bIsPlayWithComputer?pieceColor:['white','black'][this.numNowStep & 1];

    //修改nowData
    this.nowData[numXia][numYj15]={
      piece:strPiece,
      numStep:this.numNowStep
    }

    this.render();
    //渲染完后保存下棋log
    var strTmp=JSON.stringify(this.nowData[numXia][numYj15])+'fangxuecongExpectToEnterCDC'+numXia+'fangxuecongExpectToEnterCDC'+numYj15;
    this.arrStepData[this.numNowStep-1]=strTmp;
    //删除当前步后面的步数（当撤销后又手动下）。后期如果深化，考虑有多分歧的棋局，则可能产生多维数组，不删除步数。。。
    this.arrStepData.length=this.numNowStep;
    //console.log(this.arrStepData);

    if(!this.checkIsWin(numXia,numYj15,pieceColor)){
      //轮到电脑下
      this.computerChess(pieceColor==='black'?'white':'black');
    }else{
      alert('v');
    }
  }
  checkIsWin(i,j,pieceColor){
    var bIsWin=false;
    for(var k=0;k<this.numAllWins;k++){
      if(this.arrWins[i][j][k] && this.nowData[i][j].piece===pieceColor){
        this.arrHumanWin[k]++;
        //this.arrComputerWin[k]=6;
        if(this.arrHumanWin[k]===5){
          bIsWin=true;
        }
      }
    }
    return bIsWin;
  }
  //============悔棋
  undo(){
    var gomokuThis=this;
    this.elesUndo[0].onclick=function(){
      //没有可悔的棋局
      if(gomokuThis.numNowStep===0){
        return false;
      }
      //还原为初始值
      for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
          if(gomokuThis.nowData[i][j].numStep===gomokuThis.numNowStep){
            gomokuThis.nowData[i][j]={
              piece:'',
              numStep:0
            }
          }
        }
      }

      gomokuThis.numNowStep--;
      gomokuThis.render();
    }
  }
  redo(){
    var gomokuThis=this;
    this.elesUndo[1].onclick=function(){
      //没有可撤销的棋局
      if(gomokuThis.numNowStep===gomokuThis.arrStepData.length){
        return false;
      }
      var objRedo=JSON.parse(gomokuThis.arrStepData[gomokuThis.numNowStep].split(/fangxuecongExpectToEnterCDC/g)[0]);
      var i=Number(gomokuThis.arrStepData[gomokuThis.numNowStep].split(/fangxuecongExpectToEnterCDC/g)[1]);
      var j=Number(gomokuThis.arrStepData[gomokuThis.numNowStep].split(/fangxuecongExpectToEnterCDC/g)[2]);
      //赋值
      gomokuThis.nowData[i][j]={
        piece:objRedo.piece,
        numStep:objRedo.numStep
      }

      gomokuThis.numNowStep++;
      gomokuThis.render();
    };
  }
  //=============创建赢法数组
  createArrWins(){
    /*初始化赢法数据*/
    for(var i=0;i<15;i++){
      this.arrWins[i]=[];
      for(var j=0;j<15;j++){
        this.arrWins[i][j]=[];
      }
    }
    /*计算有多少种赢法*/
    for(var i=0;i<15;i++){ //横线五子
      for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
          this.arrWins[i][j+k][this.numAllWins]=true;
        }
        this.numAllWins++;
      }
    }
    for(var i=0;i<11;i++){ //竖线五子
      for(var j=0;j<15;j++){
        for(var k=0;k<5;k++){
          this.arrWins[i+k][j][this.numAllWins]=true;
        }
        this.numAllWins++;
      }
    }
    for(var i=0;i<11;i++){ //斜线(\)五子
      for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
          this.arrWins[i+k][j+k][this.numAllWins]=true;
        }
        this.numAllWins++;
      }
    }
    for(var i=14;i>=4;i--){ //斜线(/)五子
      for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
          this.arrWins[i-k][j+k][this.numAllWins]=true;
        }
        this.numAllWins++;
      }
    }
  }
  //===========创建玩家胜利数组
  createArrHumanWinAndComputerWin(){
    for(var i=0;i<this.numAllWins;i++){
      this.arrHumanWin[i]=0;
      this.arrComputerWin[i]=0;
    }
  }
  //============深度拷贝
  deepCopyObject(obj){
    var str='';
    var newObj=obj.constructor===Array?[]:{};
    if(typeof obj!=='object'){
      return;
    }else if(window.JSON){
      str=JSON.stringify(obj);
      newObj=JSON.parse(str);
    }else{
      for(var i in obj){
        newObj[i]=typeof obj[i]==='object'?deepCopyObject(obj[i]):obj[i];
      }
    }
    return newObj;
  }
} //end of class

var objFxcGomoku=new FxcGomoku();
objFxcGomoku.init();
//console.log(objFxcGomoku.nowData);
