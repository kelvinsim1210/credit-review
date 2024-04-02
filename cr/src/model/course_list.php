<?php
    require("link_sql.php");

    function get_course_list($year) {
        global $db;
        session_start();
        $department = $_SESSION["department"];
        
        $sql = "SELECT * FROM `course_list` WHERE year=? and department=?";
        $smtp = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($smtp, "ss", $year, $department);
        mysqli_stmt_execute($smtp);  // 執行 sql

        $result = mysqli_stmt_get_result($smtp);
        try {
            if($result) {
                if($data = mysqli_fetch_assoc($result)) {
                    return $data["course"];
                }
                else {
                    return false;
                }
            }
        }
        catch(Exeption $e) {
            echo "Caught error: ", $e -> getMessage(), "\n";
        }
    }

    function update_course($year, $course) {
        global $db;
        session_start();

        $sql_1 = "SELECT COUNT(*) AS 'num' FROM `course_list` WHERE `year`=? AND `department`=?";
        $smtp_1 = mysqli_prepare($db, $sql_1);
        mysqli_stmt_bind_param($smtp_1, "ss", $year, $_SESSION["department"]);
        mysqli_stmt_execute($smtp_1);  // 執行 sql

        $result_1 = mysqli_stmt_get_result($smtp_1);
        if(mysqli_fetch_assoc($result_1)["num"] != 0) {
            $sql_2 = "UPDATE `course_list` SET `course`=? WHERE `year`=? and`department`=?";
            $smtp_2 = mysqli_prepare($db, $sql_2);
            mysqli_stmt_bind_param($smtp_2, "sss", $course, $year, $_SESSION["department"]);
            mysqli_stmt_execute($smtp_2);  // 執行 sql
            echo $year."年，".$_SESSION["department"]."，課程修正";
        }
        else {
            $sql_3 = "INSERT INTO `course_list`(`year`, `department`, `course`) VALUES (?,?,?)";
            $smtp_3 = mysqli_prepare($db, $sql_3);
            mysqli_stmt_bind_param($smtp_3, "sss", $year, $_SESSION["department"], $course);
            mysqli_stmt_execute($smtp_3);  // 執行 sql
            echo $year."年，".$_SESSION["department"]."，課程新增";
        }
        make_department_course($_SESSION["department"]);
        return;
    }

    // 生成係所總課程
    function make_department_course() {

    }
?>