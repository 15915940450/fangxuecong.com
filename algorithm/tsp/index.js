class TSP{
  constructor(){
    this.n=-1;  //raf多少次
    this.interval=1; //每幀的間隔
    this.currentStep=-1; //當前。。。

    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH4=document.documentElement.clientHeight || document.body.clientHeight;

    this.eleCanvas=document.querySelector('#tsp');

    this.startPointAlsoEndPoint=null; //起點

    this.points=[]; //所經過的點
    //目標：最好的路綫
    this.best={
      distance:0,
      DNA:[]
    };
    this.bestDNA=[];


    //==================參數
    this.gthPopulation=1e3; //種群DNA總數
    this.allGeneration=1e4; //要進化多少代
    this.mutateRate=0.01;   //突變率,一般取0.001－0.1
    this.gthAllPoints=55;  //除起點外的所經過點的個數
    this.pow=15;
    this.population=[]; //種群
    this.bestInCurrentGeneration=[];
  }

  //判断动画是否 持续 进行
  ciZuk(){
    return (this.n<this.allGeneration*this.interval);
  }

  //适应度函数设计直接影响到遗传算法的性能。
  funFitness(DNA){
    var f=this;
    var distance=f.calcDistance(DNA);
    var pow=Math.pow(distance,f.pow)+1;
    return (1/pow);
  }

  init(){
    var f=this;
    f.eleCanvas.width=f.CW;
    f.eleCanvas.height=f.CH4-70;

    //隨機生成點
    var i,DNA=[];
    f.startPointAlsoEndPoint=f.generateRandomPoint(-1);
    f.points.length=0;
    for(i=0;i<f.gthAllPoints;i++){
      f.points.push(f.generateRandomPoint(i));
      DNA[i]={
        gene:i
      };
    }
    // console.log(JSON.stringify(f.points));

    //生成種群
    for(i=0;i<f.gthPopulation;i++){
      f.population[i]={
        DNA:_.shuffle(DNA),
        fitness:-1
      };
    }
    return f;
  } //init


  //計算所有點長度
  calcDistance(DNA){
    var f=this;
    // console.log(DNA);
    var initialValue=f.calcDistanceAbout2point(f.startPointAlsoEndPoint,f.points[DNA[0].gene]);
    var distance=DNA.reduce(function(acc,cur,idx,src){
      var distance2idx;

      if(idx===f.gthAllPoints-1){
        distance2idx=f.calcDistanceAbout2point(f.points[cur.gene],f.startPointAlsoEndPoint);
      }else{
        // console.log(src,idx);
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
      f.bestDNA=_.cloneDeep(DNA);
      console.log(`best distance:${f.currentStep}代-${distance}`,f.best);
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
    // console.log(f.currentStep);
    f.nextGeneration();
    f.draw();
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
  mutation(mutateRate){
    var f=this;
    mutateRate=mutateRate || f.mutateRate;
    var populationMutation=f.population.map(function(objDNA){
      var DNA=objDNA.DNA;

      var i1=_.random(0,f.gthAllPoints-2);
      var i2=_.random(i1+1,f.gthAllPoints-1);
      

      if(Math.random()<mutateRate){
        var randomABC=_.random(0,2);
        switch(randomABC){
        case 0:
          DNA=f.mutateA(DNA,i1,i2);
          break;
        case 1:
          if(i2-i1<3){
            //交換相鄰兩點
            DNA=f.mutateA(DNA,i1,i1+1);
          }else{
            DNA=f.mutateB(DNA,i1,i2);
          }
          break;
        case 2:
          var i3=_.random(i2,f.gthAllPoints-1);
          if(i3===i2){
            DNA=f.mutateA(DNA,i1,i1+1);
          }else{
            DNA=f.mutateC(DNA,i1,i2,i3);
          }
          break;
        default:
          console.log('it is impossible.');
        }
      }
      return ({
        DNA:DNA,
        fitness:-1
      });
    });
    f.population=populationMutation;
    return f;
  }
  //交换
  mutateA(DNA,i1,i2){
    this.swap(DNA,i1,i2);
    return DNA;
  }
  //倒序
  mutateB(DNA,i1,i2){
    var DNA1=DNA.slice(0,i1);
    var DNA2=DNA.slice(i1,i2);
    DNA2.reverse();
    var DNA3=DNA.slice(i2);
    DNA=DNA1.concat(DNA2,DNA3);
    return DNA;
  }
  //移动
  mutateC(DNA,i1,i2,i3){
    var DNA1=DNA.slice(0,i1);
    var DNA2=DNA.slice(i1,i2);
    var DNA3=DNA.slice(i2,i3);
    var DNA4=DNA.slice(i3);
    // console.log(i1,i2,i3);
    DNA=DNA1.concat(DNA3,DNA2,DNA4);
    return DNA;
  }
  //交換數組兩個元素
  swap(arr,i,j){
    var f=this;
    var tmp=arr[i];
    arr[i]=arr[j];
    arr[j]=tmp;
    return f;
  }
  myrandom(lower,upper){
    var result=(Math.random()*(upper-lower+1)>>0)+lower;
    
    return result;
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
  //當前代中找到最優的解
  findBestInCureentGeneration(){
    var f=this;
    var bestInCurrentGeneration=f.population[0].DNA;
    var bestDistance=f.calcDistance(bestInCurrentGeneration);
    // return f;
    for(var i=1;i<f.gthPopulation;i++){
      var distance=f.calcDistance(f.population[i].DNA);
      if(distance<bestDistance){
        bestInCurrentGeneration=f.population[i].DNA;
        bestDistance=f.calcDistance(bestInCurrentGeneration);
      }
    }
    // console.log(bestInCurrentGeneration);
    f.bestInCurrentGeneration=bestInCurrentGeneration;
    //找到之後在第一個canvas中繪製
    // f.drawWithCTX(false,bestInCurrentGeneration);
    return f;
  }

  draw(){
    var f=this;
    
    var ctx=f.eleCanvas.getContext('2d');
    
    ctx.clearRect(0,0,f.eleCanvas.width,f.eleCanvas.height);
    ctx.translate(0.5,0.5);

    f.drawDNA(ctx);
    f.drawDNA(ctx,true);
    
    ctx.translate(-0.5,-0.5);
    return f;
  }
  // isBelow画下方，全局最优解
  drawDNA(ctx,isBelow){
    var f=this;
    var DNA=f.bestInCurrentGeneration;
    if(isBelow){
      DNA=f.bestDNA;
      ctx.translate(0,f.eleCanvas.height/2);
      var text=`当前第 ${f.currentStep+1} 代， 总共 ${f.allGeneration} 代， 种群个数 ${f.gthPopulation}， 突变率：${f.mutateRate}， 城市个数：${f.gthAllPoints}`;
      ctx.font = "13px serif";
      ctx.textAlign='right';
      ctx.fillText(text,f.CW-50,0);
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
    if(isBelow){
      ctx.strokeStyle='floralwhite';
    }
    ctx.stroke();


    //畫點
    ctx.beginPath();
    ctx.fillStyle='crimson';
    ctx.arc(f.startPointAlsoEndPoint.x,f.startPointAlsoEndPoint.y,10,0,Math.PI*2,true);
    ctx.fill();

    for(var i=0;i<f.gthAllPoints;i++){
      ctx.beginPath();
      ctx.fillStyle='#0077ee';
      if(isBelow){
        ctx.fillStyle='floralwhite';
      }
      ctx.arc(f.points[DNA[i].gene].x,f.points[DNA[i].gene].y,4,0,Math.PI*2,true);
      ctx.fill();
      ctx.fillText(i,f.points[i].x+10,f.points[i].y+15);
    }
    

    if(isBelow){
      ctx.translate(0,-f.eleCanvas.height/2);
    }


    



    return f;
  }

} //class

var obj=new TSP();
obj.init();
obj.solve();




/*
顶十字(6)：
FRUR'U'F'

顶面(8)：（index_6）
RUR'URUUR'

顶角(12)：（右眼）X'
RRDD R'U'R DDR'UR'

顶棱(12)：（全色置后面）
RU'RURURU'R'U'RR
*/