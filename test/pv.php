<?php
session_start();
//使用面向对象进行数据库的连接，在创建对象的时候就自动的连接数据
    $mySQLi = new MySQLi('localhost','root','root','fxc',3306);

    //判断数据库是否连接
    if($mySQLi -> connect_errno){
        die('连接错误' . $mySQLi -> connect_error);
    }
    //设置字符集
    $mySQLi -> set_charset('utf8');
    //编写sql语句并执行
    $sql = "select * from sessionpv";

    //发送sql语句并执行，如果是select语句，返回的是一个对象，其他的返回来一个boolean.
    $res = $mySQLi -> query($sql);

    //使用fetch_object();
    while($row = $res -> fetch_object()){
     $_SESSION['views']=($row->pv);
    }
    $res -> free();

    $sessionpv=$_SESSION['views']+1;
    echo $sessionpv;

    $sqlUpdate = "UPDATE `sessionpv` SET `pv`=$sessionpv WHERE `sessionID`=1";
    $res = $mySQLi -> query($sqlUpdate);
    // print_r($res);

    //
    $mySQLi -> close();
?>
