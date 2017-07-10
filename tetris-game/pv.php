<?php
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $MSQL=new MySQLi('localhost','root','','fangxuec_tetris',3306);
  if($MSQL->connect_errno){
    die('数据库连接失败'.$MSQL->connect_error);
  }
  $MSQL->set_charset('utf8');
  //============================
  if(isset($_GET["pageid"])){
    $pageid=$_GET["pageid"];
    $sql1="UPDATE pv SET pv=pv+1 WHERE id='$pageid'";
    $res=$MSQL->query($sql1);

    if(isset($_GET["cw"])){
      //desktop
      if($_GET["cw"]>992){
        $sql4="UPDATE pv SET pv=pv+1 WHERE page='desktop'";
        $res=$MSQL->query($sql4);
      }else{
        $sql5="UPDATE pv SET pv=pv+1 WHERE page='phone'";
        $res=$MSQL->query($sql5);
      }
    }
  }
  $sql2="SELECT * FROM pv";
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
