$(function(){
  var numClientW=document.documentElement.clientWidth || document.body.clientWidth;
  if(numClientW>992){
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
  }
});