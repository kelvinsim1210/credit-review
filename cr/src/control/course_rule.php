<?php
    require("../model/course_rule.php");

    $act = $_GET["act"];
    switch($act) {
        case "update_course_rule":
            $year = $_GET["year"];
            $course_rule = $_POST["course_rule"];
            echo update_course_rule($year, $course_rule);
            return;

        case "get_course_rule":
            $year = $_GET["year"];
            echo get_course_rule($year);
            return;

        default:
    }
?>