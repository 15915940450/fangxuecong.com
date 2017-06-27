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
      var numW=$('.col-md-3.work_item').width();
      $('.work_item').each(function(i){
        // console.log(numW);
        $(this).height(numW);
      });
    }
  }
  setHeightEqualWidth();


  /*
  *theater
  */
  if($('#theater').length>0){
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
      .addScene('theater:大家好，我是学聪...', 3000)
      .addScene('theater:现居住在深圳', 200, '.', 200, '.', 200, '. ',1000)
      .addScene('theater:2011年毕业于广东工业大学', 200, '.', 200, '.', 200, '. ')
      .addScene('theater:我努力做出好看的',1000)
      .addScene(-3,'美丽大方的界面',500, '.', 500, '.', 500, '. ',2000)
      // .addScene('theater:我努力做出好看的、美丽大方的界面', 200, '.', 200, '.', 200, '. ',2000)
      .addScene('theater:我注重网站性能', 200, '.', 200, '.', 200, '. ',1000)
      .addScene('theater:我编写高质量的前端代码', 200, '.', 200, '.', 200, '. ',3000)
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
        $('.comming_soon .head').css({background:'#000 url("img/logo.svg") no-repeat center center'});
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
  *wave
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
	}
  /*
  *bst
  */
  $('#transfer-btn').on('click',function(){
    var strInput=$('#input-arr').val();
    try{
      var expectArrInput=JSON.parse(strInput);
      if($.type(expectArrInput)==='array'){
        if(!checkIfIsSorted(expectArrInput)){
          $('#hint').html('不是有序的数组！').css({opacity:1});
        }else{
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
  });
  function checkIfIsSorted(arr){
    var bASC=(arr[1]-arr[0]>0);
    for(var i=2;i<arr.length;i++){
      if((arr[i]-arr[i-1]>0)!==bASC){
        return false;
      }
    }
    return true;
  }

  function BST(arr){
    var numArrLen=arr.length;
    var numCenterKey=Math.floor(numArrLen/2); /*中键*/
    var obj={
      v:arr[numCenterKey],
      l:arr.slice(0,numCenterKey),
      r:arr.slice(numCenterKey+1)
    };
    //=====================================================
    if(numArrLen===2){ //[1,4]==>{v:4,l:[1],r:[]}
      obj.l=BST(obj.l);
      delete obj.r;
    }else if(numArrLen===1){ //[1]==>{v:1,l:[],r:[]}
      delete obj.l;
      delete obj.r;
    }else{
      //[1,4,5,9]==>{v:5,l:[1,4],r:[9]}
      //[1,5,9]==>{v:5,l:[1],r:[9]}
      //分治思想，递归调用BST
      //T(n)=2T(n/2)+O(1)
      //CASE1(a=2,b=2,ε=1)(http://baike.baidu.com/link?url=l_CDLecR13m1qijEF2WzleUBvJsRVI7psBOyi-2ipL2CZEcccMYaWsvasxATT67UrOlE9TLQrZjYSFE97kEGvCiIj37yGt0Mjhn0lFvmDGeMh10ucbUntpgFGYimdbCF)
      obj.l=BST(obj.l);
      obj.r=BST(obj.r);
    }
    //=====================================================
    return obj;
  }

// resize
  window.onresize=function(){
    setHeightEqualWidth();
  };

});//ready
