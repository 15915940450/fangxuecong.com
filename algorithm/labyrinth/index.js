class Maze{
  //basic要素
  constructor(){
    this.eleMaze=document.querySelector('#maze');
    this.CW=document.documentElement.clientWidth || document.body.clientWidth;
    this.CH=document.documentElement.clientHeight || document.body.clientHeight;
    this.ctx=this.eleMaze.getContext('2d');

    this.w=30;
    this.grid=[]; //網格(包含cell)
    this.rows=(this.CH-100)/this.w>>0;
    this.cols=(this.CW-300)/this.w>>0;

    this.adjacentFrontier=[]; //sure is visited(最重要的數據)
    this.complete=false;

    this.n=0;

    //尋路所需
    this.startIndex=-1;
    this.endIndex=-1;
    this.queue=[];
    this.pathBFS=[];
    this.search0=true;
    this.completeSearch=false;

    this.elePercent=document.querySelectorAll('.percent');
    this.percentGeneration=0;
    this.percentSolve=0;
    this.allCells=0;
  }

  init(){
    var f=this;
    f.eleMaze.width=f.CW;
    f.eleMaze.height=f.CH-70;

    for(var i=0;i<f.rows;i++){
      for(var j=0;j<f.cols;j++){
        var falseFirst=true;
        var falseLast=true;
        if(i+j===0){
          falseFirst=false;
        }
        if(i===f.rows-1 && j===f.cols-1){
          falseLast=false;
        }

        f.grid.push({
          index:i*f.cols+j,
          row:i,
          col:j,
          visited:false,
          walls:[true,falseLast,true,falseFirst] //上，右，下，左
        });
      }
    }

    f.allCells=f.grid.length;
    f.startIndex=0;
    f.endIndex=f.grid[f.grid.length-1].index;
    this.queue.push(f.startIndex);
    this.grid[f.startIndex].marked=true;

    //STEP1
    f.adjacentFrontier.push(f.getRandomOne(f.grid));
    f.adjacentFrontier[0].visited=true;
    return f;
  }
  //從數組中隨機選擇一個元素
  getRandomOne(arr){
    return (arr[Math.random()*arr.length>>0]);
  }
  //檢測是否生成完成
  checkIsComplete(){
    var f=this;
    var isComplete=f.grid.every(function(v){
      return (v.visited);
    });
    return isComplete;
  }
  // 生成未訪問的鄰居數組
  checkNeighbour(objCell){
    var f=this,i,cellNeighbour;
    var arr=[];
    for(i=0;i<4;i++){
      cellNeighbour=f.grid[objCell.index+((i===3 || i===0)?-1:1)*Math.pow(f.cols,(i+1)&1)];
      if(cellNeighbour && !cellNeighbour.visited){
        if((i===3 && !objCell.col) || (i===1 && !cellNeighbour.col)){
          //左或右
          continue;
        }
        arr.push(cellNeighbour);
      }
    }

    //當前，上，右，下，左
    // var topNeighbour=f.grid[objCell.index-f.cols];
    // var rightNeighbour=f.grid[objCell.index+1];
    // var bottomNeighbour=f.grid[objCell.index+f.cols];
    // var leftNeighbour=f.grid[objCell.index-1];

    // if(objCell.row && !topNeighbour.visited){
    //   arr.push(topNeighbour);  //上
    // }
    // if(objCell.col!==f.cols-1 && !rightNeighbour.visited){
    //   arr.push(rightNeighbour);  //右
    // }
    // if(objCell.row!==f.rows-1 && !bottomNeighbour.visited){
    //   arr.push(bottomNeighbour);  //下
    // }
    // if(objCell.col && !leftNeighbour.visited){
    //   arr.push(leftNeighbour);  //左
    // }
    return arr;
  }
  //隨機選擇frontier
  chooseRandomFrontier(objCell){
    var f=this;
    var neighbors=f.checkNeighbour(objCell);
    return (f.getRandomOne(neighbors));
  }
  //移除墻體
  removeWall(currentCell,chosenCell){
    var f=this;
    switch(chosenCell.row-currentCell.row){
    case 1:
      chosenCell.walls[0]=false;
      currentCell.walls[2]=false;
      break;
    case -1:
      chosenCell.walls[2]=false;
      currentCell.walls[0]=false;
      break;
    default:

    }

    switch(chosenCell.col-currentCell.col){
    case 1:
      chosenCell.walls[3]=false;
      currentCell.walls[1]=false;
      break;
    case -1:
      chosenCell.walls[1]=false;
      currentCell.walls[3]=false;
      break;
    default:
    
    }

    return f;
  }
  dealGrid(){
    var f=this;
    // STEP2
    if(!f.checkIsComplete()){
      // STEP3&4
      var randomAdjacent=f.getRandomOne(f.adjacentFrontier);
      var randomFrontier=f.chooseRandomFrontier(randomAdjacent);
      // STEP5
      f.removeWall(randomAdjacent,randomFrontier);
      // STEP6
      randomFrontier.visited=true;
      //can not just push
      f.adjacentFrontier.push(randomFrontier);
      //need to filter
      f.adjacentFrontier=f.adjacentFrontier.filter(function(v){
        return (f.checkNeighbour(v).length);
      });
      
    }else{
      f.complete=true;
    }
    return f;
  }
  addAdj(){
    var f=this;
    f.grid=f.grid.map(function(v){
      v.adj=f.gAdj(v);
      v.marked=false;
      v.edgeTo=-1;
      v.isPath=false;

      return (v);
    });
    return f;
  }
  gAdj(v){
    var objAdj,i,arr=[];
    for(i=0;i<4;i++){
      if(!v.walls[i]){
        //沒有墻，連通
        // switch(i){
        // case 0:
        //   objAdj=this.grid[v.index-this.cols];
        //   break;
        // case 1:
        //   objAdj=this.grid[v.index+1];
        //   break;
        // case 2:
        //   objAdj=this.grid[v.index+this.cols];
        //   break;
        // case 3:
        //   objAdj=this.grid[v.index-1];
        //   break;
        // default:
        
        // }
        // if(objAdj){
        // }
        objAdj=this.grid[v.index+((i===3 || i===0)?-1:1)*Math.pow(this.cols,(i+1)&1)];
        objAdj && arr.push(objAdj.index);
      }
    }
    
    return arr;
  }
  dealGridSearch(){
    var f=this,i;
    var currentIndex=f.queue.shift();
    for(i=0;i<f.grid[currentIndex].adj.length;i++){
      var vertex=f.grid[f.grid[currentIndex].adj[i]];
      if(!vertex.marked){
        // 未訪問過
        f.queue.push(vertex.index);
        vertex.marked=true;
        vertex.edgeTo=currentIndex;
      }
    }
    return f;
  }
  findPath(w){
    var f=this;
    f.pathBFS.unshift(w);
    if(w===f.startIndex){
      return true;
    }
    var b=f.findPath(f.grid[w].edgeTo);
    return b;
  }
  markedThePath(){
    var f=this;
    f.pathBFS.forEach(function(v){
      f.grid[v].isPath=true;
    });
    return f;
  }
  calcPercent(isG){
    var f=this;
    if(isG){
      f.percentGeneration=100*f.grid.filter(function(v){
        return v.visited;
      }).length/f.allCells;
    }else{
      f.percentSolve=100*f.grid.filter(function(v){
        return v.marked;
      }).length/f.allCells;
    }
    return f;
  }
  //動畫
  raf(){
    var f=this;
    var objNum;
    var rafCallback=function(){
      f.n++;
      // console.log(f.n);
      if(!f.complete){
        //生成過程中
        f.dealGrid();
        //percent
        f.calcPercent(true);
        objNum=new Number(f.percentGeneration);
        f.elePercent[0].innerHTML=objNum.toFixed(3)+'%';
        window.requestAnimationFrame(rafCallback);
      }else if(!f.grid[f.endIndex].marked){
        //尋路中
        if(f.search0){
          f.addAdj();
          f.search0=false;
        }
        f.dealGridSearch();
        f.calcPercent(false);
        objNum=new Number(f.percentSolve);
        f.elePercent[1].innerHTML=objNum.toFixed(3)+'%';
        window.requestAnimationFrame(rafCallback);
      }else{
        //程序結束
        console.log('completeSearch');
        f.completeSearch=true;
        f.elePercent[1].innerHTML='100.000%';
        f.findPath(f.endIndex);
        f.markedThePath();
      }
      f.draw();
    };
    window.requestAnimationFrame(rafCallback);
    return f;
  }

  //根據grid繪製canvas
  draw(){
    var f=this;
    var ctx=f.ctx;
    ctx.translate(130.5,30.5);
    ctx.clearRect(0,0,f.CW,f.CH);
    ctx.moveTo(0,0);
    ctx.strokeStyle='snow';
    
    var color='dimgray';
    
    for(var i=0;i<f.grid.length;i++){
      var cell=f.grid[i];
      var col=cell.col;
      var row=f.rows-1-cell.row;
      
      //已訪問(生成)
      if(cell.visited){
        ctx.fillStyle=color;
        ctx.fillRect(col*f.w,row*f.w,f.w+1,f.w+1);
      }
      //已訪問(馴鹿)
      if(cell.marked){
        ctx.fillStyle='midnightblue';
        ctx.fillRect(col*f.w,row*f.w,f.w+1,f.w+1);
        ctx.fillStyle=color;
      }
      //是路徑
      if(cell.isPath){
        ctx.fillStyle='crimson';
        ctx.fillRect(col*f.w+f.w/4,row*f.w+f.w/4,f.w-f.w/2,f.w-f.w/2);
        ctx.fillStyle=color;
      }

      // console.log(cell);
      ctx.beginPath();
      if(cell.walls[2]){
        //上邊
        ctx.moveTo(col*f.w,row*f.w);
        ctx.lineTo((col+1)*f.w,row*f.w);
      }
      if(cell.walls[1]){
        //右邊
        ctx.moveTo((col+1)*f.w,row*f.w);
        ctx.lineTo((col+1)*f.w,(row+1)*f.w);
      }
      if(cell.walls[0]){
        //下邊
        ctx.moveTo((col+1)*f.w,(row+1)*f.w);
        ctx.lineTo(col*f.w,(row+1)*f.w);
      }
      if(cell.walls[3]){
        //左邊
        ctx.moveTo(col*f.w,(row+1)*f.w);
        ctx.lineTo(col*f.w,row*f.w);
      }
      ctx.stroke();

      // 尋路時繪製網格編號
      if(!f.completeSearch && f.complete){
        ctx.font='9px serif';
        ctx.fillStyle='silver';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(cell.index,col*f.w+f.w/2,row*f.w+f.w/2);
        ctx.fillStyle=color;
      }
    } //for
    // ctx.closePath();
    ctx.translate(-130.5,-30.5);
    return f;
  }



} //class

var obj=new Maze();
obj.init().raf();
