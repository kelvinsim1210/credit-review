<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "credit_review";
    
    // 创建连接
    $db = mysqli_connect($servername, $username, $password, $dbname);
    
    // 检查连接是否成功
    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }
?>
