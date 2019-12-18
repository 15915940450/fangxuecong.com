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


    //==================參數
    this.gthPopulation=1e3; //種群DNA總數
    this.allGeneration=1e2; //要進化多少代
    this.mutateRate=0.01;   //突變率,一般取0.001－0.1
    this.gthAllPoints=55;  //除起點外的所經過點的個數
    this.pow=15;
    this.population=[]; //種群
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<1e1*this.interval);
  }

  //适应度函数设计直接影响到遗传算法的性能。
  funFitness(DNA){
    var f=this;
    var distance=f.calcDistance(DNA);
    var pow=Math.pow(distance,f.pow)+1;
    return (1/pow);
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
    // console.log(JSON.stringify(this.points));

    //生成種群
    for(i=0;i<this.gthPopulation;i++){
      this.population[i]={
        DNA:DNA.shuffle(),
        fitness:-1
      };
    }

  }

  //計算所有點長度
  calcDistance(DNA){
    var f=this;
    var initialValue=f.calcDistanceAbout2point(f.startPointAlsoEndPoint,f.points[DNA[0].gene]);
    var distance=DNA.reduce(function(acc,cur,idx,src){
      var distance2idx;

      if(idx===f.gthAllPoints-1){
        distance2idx=f.calcDistanceAbout2point(f.points[cur.gene],f.startPointAlsoEndPoint);
      }else{
        distance2idx=f.calcDistanceAbout2point(f.points[cur.gene],f.points[src[idx+1].gene]);
      }

      return (acc+distance2idx);
    },initialValue)>>0;

    //一旦找到比歷史更短的distance，立馬設置為最優解並繪製
    //set best(初次或當前比歷史更短)
    f.setBest(distance,DNA);
    return distance;
  }
  //計算兩點之間的距離
  calcDistanceAbout2point(m,n){
    var powX=Math.pow(m.x-n.x,2);
    var powY=Math.pow(m.y-n.y,2);
    var distanceMN=Math.sqrt(powX+powY);
    return (distanceMN);
  }

  setBest(distance,DNA){
    var f=this;
    if(!f.best.distance || distance<f.best.distance){
      f.best={
        distance:distance,
        DNA:DNA.slice()
      };
      console.log('best distance:'+distance+', at '+f.currentGeneration+'th generation');
      f.eleRecord.innerHTML='最短記錄：'+distance;
      //存貯到本地(3398)
      if(!window.localStorage['bestDNA'+f.gthAllPoints] || (window.localStorage['bestDNA'+f.gthAllPoints] && +window.localStorage['bestDNA'+f.gthAllPoints]>distance)){
        window.localStorage['bestDNA'+f.gthAllPoints]=distance;
      }
      f.drawBest();
    }else if(distance===f.best.distance){
      // console.log('again best:',DNA);
    }
    return f;
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
    f.nextGeneration();
    f.draw(f.best.DNA);
    return f;
  }

  // 产生下一代
  nextGeneration(){
    /*
    在每一代，根据问题域中个体的适应度（fitness）大小选择（selection）个体，并借助于自然遗传学的遗传算子（genetic operators）进行组合交叉（crossover）和变异（mutation），产生出代表新的解集的种群。这个过程将导致种群像自然进化一样的后生代种群比前代更加适应于环境，末代种群中的最优个体经过解码（decoding），可以作为问题近似最优解。
    */
    var f=this;
    //選擇（selection）（組合交叉：crossover）
    f.selection();
    //變異（mutation）
    f.mutation(f.mutateRate);

    //生成第二代之後找出當前代中最優解
    f.findBestInCureentGeneration();
    return f;
  }
  //計算適應度
  calcFitness(){
    var f=this;
    f.population=f.population.map(function(v){
      v.fitness=f.funFitness(v.DNA);
      return (v);
    });
    var sumFitness=f.population.reduce(function(acc,cur){
      return (acc+cur.fitness);
    },0);
    f.population=f.population.map(function(v){
      v.fitness=v.fitness/sumFitness;
      return (v);
    });
    return f;
  }
  //輪盤賭
  roulette(){
    var f=this;
    var index=0;
    var randomNum=Math.random();
    while(randomNum>0){
      randomNum=randomNum-f.population[index].fitness;
      index++;
    }
    return (index-1);
  }
  selection(){
    var f=this;
    f.calcFitness();
    var newPopulation=[];

    for(var i=0;i<f.gthPopulation;i++){
      if(i){
        var DNA1index=f.roulette();
        var DNA2index=f.roulette();
        newPopulation[i]={
          DNA:f.crossover(f.population[DNA1index].DNA,f.population[DNA2index].DNA),
          fitness:-1
        };
      }else{
        //最優解直接進入第二代
        newPopulation[0]={
          DNA:f.best.DNA,
          fitness:-1
        };
      }
    }
    f.population=newPopulation;
  }
  crossover(DNA1,DNA2){
    var f=this;
    var start=_.random(0,f.gthAllPoints-1);
    var end=_.random(start+1,f.gthAllPoints-1);
    var sniDNA1=DNA1.slice(start,end);
    DNA2.forEach(function(v){
      if(!sniDNA1.includes(v)){
        sniDNA1.push(v);
      }
    });
    return sniDNA1;
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