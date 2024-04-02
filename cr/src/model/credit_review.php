<?php
    require("link_sql.php");

    function get_all_department() {
        global $db;
        session_start();

        $sql_1 = "SELECT `department` FROM `user` WHERE `department`!='' GROUP BY `department`";
        $smtp_1 = mysqli_prepare($db, $sql_1);
        mysqli_stmt_execute($smtp_1);  // 執行 sql

        $result_1 = mysqli_stmt_get_result($smtp_1);
        $all_department = array();
        while($data = mysqli_fetch_assoc($result_1)) {
            $all_department[] = $data["department"];
        }
        return json_encode($all_department);        
    }

    function get_credit_review($department, $year, $course_records) {
        global $db;
        $sql_1 = "SELECT * FROM `course_list` WHERE `year`>=?";
        $smtp_1 = mysqli_prepare($db, $sql_1);
        mysqli_stmt_bind_param($smtp_1, "s", $year);
        mysqli_stmt_execute($smtp_1);  // 執行 sql

        $result_1 = mysqli_stmt_get_result($smtp_1);
        $all_course_data = array();  // 所有符合年份的課程資料
        while($data = mysqli_fetch_assoc($result_1)) {
            $data["course"] = json_decode($data["course"]);
            $data["rule"] = json_decode($data["rule"]);
            $all_course_data[] = $data;
        }
        // return json_encode($all_course_data);

        $course_list = explode("\n\n", $course_records);  // 學生修課歷史
        
        $course_classification = [];  // 所有課程分類記錄
        $course_classification["compulsory"] =[];  // 必修
        $course_classification["elective"] = [];  // 選修
        $course_classification["special_elective"] = [];  // 特殊選修（電機）
        $course_classification["free"] = [];  // 自由
        $course_classification["general"] = [];  // 通識
        $course_classification["general"]["特色通識"] = [];  
        $course_classification["general"]["特色通識"]["特色通識-社會創新（在地實踐）"] = [];
        $course_classification["general"]["特色通識"]["特色通識-淨零永續（綠概念）"] = [];
        $course_classification["general"]["特色通識"]["特色通識-國際連接（東南亞）"] = [];
        $course_classification["general"]["自然"] = [];  
        $course_classification["general"]["自然"]["自然-生命與科學"] = [];
        $course_classification["general"]["自然"]["自然-工程與科技"] = [];
        $course_classification["general"]["社會"] = [];  
        $course_classification["general"]["社會"]["社會-社經與管理"] = [];
        $course_classification["general"]["社會"]["社會-法政與教育"] = [];
        $course_classification["general"]["人文"] = [];  
        $course_classification["general"]["人文"]["人文-歷史哲學與文化"] = [];
        $course_classification["general"]["人文"]["人文-文學與藝術"] = []; 
        // $course_classification["free"][] = []; 
        $course_classification["no_compulsory"] = [];

        // 修課規則
        foreach($all_course_data as $data) {
            // print_r($data['rule']) ;
            if($data['year'] == $year) {
                $rule_data = $data['rule'];
                $course_classification['course_rule']['elective'] = $rule_data->elective;
                $course_classification['course_rule']['free'] = $rule_data->free;
                $course_classification['course_rule']['limit'] = $rule_data->general->limit;
                $course_classification['course_rule']['feature'] = $rule_data->general->feature;
                $course_classification['course_rule']['nature'] = $rule_data->general->nature;
                $course_classification['course_rule']['society'] = $rule_data->general->society;
                $course_classification['course_rule']['humanities'] = $rule_data->general->humanities;
                break;
            }
        }

        // if($department == "電機系,23") {
        foreach($course_list as $data_now) {
            $data_now = explode("\n",$data_now);
            foreach($data_now as $data) {
                $data = explode(" ",$data);
                // return strpos($data[0], "修課狀況");
                if(count($data)>=3 && strpos($data[1], "學分")) {
                    // return "y";
                    // print_r($data);
                    // echo var_dump($data);
                    // echo var_dump($course_classification["free"]);
                    // $result = isnot_in_course_23($all_course_data, $course_classification,  $data[0], $data[3]);
                    if($department == "電機系,23") {
                        $course_classification = isnot_in_course_23($all_course_data, $course_classification, $data);
                    }
                    // return json_encode($course_classification);
                    // return json_encode($data);
                    // if($result == "compulsory") {
                    //     $course_classification["compulsory"][] = $data;
                    // }
                    // else if($result == "elective") {
                    //     $course_classification["elective"][] = $data;
                    // }
                    // else if($result == "special_elective") {
                    //     $course_classification["special_elective"][] = $data;
                    // }
                    // else if($result == "free") {
                    //     // return json_encode($data);
                    //     // echo var_dump($data);
                    //     $course_classification["free"][] = $data;
                    // }
                    // else if($result == "local_practice") {
                    //     $course_classification["general"]["特色通識"]["特色通識-社會創新（在地實踐）"][] = $data;
                    // }
                    // else if($result == "green_concept") {
                    //     $course_classification["general"]["特色通識"]["特色通識-淨零永續（綠概念）"][] = $data;
                    // }
                    // else if($result == "southeast_asia") {
                    //     $course_classification["general"]["特色通識"]["特色通識-國際連接（東南亞）"][] = $data;
                    // }
                    // else if($result == "life_science") {
                    //     $course_classification["general"]["自然"]["自然-生命與科學"][] = $data;
                    // }
                    // else if($result == "engineering_technology") {
                    //     $course_classification["general"]["自然"]["自然-工程與科技"][] = $data;
                    // }
                    // else if($result == "social_economics_management") {
                    //     $course_classification["general"]["社會"]["社會-社經與管理"][] = $data;
                    // }
                    // else if($result == "general.law_education") {
                    //     $course_classification["general"]["社會"]["社會-法政與教育"][] = $data;
                    // }
                    // else if($result == "history_philosophy_culture") {
                    //     $course_classification["general"]["人文"]["人文-歷史哲學與文化"][] = $data;
                    // }
                    // else if($result == "general.literature_art") {
                    //     $course_classification["general"]["人文"]["人文-文學與藝術"][] = $data;
                    // }
                }
                // 姓名
                else if(strpos($data[0], "歷年修課狀況")) {
                    $course_classification["姓名"] = substr($data[0], 0, -28);
                }
                // 目前修習學分
                else if(substr($data[0], 0, 6) == "總共" && substr($data[0], -6) == "學分") {
                    $course_classification["目前已修習學分數"] = substr($data[0], 6, -6);
                }
                // 通識講座
                else if(substr(end($data), -6) == "通過") {
                    $course_classification["通識講座"][] = substr($data[0], 0, -6);
                }
                // 英文能力
                else if(substr(end($data), -12) == "英文能力") {
                    $course_classification["英文能力"][] = implode("", $data);
                }
            }
        }
        foreach($course_classification['general'] as $key => $x) {
            foreach($x as $key2 => $y) {
                if(count($y)==0) {
                    $course_classification['general'][$key][$key2][] = [];
                }
            }
        }

        // 獲取未通過必修
        foreach($all_course_data as $data_list) {
            if($data_list['year'] == $year) {
                foreach($data_list["course"] as $key => $data) {
                    foreach($data as $data_list2) {
                        if($data_list2[4] == "必" && $data_list2[0] == explode(',', $department)[0]) {
                            $next = 0;
                            foreach($course_classification["compulsory"] as $c_data) {
                                if($data_list2[1] == $c_data[0]) {
                                    $next = 1;
                                    break;
                                }
                            }
                            if($next == 0) {
                                $is_in = 0;
                                foreach($course_classification["no_compulsory"] as $no_c) {
                                    if($no_c[1] == $data_list2[1]) {
                                        $is_in = 1;
                                    }
                                }
                                if($is_in == 0) {
                                    $course_classification["no_compulsory"][] = $data_list2;
                                }
                                $is_in = 0;
                            }
                            $next = 0;
                        }
                    }
                }
            }
        }

        return json_encode($course_classification);
        // }
        // return;
    }

    // 電機課程整理
    // 所有課程資料，記錄課程整理，當前測試課程
    function isnot_in_course_23($all_course_data, $course_classification, $course_data) {
        // 如果不是數字就會返回 0
        if(intval($course_data[3]) >= 60) {
            // return "60";
            // return json_encode($all_course_data);
            $clear = 0;
            foreach($all_course_data as $data_list) {
                if($clear == 1) {
                    break;
                }
                foreach($data_list["course"] as $key => $data) {
                    // return $data;
                    // echo $key;
                    if($key == "general") {  // 檢測屬於通識課程
                        // return isnot_in_general($data, $id);
                        $result = isnot_in_general($course_classification, $data, $course_data);
                        $course_classification = $result[0];
                        $clear = $result[1];
                        // return $course_classification;
                        if($clear == 1) {
                            break;
                        }
                    }
                    else {  // 其他課程
                        foreach($data as $data_list2) {
                            if($course_data[0] == $data_list2[1]) {
                                // return $key;
                                if($key == "compulsory") {
                                    $course_classification["compulsory"][] = $course_data;
                                }
                                else if($key == "elective") {
                                    $course_classification["elective"][] = $course_data;
                                }
                                else if($key == "special_elective") {
                                    $course_classification["special_elective"][] = $course_data;
                                }
                                // return $course_classification;
                                $clear = 1;
                                break;
                            }
                        }
                    }
                    if($clear == 1) {
                        break;
                    }
                    // 共同必修
                    // else {
                    //     if((strpos($course_data[4],"體育"))
                    //     || (strpos($course_data[4],"大一體育"))
                    //     || (strpos($course_data[4],"服務學習"))
                    //     || (strpos($course_data[4],"英文二"))
                    //     || (strpos($course_data[4],"英文"))
                    //     || (strpos($course_data[4],"國文"))
                    //     || (strpos($course_data[4],"喬外生華語文"))
                    //     || (strpos($course_data[4],"中文思維與表達"))) {
                    //         $course_classification["共同必修"][] = $course_data;
                    //     }
                    // }

                }
            }
            // 英文畢業
            if($course_data[0] == "951005" || $course_data[0] == "951006") {
                $course_classification["英文能力_課程"][] = $course_data;
            }
            // 共同必修
            else if((substr($course_data[4],0,6) == "體育")
            || (strpos($course_data[4],"大一體育"))
            || (strpos($course_data[4],"體育"))
            || (strpos($course_data[4],"服務學習"))
            || (strpos($course_data[4],"英文二"))
            || (strpos($course_data[4],"英文"))
            || (strpos($course_data[4],"國文"))
            || (strpos($course_data[4],"僑外生華語文"))
            || (strpos($course_data[4],"中文思維與表達"))) {
                $course_classification["共同必修"][] = $course_data;
                $clear = 1;
            }
            if($clear == 0) {
                $course_classification["free"][] = $course_data;  // 如果都不屬於，其他
            }
            // return "free";  // 自由學分
        }
        // $course_classification["free"][] = $course_data;  // 如果都不屬於，自由學分
        return $course_classification;  // 統一回傳課程整理
    }

    // 通識課識別
    // 記錄課程整理，所有通識課資料，當前測試課程
    function isnot_in_general($course_classification, $data, $course_data) {
        // print_r($data);
        foreach($data as $key => $value) {
            // echo $id;
            // echo $key;
            // print_r($value[1]);
            foreach($value as $data2) {
                // echo $data[1];
                if($course_data[0] == $data2[1]) {     
                    // return $key;  // 通識類別
                    if($key == "local_practice") {
                        $course_classification["general"]["特色通識"]["特色通識-社會創新（在地實踐）"][] = $course_data;
                    }
                    else if($key == "green_concept") {
                        $course_classification["general"]["特色通識"]["特色通識-淨零永續（綠概念）"][] = $course_data;
                    }
                    else if($key == "southeast_asia") {
                        $course_classification["general"]["特色通識"]["特色通識-國際連接（東南亞）"][] = $course_data;
                    }
                    else if($key == "life_science") {
                        $course_classification["general"]["自然"]["自然-生命與科學"][] = $course_data;
                    }
                    else if($key == "engineering_technology") {
                        $course_classification["general"]["自然"]["自然-工程與科技"][] = $course_data;
                    }
                    else if($key == "social_economics_management") {
                        $course_classification["general"]["社會"]["社會-社經與管理"][] = $course_data;
                    }
                    else if($key == "law_education") {
                        $course_classification["general"]["社會"]["社會-法政與教育"][] = $course_data;
                    }
                    else if($key == "history_philosophy_culture") {
                        $course_classification["general"]["人文"]["人文-歷史哲學與文化"][] = $course_data;
                    }
                    else if($key == "general.literature_art") {
                        $course_classification["general"]["人文"]["人文-文學與藝術"][] = $course_data;
                    }
                    return array($course_classification,1);
                }
            }
        }
        // $course_classification["free"][] = $course_data;  // 如果都不屬於，自由學分
        return array($course_classification,0);  // 統一回傳課程整理
    }
?>