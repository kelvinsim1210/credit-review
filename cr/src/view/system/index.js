var app = new Vue({
    data: {
        ui: 'login',
        menu: {
            system: "用戶管理",
            course_rule: "規則管理",
            course_list: "課程管理",
            credit_review: "學分審核"
        },
        menu_now: "system",
        user_now: {
            id: '',
            name: "",
            department: "",
            identity: ''
        },
        data_user_list: [],
        data_login: {
            id: "",
            password: ""
        },
        data_add_user: {
            id: "",
            password: "",
            name: "",
            department: "",
            identity: "adminstrater"
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
                    this.ui = "login";
                }
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        login() {
            // 處理登錄表單
            let login_data = new FormData();
            login_data.append("data", JSON.stringify(this.data_login));

            fetch("../../control/system.php?act=login", {
                method: "POST",
                body: login_data
            })
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log(data);
                if(data == "_Y_") {
                    this.change_ui("home");
                }
                else {
                    alert(data);
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
        add_user() {
            for(let item in this.data_add_user) {
                console.log(item);
                if(this.data_add_user[item] == "") {
                    alert("欄位不可為空");
                    return;
                }
            }
            let add_user_data = new FormData();
            add_user_data.append("data", JSON.stringify(this.data_add_user));

            fetch("../../control/system.php?act=add_user", {
                method: "POST",
                body: add_user_data
            })
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log(data);
                if(data == "_Y_") {
                    alert("新增成功");
                    this.change_ui("home");
                }
                else {
                    alert(data);
                }
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        get_user_list() {
            fetch("../../control/system.php?act=get_user_list")
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                console.log(this.user_now);
                this.data_user_list = data;
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        change_ui(target) {
            this.ui = target;
            if(target == "home") {
                if(this.user_now.identity != "root") {
                    this.data_add_user.department = this.user_now.department;
                }
                this.get_user_list();
            }
        }
    },
    created() {
        this.check_login();
        // this.get_user_list();
    }
});
app.$mount("#main")