var app = new Vue({
    data: {
        ui: 'home',
        menu: {
            system: "用戶管理",
            course_rule: "規則管理",
            course_list: "課程管理",
            credit_review: "學分審核"
        },
        menu_now: "course_list",
        user_now: {
            id: '',
            name: "",
            department: "",
            identity: ''
        },
        check_year: "",
        course_tittle: ["課號", "名稱", "學分"],
        // 修改課程用，本系課程，附加選修
        all_course: {
            my_course: '',
            elective: '',
            special_elective: '',
            general: {
                local_practice: '',
                green_concept: '',
                southeast_asia: '',
                life_science: '',
                engineering_technology: '',
                social_economics_management: '',
                law_education: '',
                history_philosophy_culture: '',
                literature_art: '',
            }
        },
        // 做分類，必修，選修
        course_list: {
            compulsory: [],
            elective: [],
            special_elective: [],
            general: {
                local_practice: '',
                green_concept: '',
                southeast_asia: '',
                life_science: '',
                engineering_technology: '',
                social_economics_management: '',
                law_education: '',
                history_philosophy_culture: '',
                literature_art: ''
            }
        },
        general_name: {
            local_practice: '特色通識-社會創新（在地實踐）',
            green_concept: '特色通識-淨零永續（綠概念）',
            southeast_asia: '特色通識-國際連接（東南亞）',
            life_science: '自然-生命與科學',
            engineering_technology: '自然-工程與科技',
            social_economics_management: '社會-社經與管理',
            law_education: '社會-法政與教育',
            history_philosophy_culture: '人文-歷史哲學與文化',
            literature_art: '人文-文學與藝術'
        }
    },
    methods: {
        check_login() {
            fetch("../../control/system.php?act=check_login")
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log("login: ", data);
                if(data) {
                    this.user_now["id"] = data.split("&")[0];
                    this.user_now["name"] = data.split("&")[1];
                    this.user_now["department"] = data.split("&")[2];
                    this.user_now["identity"] = data.split("&")[3];
                    this.change_ui("home");
                }
                else {
                    location.href = "../system";
                }
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        logout() {
            fetch("../../control/system.php?act=logout");
            // this.check_login();
            location.href = "../system";
        },
        get_course_list() {
            fetch("../../control/course_list.php?act=get_course_list&year="+this.check_year)
            .then(res => {return res.text();})
            .then(data => {
                console.log(JSON.parse(data));
                if(data) {
                    let course_data = JSON.parse(data);
                    this.course_list.compulsory = course_data.compulsory;
                    this.course_list.elective = course_data.elective;
                    this.course_list.special_elective = course_data.special_elective;
                    for(var key in course_data.general) {
                        // console.log(key);
                        this.course_list.general[key] = course_data.general[key];
                    }
                }
                else {
                    alert("沒有資料");
                }
                console.log(this.course_list.general);
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
            // console.log(this.course_list);
        },
        update_course() {
            // console.log("ok");
            if(!this.check_year || !this.all_course.my_course) {
                alert("學期，本系必選修 欄位不可為空");
                return;
            }
            // 本系必選修
            const course_data = this.all_course.my_course.split("\n");
            // 至少有兩個連續的空格
            const str_course_data = course_data.map(line => line.split(/ {2,}/));
            // 附加選修
            const course_data2 = this.all_course.elective.split("\n");
            const str_course_data2 = course_data2.map(line => line.split(/ {2,}/));
            // 分類必選修，特殊選修
            let compulsory_data = [];
            let elective_data = [];
            let special_elective_data = [];
            let general_data = {};
            // 處理本系必選修
            for(var key in str_course_data) {
                // console.log(str_course_data[value]);
                if(str_course_data[key][4] == "必" && str_course_data[key][0] == "電機系") {
                    compulsory_data.push(str_course_data[key]);
                }
                else {
                    elective_data.push(str_course_data[key]);
                }
            }
            // 處理附加選修
            for(var key in str_course_data2) {
                // console.log(str_course_data[value]);
                if(str_course_data2[key][4] == "選") {
                    elective_data.push(str_course_data2[key]);
                }
            }
            // 如果有特殊選修
            if(this.all_course.special_elective) {
                const course_data3 = this.all_course.special_elective.split("\n");
                const str_course_data3 = course_data3.map(line => line.split(/ {2,}/));
                for(var key in str_course_data3) {
                    if(parseInt(str_course_data3[key][5]) >= 2) {
                        special_elective_data.push(str_course_data3[key]);
                    }
                }
            }
            // 通識
            for(var key in this.all_course.general) {
                const course_data = this.all_course.general[key].split("\n");
                const str_course_data = course_data.map(line => line.split(/ {2,}/));
                general_data[key] = str_course_data;
            }
            let result = {};
            result.compulsory = compulsory_data;
            result.elective = elective_data;
            result.special_elective = special_elective_data;
            result.general = general_data;
            console.log(result);
            // console.log(JSON.stringify(str_course_data))
            // this.course_list.compulsory = compulsory_data;
            // this.course_list.elective = elective_data;

            let update_data = new FormData();
            update_data.append("course", JSON.stringify(result));
            fetch("../../control/course_list.php?act=update_course&year="+this.check_year, {
                method: "POST",
                body: update_data
            })
            .then(res => {return res.text();})
            .then(data => {
                // console.log(data);
                alert(data);
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        set_table() {
            console.log("set");
            document.addEventListener('DOMContentLoaded', function() {
                var tables = document.querySelectorAll('table');
            
                tables.forEach(function(table) {
                    var head = table.querySelector('thead');
                    var body = table.querySelector('tbody');
            
                    head.addEventListener('click', function() {
                        if (body.style.display === 'none') {
                            body.style.display = 'table-row-group';
                        } else {
                            body.style.display = 'none';
                        }
                    });
                });
            });
        },
        change_ui(target) {
            if(target == "home") {
                this.check_year = "";
            }
            else {
                this.check_year = "";
            }
            this.ui = target;
        }
    },
    mounted() {
        this.set_table();
    },
    created() {
        this.check_login();
        this.change_ui("home");
        
        // this.get_user_list();
    }
});
app.$mount("#main")