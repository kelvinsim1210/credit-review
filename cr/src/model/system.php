<?php
    require("link_sql.php");  // 鏈接資料庫

    function check_login() {
        session_start();
        if(isset($_SESSION["user"])) {
            return $_SESSION["user"] ."&". $_SESSION["name"] ."&". $_SESSION["department"] ."&". $_SESSION["identity"];
        }
        return;
    }

    function login($id, $password) {
        global $db;

        $sql = "select * from user where id=?";
        $smtp = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($smtp, "s", $id);
        mysqli_stmt_execute($smtp);  // 執行 sql

        $result = mysqli_stmt_get_result($smtp);
        try {
            if($result) {
                if($data = mysqli_fetch_assoc($result)) {
                    if(password_verify($password, $data["password"])) {
                        if($data["identity"] == "adminstrater" || $data["identity"] == "root") {
                            session_start();
                            $_SESSION["user"] = $id;
                            $_SESSION["name"] = $data["name"];
                            $_SESSION["department"] = $data["department"];
                            $_SESSION["identity"] = $data["identity"];
                            return "_Y_";
                        }
                        else {
                            return "權限不足";
                        }
                    }
                    else {
                        return "密碼錯誤";
                    }
                }
                else {
                    return "賬號不存在";
                }
            }
        }
        catch(Exeption $e) {
            echo "Caught error: ", $e -> getMessage(), "\n";
        }
    }

    function logout() {
        session_start(); 
        session_destroy();
    }

    function add_user($id, $password, $name, $department, $identity) {
        global $db;

        $check_exist = "SELECT * FROM `user` WHERE `id`=?";
        $smtp = mysqli_prepare($db, $check_exist);
        mysqli_stmt_bind_param($smtp, "s", $id);
        mysqli_stmt_execute($smtp);  // 執行 sql
        $result = mysqli_stmt_get_result($smtp);
        try {
            if($result) {
                if($r = mysqli_fetch_assoc($result)) {
                    return "賬號已存在";
                }
            }
        }
        catch(Exeption $e) {
            echo "Caught error: ", $e -> getMessage(), "\n";
        }

        $sql = "INSERT INTO `user`(`id`, `name`, `password`, `department`, `identity`) VALUES (?,?,?,?,?)";
        $smtp = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($smtp, "sssss", $id, $name, $password_hash, $department, $identity);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        mysqli_stmt_execute($smtp);  // 執行 sql
        return "_Y_";
    }

    function get_user_list() {
        global $db;

        $sql = "select * from user where 1";
        $smtp = mysqli_prepare($db, $sql);
        mysqli_stmt_execute($smtp);  // 執行 sql

        $result = mysqli_stmt_get_result($smtp);
        try {
            if($result) {
                $rows = array();
                while($r = mysqli_fetch_assoc($result)) {
                    $rows[] = $r;
                }
                return json_encode($rows);
            }
        }
        catch(Exeption $e) {
            echo "Caught error: ", $e -> getMessage(), "\n";
        }
    }
?>