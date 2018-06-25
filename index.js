'use strict';

var dappAddress = "n1omSaU3V5rLVpjLpKtb58B7vSuGwGoGC3R";

var page_num = 4;

var type_female = ["清纯可爱", "成熟大气", "秀外慧中", "楚楚动人", "温柔体贴",
                    "乐观开朗", "绝佳身材", "端庄大方", "惹人注目", "古灵精怪"];
var type_man = ["风流倜傥", "忠厚老实", "经济适用", "才高八斗", "幽默风趣",
                "低调靠谱", "富足有礼", "运动阳光", "成熟魄力", "文质彬彬"];

var FriendListInfo = function() {
    this.cur_page_female = 1;
    this.cur_page_man = 1;
    this.max_female = 0;
    this.max_man = 0;
    this.click_type_female = 0;
    this.click_type_man = 0;
}
FriendListInfo.prototype = {

    init: function() {
        var self = this;
        self.init_female_list();
        self.init_man_list();
        self.init_female_choose_page();
        self.init_man_choose_page();
        self.init_female_type();
        self.init_man_type();
    },

    init_female_list: function() {
        $("#female_page").hide();
        $("#loading_female").show();  
        this.cur_page_female = 1;
        this.max_female = 0;
        this.query_female_list(this.cur_page_female);
    },

    init_man_list: function() {
        $("#man_page").hide();
        $("#loading_man").show();
        this.cur_page_man = 1;
        this.max_man = 0;
        this.query_man_list(this.cur_page_man);
    },
        
    init_female_type: function() {
        var self = this;
        var type_list_t = template(document.getElementById('type_list_t').innerHTML);
        var female_type_html = type_list_t({list: type_female});
        $("#filter_female").append(female_type_html);
        // 设置选中态
        $("#filter_female").find("a").first().css("color", "#FF1493");
        $("#filter_female a").click(function() {
            var type_name = $(this).text();
            var b_click_again = false;
            for(var i = 0; i < type_female.length; i++) {
                if (type_female[i] == type_name) {
                    // 重新加载
                    if (self.click_type_female == i) {
                        b_click_again = true;
                    } else {
                        b_click_again = false;
                    }
                    self.click_type_female = i;
                    break;
                }
            }
            // 重新加载
            if (b_click_again == false) {
                $("#filter_female").find("a").css("color", "#fff");
                $(this).css("color", "#FF1493");
                $("#no-data-female").hide();
                $("#female_page").hide();
                $("#data-female").show();
                $("#loading_female").show();
                self.init_female_list();
            }
        });
    },

    init_man_type: function() {
        var self = this;
        var type_list_t = template(document.getElementById('type_list_t').innerHTML);
        var man_type_html = type_list_t({list: type_man});
        $("#filter_man").append(man_type_html);
        $("#filter_man").find("a").first().css("color", "#FF1493");
        $("#filter_man a").click(function() {
            var type_name = $(this).text();
            var b_click_again = false;
            for(var i = 0; i < type_man.length; i++) {
                if (type_man[i] == type_name) {
                    // 重新加载
                    if (self.click_type_man == i) {
                        b_click_again = true;
                    } else {
                        b_click_again = false;
                    }
                    self.click_type_man = i;
                    break;
                }
            }
            // 重新加载
            if (b_click_again == false) {
                $("#filter_man").find("a").css("color", "#fff");
                $(this).css("color", "#FF1493");
                $("#no-data-man").hide();
                $("#man_page").hide();
                $("#data-man").show();
                $("#loading_man").show();
                self.init_man_list();
            }
        });
    },

    init_female_choose_page: function() {
        var self = this;
        $("#next_female_btn").click(function() {
            if (self.cur_page_female == self.max_female) {
                return;
            }
            self.cur_page_female++;
            $("#female_page").hide();
            $("#loading_female").show();  
            self.query_female_list(self.cur_page_female);
        });
        $("#pre_female_btn").click(function() {
            if (self.cur_page_female == 1) {
                return;
            }
            self.cur_page_female--;
            $("#female_page").hide();
            $("#loading_female").show();  
            self.query_female_list(self.cur_page_female);
        });
    },

    init_man_choose_page: function() {
        var self = this;
        $("#next_man_btn").click(function() {
            if (self.cur_page_man == self.max_man) {
                return;
            }
            self.cur_page_man++;
            $("#man_page").hide();
            $("#loading_man").show();
                            
            self.query_man_list(self.cur_page_man);
        });
        $("#pre_man_btn").click(function() {
            if (self.cur_page_man == 1) {
                return;
            }
            self.cur_page_man--;
            $("#man_page").hide();
            $("#loading_man").show();
            self.query_female_list(self.cur_page_man);
        });
    },

    query_female_list: function(cur_page) {
        this.query_person_list_common(this.click_type_female, cur_page, "query_femalePerson_list_by_page");
    },

    query_man_list: function(cur_page) {
        this.query_person_list_common(this.click_type_man, cur_page, "query_malePerson_list_by_page");
    },

    query_person_list_common: function(tag_type, cur_page, func_name) {
        var req_args = [];
        req_args.push(tag_type);
        req_args.push(page_num);
        req_args.push(cur_page);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : func_name,
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");    
    },

    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
                    if (obj.type == "query_femalePerson_list_by_page") {
                        self.max_female = obj.maxPage;
                        if (obj.maxPage == self.cur_page_female) {
                            // 设置next按钮不可点击
                        } else {
                        }
                        if (self.cur_page_female == 1) {
                        } else {
                        }
                        $("#loading_female").hide();
                        $("#female_page").show();
                        if (obj.success == false) {
                            $("#data-female").hide();
                            $("#no-data-female").show();
                        } else {
                            $("#no-data-female").hide();
                            $("#data-female").show();  
                        }
                        self.parse_female_list(obj.data);
                    } else if (obj.type == "query_malePerson_list_by_page") {
                        self.max_man = obj.maxPage;
                        if (obj.maxPage == self.cur_page_man) {
                            // 设置next按钮不可点击
                        } else {
                        }
                        if (self.cur_page_man == 1) {
                        } else {
                        }
                        $("#loading_man").hide();
                        $("#man_page").show();
                        if (obj.success == false) {
                            $("#data-man").hide();
                            $("#no-data-man").show();
                        } else {
                            $("#no-data-man").hide();
                            $("#data-man").show();  
                        }
                        self.parse_man_list(obj.data);
                    }
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parse_female_list: function(female_list) {
        if (female_list.length == 0) {
            $("#female_list").hide();
        } else {
            $("#female_list").empty().show();
            // 显示内容
            var female_list_t = template(document.getElementById('person_list_t').innerHTML);
            var female_list_html = female_list_t({list: female_list});
            $("#female_list").append(female_list_html);
        }
    },

    parse_man_list: function(man_list) {
        if (man_list.length == 0) {
            $("#man_list").hide();
        } else {
            $("#man_list").empty().show();
            // 显示内容
            var man_list_t = template(document.getElementById('person_list_t').innerHTML);
            var man_list_html = man_list_t({list: man_list});
            $("#man_list").append(man_list_html);
        }
    },
    
    showMessage:function (message){
		layer.open({
			content: message,
			skin: 'msg',
			time: 2
		});
    },
}
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
    month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
    return currentdate;
}

var friendListObj;

function checkNebpay() {
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("程序依赖于Extension wallet，请先安装后再使用，谢谢！")
    }
    // 环境ok，拉取数据
    friendListObj = new FriendListInfo();
    friendListObj.init();
    friendListObj.listenWindowMessage();
}

function initPage() {
    $("#no-data-man").hide();
    $("#no-data-female").hide();
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    