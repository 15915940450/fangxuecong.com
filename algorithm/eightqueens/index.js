class Queen{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。
    this.eleCanvas=document.querySelector('#eightqueens');

    this.result=[]; //解决方案
    // this.result=[2, 7, 3, 6, 0, 5, 1, 4];

    this.currentRow=0;
    this.currentCol=Math.random()*8>>0;
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
      if(f.currentRow<8){
        if(!(f.n%f.interval)){
          //若n加了10, currentStep加了1
          f.currentStep=f.n/f.interval;
          f.doINeveryframe();
        }
        window.requestAnimationFrame(rafCallback);
      }else{
        console.log(f.result);
      }
    };
    window.requestAnimationFrame(rafCallback);
    return f;
  } //raf
  //每一幀你要做點什麽？
  doINeveryframe(){
    var f=this;
    // console.log(f.currentStep);
    f.plusRow();
    f.draw();
    return f;
  }
  plusRow(){
    var f=this;
    f.result[f.currentRow]=f.currentCol || 0;
    var isPass=f.check(f.currentRow,f.currentCol);
    // console.log(isPass);
    if(isPass){
      //下一行
      f.currentRow++;
      f.currentCol=0;
    }else{
      //列+1
      f.currentCol++;

      f.back();

    }

    
    return f;
  }
  back(){
    var f=this;

    if(f.currentCol===8){
      //回溯
      f.currentRow--;
      f.currentCol=f.result[f.currentRow]+1;
      f.result.pop();
      // console.log(f.currentRow,f.currentCol);
      f.back();
    }

    return f;
  }

  //檢查this.result[row]下是否可行，沒有被攻擊
  check(row,col){
    var f=this;
    //2.45deg(有一些)
    var check45=f.result.slice(0,-1).some(function(v,i){
      //已存在的點(v,i)與 當前點(col,row)
      var cot=(col-v)/(row-i);
      var arrCot=[0,-1,1];
      return (arrCot.includes(cot));
    });
    if(check45){
      return false;
    }

    return true;
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
        if(f.result[j]===i){
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