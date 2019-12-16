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
    this.currentNum=1;

    this.okay=false;
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (!this.okay);
  }

  init(){
    //首先生成1，5，9這三個宮，索引是0，4，8
    this.gung159();
    this.currentCell=[1,0];
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
    f.tryCell();
    
    return f;
  }

  tryCell(){
    var f=this;
    //保存更新之前的数据
    var arrGungBeforeUpdate=JSON.parse(JSON.stringify(f.arrGung));

    //更新
    f.updateArrGung();
    //绘制的时机：每更新一次，绘制一遍
    f.draw();

    if(!f.okay){
      var checkOkay=f.check(arrGungBeforeUpdate);
      if(checkOkay){
        //当前单元格可以填充 f.currentNum
        f.updateCurrentCell();
      }else{
        //还原数据，更新填入数字
        f.arrGung=arrGungBeforeUpdate;
        f.updateCurrentNum();
      }
    }else{
      //生成终盘成功
      console.log('success');
    }
    return f;
  }
  //尝试数字
  updateCurrentNum(){
    var f=this;
    f.currentNum++;
    if(f.currentNum>=10){
      //回溯
      f.back();
    }
    return f;
  }
  back(){
    var f=this;
    //计算当前单元格的上一个单元格
    f.updateCurrentCell(true);
    // f.arrGung=[];
    // f.currentNum=1.5;
    return f;
  }
  //弃用
  backCell(){
    var f=this;
    var gungIndex=f.currentCell[0];  //从第一个宫开始
    var cellIndex=f.currentCell[1];
    cellIndex--;
    if(cellIndex<0){
      //回退到上个宫
      cellIndex=8;
      gungIndex--;
      //跳过宫
      if(gungIndex===4){
        gungIndex=3;
      }
    }

    this.currentCell=[gungIndex,cellIndex];

    //回退失败
    if(gungIndex<0){
      // console.log(cellIndex,gungIndex);
      f.okay=true;
      console.log('生成失败');
    }

  }
  //尝试单元格(前进或回退)
  updateCurrentCell(isBack){
    var f=this;
    if(isBack){}else{
      f.currentNum=1;
    }

    var gungIndex=f.currentCell[0];  //从第一个宫开始
    var cellIndex=f.currentCell[1];
    if(isBack){
      cellIndex--;
    }else{
      cellIndex++;
    }
    if(cellIndex>=9){
      cellIndex=0;
      gungIndex++;
      //跳过宫
      if(gungIndex===4){
        gungIndex=5;
      }
    }
    if(cellIndex<0){
      //回退到上个宫
      cellIndex=8;
      gungIndex--;
      //跳过宫
      if(gungIndex===4){
        gungIndex=3;
      }
    }


    this.currentCell=[gungIndex,cellIndex];


    //已经生成成功
    if(gungIndex>=8){
      // console.log(cellIndex,gungIndex);
      f.okay=true;
    }
    //回退失败
    if(gungIndex<0){
      // console.log(cellIndex,gungIndex);
      f.okay=true;
      console.log('生成失败');
    }

    return f;
  }
  //更新宫数据
  updateArrGung(){
    var f=this;
    f.arrGung[f.currentCell[0]][f.currentCell[1]]=f.currentNum;
    // console.log(f.arrGung);

    
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
  arrRowCol_from_arrGung(arrGung){
    var f=this;
    //默认是f.arrGung
    arrGung=arrGung || f.arrGung;
    var arrRow=[],arrCol=[];
    for(var gungIndex=0;gungIndex<9;gungIndex++){
      arrRow[gungIndex]=arrRow[gungIndex] || [];
      for(var cellIndex=0;cellIndex<9;cellIndex++){
        arrCol[cellIndex]=arrCol[cellIndex] || [];

        var rowcol=f.turnGungCell2rowcol(gungIndex,cellIndex);
        arrRow[gungIndex][cellIndex]=arrGung[rowcol.row][rowcol.col];
        arrCol[cellIndex][gungIndex]=arrGung[rowcol.row][rowcol.col];
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
  //检查数据的正确性,（更新了arrGung之前）,针对当前单元格进行检查
  check(arrGungBeforeUpdate){
    var f=this;

    

    //获取当前单元格所在宫数据
    var gungIndex=f.currentCell[0];
    var cell=f.currentCell[1];
    var theGung=arrGungBeforeUpdate[gungIndex];

    //获取当前单元格所在的行列
    var rowCol=f.turnGungCell2rowcol(gungIndex,cell);
    var arrRowCol=f.arrRowCol_from_arrGung(arrGungBeforeUpdate);

    //获取当前单元格所在的行列数据
    var theRow=arrRowCol.arrRow[rowCol.row];
    var theCol=arrRowCol.arrCol[rowCol.col];


    //concat
    var theGungRowCol=theGung.concat(theRow,theCol);
    // console.log(theGungRowCol);


    //okay：没有 f.currentNum
    var checkOkay=!theGungRowCol.includes(f.currentNum);
    console.log(checkOkay);
    return checkOkay;
  }

} //class

var obj=new Souduk();
obj.init();
obj.solve();