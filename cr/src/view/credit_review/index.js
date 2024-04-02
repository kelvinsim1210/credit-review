var app = new Vue({
    data: {
        ui: 'home',
        show: false,
        menu: {
            system: "用戶管理",
            course_rule: "規則管理",
            course_list: "課程管理",
            credit_review: "學分審核"
        },
        menu_now: "credit_review",
        user_now: {
            id: '',
            name: "",
            department: "",
            identity: ''
        },
        credit_review_data: {
            department: '',
            year: '',
            course_records: ''
        },
        all_department: [],
        result_credit_review: {},
        cr_general: {
            all_num: 0,
            人文_num: 0,
            社會_num: 0,
            自然_num: 0,
            特色通識_num: 0,
            re_num: [],
            re_all_course: [0,0,0,0],
        },
        elective_course: 0,
        共同必修_course: 0,
        free_course: 0,
        no_共同必修: []
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
        get_all_department() {
            fetch("../../control/credit_review.php?act=get_all_department")
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log("all_department: ", JSON.parse(data));
                this.all_department = JSON.parse(data);
                // console.log(data);
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        reset_data() {
            // 初始化
            this.cr_general.all_num = 0;
            this.cr_general.人文_num = 0;
            this.cr_general.社會_num = 0;
            this.cr_general.自然_num = 0;
            this.cr_general.特色通識_num = 0;
            this.cr_general.re_num = [];
            this.cr_general.re_all_course = [0,0,0,0];

            this.elective_course = 0;
            this.共同必修_course = 0;
            this.free_course = 0;
            this.no_共同必修 = [
                "大一體育（上）",
                "大一體育（下）",
                "特色運動",
                "國文（上）",
                "國文（下）",
                "大一英文（上）",
                "大一英文（下）",
                "大二英文",
                "社會服務學習(上)",
                "社會服務學習(下)",
            ];
            this.show = false;
        },
        get_credit_review() {
            this.reset_data();

            const cr_data = new FormData();
            cr_data.append("credit_review_data", JSON.stringify(this.credit_review_data));
            fetch("../../control/credit_review.php?act=get_credit_review", {
                method: "POST",
                body: cr_data
            })
            .then(res => {
                return res.text();
            })
            .then(data => {
                console.log("result: ", JSON.parse(data));
                this.result_credit_review = JSON.parse(data);
                // console.log("cr: ", data);
                // for(var x in this.result_credit_review.general) {
                //     for(var y in this.result_credit_review.general[x]) {
                //         console.log(x);
                //         this.cr_general.all_num += this.result_credit_review.general[x][y].length;
                //         this.cr_general[x+"_num"] += this.result_credit_review.general[x][y].length;
                //     }
                // }
                // console.log("?y?");
                console.log("cr_re", this.cr_general.re_num);
                this.result_credit_review.共同必修.sort();
                this.make_cr_general_table();
            })
            .catch(error => {
                console.log("fetch error: ", error);
            })
        },
        make_cr_general_table() {
            for(var x in this.result_credit_review.general) {
                for(var y in this.result_credit_review.general[x]) {
                    // console.log(this.result_credit_review.general[x]);
                    this.cr_general.all_num += this.result_credit_review.general[x][y].length;
                    this.cr_general[x+"_num"] += this.result_credit_review.general[x][y].length;
                    if(y=='特色通識-國際連接（東南亞）') {
                        this.cr_general.re_num[0] = this.result_credit_review.general[x][y][0].length!=0 ? this.result_credit_review.general[x][y].length:0;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[0] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='特色通識-淨零永續（綠概念）') {
                        this.cr_general.re_num[1] = this.result_credit_review.general[x][y][0].length!=0 ? this.result_credit_review.general[x][y].length:0;
                        for(var z in this.result_credit_review.general[x][y]) {
                            // console.log(parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]));
                            this.cr_general.re_all_course[0] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='特色通識-社會創新（在地實踐）') {
                        this.cr_general.re_num[2] = this.result_credit_review.general[x][y][0].length!=0 ? this.result_credit_review.general[x][y].length:0;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[0] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='人文-文學與藝術') {
                        this.cr_general.re_num[3] = this.result_credit_review.general[x][y][0].length!=0 ? this.result_credit_review.general[x][y].length:0;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[1] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='人文-歷史哲學與文化') {
                        this.cr_general.re_num[4] = this.result_credit_review.general[x][y][0].length==0 ? 0:this.result_credit_review.general[x][y].length;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[1] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='社會-社經與管理') {
                        this.cr_general.re_num[5] = this.result_credit_review.general[x][y][0].length==0 ? 0:this.result_credit_review.general[x][y].length;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[2] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='社會-法政與教育') {
                        this.cr_general.re_num[6] = this.result_credit_review.general[x][y][0].length==0 ? 0:this.result_credit_review.general[x][y].length;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[2] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='自然-生命與科學') {
                        this.cr_general.re_num[7] = this.result_credit_review.general[x][y][0].length==0 ? 0:this.result_credit_review.general[x][y].length;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[3] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    if(y=='自然-工程與科技') {
                        this.cr_general.re_num[8] = this.result_credit_review.general[x][y][0].length==0 ? 0:this.result_credit_review.general[x][y].length;
                        for(var z in this.result_credit_review.general[x][y]) {
                            this.cr_general.re_all_course[3] += this.result_credit_review.general[x][y][z].length!=0 ? parseFloat(this.result_credit_review.general[x][y][z][1].split('學分')[0]):0;
                        }
                    }
                    // console.log(this.cr_general.re_all_course[0]+3);
                }
            }
            // 選修總學分（電機）
            for(var x in this.result_credit_review.elective) {
                this.elective_course += parseFloat(this.result_credit_review.elective[x][1].split("學分")[0]);
            }
            // 共同必修學分
            for(var x in this.result_credit_review.共同必修) {
                this.共同必修_course += parseFloat(this.result_credit_review.共同必修[x][1].split("學分")[0]);
            }
            // var target = this.$refs.cr_general_table;
            // for(var x=0; x<this.cr_general.all_num; x++) {
            //     target.innerHTML += "<tr><td>q</td></tr>";
            // }
            // 自由學分
            for(var x in this.result_credit_review.free) {
                this.free_course += parseFloat(this.result_credit_review.free[x][1].split("學分")[0]);
            }
            let 體育 = 2;
            for(var x in this.result_credit_review.共同必修) {
                if(this.result_credit_review.共同必修[x][4].includes("大一體育") 
                && this.result_credit_review.共同必修[x][4].includes("上")) {this.no_共同必修[0] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("大一體育") 
                && this.result_credit_review.共同必修[x][4].includes("下")) {this.no_共同必修[1] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("體育")) {體育 -= 1;}
                else if((this.result_credit_review.共同必修[x][4].includes("國文") 
                || this.result_credit_review.共同必修[x][4].includes("僑外生華語文")
                || this.result_credit_review.共同必修[x][4].includes("中文思維與表達")) 
                && this.result_credit_review.共同必修[x][4].includes("上")) {this.no_共同必修[3] = 0;}
                else if((this.result_credit_review.共同必修[x][4].includes("國文") 
                || this.result_credit_review.共同必修[x][4].includes("僑外生華語文")
                || this.result_credit_review.共同必修[x][4].includes("中文思維與表達")) 
                && this.result_credit_review.共同必修[x][4].includes("下")) {this.no_共同必修[4] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("英文") 
                && this.result_credit_review.共同必修[x][4].includes("上")) {this.no_共同必修[5] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("英文") 
                && this.result_credit_review.共同必修[x][4].includes("下")) {this.no_共同必修[6] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("英文二")) {this.no_共同必修[7] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("服務學習") 
                && this.result_credit_review.共同必修[x][4].includes("上")) {this.no_共同必修[8] = 0;}
                else if(this.result_credit_review.共同必修[x][4].includes("服務學習") 
                && this.result_credit_review.共同必修[x][4].includes("下")) {this.no_共同必修[9] = 0;}
            }
            if(體育<=0) {this.no_共同必修[2] = 0;}
            else {this.no_共同必修[2] = "特色運動*" + 體育;}
            this.show = true;
        },
        change_ui(target) {
            this.ui = target;
        },
        // 通識表格
        use1(target) {
            console.log(this.cr_general[target]);
            if(this.cr_general[target] == true) {
                this.cr_general[target] = false;
                return true;
            }
            return false;
        }
    },
    mounted() {
        
    },
    created() {
        this.check_login();
        this.change_ui("home");
        this.get_all_department();
    }
});
app.$mount("#main")