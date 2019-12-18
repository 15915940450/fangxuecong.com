
class TSP{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=10; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH4=document.documentElement.clientHeight || document.body.clientHeight;

    this.eleCanvas=document.querySelector('#tsp');

    this.startPointAlsoEndPoint=null; //起點

    this.points=[]; //所經過的點
    //目標：最好的路綫
    this.best={"distance":4232,"DNA":[{"gene":26},{"gene":4},{"gene":41},{"gene":47},{"gene":7},{"gene":12},{"gene":45},{"gene":24},{"gene":15},{"gene":31},{"gene":39},{"gene":28},{"gene":2},{"gene":8},{"gene":32},{"gene":11},{"gene":34},{"gene":29},{"gene":10},{"gene":54},{"gene":14},{"gene":5},{"gene":16},{"gene":27},{"gene":46},{"gene":33},{"gene":21},{"gene":44},{"gene":53},{"gene":30},{"gene":1},{"gene":52},{"gene":13},{"gene":43},{"gene":6},{"gene":25},{"gene":17},{"gene":35},{"gene":51},{"gene":19},{"gene":20},{"gene":37},{"gene":3},{"gene":9},{"gene":49},{"gene":48},{"gene":23},{"gene":42},{"gene":36},{"gene":50},{"gene":38},{"gene":18},{"gene":22},{"gene":0},{"gene":40}]};
    /*this.best={
      distance:0,
      DNA:[]
    };*/


    this.gthAllPoints=55;  //除起點外的所經過點的個數
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<1e1*this.interval);
  }

  init(){
    this.eleCanvas.width=this.CW;
    this.eleCanvas.height=this.CH4-70;

    //隨機生成點
    var i,DNA=[];
    this.startPointAlsoEndPoint=this.generateRandomPoint(-1);
    this.points.length=0;
    for(i=0;i<this.gthAllPoints;i++){
      this.points.push(this.generateRandomPoint(i));
      DNA[i]={
        gene:i
      };
    }
    console.log(JSON.stringify(this.points));
  }

  //生成點
  generateRandomPoint(id){
    var f=this;
    return ({
      id:id,
      x:(Math.random()*(f.CW-50)>>0)+25,
      y:((Math.random()*(f.CH4-150)>>0)+20)/2  //一半
    });
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
    f.draw(f.best.DNA);
    return f;
  }

  draw(DNA){
    var f=this;
    
    var ctx=f.eleCanvas.getContext('2d');
    DNA=DNA || f.population[0].DNA;
    ctx.clearRect(0,0,f.eleCanvas.width,f.eleCanvas.height);
    ctx.translate(0.5,0.5);

    //畫點
    ctx.beginPath();
    ctx.fillStyle='crimson';
    ctx.arc(f.startPointAlsoEndPoint.x,f.startPointAlsoEndPoint.y,10,0,Math.PI*2,true);
    ctx.fill();

    for(var i=0;i<f.gthAllPoints;i++){
      ctx.beginPath();
      ctx.fillStyle='#0077ee';
      ctx.arc(f.points[DNA[i].gene].x,f.points[DNA[i].gene].y,4,0,Math.PI*2,true);
      ctx.fill();
    }

    //畫曲綫
    //start-0
    ctx.beginPath();
    ctx.moveTo(f.startPointAlsoEndPoint.x,f.startPointAlsoEndPoint.y);
    ctx.lineTo(f.points[DNA[0].gene].x,f.points[DNA[0].gene].y);
    ctx.strokeStyle='crimson';
    ctx.stroke();
    //0-1-2-last-start
    ctx.beginPath();
    ctx.moveTo(f.points[DNA[0].gene].x,f.points[DNA[0].gene].y);
    for(i=1;i<f.gthAllPoints;i++){
      ctx.lineTo(f.points[DNA[i].gene].x,f.points[DNA[i].gene].y);
    }
    ctx.lineTo(f.startPointAlsoEndPoint.x,f.startPointAlsoEndPoint.y);
    ctx.strokeStyle='#0077ee';
    ctx.stroke();
    
    ctx.translate(-0.5,-0.5);
    return f;
  }

} //class

var obj=new TSP();
obj.init();
obj.solve();