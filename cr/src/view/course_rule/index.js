var app = new Vue({
    data: {
        ui: 'home',
        menu: {
            system: "用戶管理",
            course_rule: "規則管理",
            course_list: "課程管理",
            credit_review: "學分審核"
        },
        menu_now: "course_rule",
        user_now: {
            id: '',
            name: "",
            department: "",
            identity: ''
        },
        check_year: "all",
        course_rule: {
            elective: '',
            free: '',
            general: {
                limit: true,  // 是否各次領域都要至少修一門
                feature: "",
                nature: "",
                society: "",
                humanities: ""
            }
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
        update_course_rule() {
            console.log("ucr");
            if(!this.check_year 
            || !this.course_rule.elective 
            || !this.course_rule.free) {
                alert("欄位不可為空");
                return;
            }
            let update_data = new FormData();
            update_data.append("course_rule", JSON.stringify(this.course_rule));
            fetch("../../control/course_rule.php?act=update_course_rule&year="+this.check_year, {
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
        get_course_rule() {
            fetch("../../control/course_rule.php?act=get_course_rule&year="+this.check_year)
            .then(res => {return res.text();})
            .then(data => {
                console.log(JSON.parse(data));
                if(data) {
                    this.course_rule = JSON.parse(data);
                }
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        change_ui(target) {
            if(target == "home") {
                this.check_year = "all";
            }
            else {
                this.check_year = "";
            }
            this.ui = target;
        }
    },
    mounted() {
        
    },
    created() {
        this.check_login();
        this.change_ui("home");
        
        // this.get_user_list();
    }
});
app.$mount("#main")