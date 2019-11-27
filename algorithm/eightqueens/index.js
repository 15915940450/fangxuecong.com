class Queen{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。
    this.eleCanvas=document.querySelector('#eightqueens');

    this.result=[]; //解决方案
    // this.result=[3, 6, 4, 1, 5, 0, 2, 7];
    this.arrColIndex=[0,1,2,3,4,5,6,7];
  }

  init(){
    
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
      //動畫終止條件
      if(f.n<1e1*f.interval){
        if(!(f.n%f.interval)){
          //若n加了10, currentStep加了1
          f.currentStep=f.n/f.interval;
          f.doINeveryframe();
        }
        window.requestAnimationFrame(rafCallback);
      }
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
  //绘制canvas
  draw(){
    var f=this;
    var ctx=f.eleCanvas.getContext('2d');
    var w=50;
    ctx.translate(0.5,0.5);
    ctx.strokeStyle='crimson';
    ctx.lineWidth=15;
    var x=0;
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        ctx.fillStyle='black';
        //x&1^x>>>3&1  偶數行奇數列或奇數行偶數列
        if(x&1^x>>>3&1){
          ctx.fillStyle='white';
        }
        ctx.fillRect(i*w,j*w,w,w);
        if(f.result[i]===j){
          ctx.strokeRect(i*w+10,j*w+10,w-20,w-20);
        }

        x++;
      }
    }
    ctx.translate(-0.5,-0.5);
    return f;
  }

} //class

var obj=new Queen();
obj.init();
obj.solve();