/*
var eleFxcGomoku=document.getElementById('fxc-gomoku');
eleFxcGomoku.onclick=function(){
  alert('test');
};
*/

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
    this.numNowStep=0;
  }

  init(){
    for(var i=0;i<15;i++){
      this.nowData[i]=[];
      for(var j=0;j<15;j++){
        this.nowData[i][j]={
          piece:'',
          numStep:0
        };
      }
    }
    this.render();
    //var gomokuThis=this;
    this.eleCanvas.onclick=this.dealClick.bind(this);
  } //end of init
  render(){
    //由nowData渲染出的棋局，可以使用canvas或dom
    for(var i=0;i<15;i++){
      for(var j=0;j<15;j++){
        //console.log(this.nowData[i][j]);
        var pieceIaJ15=this.nowData[i][j];
        objFxcGomoku.drawPiece(pieceIaJ15.piece,i,j,pieceIaJ15.numStep);
      }
    }
  }

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
  dealClick(e){
    //console.log(this);
    var numOffsetX=e.offsetX;
    var numOffsetY=e.offsetY;

    var floatX=(numOffsetX-this.paddingLeft)/this.numCeilWidth;
    var floatY=(numOffsetY-this.paddingLeft)/this.numCeilWidth;
    var numXia=Math.round(floatX);
    var numYj15=Math.round(floatY);

    //var strPiece=['black','white'][this.iColor];
    var strPiece='white';
    this.numNowStep++;
    this.nowData[numXia][numYj15]={
      piece:strPiece,
      numStep:this.numNowStep
    }
    this.iColor=!this.iColor;

    this.render();
  }
}

var objFxcGomoku=new FxcGomoku();
objFxcGomoku.init();
//console.log(objFxcGomoku.nowData);
