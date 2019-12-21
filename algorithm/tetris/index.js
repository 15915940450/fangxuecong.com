class AItetris{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH4=document.documentElement.clientHeight || document.body.clientHeight;

    this.eleCanvas=document.querySelector('#tetris');
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<1e1*this.interval);
  }

  init(){
    var f=this;
    f.eleCanvas.width=f.CW;
    f.eleCanvas.height=f.CH4-70;

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
    ctx.translate(0.5,0.5);

    
    ctx.translate(-0.5,-0.5);
    return f;
  }

} //class

var obj=new AItetris();
obj.init();
obj.solve();