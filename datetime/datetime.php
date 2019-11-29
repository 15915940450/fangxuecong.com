<?php
  $nm=$_POST["nm"];
  $dt=$_POST["dt"];

  if(isset($nm) && isset($dt)){
    //MySQL
    
    //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
    $MSQL=new MySQLi('localhost','root','00000000','dt',3306);
    if($MSQL->connect_errno){
      die('数据库连接失败'.$MSQL->connect_error);
    }
    $MSQL->set_charset('utf8');
    //============================
    $sql1="INSERT INTO dt(nm,dt) VALUES('".$nm."',".$dt.")";
    $res=$MSQL->query($sql1);

    // $sql2="SELECT id,nm,FROM_UNIXTIME(dt) FROM dt";
    // $res=$MSQL->query($sql2);
    // $pv=array();
    // while($row=$res->fetch_object()){
    //   $pv[]=$row;
    // }
    // echo json_encode($pv);
    // echo $dt;
    //============================
    // $res->free();
    $MSQL->close();
  }
?>
