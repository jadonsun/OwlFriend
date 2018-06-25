'use strict';

var dappAddress = "n1omSaU3V5rLVpjLpKtb58B7vSuGwGoGC3R";

var page_num = 4;

var LoveEachOtherListInfo = function() {
}
LoveEachOtherListInfo.prototype = {

    init: function() {
        var self = this;
        self.query_love_eachother_size();
    },

    query_love_eachother_size: function() {
        var req_args = [];
        var func_name = "query_likeEachOther_list_size";
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

    query_like_eachother_list_by_page: function(cur_page) {
        var req_args = [];
        var func_name = "query_likeEachOther_list_by_page";
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
                    if (obj.type == "query_likeEachOther_list_by_page") {
                        $("#loading_page").hide();
                        $("#page_detail").show();
                        $("#love_list_loading").hide();
                        $("#love_eachother_list").show();

                        if (obj.success == false) {
                            $("#love_eachother_list").hide();
                            $("#no_data_love_eachother").show();
                            
                        } else {
                            $("#no_data_love_eachother").hide();
                            $("#love_eachother_list").show();
                        }

                        self.parse_like_eachother_list(obj.data);
                    } else if(obj.type == "query_likeEachOther_list_size") {
                        if (obj.success == false) {
                            $("#love_list_loading").hide();
                            $("#love_eachother_list").hide();
                            $("#no_data_love_eachother").show();
                            
                        } else {
                            $("#no_data_love_eachother").hide();
                            $("#love_eachother_list").show();
                        }
                        self.parse_eachother_like_num(obj.list_size);
                    }
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parse_like_eachother_list: function(youlike_list) {
        if (youlike_list.length == 0) {
            // 没有数据
        } else {
            $("#love_eachother_list").empty().show();
            // 显示内容
            var love_eachother_list_t = template(document.getElementById('person_list_t').innerHTML);
            var love_eachother_list_html = love_eachother_list_t({list: youlike_list});
            $("#love_eachother_list").append(love_eachother_list_html);
        }
    },

    parse_eachother_like_num: function(total_num) {
        if (total_num == 0) {
            $("#loading_page").hide();
            $("#page_detail").show();
            return;
        }
        paginationObj.init(total_num);
        paginationObj.showPagination(); 
    },

    showMessage:function (message){
		layer.open({
			content: message,
			skin: 'msg',
			time: 2
		});
	},
}

var Pagination = function() {
    this.list_index = [];
    this.page_size = page_num;
    this.showGoInput = true;
    this.showGoButton = true;
};

Pagination.prototype = {
    // 初始化
    init: function(totalNum) {
        this.list_index=[];
        for(var i = 1; i <= totalNum; i++) {
            this.list_index.push(i);
        }
    },

    // 显示分页插件
    showPagination: function() {
        var self = this;
        $('#pagination').pagination({
            dataSource: this.list_index,
            pageSize: self.page_size,
            showGoInput: true,
            showGoButton: true,
            callback: function(data, pagination) {
                var click_page_num = pagination.pageNumber;
                var list_offset = data[0];
                self.onChoosePageEvent(click_page_num, list_offset);
            }
        });
    },

    // 选择页事件
    onChoosePageEvent: function(click_page_num, list_offset) {
        $("#love_eachother_list").hide();
        $("#love_list_loading").show();
        loveEachOtherListObj.query_like_eachother_list_by_page(click_page_num);
    },
}

var paginationObj = new Pagination();

var loveEachOtherListObj;

function checkNebpay() {
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("程序依赖于Extension wallet，请先安装后再使用，谢谢！")
    }
    // 环境ok，拉取数据
    loveEachOtherListObj = new LoveEachOtherListInfo();
    loveEachOtherListObj.init();
    loveEachOtherListObj.listenWindowMessage();
}

function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        $("#no_data_love_eachother").hide();
        console.log("web page loaded...");
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    