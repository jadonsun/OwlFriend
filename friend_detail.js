'use strict';

var dappAddress = "n1wJXAD99AagTTNVW8WHmW7rZsGF7paRg3A";

var commit_comment_info = {};

var FriendDetailInfo = function() {
    this.cur_key_info = "";
    this.commit_type = "";
    this.b_haslike_this_person = false;
    this.b_is_register = false;
}
FriendDetailInfo.prototype = {

    init: function() {
        var self = this;

        this.cur_key_info =UrlParm.parm("key");

        this.req_friend_info();

        this.req_communication_info();

        this.add_communication_info();

        this.add_good_info();
        
        this.add_bad_info();

        this.add_like_to_friend();

    },

    req_friend_info: function() {
        var req_args = [];
        req_args.push(this.cur_key_info);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "get_personTxt_by_id",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },

    req_communication_info: function() {
        var req_args = [];
        req_args.push(this.cur_key_info);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_communication_list_by_personTxtId",
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
            if(!!e.data.data.txhash){
                if (self.commit_type == "good") {
                    window.setTimeout(self.refresh_good_num_after_click, 10000);
                    self.commit_type = "";
                } else if(self.commit_type == "bad") {
                    window.setTimeout(self.refresh_bad_num_after_click, 10000);
                    self.commit_type = "";
                } else if(self.commit_type == "comment") {
                    window.setTimeout(self.refresh_comment_after_add, 10000);
                    self.commit_type = "";
                } else if (self.commit_type == "like") {
                    window.setTimeout(self.refresh_like_num_after_click, 10000);
                    self.commit_type = "";
                }
                return;
            }

            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
                    if (obj.type == "get_personTxt_by_id") {
                        $("#page_loading").hide();
                        $("#page_detail").show();
                        if (obj.bIsRegister == 1) {
                            self.b_is_register = true;
                        } else {
                            self.b_is_register = false;
                        }
                        self.parse_friend_info(obj.personTxt, obj.isNeedPay, obj.bHasLikeThisPerson);
                    } else if(obj.type == "query_communication_list_by_personTxtId") {
                        self.parse_communication_info(obj.data);
                    }
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parse_friend_info: function(friend_info, is_need_pay, b_haslike_this_person) {
        var self = this;
        if (friend_info == undefined || friend_info == "") {
            return;
        }
        if (is_need_pay == "1") {
            // 付费查看
        } else {
            // 非付费查看
        }
        if (b_haslike_this_person == 1) {
            // 喜欢过
            self.b_haslike_this_person = true;
            $("#pick_me_btn").removeAttr("href");
            $("#pick_me_btn").removeAttr("onclick");
        } else {
            self.b_haslike_this_person = false;
            // 没有喜欢过
            // $("#pick_me_btn").attr("disabled");
        }
        $("#name").text("昵称 : " + friend_info.name);
        $("#publish_time").text("加入时间： " + friend_info.publishTime);
        $("#manifesto").text(friend_info.manifesto);
        $("#good_num").text(friend_info.goodNum);
        $("#bad_num").text(friend_info.badNum);
        $("#communication_num").text(friend_info.communicationNum);
        $("#belike_num").text(friend_info.beLiked);
        $("#hobby").text(friend_info.hobby);
        $("#personality").text(friend_info.personality);
        if (friend_info.sex == "1") {
            $("#sex").text("男");
        } else {
            $("#sex").text("女");
        }
        $("#height").text(friend_info.height);
        $("#weight").text(friend_info.weight);
        $("#birthday").text(friend_info.birthday);
        $("#location").text(friend_info.location);
        $("#weixin").text(friend_info.weixin);
        $("#phone").text(friend_info.phone);
        $("#qq").text(friend_info.qq);
        $("#head_img").attr("src", friend_info.headImg);

        
    },

    parse_communication_info: function(communication_list) {
        if (communication_list.length == 0) {
            // 没有内容
        } else {
            // 显示内容
            var communication_t = template(document.getElementById('comment_list_t').innerHTML);
            var communication_html = communication_t({list: communication_list});
            $("#comment_list").append(communication_html);
        }
    },

    add_communication_info: function() {
        var self = this;
        $("#sub_comment").click(function() {
            var comment_title = "1";
            var content = $("#comment_content").val();
            var comment_time = getNowFormatDate();
            if (content == "") {
                return;
            }
            var func = "add_communicationItem_to_list";
            var req_arg_item = {
                "content": content,
                "personTxtId": self.cur_key_info,
                "communicationName":comment_title,
                "communicationTime": comment_time,
            };

            commit_comment_info.content = content;
            commit_comment_info.communicationName = comment_title;
            commit_comment_info.communicationTime = comment_time;

            var req_args = [];
            req_args.push(req_arg_item);

            window.postMessage({
                "target": "contentscript",
                "data":{
                    "to" : dappAddress,
                    "value" : "0",
                    "contract" : {
                        "function" : func,
                        "args" : JSON.stringify(req_args),
                    }
                },
                "method": "neb_sendTransaction"
            }, "*");
            self.commit_type = "comment";
        });
    },

    refresh_comment_after_add: function() {
        // 插入评论
        var self = this;
        var communication_t = template(document.getElementById('comment_list_t').innerHTML);
        var temp_array = [];
        temp_array.push(commit_comment_info);
        var communication_html = communication_t({list: temp_array});
        $("#comment_list").prepend(communication_html);
        $("#comment_list").show();
        var comment_num = parseInt($("#communication_num").html());
        $("#communication_num").text(comment_num + 1);

    },

    add_good_info: function() {
        var self = this;
        $("#good").click(function() {
            // 提交
            var func = "add_goodItem_to_list";
            var req_arg_item = {
                "personTxtId": self.cur_key_info
            };
            var req_args = [];
            req_args.push(req_arg_item);

            window.postMessage({
                "target": "contentscript",
                "data":{
                    "to" : dappAddress,
                    "value" : "0",
                    "contract" : {
                        "function" : func,
                        "args" : JSON.stringify(req_args),
                    }
                },
                "method": "neb_sendTransaction"
            }, "*");
            self.commit_type = "good";
        });
    },

    refresh_good_num_after_click: function() {
        var self = this;
        var good_num = parseInt($("#good_num").html());
        $("#good_num").text(good_num + 1);
    },

    add_bad_info: function() {
        var self = this;
        $("#bad").click(function() {
            // 提交
            var func = "add_badItem_to_list";
            var req_arg_item = {
                "personTxtId": self.cur_key_info
            };
            var req_args = [];
            req_args.push(req_arg_item);

            window.postMessage({
                "target": "contentscript",
                "data":{
                    "to" : dappAddress,
                    "value" : "0",
                    "contract" : {
                        "function" : func,
                        "args" : JSON.stringify(req_args),
                    }
                },
                "method": "neb_sendTransaction"
            }, "*");
            self.commit_type = "bad";
        });
    },

    refresh_bad_num_after_click: function() {
        var self = this;
        var bad_num = parseInt($("#bad_num").html());
        $("#bad_num").text(bad_num + 1);
    },

    add_like_to_friend: function() {
        var self = this;
        $("#pick_me_btn").click(function() {
            // 提交
            if (self.b_haslike_this_person == true) {
                return;
            }
            // 判断是否注册过
            if (self.b_is_register == false) {
                self.showMessage("请先注册信息，才能喜欢TA哦~");
                return;
            }
            var func = "add_likeTa_to_list";
            var req_args = [];
            req_args.push(self.cur_key_info);

            window.postMessage({
                "target": "contentscript",
                "data":{
                    "to" : dappAddress,
                    "value" : "0",
                    "contract" : {
                        "function" : func,
                        "args" : JSON.stringify(req_args),
                    }
                },
                "method": "neb_sendTransaction"
            }, "*");
            self.commit_type = "like";
        });
    },

    refresh_like_num_after_click: function() {
        var self = this;
        var belike_num = parseInt($("#belike_num").html());
        $("#belike_num").text(belike_num + 1);
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

var friendDetailObj;

function checkNebpay() {
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("程序依赖于Extension wallet，请先安装后再使用，谢谢！")
    }
    // 环境ok，拉取数据
    friendDetailObj = new FriendDetailInfo();
    friendDetailObj.init();
    friendDetailObj.listenWindowMessage();
}

function initPage() {
    $("#page_detail").hide();
    $("#page_loading").show();
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    