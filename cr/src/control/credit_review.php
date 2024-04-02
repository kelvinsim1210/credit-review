<?php
    require("../model/credit_review.php");

    $act = $_GET["act"];
    switch($act) {
        case "get_all_department":
            echo get_all_department();
            return;

        case "get_credit_review":
            $data = $_POST["credit_review_data"];
            $data = json_decode($data);
            echo get_credit_review($data->department, $data->year, $data->course_records);

        default:
    }
?>