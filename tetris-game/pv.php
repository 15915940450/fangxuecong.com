<?php
  $pageid=$_GET["pageid"];
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $MSQL=new MySQLi('localhost','root','','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  $sql1="UPDATE pv SET pv=pv+1 WHERE id='$pageid'";
  $res=$MSQL->query($sql1);

  $sql2="SELECT * FROM pv WHERE id='$pageid'";
  $res=$MSQL->query($sql2);
  $pv=array();
  while($row=$res->fetch_object()){
    $pv[]=$row;
  }
  echo json_encode($pv);
  //============================
  $res->free();
  $MSQL->close();
?>
