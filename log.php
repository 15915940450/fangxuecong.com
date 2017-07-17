<?php
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $MSQL=new MySQLi('localhost','root','','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if (!empty($_POST)){
    $ua=$_POST['ua'];
    $cw=$_POST['cw'];
    $ch=$_POST['ch'];
    $sw=$_POST['sw'];
    $sh=$_POST['sh'];
    $isInternetExplorer=$_POST['isInternetExplorer'];
    $city=$_POST['city'];
    $ip=$_POST['ip'];

    $sql="INSERT INTO log(ua,cw,ch,sw,sh,isInternetExplorer,city,logtime,ip) VALUES('$ua','$cw','$ch','$sw','$sh','$isInternetExplorer','$city',now(),'$ip')";
    $res=$MSQL->query($sql);
    echo $res;
    //var_dump($res);
  }else{
    // echo "_POST is empty.";
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
  }
  // return;
?>
