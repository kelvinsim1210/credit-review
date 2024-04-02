<?php
    require("../model/course_list.php");

    $act = $_GET["act"];
    switch($act) {
        case "get_course_list":
            $year = $_GET["year"];
            echo get_course_list($year);
            return;

        case "update_course":
            $year = $_GET["year"];
            $course = $_POST["course"];
            echo update_course($year, $course);
            return;

        default:
    }
?>