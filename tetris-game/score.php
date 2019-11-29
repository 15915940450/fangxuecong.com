<?php
  //设置时间时区
  // date_default_timezone_set('prc');

  $MSQL=new MySQLi('localhost','root','00000000','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if(isset($_POST['nickname']) && isset($_POST['score'])){
    $nickname=$_POST['nickname'];
    $score=$_POST['score'];
    $sql1="INSERT INTO tetrisscore(nickname,score,playtime) VALUES ('$nickname','$score',now())";
    $res=$MSQL->query($sql1);
  }



  $sql2="SELECT * FROM tetrisscore ORDER BY score DESC,playtime ASC";
  $res=$MSQL->query($sql2);
  $arrTop=array();
  while($row=$res->fetch_object()){
    $arrTop[]=$row;
  }
  echo json_encode($arrTop);
  //============================
  $res->free();
  $MSQL->close();
?>
