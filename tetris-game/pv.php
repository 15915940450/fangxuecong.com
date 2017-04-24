<?php
  //使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据,密码为空
  $mySQLi = new MySQLi('localhost','root','','fxc',3306);

  //判断数据库是否连接
  if($mySQLi -> connect_errno){
      die('MySQL连接错误' . $mySQLi -> connect_error);
  }
  //设置字符集
  $mySQLi -> set_charset('utf8');
  //编写sql语句并执行
  $sql1 = "UPDATE PV SET TetrisPagePV=TetrisPagePV+1 WHERE ID=0";

  //发送sql语句并执行，如果是select语句，返回的是一个对象，其他的返回来一个boolean.
  $res = $mySQLi -> query($sql1);

  $sql2 = "SELECT * FROM pv WHERE ID=0";
  $res = $mySQLi -> query($sql2);
  //使用fetch_object();
  while($row = $res -> fetch_object()){
   $TetrisPagePV=($row->TetrisPagePV);
  }
  $res -> free();
  //输出
  echo $TetrisPagePV;

  //关闭连接
  $mySQLi -> close();
?>
