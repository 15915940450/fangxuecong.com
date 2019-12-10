class Journey{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.eleCanvas=document.querySelector('#journey');
    this.arrStep=[{"x":5,"y":7,"step":0},{"step":1,"x":7,"y":6},{"step":2,"x":6,"y":4},{"step":3,"x":7,"y":2},{"step":4,"x":6,"y":0},{"step":5,"x":4,"y":1},{"step":6,"x":2,"y":0},{"step":7,"x":0,"y":1},{"step":8,"x":1,"y":3},{"step":9,"x":0,"y":5},{"step":10,"x":1,"y":7},{"step":11,"x":3,"y":6},{"step":12,"x":1,"y":5},{"step":13,"x":0,"y":7},{"step":14,"x":2,"y":6},{"step":15,"x":4,"y":7},{"step":16,"x":6,"y":6},{"step":17,"x":7,"y":4},{"step":18,"x":6,"y":2},{"step":19,"x":7,"y":0},{"step":20,"x":5,"y":1},{"step":21,"x":3,"y":0},{"step":22,"x":1,"y":1},{"step":23,"x":0,"y":3},{"step":24,"x":2,"y":2},{"step":25,"x":1,"y":0},{"step":26,"x":0,"y":2},{"step":27,"x":1,"y":4},{"step":28,"x":0,"y":6},{"step":29,"x":2,"y":7},{"step":30,"x":4,"y":6},{"step":31,"x":6,"y":7},{"step":32,"x":7,"y":5},{"step":33,"x":6,"y":3},{"step":34,"x":7,"y":1},{"step":35,"x":5,"y":0},{"step":36,"x":3,"y":1}];
    //下一步有效单元格（属性numCeotLou:此单元格的出路数）
    this.nextValidCell=[];
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
    // console.log(f.currentStep);
    f.draw();
    return f;
  }
  //绘制canvas (留意绘制的时机)
  //绘制canvas (留意绘制的时机)
  draw(){
    var f=this;

    var arrCell=f.step2cell();

    var ctx=f.eleCanvas.getContext('2d');
    ctx.clearRect(0,0,400,400);
    var w=50;
    ctx.translate(0.5,0.5);
    /*ctx.strokeStyle='silver';
    ctx.lineWidth=10;*/
    
    var x=0,i,j;
    for(i=0;i<8;i++){
      for(j=0;j<8;j++){
        //x&1^x>>>3&1  偶數行奇數列或奇數行偶數列
        if(x&1^x>>>3&1){
          ctx.fillStyle='white';
          if(arrCell[x].isPass){
            ctx.fillStyle='rgba(255,100,100,.8)';
          }
        }else{
          ctx.fillStyle='black';
          if(arrCell[x].isPass){
            ctx.fillStyle='rgba(255,10,10,.8)';
          }
        }

        ctx.fillRect(j*w,i*w,w,w);

        if(arrCell[x].step===f.arrStep[f.arrStep.length-1].step){
          ctx.fillStyle='yellow';
          ctx.fillRect(j*w+10,i*w+10,w-20,w-20);
        }

        //文字层在上面(同时画文字)
        ctx.fillStyle='black';
        if(arrCell[x].isPass){
          ctx.fillText(arrCell[x].step,(j+1/3)*w,(i+1/2)*w);
        }

        x++;
      }
    }

    
    /*x=0;
    for(i=0;i<8;i++){
      for(j=0;j<8;j++){
        
        x++;
      }
    }*/
    ctx.translate(-0.5,-0.5);
    return f;
  }

  //將步數數組（解）轉化為按單元格排序的數組
  step2cell(){
    var f=this;
    var arrCell=[];
    if(f.arrStep.length===Math.pow(8,2)){
      arrCell=f.arrStep.map(function(v){
        return (Object.assign({
          cellIndex:v.x+v.y*8
        },v));
      }).sort(function(a,b){
        return (a.cellIndex-b.cellIndex);
      });
    }else{
      //測試，如果沒走完64步
      for(var i=0;i<Math.pow(8,2);i++){
        var ele=f.arrStep.find(function(v){
          return (v.x+v.y*8===i);
        });
        if(ele){
          arrCell[i]=Object.assign({
            cellIndex:i,
            isPass:true
          },ele);
        }else{
          arrCell[i]={
            cellIndex:i,
            step:'',
            isPass:false
          };
        }
      }
    }
    return (arrCell);
  }

} //class

var obj=new Journey();
obj.init();
obj.solve();