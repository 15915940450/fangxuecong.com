$(function(){
  /*
  *履歷圖片等寬高
  */
  var numW=$('.col-md-3.work_item').width();
  $('.work_item').each(function(i){
    // console.log(numW);
    $(this).height(numW);
  });

  /*
  *theater
  */
  var theater = theaterJS()

  theater
    .on('type:start, erase:start', function () {
      // add a class to actor's dom element when he starts typing/erasing
      var actor = theater.getCurrentActor()
      actor.$element.classList.add('is-typing')
    })
    .on('type:end, erase:end', function () {
      // and then remove it when he's done
      var actor = theater.getCurrentActor()
      actor.$element.classList.remove('is-typing')
    })

  theater
    .addActor('theater',{ accuracy: 1, speed: 0.6 })

  theater
    .addScene('theater:大家好，我是学聪...', 1000)
    .addScene('theater:现居住在深圳', 200, '.', 200, '.', 200, '. ',1000)
    .addScene('theater:2011年毕业于广东工业大学', 200, '.', 200, '.', 200, '. ',3000)
    .addScene(theater.replay)

  /*
  *head
  */
  // return;
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
// resize
  window.onresize=function(){
    var numW=$('.col-md-3.work_item').width();
    $('.work_item').each(function(i){
      // console.log(numW);
      $(this).height(numW);
    });
  };

});//ready
