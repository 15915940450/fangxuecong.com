/*
Fisher–Yates shuffle
https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle


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


    this.arrGung=[];  //宫数据
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<1e1*this.interval);
  }

  init(){
    //首先生成1，5，9這三個宮，索引是0，4，8
    this.gung159();
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
    console.log(f.currentStep);
    f.draw();
    return f;
  }

  draw(){
    var f=this;
    
    return f;
  }

} //class

var obj=new Souduk();
obj.init();
obj.solve();