<?php
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $MSQL=new MySQLi('localhost','root','00000000','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if (!empty($_POST)){
    $phone=$_POST['tak'];
    $lau=$_POST['wah'];

    $sql="INSERT INTO im_log(phone,lau,time) VALUES('$phone','$lau',now())";
    $res=$MSQL->query($sql);
    echo $lau;
    //var_dump($res);
  }else{
    // echo "_POST is empty.";
    $sql2="SELECT * FROM im_log ORDER BY time DESC";
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
