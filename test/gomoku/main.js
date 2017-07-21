/*
var eleFxcGomoku=document.getElementById('fxc-gomoku');
eleFxcGomoku.onclick=function(){
  alert('test');
};
*/

//2017-07-21 周五 10:32 上午
var FxcGomoku=function(){
  this.nowData=[]
}

FxcGomoku.prototype={
  init:function(){
    for(var i=0;i<15;i++){
      this.nowData[i]=[];
      for(var j=0;j<15;j++){
        this.nowData[i][j]={
          piece:'black'
        };
      }
    }
  }, //end of init
  render:function(){

  }
};  //end of prototype

var objFxcGomoku=new FxcGomoku();
objFxcGomoku.init();
console.log(objFxcGomoku.nowData);
