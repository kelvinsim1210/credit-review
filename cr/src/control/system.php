<?php
    require("../model/system.php");

    $act = $_GET["act"];
    switch($act) {     
        case "check_login":
            echo check_login();
            return;

        case "login":
            $data = $_POST["data"];
            $data = json_decode($data);
            echo login($data->id, $data->password);
            return;

        case "add_user":
            $data = $_POST["data"];
            $data = json_decode($data);
            echo add_user($data->id, $data->password, $data->name, $data->department, $data->identity);
            return;

        case "get_user_list":
            echo get_user_list();
            return;

        case "logout":
            logout();
            return;

        default :
    }
?>