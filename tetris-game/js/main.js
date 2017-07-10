window.onload=function(){
//分辨率過低
  var numClientWidth=document.documentElement.clientWidth || document.body.clientWidth;
  var numClientHeight=document.documentElement.clientHeight || document.body.clientHeight;
  if(numClientWidth<1000 || numClientHeight<550){
    window.alert('分辨率過低!不支持手機端。请在电脑端查看。');
  }

//elements
//ctx  CanvasRenderingContext2D
  var eleCanvas=document.getElementById('tetris_canvas');
  var ctx=eleCanvas.getContext('2d');
  var eleUpcomingCanvas=document.getElementById('upcoming_canvas');
  var ctxUpcoming=eleUpcomingCanvas.getContext('2d');
  var eleScore=document.querySelector('#score p strong');
  var eleLevel=document.getElementById('level');
  var eleUser=document.getElementById('user');
  var eleTop=document.getElementById('top');
  var eleTopTbody=document.querySelector('#top table tbody');
  var elePV=document.getElementById('pv');

  var eleNickName=document.querySelector('.nn_wrap input');
  var eleUserScore=document.querySelector('.user_wrap p strong');

  var eleBlackMask=document.querySelector('.black_mask');
  var eleIntroMask=document.querySelector('.introductions_mask');
  var eleIntroA=document.querySelector('#introductions a');
  var eleIntroBackToGame=document.querySelector('.introductions_mask p a');
  var eleCloseUser=document.querySelector('.close_user');
  var eleNickNameForm=document.querySelector('#user .nn_wrap form');
  var eleNickNameFormSubmitA=document.querySelector('#user .nn_wrap form a');
  var eleNickNameFormNickName=document.querySelector('#user .nn_wrap input');
  var eleNickNameHint=document.querySelector('#user .nn_wrap p');

//======================================tetris
/*
*jsonAll
*/
  var jsonAll={
    "I":[[4,4,4,4],[0,0,15,0],[2,2,2,2],[0,15,0,0]],
    "J":[[2,2,6,0],[14,2,0,0],[12,8,8,0],[0,8,14,0]],
    "L":[[8,8,12,0],[0,2,14,0],[6,2,2,0],[14,8,0,0]],
    "O":[[0,6,6,0],[0,6,6,0],[0,6,6,0],[0,6,6,0]],
    "S":[[0,6,12,0],[4,6,2,0],[0,6,12,0],[4,6,2,0]],
    "T":[[0,14,4,0],[2,6,2,0],[0,4,14,0],[4,6,4,0]],
    "Z":[[0,12,6,0],[2,6,4,0],[0,12,6,0],[2,6,4,0]]
  };
//常量
  var numGrid=30; //每一格的宽度
  var numWidthCanvas=300;
  var numHeightCanvas=540;
  var numAllCols=numWidthCanvas/numGrid;
  var numAllRows=numHeightCanvas/numGrid;
  var objKeys={
    up:38,
    left:37,
    right:39,
    down:40,
    arrStart:[53,101],
    F5:116
  };

/*
*全局變量 Timer,strLetter,TF,strNextLetter,numNextTF,unitX,unitY,arr2Dcontainer,bIng,bOver,numScore,numLevel,jsonTop,numTopNumber,strNickName,bCanSubmit;
*/
var Timer,strLetter,TF,strNextLetter,numNextTF,unitX,unitY,arr2Dcontainer,bIng,bOver,numScore,numLevel,jsonTop,numTopNumber,strNickName,bCanSubmit;


//=======================================function initTetris
/*
*初始化（重置）俄羅斯方塊遊戲
*/
initTetris();
function initTetris(){
  Timer=null;
  strLetter='T';  //strLetter=strNextLetter;
  TF=0; //TF=numNextTF;
  strNextLetter=Object.keys(jsonAll)[Math.floor(Math.random()*Object.keys(jsonAll).length)];
  numNextTF=Math.floor(Math.random()*4);
  unitX=Math.ceil((numAllCols-4)/2);  //中間位置
  unitY=0;
  arr2Dcontainer=[]; //arr2Dcontainer[x] arr2Dcontainer[x][y] 代表x列y行的格子
  for(var i=0;i<numAllCols;i++){
    arr2Dcontainer[i]=[];
    for(var j=0;j<numAllRows;j++){
      arr2Dcontainer[i][j]='';
    }
  }
//遊戲狀態
  bIng=false;
  bOver=false;

//計分
  numScore=0;
  numLevel=2;
// 第几名
  numTopNumber=Number.MAX_VALUE;
// 游戏昵称
  strNickName='';
  bCanSubmit=false;
//排行榜jsonTop
  ajaxGET('score.php',function(data){
    jsonTop=JSON.parse(data);
    setEleTopTbodyInnerHTML();
  });

/*
*初始繪製FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
*/
  clearAll();
  drawCeil(ctx,strLetter,TF,unitX,unitY);
  drawCeil(ctxUpcoming,strNextLetter,numNextTF,0,0);

//DOM
  eleScore.innerHTML=numScore;
  eleLevel.innerHTML=1;
//PV
  ajaxGET('pv.php?pageid=1',function(data){
    var objData=JSON.parse(data);
    console.log(objData);
    elePV.innerHTML=objData[0].pv;
  });
  eleUser.style.display='none';
  eleTop.style.backgroundColor='rgba(109,28,243,.1)';
//开始游戏
  start();
}
//=============================events
  /*
  *事件
  */
  // 键盘
  document.onkeydown=function(ev){
    if(bIng){
      switch (ev.keyCode) {
        case objKeys.up:
          tform();
        break;
        case objKeys.down:
          dropRapidly();
        break;
        case objKeys.left:
          move('left');
        break;
        case objKeys.right:
          move('right');
        break;
        case objKeys.F5:
          // 遊戲當中禁止鍵盤F5刷新頁面
          ev.preventDefault();
        break;

        default:
          // console.log(ev.keyCode);
      }
    }
    //開始，暫停(數字5,小键盘5),注意表單輸入
    if(objKeys.arrStart.includes(ev.keyCode)){
      if(!bIng){
        if(bOver){
          initTetris();
        }else{
          start();
        }
      }else{
        pause();
      }
    }
  };

  // 游戏说明
  eleIntroA.onclick=function(){
    pause();
  };

  eleIntroBackToGame.onclick=function(){
    if(bOver){
      initTetris();
    }else{
      start();
    }
  };
  //关闭用户昵称弹窗
  eleCloseUser.onclick=closeUserModal;

  // 用户昵称提交
  eleNickNameForm.onsubmit=sumbitNickName;
  eleNickNameFormSubmitA.onclick=sumbitNickName;
  eleNickNameFormNickName.onkeydown=function(ev){
    ev.stopPropagation();
  };
  eleNickNameFormNickName.oninput=function(){
    strNickName=eleNickNameFormNickName.value.trim();
    // console.log(strNickName);

    if(!strNickName){
      eleNickNameHint.innerHTML='不能為空';
      bCanSubmit=false;
    }else{
      var res=jsonTop.find(function(ele){
        return ele.NickName===strNickName;
      });
      if(res){  //重複
        eleNickNameHint.innerHTML='已存在，你可以使用 '+strNickName+'_'+suggestANickNamePostfix();
        bCanSubmit=false;
      }else{
        eleNickNameHint.innerHTML='√';
        bCanSubmit=true;
      }
    }
  };
//=============================end of events
//end of tetris
// =============================函数
/*
func:ajaxGET,ajaxPOST
*/
function ajaxGET(url,callback){
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function(){
    if(xmlhttp.readyState===4 && xmlhttp.status===200){
      callback(xmlhttp.responseText);
    }
  };
  xmlhttp.open('GET',url,true);
  xmlhttp.send();
}
function ajaxPOST(url,strPostString,callback){
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function(){
    if(xmlhttp.readyState===4 && xmlhttp.status===200){
      callback(xmlhttp.responseText);
    }
  };
  xmlhttp.open('POST',url,true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(strPostString);
}
/*
func:setEleTopTbodyInnerHTML
*/
function setEleTopTbodyInnerHTML(){
  var arrTr=[];
  /*jsonTop.sort(function(p1,p2){
    return -(p1.score-p2.score);
  });*/
  /*if(jsonTop.length>10){
    jsonTop.length=10;
  }*/
  for(var i=0;i<(jsonTop.length<10?jsonTop.length:10);i++){  //jsonTop.length
    arrTr[i]='<tr><td>'+(i)+'</td><td>'+jsonTop[i].nickname+'</td><td>'+jsonTop[i].score+'</td></tr>';
  }
  eleTopTbody.innerHTML=arrTr.join('');
}
/*
*func:doWithCeilXY
**strLetter:形状所使用的字母
**TF:四种变形的编号
**unitX,unitY:距離畫布原點的X，Y單元距離
**fn(unitX1,unitY1):其中unitX1=unitX+(3-j)，unitY1=unitY+i；
*/
function doWithCeilXY(strLetter,TF,unitX,unitY,fn){
  for(var i=0;i<4;i++){
    var ceil=jsonAll[strLetter][TF].slice();  //复制一个数组
    for(var j=3;j>=0;j--){
      if(ceil[i]>=Math.pow(2,j)){
        fn(unitX+(3-j),unitY+i);
        ceil[i]-=Math.pow(2,j);
      }
    }
  }
}
/*
*func:checkWhetherCanOperateOrNot
*/
function checkWhetherCanOperateOrNot(strLetter,TF,unitX,unitY){
  var bResult=true;
  doWithCeilXY(strLetter,TF,unitX,unitY,function(unitX1,unitY1){
    if((unitX1<0) || (unitX1>=numAllCols) || (unitY1<0) || (unitY1>=numAllRows) || arr2Dcontainer[unitX1][unitY1]){
      bResult=false;
    }
  });
  return bResult;
}
/*
*func:clearAll
*/
function clearAll(){
  ctx.clearRect(0,0,numWidthCanvas+2,numHeightCanvas+2);
}
/*
*func:tform,autoMoveDown
*/
function tform(){
  var TFpi=TF+1;
  if(TFpi>3){
    TFpi=0;
  }
  if(checkWhetherCanOperateOrNot(strLetter,TFpi,unitX,unitY)){
    TF=TFpi;
    //繪製
    clearAll();
    drawContainer();
    drawCeil(ctx,strLetter,TF,unitX,unitY);
  }
}
// ==============================
//最重要的函數autoMoveDown
// ==============================
function autoMoveDown(){
  var unitYpi=unitY+1;
  //檢查是否可以下移
  if(checkWhetherCanOperateOrNot(strLetter,TF,unitX,unitYpi)){
    //Y距離加加
    unitY=unitYpi;
    //繪製
    clearAll();
    drawContainer();
    drawCeil(ctx,strLetter,TF,unitX,unitY);
  }else{
    //無法繼續下移
    //修改二維數組arr2Dcontainer的值
    doWithCeilXY(strLetter,TF,unitX,unitY,function(unitX1,unitY1){
      arr2Dcontainer[unitX1][unitY1]=strLetter;
    });
    //消除行,加分？
    modifyContainerAndScoreAndLevelWhenRowFull();
    // console.log(JSON.stringify(arr2Dcontainer));
    //初始化參數,設置下一個（6個變量）
    unitX=Math.ceil((numAllCols-4)/2);
    unitY=0;
    strLetter=strNextLetter;
    TF=numNextTF;
    strNextLetter=Object.keys(jsonAll)[Math.floor(Math.random()*Object.keys(jsonAll).length)];
    numNextTF=Math.floor(Math.random()*4);

    // console.log(checkWhetherCanOperateOrNot(strLetter,TF,unitX,unitY));
    //檢查下一個方塊是否有空間生成，即遊戲是否結束
    if(!checkWhetherCanOperateOrNot(strLetter,TF,unitX,unitY)){
      gameOver();
    }

    //繪製
    clearAll();
    drawContainer();
    drawCeil(ctx,strLetter,TF,unitX,unitY);
    //預測窗口圖形
    drawCeil(ctxUpcoming,strNextLetter,numNextTF,0,0);
    //加分
    eleScore.innerHTML=numScore;
  }
}
/*
*func:dropRapidly
*/
function dropRapidly(){
  for(var i=0;i<numAllRows;i++){
    var unitYpi=unitY+i;
    if(!checkWhetherCanOperateOrNot(strLetter,TF,unitX,unitYpi)){
      // console.log(i);
      unitY=unitYpi-2;
      //到達倒數第二行，即中間省略了繪製n多行，再自動往下走一行
      autoMoveDown();
      break;
    }
  }
}
/*
*func:move(left or right)
*/
function move(dir){
  var unitXpi;
  if(dir==='left'){
    unitXpi=unitX-1;
  }else if(dir==='right') {
    unitXpi=unitX+1;
  }

  if(checkWhetherCanOperateOrNot(strLetter,TF,unitXpi,unitY)){
    unitX=unitXpi;
    //繪製
    clearAll();
    drawContainer();
    drawCeil(ctx,strLetter,TF,unitX,unitY);
  }
}
/*
*func:modifyContainerAndScoreAndLevelWhenRowFull
*消除行，并加分
*/
function modifyContainerAndScoreAndLevelWhenRowFull(){
  var arrDeleteRow=[];
  var numRowDelete=0;
  for(var i=0;i<numAllRows;i++){
    arrDeleteRow[i]=true;
  }
  for(i=0;i<numAllCols;i++){
    for(var j=0;j<numAllRows;j++){
      if(!arr2Dcontainer[i][j]){
        arrDeleteRow[j]=false;
      }
    }
  }
  // console.log(arrDeleteRow);
  // console.log(arrDeleteRow.length===numAllRows);  //總共的行數
  for(i=0;i<numAllRows;i++){
    if(arrDeleteRow[i]){
      //消除了幾行
      numRowDelete++;
      //修改二維數組
      for(var k=0;k<numAllCols;k++){
        //刪一個，再添一個，arr2Dcontainer[k]數組長度不變
        arr2Dcontainer[k].splice(i,1);
        arr2Dcontainer[k].unshift('');
      }
    }
  }
  // console.log(numRowDelete);  //0，1,2,3,4
  if(numRowDelete){
    numScore+=100*Math.pow(2,numRowDelete-1);
    //加速？
    if(numScore>=10000*(numLevel)){
      eleLevel.innerHTML=numLevel;
      numLevel++;
      if(numLevel>9){
        numLevel=1;
      }
      pause();
      start();
    }
  }
}
/*
*func:drawContainer
*/
function drawContainer(){
  // console.log(JSON.stringify(arr2Dcontainer));
  ctx.strokeStyle='#333';
  ctx.fillStyle='#fee300';
  ctx.translate(0.5, 0.5);  //图变清脆
  for(var i=0;i<numAllCols;i++){
    for(var j=0;j<numAllRows;j++){
      if(arr2Dcontainer[i][j]){  //不是空字符串
        ctx.fillRect(numGrid*i,numGrid*j,numGrid,numGrid);
        ctx.strokeRect(numGrid*i,numGrid*j,numGrid,numGrid);
      }
    }
  }
  ctx.translate(-0.5, -0.5);
}
/*
*func:drawCeil
**ctx:画布
**strLetter:形状所使用的字母
**TF:四种变形的编号
**unitX,unitY:距離畫布原點的X，Y單元距離
*/
function drawCeil(ctx,strLetter,TF,unitX,unitY){
  // ctx.clearRect(0,0,numWidthCanvas+2,numHeightCanvas+2);  //清除整个画布
  if(ctx.canvas.id==='upcoming_canvas'){
    ctx.clearRect(0,0,121,121);
  }
  ctx.strokeStyle='#333';
  ctx.fillStyle='#fee300';
  ctx.translate(0.5, 0.5);  //图变清脆

  doWithCeilXY(strLetter,TF,unitX,unitY,function(unitX1,unitY1){
    if(ctx.canvas.id==='upcoming_canvas'){
      // ctx.clearRect(0,0,121,121);
      ctx.fillRect(30*unitX1,30*unitY1,30,30);
      ctx.strokeRect(30*unitX1,30*unitY1,30,30);
    }else{
      ctx.fillRect(numGrid*unitX1,numGrid*unitY1,numGrid,numGrid);
      ctx.strokeRect(numGrid*unitX1,numGrid*unitY1,numGrid,numGrid);
    }

  });

  ctx.translate(-0.5, -0.5);
}
/*
*func:start,pause,gameOver,(全局變量Timer)
**start:每次向下移動一格,唯一的定時器
*/
function start(){
  window.clearInterval(Timer);
  bIng=true;
  Timer=window.setInterval(function(){
    autoMoveDown();
  },100*(10-numLevel));
  eleBlackMask.style.display='none';
  eleIntroMask.style.display='none';
}
function pause(){
  window.clearInterval(Timer);
  bIng=false;
  eleBlackMask.style.display='block';
  eleIntroMask.style.display='block';
}
function gameOver(){
  window.clearInterval(Timer);
  bIng=false;
  bOver=true;
  eleUser.style.display='block';
  eleTop.style.backgroundColor='rgba(255,255,255,1)';
  eleUserScore.innerHTML=numScore;
  eleNickName.value='';
  eleNickName.focus();
}
/*
*func:closeUserModal,sumbitNickName
*/
function closeUserModal(){
  eleUser.style.display='none';
  eleTop.style.backgroundColor='rgba(109,28,243,.1)';
  eleNickName.value='';
}
function double_09(num){
  return (num<10?('0'+num):num);
}
function suggestANickNamePostfix(){
  var today=new Date();
  var tmp=''+double_09(today.getMonth()+1)+double_09(today.getDate())+''+(Math.random().toString().substring(2,4));
  return tmp;
}
function sumbitNickName(ev){
  ev.preventDefault();
  if(bCanSubmit){
    numTopNumber=0;
    for(var i=0;i<jsonTop.length;i++){
      if(Number(jsonTop[i].score)>=numScore){
        numTopNumber++;
      }
    }
    if(numTopNumber<10){
      window.alert('恭喜'+strNickName+'！！您的排名是：'+numTopNumber+'。欢迎联系管理员领取红包（微信号：hokcung）。');
    }else{
      window.alert('您的排名是：'+numTopNumber);
    }

    eleNickNameHint.innerHTML='';
    ajaxPOST('score.php','nickname='+strNickName+'&score='+numScore,function(data){
      jsonTop=JSON.parse(data);
      setEleTopTbodyInnerHTML();
    });
    closeUserModal();
  }

}


//end of window onload
};

//=======================
//Polyfill:Array.prototype.includes find
//=======================
if(!Array.prototype.includes){Object.defineProperty(Array.prototype,"includes",{value:function(d,e){if(this==null){throw new TypeError('"this" is null or not defined')}var f=Object(this);var a=f.length>>>0;if(a===0){return false}var g=e|0;var c=Math.max(g>=0?g:a-Math.abs(g),0);function b(h,i){return h===i||(typeof h==="number"&&typeof i==="number"&&isNaN(h)&&isNaN(i))}while(c<a){if(b(f[c],d)){return true}c++}return false}})};

if(!Array.prototype.find){Object.defineProperty(Array.prototype,"find",{value:function(b){if(this==null){throw new TypeError('"this" is null or not defined')}var f=Object(this);var a=f.length>>>0;if(typeof b!=="function"){throw new TypeError("predicate must be a function")}var c=arguments[1];var d=0;while(d<a){var e=f[d];if(b.call(c,e,d,f)){return e}d++}return undefined}})};
