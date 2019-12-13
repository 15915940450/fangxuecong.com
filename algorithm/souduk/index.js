/*
Fisher–Yates shuffle
https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
https://gaohaoyang.github.io/2016/10/16/shuffle-algorithm/

[1,2,3,4,5,6,7,8].shuffle()
*/
Array.prototype.shuffle = function() {
  //避免修改原数组
  var input = JSON.parse(JSON.stringify(this));

  for (var i = input.length-1; i >=0; i--) {

    var randomIndex = Math.floor(Math.random()*(i+1));
    var itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return (input);
};
/*var a=[1,2,3,5];
var b=a.shuffle();
console.log(a,b);*/

class Souduk{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH4=document.documentElement.clientHeight || document.body.clientHeight;

    this.eleCanvas=document.querySelector('#souduk');


    this.arrGung=[];  //宫数据
    this.currentCell=[];  //当前进行尝试的单元格索引 [gungIndex,cell]

    this.okay=false;
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (!this.okay);
  }

  init(){
    //首先生成1，5，9這三個宮，索引是0，4，8
    this.gung159();
    this.currentCell=[1,-1];
  }

  gung159(){
    var f=this;
    var i,j,arr1_9=[];
    for(i=0;i<9;i++){
      f.arrGung[i]=f.arrGung[i] || [];
      arr1_9.push(i+1);
      for(j=0;j<9;j++){
        f.arrGung[i][j]=0;
      }
    }

    f.arrGung[0]=arr1_9.shuffle();
    f.arrGung[4]=arr1_9.shuffle();
    f.arrGung[8]=arr1_9.shuffle();

    // console.log(arr1_9);  //[1, 2, 3, 4, 5, 6, 7, 8, 9]

    return f;
  }

  // 算法
  solve(){
    var f=this;
    f.raf();
    return f;
  }
  //執行動畫
  raf(){
    var f=this;
    var rafCallback=function(){
      f.n++;
      //動畫进行中
      if(f.ciZuk()){
        if(!(f.n%f.interval)){
          //一帧一步
          f.currentStep++;
          f.doINeveryframe();
        }
        window.requestAnimationFrame(rafCallback);
      } //end if
    };
    window.requestAnimationFrame(rafCallback);
    return f;
  } //raf
  //每一幀你要做點什麽？
  doINeveryframe(){
    var f=this;
    // console.log(f.currentStep);
    f.tryCell(1);
    
    return f;
  }

  tryCell(num){
    var f=this;
    f.updateCurrentCell();
    if(!f.okay){
      f.updateArrGung(num);
    }
      

    return f;
  }
  updateCurrentCell(){
    var f=this;
    var gungIndex=f.currentCell[0];  //从第一个宫开始
    var cellIndex=f.currentCell[1];
    cellIndex++;
    if(cellIndex>=9){
      cellIndex=0;
      gungIndex++;
      //跳过宫
      if(gungIndex===4){
        gungIndex=5;
      }
    }


    this.currentCell=[gungIndex,cellIndex];


    //已经生成成功
    if(gungIndex>=8){
      // console.log(cellIndex,gungIndex);
      f.okay=true;
    }

    return f;
  }
  //更新宫数据
  updateArrGung(num){
    var f=this;
    f.arrGung[f.currentCell[0]][f.currentCell[1]]=num;
    // console.log(f.arrGung);

    //绘制的时机
    f.draw();
    return f;
  }

  draw(){
    var f=this;

    var arrRowCol=f.arrRowCol_from_arrGung();

    var canvasWidth=f.eleCanvas.width;
    var ctx=f.eleCanvas.getContext('2d');
    ctx.clearRect(0,0,canvasWidth,canvasWidth);

    var w=50;
    ctx.translate(20.5,20.5);

    var i,j;
    for(i=0;i<9;i++){
      for(j=0;j<9;j++){
        //画底盘
        ctx.strokeStyle='silver';
        ctx.lineWidth=1;
        ctx.strokeRect(i*w,j*w,w,w);

        ctx.fillStyle='#e1f0ff';
        ctx.font = "20px serif";
        ctx.textAlign='center';
        ctx.textBaseline='middle';

        var text=arrRowCol.arrRow[j][i] || '';
        ctx.fillText(text,(i+1/2)*w,(j+1/2)*w);
      }
    }

    //3,6
    ctx.strokeStyle='snow';
    ctx.lineWidth=3;
    ctx.beginPath();

    ctx.moveTo(0,3*w);
    ctx.lineTo(9*w,3*w);
    ctx.moveTo(0,6*w);
    ctx.lineTo(9*w,6*w);
    ctx.moveTo(3*w,0);
    ctx.lineTo(3*w,9*w);
    ctx.moveTo(6*w,0);
    ctx.lineTo(6*w,9*w);

    ctx.closePath();
    ctx.stroke();


    ctx.translate(-20.5,-20.5);

    return f;
  }

  //生成arrRow使與arrGung相對應
  arrRowCol_from_arrGung(){
    var f=this;
    var arrRow=[],arrCol=[];
    for(var gungIndex=0;gungIndex<9;gungIndex++){
      arrRow[gungIndex]=arrRow[gungIndex] || [];
      for(var cellIndex=0;cellIndex<9;cellIndex++){
        arrCol[cellIndex]=arrCol[cellIndex] || [];

        var rowcol=f.turnGungCell2rowcol(gungIndex,cellIndex);
        arrRow[gungIndex][cellIndex]=f.arrGung[rowcol.row][rowcol.col];
        arrCol[cellIndex][gungIndex]=f.arrGung[rowcol.row][rowcol.col];
      }
    }
    return ({
      arrRow:arrRow,
      arrCol:arrCol
    });
  }
  turnGungCell2rowcol(gungIndex,cellIndex){
    //gung[5][3]=row[4][6]
    var shangGung=Math.floor(gungIndex/3);  //商(1)
    var yuGung=gungIndex%3; //余(2)
    var shangCell=Math.floor(cellIndex/3);  //商(1)
    var yuCell=cellIndex%3; //余(0)

    var x=shangGung*3+shangCell;  //1*3+1
    var y=yuGung*3+yuCell;  //2*3+0

    return ({
      row:x,
      col:y
    });
  }

} //class

var obj=new Souduk();
obj.init();
obj.solve();