// console.log('Lévy flight');
class Levy{
  constructor(){
    this.eleCanvas=document.querySelector('#levy');
    this.ctx=this.eleCanvas.getContext('2d');
    this.CW=$('.page.max_height').width();
    this.CH=$('.page.max_height').height();

    this.currentPoint=null; //当前点
    this.startPoint=null; //开始点(原点)
    this.timerN=0;
  }

  //生成A(包含)到B(包含)的整数
  random(inclusiveA,inclusiveB){
    var x=Math.random()*(inclusiveB+1-inclusiveA)>>0;
    return (x+inclusiveA);
  }
  //初始化
  init(){
    var f=this;
    f.eleCanvas.width=f.CW;
    f.eleCanvas.height=f.CH;
    return f;
  }

  draw(){
    var f=this;
    var ctx=f.ctx;
    ctx.translate(0.5,0.5);

    f.currentPoint={
      x:f.CW/2,
      y:f.CH/2
    };

    ctx.strokeStyle='blanchedalmond';
    ctx.beginPath();
    ctx.moveTo(f.currentPoint.x,f.currentPoint.y);
    f.signStart(ctx,f.currentPoint);
    f.timer();

    return f;
  }
  //标志开始点
  signStart(ctx,currentPoint){
    var f=this;
    f.startPoint={
      x:currentPoint.x,
      y:currentPoint.y
    };
    ctx.arc(currentPoint.x,currentPoint.y,30,0,Math.PI*2,true);
    ctx.fillStyle='crimson';
    ctx.fill();

    return f;
  }
  timer(){
    var f=this;
    
    var ctx=f.ctx;
    var rafCallback=function(){
      f.timerN++;
      var nextPoint=f.generateNext();


      ctx.lineTo(nextPoint.x,nextPoint.y);
      ctx.stroke();

      //如果回到原点(轨迹经过原点)
      var isPass=f.back2o(f.startPoint,f.currentPoint,nextPoint);
      if(isPass){
        var time=new Date();
        alert('已经回到原点('+time+')');
        return true;
      }

      //赋值于当前点
      f.currentPoint={
        x:nextPoint.x,
        y:nextPoint.y
      };

      window.requestAnimationFrame(rafCallback);
    };
    window.requestAnimationFrame(rafCallback);
    return f;
  }
  //判断点p(x,y)在直线p0(x0,y0)p1(x1,y1)上
  back2o(p,p0,p1){
    var f=this;
    var x=p.x;
    var x0=p0.x;
    var x1=p1.x;
    var y=p.y;
    var y0=p0.y;
    var y1=p1.y;
    
    
    //1.x1=x0
    // 要y==y0
    if(x1===x0 && y!==y0){
      return false;
    }

    //2.x1!=x0
    // 要y==(y1-y0)*(x-x0)/(x1-x0)+y0;
    var yTemp=((y1-y0)*(x-x0)/(x1-x0)+y0);
    if(x1!==x0 && Math.abs(y-yTemp)>1){
      return false;
    }
    // console.log(x0,x1,y0,y1,x,y,yTemp);

    //3.最终判断是否在延伸线上
    if((x<x0-1 && x<x1-1) || (x>x0+1 && x>x1+1)){
      return false;
    }

    

    




    if(f.timerN<=1e2){
      return false;
    }
    console.log(f.timerN,p,p0,p1);
    return true;
  }
  generateNext(){
    var f=this;
    var randomX=f.random(-5,5);
    var randomY=f.random(-5,5);

    if(Math.random()<0.05){
      randomX=f.random(-88,88);
      randomY=f.random(-88,88);
    }
    var x=f.currentPoint.x+randomX;
    var y=f.currentPoint.y+randomY;
    if(x<0 || x>f.CW || y<0 || y>f.CH-4){
      //超出屏幕界限
      // console.log(x,y);
      var obj=f.generateNext();
      return obj;
    }else{
      return ({
        x:x,
        y:y
      });
    }


    
  }



} //class

$(function(){
  //全局變量：屏寬numClientW
  var numClientW=document.documentElement.clientWidth || document.body.clientWidth;
  var numClientH=document.documentElement.clientHeight || document.body.clientHeight;
  /*
  *playker圖片marginTop
  */
  if(numClientW<=992){
    var numWrapW=numClientW;
    var numWrapH=numClientH-70;
    $('.playker-img').each(function(){
      var numImgW=Number($(this).data('w'));
      var numImgH=Number($(this).data('h'));
      //圖片要縮放
      if(numImgW>numWrapW || numImgH>numWrapH){
        if(numImgW/numImgH>numWrapW/numWrapH){
          var numMarginTop=(numWrapH-(numWrapW*numImgH/numImgW))/2;
          $(this).css({marginTop:numMarginTop});
        }
      }else{
        var numMarginTop=(numWrapH-numImgH)/2;
        $(this).css({marginTop:numMarginTop});
      }
    });
  }
  /*
  *履歷圖片等寬高
  */
  function setHeightEqualWidth(){
    if($('.work').length>0){
      var numW=$('.col-md-6.work_item').width();
      $('.work_item').each(function(i){
        // console.log(numW);
        $(this).height(numW/2);
      });
    }
  }
  setHeightEqualWidth();


  /*
  *theater
  */
  if($('#theater').length>0){
    $('#no-theater').css({display:'none'});
    var theater = theaterJS();

    theater
      .on('type:start, erase:start', function () {
        // add a class to actor's dom element when he starts typing/erasing
        var actor = theater.getCurrentActor();
        actor.$element.classList.add('is-typing');
      })
      .on('type:end, erase:end', function () {
        // and then remove it when he's done
        var actor = theater.getCurrentActor();
        actor.$element.classList.remove('is-typing');
      });

    theater
      .addActor('theater',{ accuracy: 1, speed: 0.6 });

    theater
      .addScene('theater:大家好，我是学聪 ...', 3000)
      .addScene('theater:现居住在深圳', 200, '.', 200, '.', 200, '. ',1000)
      .addScene('theater:2011年毕业于广东工业大学', 200, '.', 20, '.', 20, '. ',100)
      .addScene('theater:我努力做出好看的',1000)
      .addScene(-3,'美丽大方的界面',500, '.', 500, '.', 500, '. ',2000)
      // .addScene('theater:我努力做出好看的、美丽大方的界面', 200, '.', 200, '.', 200, '. ',2000)
      .addScene('theater:我注重网站性能', 200, '.', 200, '.', 200, '. ',1000)
      .addScene('theater:我编写高质量的前端代码.', 200, '.', 200, '. ',3000)
      .addScene('theater:愿我们成为好朋友',500,' ^_^',5000)
      .addScene(theater.replay);
  }

  /*
  *head随机变换的头像
  */
  // return;
  if($('.comming_soon').length>0){
    var x1=0;
    var x2=0;
    var numHead=0;
    var numTimeInterval=300;
    var Timer=window.setInterval(function(){
      x1++;
      //三秒左右开始动
      if(x1>Math.floor(3000/numTimeInterval)){
        $('.comming_soon .head').css({background:'#FFF'});
        $('.comming_soon .head img').eq(0).css({display:'block'});
      }
      //五秒左右开始动
      if(x1>Math.floor(5000/numTimeInterval)){
        numHead++;
        numHead=numHead<40?numHead:0;
        // 算法复杂化
        x2=numHead*Math.random();
        // console.log(x2);
        if(x2<=7 && x2>2){
          $('.comming_soon .head img').css({display:'none'});
          $('.comming_soon .head img').eq(Math.floor(generateRandomNumber(0,4))).css({display:'block'});
        }
      }
      // 20分钟后清除定时器
      if(x1>Math.floor(1000*60*20/numTimeInterval)){
        window.clearInterval(Timer);
        $('.comming_soon .head img').css({display:'none'});
        $('.comming_soon .head').css({background:'#000 url("http://fangxuecong.com/img/logo.svg") no-repeat center center'});
      }
    },numTimeInterval);
    function generateRandomNumber(min,max){
      return (Math.random()*(max-min)+min);
    }
  }
  /*
  *mask
  */
  //load images
  $('#load-xposed-img').one('click',function(){
    $('.houtai-img').each(function(){
      $(this).attr('src',$(this).data('src'));
    });
  });
  $('#load-playker-img').one('click',function(){
    $('.playker-img').each(function(){
      $(this).attr('src',$(this).data('src'));
    });
    var mySwiper=new Swiper('.swiper-container',{
      loop: true,
      pagination:'.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev'
    });
  });

  $('#xposed').on('click',function(){
    $('.houtai').css({display:'block'});
    $('.mask').fadeIn();
  });
  $('.mask svg').on('click',function(){
    $('.mask').fadeOut(function(){
      $('.houtai,.playker').css({display:'none'});
    });
  });
  //圖片放大，新窗口打開
  if(numClientW>992){
    $('.houtai-img,.playker-img').css({cursor:'pointer'}).on('click',function(){
      window.open($(this).attr('src'),'_blank');
    });
  }
  $('#playker').on('click',function(){
    $('.playker').css({display:'block'});
    $('.mask').fadeIn();
  });

  /*
  *tangram:origin,runner
  */
  if($('#tangram').length>0){
    if(numClientW<=992){
      //手機
      var Timer=window.setInterval(function(){
        var strTangramName=['origin','runner','fish','boat','paper-crane','paper-crane2'][Math.floor(Math.random()*6)];
        $('.tangram-wrap').attr('class','tangram-wrap '+strTangramName);
      },3000);
    }else{
      $('#tangram').hover(function(){
        // $('.tangram-wrap').addClass('runner');
        $('.tangram-wrap').attr('class','tangram-wrap '+['runner','fish','boat','paper-crane','paper-crane2'][Math.floor(Math.random()*5)]);
      },function(){
        $('.tangram-wrap').attr('class','tangram-wrap origin');
        // $('.tangram-wrap').removeClass('runner');
      });
    }

  }
  /*
  *vector
  */
  if($('#vector').length>0 && numClientW>992){
    FSS("vector", "vector2");
  }
  /*
  *wave: and count page-index(id:2) pv
  */
  if($('#wave').length>0){
    //iPhone或者桌面,UCBrowser
    if(window.navigator.userAgent.indexOf('iPhone')!==-1 || numClientW>992 || window.navigator.userAgent.indexOf('UCBrowser')!==-1){
      var SW = new SiriWave({
  		  container:document.querySelector('.banner'),
  		  width: 2000,
  		  height: 300
  		});

  		SW.setSpeed(0.1);
  		SW.setNoise(0.3);
  		SW.start();
    }
    //================2017-07-12(remove) index pv(pageid,cw)
    // $.ajax({
    //   url:'/tetris-game/pv.php?pageid=2&cw='+numClientW,
    //   method:'GET',
    //   dataType:'json',
    //   // success:function(data){
    //   //   console.log(data);
    //   //   // console.log('index:'+data[0].pv);
    //   // },
    //   error:function(err){
    //     console.log(err);
    //   }
    // });

    //weibo phone
    if(numClientW<=992){
      $('#wave a.weibo').attr({href:'https://m.weibo.cn/u/3841442461'});
    }
    //首頁訪問log
    (function(){
      // ua,cw,ch,sw,sh,isInternetExplorer,objSohuC,ip
      var objSohuC=returnCitySN || {cname:'sohu-name',cid:'sohu-id',cip:'sohu-ip'};
      // var ip=objSohuC.cip;
      // var ua=window.navigator.userAgent;
      // var cw=numClientW;
      // var ch=numClientH;
      // var sw=window.screen.width;
      // var sh=window.screen.height;
      // var isInternetExplorer=Boolean(window.ActiveXObject || "ActiveXObject" in window);
      var plainObjectDataThatToBeSentToTheServer={
        ua:window.navigator.userAgent,
        cw:numClientW,
        ch:numClientH,
        sw:window.screen.width,
        sh:window.screen.height,
        isInternetExplorer:(Boolean(window.ActiveXObject || "ActiveXObject" in window)?1:0),
        // objSohuC:returnCitySN,
        city:objSohuC.cname+'('+objSohuC.cid+')',
        ip:objSohuC.cip
      };
      // console.log(plainObjectDataThatToBeSentToTheServer.ua);
      // return false;

      $.ajax({
        url:'/log.php',
        method:'POST',
        data:plainObjectDataThatToBeSentToTheServer,
        // dataType:'json',
        //success:function(data){
        //  console.log(data);
        //},
        error:function(err){
          console.log('log err: '+err);
        }
      });
    })();
	}
  /*
  *bst
  */
  $('#transfer-btn').on('click',function(){
    var strInput=$('#input-arr').val();
    try{
      var expectArrInput=JSON.parse(strInput);
      if($.type(expectArrInput)==='array'){
        var objCheckArr=checkIfCanTransfer(expectArrInput);
        if(!objCheckArr.bCanTransfer){
          $('#hint').html(objCheckArr.strHint).css({opacity:1});
        }else{
          //确保是正序
          expectArrInput.sort(function(a,b){
            return (a-b);
          });
          var obj=BST(expectArrInput);
          $('#ouput-bst').html(JSON.stringify(obj));
        }

      }else{
        $('#hint').html('不是数组！').css({opacity:1});
      }
    }catch(err){
      console.log(err);
      $('#hint').html('不是数组！').css({opacity:1});
    }


  });
  $('#input-arr').on('input',function(){
    $('#hint').css({opacity:0});
    $('#ouput-bst').html('');
  });
  function checkIfCanTransfer(arr){
    var bASC=(arr[1]-arr[0]>0);
    for(var i=0;i<arr.length;i++){
      if(!Number.isInteger(arr[i])){
        return {
          bCanTransfer:false,
          strHint:'数组中含有不是整数的元素！'
        };
      }
      if((i>1) && (arr[i-1]===arr[i])){
        return {
          bCanTransfer:false,
          strHint:'数组中含有相同的两个整数！'
        };
      }
      if((i>1) && ((arr[i]-arr[i-1]>0)!==bASC)){
        return {
          bCanTransfer:false,
          strHint:'不是有序的数组！'
        };
      }
    }
    return {bCanTransfer:true};
  }
  // bst pv
  if($('.bst.page').length>0){
    $.ajax({
      url:'/tetris-game/pv.php?pageid=3',
      method:'GET',
      dataType:'json',
      //success:function(data){
        //console.log(data);
        // console.log('xkool:'+data[0].pv);
      //},
      error:function(err){
        console.log(err);
      }
    });
  }

  function BST(arr){
    var numArrLen=arr.length;
    if(numArrLen===0){
      return {};
    }
    var numCenterKey=Math.floor(numArrLen/2); /*中键*/
    var obj={
      v:arr[numCenterKey]
    };
    if(numArrLen===2){ //[1,4]==>{v:4,l:[1],r:[]}
      obj.l=BST(arr.slice(0,numCenterKey));
    }else if(numArrLen>2){
      obj.l=BST(arr.slice(0,numCenterKey));
      obj.r=BST(arr.slice(numCenterKey+1));
    }
    return obj; //此时的numArrLen等于1（默认情况），因此，数组长度0,1,2,>=3的所有可能情况都考虑到了
  }

  //===wave-slide
  if(numClientW>992 && $('.wave-parent').length>0){
    (function(){
      var curpage = 1;
      var sliding = false;
      var click = true;
      var left = document.getElementById('left');
      var right = document.getElementById('right');
      var pagePrefix = 'slide';
      var pageShift = 500;
      var transitionPrefix = 'circle';
      var svg = true;

      function leftSlide() {
        if (click) {
          if (curpage === 1) {
            curpage = 5;
          }
            sliding = true;
            curpage--;
            svg = true;
            click = false;
            for(k=1;k<=4;k++){
              var a1 = document.getElementById(pagePrefix + k);
              a1.className += ' tran';
            }
            setTimeout(function(){
              move();
            },200);
            setTimeout(function(){
              for(k=1;k<=4;k++){
                var a1 = document.getElementById(pagePrefix + k);
                a1.classList.remove('tran');
              };
            },1400);
          }
      }


       function rightSlide() {
        if (click) {
          if (curpage === 4) {
            curpage = 0;
          }
          sliding = true;
          curpage++;
          svg = false;
          click = false;
          for(k=1;k<=4;k++){
            var a1 = document.getElementById(pagePrefix + k);
            a1.className += ' tran';
          }
          setTimeout(function(){
            move();
          },200);
          setTimeout(function(){
            for(k=1;k<=4;k++){
              var a1 = document.getElementById(pagePrefix + k);
              a1.classList.remove('tran');
            };
          },1400);
        }
      }


      function move() {
        if (sliding) {
          sliding = false;
          if (svg) {
            for (j = 1; j <= 9; j++) {
              var c = document.getElementById(transitionPrefix + j);
              c.classList.remove("steap");
              c.setAttribute("class", (transitionPrefix + j) + " streak")
            }
          } else {
            for (j = 10; j <= 18; j++) {
              var c = document.getElementById(transitionPrefix + j);
              c.classList.remove("steap");
              c.setAttribute("class", (transitionPrefix + j) + " streak")
            }
          }

          // for(k=1;k<=4;k++){
          //   var a1 = document.getElementById(pagePrefix + k);
          //   a1.className += ' tran';
          // }

          setTimeout(function(){
            for (i = 1; i <= 4; i++) {
              if (i == curpage) {
                var a = document.getElementById(pagePrefix + i);
                a.className += ' up1';
              } else {
                var b = document.getElementById(pagePrefix + i);
                b.classList.remove("up1");
              }
            };
            sliding = true;
          }, 600);
          setTimeout(function(){
            click = true;
          }, 1700);



          setTimeout(function(){
            if (svg) {
              for (j = 1; j <= 9; j++) {
                var c = document.getElementById(transitionPrefix + j);
                c.classList.remove("streak");
                c.setAttribute("class", (transitionPrefix + j) + " steap");
              }
            } else {
              for (j = 10; j <= 18; j++) {
                var c = document.getElementById(transitionPrefix + j);
                c.classList.remove("streak");
                c.setAttribute("class", (transitionPrefix + j) + " steap");
              }
              sliding = true;
            }
          }, 850);
          setTimeout(function(){
            click = true;
          }, 1700);
        }

      }

      left.onmousedown=function(){
        leftSlide();
      }

      right.onmousedown=function(){
        rightSlide();
      }

      // document.onkeydown=(e)=>{
      //   if(e.keyCode==37){
      //     leftSlide();

      //   }
      //   else if (e.keyCode==39) {
      //     rightSlide();

      //   }
      // }

      //for codepen header
      setTimeout(function(){
        rightSlide();
      },500)
    })();
  }

  //===levy
  if($('#levy').length>0){
    var levy=new Levy();
    levy.init().draw();
  }

// resize
  window.onresize=function(){
    setHeightEqualWidth();
  };

});//ready
