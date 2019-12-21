class AItetris{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH4=document.documentElement.clientHeight || document.body.clientHeight;

    this.eleCanvas=document.querySelector('#tetris');

    this.arrTetris=[];
    //arrTetris:20*10(沒有當前活動的數據，當一個方塊固定後需要更新)
    //arrTetrisAppendActive:20*10（加上當前活動的方塊，即係展示給用戶的數據，每一幀，每一個操作都要更新）
    this.arrTetrisAppendActive=[];

    this.W=10;  //寬度：10
    this.H=20;  //高度：20
    this.cell=30; //每個格子大小
    this.randomRow=15;
    this.lock=false; //鎖住遊戲
    this.gameOver=false; //遊戲結束


    /*遊戲中的狀態*/
    this.active=null;  //當前方塊
    this.activeForm=null;  //當前方塊形態索引
    this.activePosition={ //當前方塊的位置
      row:null,
      j:3  //列(3,4,5,6)(0_base)
    };  //下一個方塊
    this.next=null;  //下一個方塊
    this.nextForm=null;  //下一個方塊形態索引


    /*人工智能目標形狀與列*/
    this.targetForm=null;
    this.targetJ=null;
    this.HIGHEST=null;

    this.pureRow=[];


    this.level=18;  //18級(。。。。。。)
    this.score=0; //遊戲得分
    this.HiScore=0; //歷史最高分
    this.lines=0; //已消除的行數
    this.frame=1; //速度：幀數

    this.rule=[];  //級數規則

    this.tetrisScore=[];  //消除行數得分

    //定義方塊形狀(4*4)(IJLOSTZ)(four times four)
    this.f_f={};
    this.generation=1;  //1，2：一代或二代
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<1e1*this.interval);
  }

  init(){
    var f=this;
    f.eleCanvas.width=f.CW;
    f.eleCanvas.height=f.CH4-70;

    this.arrTetrisAppendActive=[[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"black","v":0},{"color":"black","v":0},{"color":"#fffeff","v":1},{"color":"black","v":0},{"color":"#2eb788","v":1},{"color":"#2eb788","v":1},{"color":"#2eb788","v":1},{"color":"black","v":0},{"color":"black","v":0},{"color":"black","v":0}],[{"color":"#2eb788","v":1},{"color":"#2eb788","v":1},{"color":"#fffeff","v":1},{"color":"#2eb788","v":1},{"color":"#2eb788","v":1},{"color":"#fffeff","v":1},{"color":"#fffeff","v":1},{"color":"#2eb788","v":1},{"color":"black","v":0},{"color":"#fffeff","v":1}],[{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"#fffeff","v":1},{"color":"#fffeff","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"#fffeff","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"#fffeff","v":1}],[{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"#fffeff","v":1},{"color":"#fffeff","v":1},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"#fffeff","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":1}],[{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"#fffeff","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":1}],[{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"#fffeff","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0}],[{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0}],[{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":0}],[{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":1},{"color":"crimson","v":0}],[{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":1},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0},{"color":"crimson","v":0}]];

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
    console.log(f.currentStep);
    f.draw();
    return f;
  }
  draw(){
    var f=this;
    var ctx=f.eleCanvas.getContext('2d');
    
    ctx.clearRect(0,0,f.eleCanvas.width,f.eleCanvas.height);
    //基线：中线
    ctx.translate((f.eleCanvas.width/2)>>0+0.5,0.5);

    // 渲染主區
    f.renderCanvas(-300,f.arrTetrisAppendActive);


    ctx.translate(-((f.eleCanvas.width/2)>>0)-0.5,-0.5);
    return f;
  }

  //由二維數組繪製成canvas
  renderCanvas(numTranslate,arr,perW,el){
    var f=this;

    perW=perW || f.cell;
    el=el || f.eleCanvas;
    var arrBCC=[1,4];
    var ctx=el.getContext('2d');
    ctx.clearRect(0,0,1e4,1e4);

    ctx.translate(numTranslate,50);

    ctx.strokeStyle='#4e0000';
    ctx.lineWidth=10;
    ctx.strokeRect(0,0,300,600);

    ctx.fillStyle='black';
    ctx.fillRect(0,0,300,600);

    ctx.beginPath();
    for(var row=0;row<arr.length;row++){
      for(var j=0;j<arr[0].length;j++){
        if(arr[row][j].v){
          ctx.fillStyle='dimgray';
          ctx.fillRect(perW*j+arrBCC[0],perW*row+arrBCC[0],perW-2,perW-2);

          //格子的顏色
          ctx.fillStyle=arr[row][j].color;
          ctx.fillRect(perW*j+arrBCC[1],perW*row+arrBCC[1],perW-2*arrBCC[1],perW-2*arrBCC[1]);
        }
      }

    }
    ctx.fill();

    ctx.translate(-numTranslate,-50);
    return f;
  }

} //class

var obj=new AItetris();
obj.init();
obj.solve();