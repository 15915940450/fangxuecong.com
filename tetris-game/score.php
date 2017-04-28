<?php
  //设置时间时区
  // date_default_timezone_set('prc');

  $MSQL=new MySQLi('localhost','root','','fxc',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if(isset($_POST['nickname']) && isset($_POST['score'])){
    $NickName=$_POST['nickname'];
    $Score=$_POST['score'];
    $sql1="INSERT INTO TetrisScore(NickName,Score,PlayTime) VALUES ('$NickName','$Score',now())";
    $res=$MSQL->query($sql1);
  }



  $sql2="SELECT * FROM TetrisScore ORDER BY Score DESC,PlayTime ASC";
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
