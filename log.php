<?php
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $MSQL=new MySQLi('localhost','root','','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if (!empty($_POST)){

    // echo $_POST["ua"];
    $sql="INSERT INTO log(ua,cw,ch,sw,sh,isInternetExplorer,city,logtime,ip) VALUES('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.3103.400 QQBrowser/9.6.11372.400',700,500,1920,1080,1,'广东省深圳市宝安区(440306)',now(),'119.137.54.102')";
    $res=$MSQL->query($sql);
  }else{
    // echo "$_POST is empty.";
  }
  // return;
  $sql2="SELECT * FROM log ORDER BY logtime DESC";
  $res=$MSQL->query($sql2);

  $arrLog=array();
  while($row=$res->fetch_object()){
    $arrLog[]=$row;
  }
  echo json_encode($arrLog);
  //============================
  $res->free();
  $MSQL->close();
?>
