'use strict';

var dappAddress = "n1wJXAD99AagTTNVW8WHmW7rZsGF7paRg3A";

var type_female = ["清纯可爱", "成熟大气", "秀外慧中", "楚楚动人", "温柔体贴",
                    "乐观开朗", "绝佳身材", "端庄大方", "惹人注目", "古灵精怪"];
var type_man = ["风流倜傥", "忠厚老实", "经济适用", "才高八斗", "幽默风趣",
                "低调靠谱", "富足有礼", "运动阳光", "成熟魄力", "文质彬彬"];

var ResisterFriendInfo = function() {

}
ResisterFriendInfo.prototype = {

    init: function() {
        var self = this;
        self.init_select_sex();
        self.init_select_pay();
        self.register_info();
        self.req_person_info();
    },

    init_select_pay: function() {
        // $("input[name='is_pay']").click(function() {
        //     var value = $(this).val();
        //     if (value == "1") {
        //         $("#pay_num").show();
        //         $("#pay_container").show();
        //     } else {
        //         $("#pay_container").hide();
        //     }
        // });
    },

    init_select_sex: function() {
        $("input[name='sex']").click(function() {
            var value = $(this).val();
            $("#label").val(null).trigger("change");
            $("#label").empty();
            if (value == "1") {
                // 男
                $('#label').select2(
                    {
                        multiple: true,
                        data: type_man,
                        allowClear: true
                    }
                );
            } else {
                // 女
                $('#label').select2(
                    {
                        multiple: true,
                        data: type_female,
                        allowClear: true
                    }
                );
            }
        });
    },

    register_info: function() {
        var self = this;
        $("#submit_form").click(function() {
            console.log("hehe");
            var name = $("#name").val(),
                sex = $("input[name='sex']:checked").val(),
                birthday = $("#datepicker").val(),
                height = $("#height").val(),
                weight = $("#weight").val(),
                city = $("#city").val(),
                weixin_num = $("#weixin_num").val(),
                phone_num = $("#phone_num").val(),
                qq_num = $("#qq_num").val(),
                gexing = $("#gexing").val(),
                love_thing = $("#love_thing").val(),
                xuanyan = $("#xuanyan").val(),
                label = $("#label").select2('data'),
                // is_pay = $("input[name='is_pay']:checked").val(),
                pay_num = $("#pay_num").val(),
                face_image = $("#face_image").attr("src");
            
            if (name == "") {
                $("#name").focus();
                self.showMessage("请填写昵称");
            }

            if (birthday == "") {
                $("#datepicker").focus();
                self.showMessage("请选择出生年月");
            }

            if (height == "") {
                $("#height").focus();
                self.showMessage("请填写身高");
            }

            if (weight == "") {
                $("#weight").focus();
                self.showMessage("请填写体重");
            }

            if (city == "") {
                $("#city").focus();
                self.showMessage("请填写所在地");
            }

            if (weixin_num == "") {
                $("#weixin_num").focus();
                self.showMessage("请填写微信号");
            }
                
            if (phone_num == "") {
                $("#phone_num").focus();
                self.showMessage("请填写手机号");
            }

            if (qq_num == "") {
                $("#qq_num").focus();
                self.showMessage("请填写QQ号");
            }

            if (gexing == "") {
                $("#gexing").focus();
                self.showMessage("请填写个性");
            }

            if (love_thing == "") {
                $("#love_thing").focus();
                self.showMessage("请填写兴趣爱好");
            }

            if (xuanyan == "") {
                $("#xuanyan").focus();
                self.showMessage("请填写交友宣言");
            }

            if (label == "") {
                $("#label").focus();
                self.showMessage("请填写标签");
            }

            // if (is_pay == "is") {
            //     // 判断付费金额
            //     if (pay_num == "") {
            //         $("#pay_num").focus();
            //         self.showMessage("请填写付费金额");
            //     }
            // }

            if (face_image != "" && face_image != "images/upimg.png") {
                var file_src=$("#myfile").attr("src");
                 var length = face_image.replace(/[^\u0000-\u00ff]/g,"aaa").length;
                 console.log(length);
                 if (length > 112400) {
                     $("#myfile").focus();
                     self.showMessage('抱歉，暂时不支持大图片，请选择小图片(base64编码大小需小于128K)"');
                     // 弹框
                     return;
                 }
            }
            if (face_image == "images/upimg.png") {
                $("#myfile").focus();
                self.showMessage('请上传您的靓照');
                // 弹框
                return;
            }
            var label_id = "";
            var cur_type_list = [];
            if (sex == "1") {
                cur_type_list = type_man;
            } else {
                cur_type_list = type_female;
            }
            for(var i = 0; i < label.length; i++)
            {
                for(var j = 0; j < cur_type_list.length; j++) {
                    if (label[i].text == cur_type_list[j]) {
                        label_id += j;
                        label_id += ",";
                        break;
                    }
                }
            }
            var label_id_new = label_id.substring(0, label_id.length - 1);
            // 数据提交
            var func = "add_personTxt_to_list";
            var req_arg_item = {
                "name": name,
                "sex": sex,
                "height": height,
                "headImg": face_image, 
                "weight": weight,
                "birthday" : birthday,
                "location" : city,
                "weixin": weixin_num,
                "phone": phone_num,
                "qq": qq_num,
                "personality": gexing,
                "hobby": love_thing,
                "manifesto": xuanyan,
                "typeLabel": label_id_new,
                "publishTime": getNowFormatDate(),
                "canPay": "0",
                "payNum": pay_num
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

            });
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
                    if (obj.type == "get_myPersonTxt") {
                        $("#loading_page").hide();
                        $("#register_page").show();
                        if (obj.success == true) {
                            self.parse_person_info(obj.personTxt);
                        }
                        
                    }
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    req_person_info: function() {
        var req_args = [];
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "get_myPersonTxt",
                    "args" : JSON.stringify(req_args),
                }
            },
            "method": "neb_call"
        }, "*");
    },

    parse_person_info: function(person_info) {
        if (person_info != "") {
            $("#name").val(person_info.name);
            var sex_value = person_info.sex;
            if (sex_value == "1") {
                $("input[name='sex']:radio[value='1']").attr('checked','true');
                $("input[name='sex']:radio[value='0']").attr('checked','false');
            } else {
                $("input[name='sex']:radio[value='1']").attr('checked','false');
                $("input[name='sex']:radio[value='0']").attr('checked','true');
            }
            $("input[name='sex']:radio[value='1']").attr('disabled','true');
            $("input[name='sex']:radio[value='0']").attr('disabled','true');

            $("#datepicker").val(person_info.birthday);
            $("#height").val(person_info.height);

            $("#weight").val(person_info.weight);
            $("#city").val(person_info.location);
            $("#weixin_num").val(person_info.weixin);
            $("#phone_num").val(person_info.phone);

            $("#qq_num").val(person_info.qq);
            $("#gexing").val(person_info.personality);
            $("#love_thing").text(person_info.hobby);
            $("#xuanyan").text(person_info.manifesto);

            var label_id_array = person_info.typeLabel.split(",");
            // 设置显示
            var show_type = [];
            var show_value = [];
            if (sex_value == "1") {
                show_type = type_man;
            } else {
                show_type = type_female;
            }
            for(var i = 0; i < label_id_array.length; i++) {
                show_value.push(show_type[parseInt(label_id_array[i])]);
            }
            $("#label").empty();
            $('#label').select2(
                {
                    multiple: true,
                    data: show_type,
                    allowClear: true
                }
            ).val(show_value).trigger('change');
            
            $("#label").prop("disabled", true);//不可用

            // var is_pay = person_info.canPay;
            // if (is_pay == "1") {
            //     $("input[name='is_pay']:radio[value='1']").attr('checked','true');
            //     $("input[name='is_pay']:radio[value='0']").attr('checked','false');
            //     $("#pay_num").show();
            //     $("#pay_num").text(person_info.payNum);
            // } else {
            //     $("input[name='is_pay']:radio[value='1']").attr('checked','false');
            //     $("input[name='is_pay']:radio[value='0']").attr('checked','true');
            //     $("#pay_num").hide();
            // }
            $("#face_image").attr("src", person_info.headImg);
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

var registerObj;

function checkNebpay() {
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("程序依赖于Extension wallet，请先安装后再使用，谢谢！")
    }
    // 环境ok，拉取数据
    registerObj = new ResisterFriendInfo();
    registerObj.init();
    registerObj.listenWindowMessage();
}

function initPage() {
    $(document).ready(function() {
		$('#label').select2(
            {
                multiple: true,
                data: type_man,
                allowClear: true
            }
        );
    });
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    