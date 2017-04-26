<?php
  //设置时间时区
  // date_default_timezone_set('prc');

  // echo $_GET['nickname'].$_GET['score'];
// echo '[{"name":"fangxuecong","score":71500},{"name":"author","score":109500},{"name":"想你夜能寐","score":300}]';
  $MSQL=new MySQLi('localhost','root','','fxc',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if(isset($_GET['nickname']) && isset($_GET['score'])){
    $NickName=$_GET['nickname'];
    $Score=$_GET['score'];
    $sql1="INSERT INTO TetrisScore(NickName,Score,PlayTime) VALUES ('$NickName','$Score',now())";
    $res=$MSQL->query($sql1);
  }



  $sql2="SELECT * FROM tetrisscore ORDER BY Score DESC,PlayTime ASC";
  $res=$MSQL->query($sql2);
  $arr = [];
  while($row=$res->fetch_object()){
    $arr[] = $row;
  }
  echo json_encode($arr);
  //============================
  $res->free();
  $MSQL->close();
?>
