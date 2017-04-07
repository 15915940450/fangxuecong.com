$(function(){
/*
*履歷圖片等寬高
*/
  var numW=$('.col-md-3.work_item').width();
  $('.work_item').each(function(i){
    // console.log(numW);
    $(this).height(numW);
  });
});//ready
