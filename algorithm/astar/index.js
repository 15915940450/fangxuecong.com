class Astar{
  constructor(){
    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH=(document.documentElement.clientHeight || document.body.clientHeight)-50;
    this.eleCanvas=document.querySelector('#a_star');
    this.ctx=this.eleCanvas.getContext('2d');
    this.colorDefault='dimgray';
    this.colorSPT='#0077ee';
    this.colorOpenSet='lawngreen';
    this.colorClosedSet='floralwhite';
    this.d=12;  //网格单位长度

    this.n=-1;  //raf多少次
    this.interval=1; //每帧的间隔
    this.currentStep=-1; //当前。。。
    // this.rows=3;
    // this.cols=3;
    this.rows=(this.CH-50)/this.d>>0;
    this.cols=(this.CW-50)/this.d>>0;
    this.rate=.2;
    this.SPTw=3;

    this.adj=[];  //邻接表

    this.result=[];
    this.SPT=[];  //最短路径树
    this.s=0; //开始位置
    this.closedSet=[];
    this.openSet=[];
    this.gScore=[];
    this.fScore=[];
    this.V=this.rows*this.cols; //顶点数
    this.E=0; //边数

    this.complete=false;
  }
  init(){
    var i;
    this.eleCanvas.width=this.CW;
    this.eleCanvas.height=this.CH;

    this.initAdj();
    this.openSet.push(this.s);

    //无向图
    this.doubleNeighbor();

    for(i=0;i<this.V;i++){
      this.gScore[i]=Infinity;
      this.fScore[i]=Infinity;
    }
    this.gScore[this.s]=0;
    this.fScore[this.s]=this.funHeuristic(this.s);

    //计算边数
    for(i=0;i<this.V;i++){
      this.E+=this.adj[i].neighbor.length;
    }
    this.E=this.E/2;
  }
  doubleNeighbor(){
    var f=this;
    f.adj.forEach(function(v,index){
      f.findAllNeighbor(v.row,v.col).forEach(function(neighborIndex){
        var neightborHasV=f.adj[neighborIndex].neighbor.includes(index);
        var vNOThasNeighbor=!v.neighbor.includes(neighborIndex);
        if(neightborHasV && vNOThasNeighbor){
          v.neighbor.push(neighborIndex);
        }
      });
    });
    return f;
  }
  //启发函数
  funHeuristic(index){
    return (3*this.calcDist(index,this.V-1)>>0);
  }
  //计算两点之间的距离
  calcDist(v,w){
    var f=this;
    var x0=f.index2center(v).x;
    var y0=f.index2center(v).y;
    var x1=f.index2center(w).x;
    var y1=f.index2center(w).y;
    var d=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    return (d);
  }

  //初始化邻接表
  initAdj(){
    var f=this;
    for(var i=0;i<f.rows;i++){
      for(var j=0;j<f.cols;j++){
        var index=f.ij2index(i,j);
        var objV={
          index:index,
          row:i,
          col:j,
          neighbor:f.addNeighbor(i,j)
        };
        f.adj[index]=objV;
      }
    }
    return f;
  }
  //已知i，j求index（不存在则为-1）
  ij2index(i,j){
    var f=this;
    if(i<0 || j<0 || i>f.rows-1 || j>f.cols-1){
      return (-1);
    }
    return (i*f.cols+j);
  }
  //已知index求i，j,不存在则为null
  index2ij(index){
    var f=this;
    if(index<0 || index>f.V-1){
      return null;
    }
    return ({
      i:index/f.cols>>0,
      j:index%f.cols
    });
  }
  //已知index求该顶点的中心点坐标
  index2center(index){
    var f=this;
    //从左下到右上
    var realRow=f.rows-f.adj[index].row-1;
    return ({
      x:f.d*f.adj[index].col+f.d/2,
      y:f.d*realRow+f.d/2
    });
  }
  //查找该顶点的所有邻居
  findAllNeighbor(i,j){
    //八个方向
    var arrDerection=[];

    //上
    arrDerection[0]=this.ij2index(i-1,j); //-1,0,1,2...
    //上-右
    arrDerection[1]=this.ij2index(i-1,j+1);
    //右
    arrDerection[2]=this.ij2index(i,j+1);
    //下-右
    arrDerection[3]=this.ij2index(i+1,j+1);
    //下
    arrDerection[4]=this.ij2index(i+1,j);
    //下-左
    arrDerection[5]=this.ij2index(i+1,j-1);
    //左
    arrDerection[6]=this.ij2index(i,j-1);
    //上-左
    arrDerection[7]=this.ij2index(i-1,j-1);

    //过滤掉-1
    return (arrDerection.filter(function(v){
      return (v+1);
    }));
  }
  //随机添加邻居（有向）
  addNeighbor(i,j){
    var f=this;
    var arrDerection=f.findAllNeighbor(i,j).filter(function(){
      return (Math.random()<f.rate);
    });

    return arrDerection;
  }


  // 算法
  solve(){
    var f=this;
    f.raf();
    return f;
  }
  //执行动画
  raf(){
    var f=this;
    var rafCallback=function(){
      f.n++;
      //动画终止条件
      if(!f.complete){
        if(!(f.n%f.interval)){
          //若n加了10, currentStep加了1
          f.currentStep=f.n/f.interval;
          f.doINeveryframe();
        }
        window.requestAnimationFrame(rafCallback);
      }else{
        f.success();
      }

      //每一帧都要绘图
      f.draw();
    };
    window.requestAnimationFrame(rafCallback);
    return f;
  } //raf
  //成功时寻找路径
  success(){
    var f=this;
    f.findPath();
    console.log('complete:::'+JSON.stringify(f.result));
    return f;
  }
  //寻找路径
  findPath(end){
    var f=this;
    end=end || f.V-1;
    f.result=[];
    for(var i=f.SPT.length-1;i>=0;i--){
      var arrVertex=f.SPT[i].split('-');
      if(+arrVertex[1]===end){
        f.result.unshift(end);
        end=+arrVertex[0];
      }
    }
    f.result.unshift(f.s);
    return f;
  }
  //每一帧你要做点什么？
  doINeveryframe(){
    var f=this;
    //处理openSet
    f.watchOpenSet();
    return f;
  }
  //openSet不为空
  watchOpenSet(){
    if(!this.openSet.length){
      console.error('fail');
      this.complete=true;
      return false;
    }
    var f=this,tentativeGScore;

    //最低fScore分数的顶点
    f.openSet.sort(function(a,b){
      return (f.fScore[a]-f.fScore[b]); //a-b升序
    });

    var current=f.openSet.shift();

    f.closedSet.push(current);

    for(var i=0;i<f.adj[current].neighbor.length;i++){
      var neighbor=f.adj[current].neighbor[i];

      if(f.closedSet.includes(neighbor)){
        continue;
      }

      tentativeGScore=f.gScore[current]+f.calcDist(current,neighbor);

      if(!f.openSet.includes(neighbor)){
        f.openSet.push(neighbor);
      }else if(tentativeGScore>=f.gScore[neighbor]){
        continue;
      }

      f.SPT.push(current+'-'+neighbor);
      f.gScore[neighbor]=tentativeGScore;
      f.fScore[neighbor]=f.gScore[neighbor]+f.funHeuristic(neighbor);


      f.findPath(neighbor);

      //已经到达终点，结束算法
      if(neighbor===f.V-1){
        this.complete=true;
        return true;
      }

    }
    /*f.adj[current].neighbor.forEach(function(v){
      if(!f.closedSet.includes(v)){
        tentativeGScore=f.gScore[current]+f.calcDist(current,v);

        if(!f.openSet.includes(v)){
          f.openSet.push(v);
          if(tentativeGScore<f.gScore[v]){
            f.SPT[v]=current;
            f.gScore[v]=tentativeGScore;
            f.fScore[v]=f.gScore[v]+f.funHeuristic(v);
          }
        }


      }


    });*/


    return f;
  }

  //绘制
  draw(){
    var f=this,i;
    f.ctx.clearRect(0,0,f.CW,f.CH);
    f.ctx.translate(25.5,25.5);
    f.ctx.fillStyle=f.colorDefault;
    f.ctx.strokeStyle=f.colorDefault;
    f.ctx.lineWidth=1;
    f.ctx.font='13px "Microsoft JhengHei"';

    for(i=0;i<f.adj.length;i++){
      f.drawEdge(i);
    }
    for(i=0;i<f.adj.length;i++){
      f.drawVertex(i);
    }

    //绘制文字(顶点数以及边数)
    f.ctx.fillStyle=f.colorClosedSet;
    var strVE=`顶点数V: ${f.V}, 边数E: ${f.E}`;
    if(f.complete){
      strVE+='===> complete';
    }
    f.ctx.fillText(strVE,f.CW/2-2e2,-8);
    f.ctx.fill();
    f.ctx.fillStyle=f.colorDefault;

    f.ctx.translate(-25.5,-25.5);
    return f;
  }
  drawVertex(index){
    var f=this;
    f.ctx.beginPath();

    
    if(f.openSet.includes(index)){
      f.ctx.fillStyle=f.colorOpenSet;
      f.ctx.strokeStyle=f.colorOpenSet;
    }
    if(f.closedSet.includes(index)){
      f.ctx.fillStyle=f.colorClosedSet;
      f.ctx.strokeStyle=f.colorClosedSet;
    }
    if(f.complete && f.result.includes(index)){
      f.ctx.fillStyle=f.colorSPT;
      f.ctx.strokeStyle=f.colorSPT;
    }
    


    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
    f.ctx.arc(f.index2center(index).x,f.index2center(index).y,f.SPTw-1,0,2*Math.PI,true);
    f.ctx.fill();

    f.ctx.closePath();
    f.ctx.stroke();

    if(f.openSet.includes(index) || f.closedSet.includes(index)){
      f.ctx.fillStyle=f.colorDefault;
      f.ctx.strokeStyle=f.colorDefault;
    }
  }
  drawEdge(index){
    var f=this;

    //画边
    f.adj[index].neighbor.forEach(function(v){
      //避免重复绘制
      if(index<v){
        f.ctx.beginPath();
        if(f.result.includes(index) && f.result.includes(v)){
          f.ctx.lineWidth=f.SPTw;
          f.ctx.fillStyle=f.colorSPT;
          f.ctx.strokeStyle=f.colorSPT;
        }
        f.ctx.moveTo(f.index2center(index).x,f.index2center(index).y);
        f.ctx.lineTo(f.index2center(v).x,f.index2center(v).y);
        f.ctx.closePath();
        f.ctx.stroke();
        if(f.result.includes(index) && f.result.includes(v)){
          f.ctx.fillStyle=f.colorDefault;
          f.ctx.strokeStyle=f.colorDefault;
          f.ctx.lineWidth=1;
        }
      }
    });
    return f;
  }

} //class

var obj =new Astar();
obj.init();
obj.solve();
