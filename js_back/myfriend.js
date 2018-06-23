"use strict";

var PersonTxt = function(text) {
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from，一个from只能创建一个个人信息
        this.name = obj.name;//个人昵称
        this.headImg = obj.headImg;//头像图片
        this.sex = obj.sex;//性别，0：女，1：男
        this.height = obj.height;//身高
        this.weight = obj.weight;//体重
        this.birthday = obj.birthday;//生日
        this.location = obj.location;//所在地
        this.weixin = obj.weixin;//微信
        this.phone = obj.phone;//手机
        this.qq = obj.qq;//qq
        this.personality = obj.personality;//个性
        this.hobby = obj.hobby;//爱好
        this.manifesto = obj.manifesto;//交友宣言
        this.typeLabel = obj.typeLabel;//所属分类标签，多个以英文逗号分隔
        this.publishTime = obj.publishTime;//发布时间
        this.goodNum = obj.goodNum;//点赞总数
        this.badNum = obj.badNum;//点踩总数
        this.beLiked = obj.beLiked;//被喜欢总数
        this.communicationNum = obj.communicationNum;//交流数量
        this.canPay = obj.canPay;//是否付费查看个人联系方式（微信、qq、手机），0:不能，1：能
        this.payNum = obj.payNum;//付费金额
        this.from = obj.from;//个人唯一标识
	} else {
	    this.id = "";
        this.name = "";
        this.headImg = "";
        this.sex = "";
        this.height = "";
        this.weight = "";
        this.birthday = "";
        this.location = "";
        this.weixin = "";
        this.phone = "";
        this.qq = "";
        this.personality = "";
        this.hobby = "";
        this.manifesto = "";
        this.typeLabel = "";
        this.publishTime =  "";
        this.goodNum = 0;
        this.badNum = 0;
        this.beLiked = 0;
        this.communicationNum = 0;
        this.canPay = "0";
        this.payNum = 0;
        this.from = "";
	}
};
var CommunicationItem = function(text) {//交流信息
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from+'_'+时间戳
        this.personTxtId = obj.personTxtId;
        this.content = obj.content;
        this.communicationName = obj.communicationName;
        this.communicationTime = obj.communicationTime;
        this.from = obj.from;
	} else {
        this.id = "";
        this.personTxtId = "";
        this.content = "";
        this.communicationName = "";
        this.communicationTime = "";
        this.from = "";
	}
};
var GoodItem = function(text) {//点赞记录信息
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from+'_'+时间戳
        this.personTxtId = obj.personTxtId;
        this.recordTime = obj.recordTime;
        this.from = obj.from;
	} else {
        this.id = "";
        this.personTxtId = "";
        this.recordTime = "";
        this.from = "";
	}
};
var BadItem = function(text) {//点踩记录信息
	if (text) {
        var obj = JSON.parse(text);
        this.id = obj.id;//id=from+'_'+时间戳
        this.personTxtId = obj.personTxtId;
        this.recordTime = obj.recordTime;
        this.from = obj.from;
	} else {
        this.id = "";
        this.personTxtId = "";
        this.recordTime = "";
        this.from = "";
	}
};

PersonTxt.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
CommunicationItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
GoodItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
BadItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var MyFriendDapp = function() {
    // 1. 先创建GoldSunStorage对象（用于存储数据）
    // 2. 定义数据结构，
    // 女性个人信息列表
    LocalContractStorage.defineMapProperty(this, "femalePerson_list", {
        parse: function (text) {
            return new PersonTxt(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    // 男性个人信息列表
    LocalContractStorage.defineMapProperty(this, "malePerson_list", {
        parse: function (text) {
            return new PersonTxt(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    // 定义一个参数，记录女性/男性个人信息的长度
    LocalContractStorage.defineProperty(this, "femalePerson_list_size");
    LocalContractStorage.defineProperty(this, "malePerson_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "femalePerson_list_array");
    LocalContractStorage.defineMapProperty(this, "malePerson_list_array");
    // 定义一个存储string的list，记录每个女性分类标签下个人信息id，多个个人信息id以英文逗号分隔
    LocalContractStorage.defineMapProperty(this, "femaleTypeLabel_person_list");
    // 定义一个存储string的list，记录每个男性分类标签下个人信息id，多个个人信息id以英文逗号分隔
    LocalContractStorage.defineMapProperty(this, "maleTypeLabel_person_list");
    //交流列表
    LocalContractStorage.defineMapProperty(this, "communicationItem_list", {
        parse: function (text) {
            return new CommunicationItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    // 定义一个存储string的list,记录个人的交流信息id，多个交流信息id以英文逗号分隔
    LocalContractStorage.defineMapProperty(this, "person_communication_list");
    //点赞列表
    LocalContractStorage.defineMapProperty(this, "goodItem_list", {
        parse: function (text) {
            return new GoodItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    //点踩列表
    LocalContractStorage.defineMapProperty(this, "badItem_list", {
        parse: function (text) {
            return new BadItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    //定义一个存储string的list，记录你喜欢的人的个人信息id，多个个人信息id以英文逗号分隔
    LocalContractStorage.defineMapProperty(this, "youLike_person_list");
    //定义一个存储string的list，记录喜欢你的人的个人信息id，多个个人信息id以英文逗号分隔
    LocalContractStorage.defineMapProperty(this, "likeYou_person_list");
};
MyFriendDapp.prototype = {
    // 初始化方法，在使用ApiSample之前，务必要调用一次(而且只能调用一次)，所有的初始化逻辑都放到这里
    init: function() {
        if (this.femalePerson_list_size == null) {
            this.femalePerson_list_size = 0;
        }
        if (this.malePerson_list_size == null) {
            this.malePerson_list_size = 0;
        }
    },
    // 添加一个段子到list中
    add_personTxt_to_list: function(text) {
        var addResult = {
            success : false,
            message : "",
            type : "add_personTxt_to_list"
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
        obj.id = obj.from;//id=from
        //个人信息
        obj.name = obj.name.trim();//个人昵称
        obj.headImg = obj.headImg.trim();//头像图片
        obj.sex = obj.sex.trim();//性别
        obj.height = obj.height.trim();//身高
        obj.weight = obj.weight.trim();//体重
        obj.birthday = obj.birthday.trim();//生日
        obj.location = obj.location.trim();//所在地
        obj.weixin = obj.weixin.trim();//微信
        obj.phone = obj.phone.trim();//手机
        obj.qq = obj.qq.trim();//qq
        obj.personality = obj.personality.trim();//个性
        obj.hobby = obj.hobby.trim();//爱好
        obj.manifesto = obj.manifesto.trim();//交友宣言
        obj.typeLabel = obj.typeLabel.trim();//所属分类标签，多个以英文逗号分隔
        obj.publishTime = obj.publishTime.trim();//发布时间
        obj.canPay = obj.canPay.trim();//是否付费查看个人联系方式（微信、qq、手机），0:不能，1：能
        obj.payNum = obj.payNum.trim();//付费金额
        
        if(obj.typeLabel===""||obj.name===""|| obj.headImg===""||obj.sex===""||obj.location===""||(obj.weixin===""&&obj.phone===""&&obj.qq==="")||obj.personality===""||obj.hobby===""||obj.manifesto===""){
            addResult.success = false;
            throw new Error("分类标签、昵称、性别、头像图片、所在地、个性、爱好、交友宣言均为必填；微信、手机和QQ请至少填写一个。");
            return addResult;
        }
        if (obj.name.length > 64 || obj.height.length > 64 || obj.weight.length > 64 || obj.birthday.length > 64 || obj.location.length > 64
            || obj.weixin.length > 64 || obj.phone.length > 64 || obj.qq.length > 64){
            addResult.success = false;
            throw new Error("昵称、身高、体重、生日、所在地、微信、手机、QQ最长为64个字。");
            return addResult;
        }
        if(obj.sex != "0"){
            obj.sex = "1";

        }
        if(obj.canPay != "1"){
            obj.canPay = "0";
            obj.payNum = 0;
        }
        var rst = this._query_personTxt_by_id(obj.id);
        var personTxt;
        var isNew = false;
        if(rst.success){//修改个人信息，性别和所属分类标签不可以修改
            personTxt = rst.personTxt;
            personTxt.name = obj.name;//个人昵称
            personTxt.headImg = obj.headImg;//头像图片
            personTxt.height = obj.height;//身高
            personTxt.weight = obj.weight;//体重
            personTxt.birthday = obj.birthday;//生日
            personTxt.location = obj.location;//所在地
            personTxt.weixin = obj.weixin;//微信
            personTxt.phone = obj.phone;//手机
            personTxt.qq = obj.qq;//qq
            personTxt.personality = obj.personality;//个性
            personTxt.hobby = obj.hobby;//爱好
            personTxt.manifesto = obj.manifesto;//交友宣言
            personTxt.canPay = obj.canPay;//是否付费查看个人联系方式（微信、qq、手机），0:不能，1：能
            personTxt.payNum = obj.payNum;//付费金额
        }else{//新增个人信息
            isNew = true;
            personTxt = new PersonTxt();
            personTxt.from = obj.from;
            personTxt.id = obj.id;
            //个人信息
            personTxt.name = obj.name;//个人昵称
            personTxt.headImg = obj.headImg;//头像图片
            personTxt.sex = obj.sex;//性别
            personTxt.height = obj.height;//身高
            personTxt.weight = obj.weight;//体重
            personTxt.birthday = obj.birthday;//生日
            personTxt.location = obj.location;//所在地
            personTxt.weixin = obj.weixin;//微信
            personTxt.phone = obj.phone;//手机
            personTxt.qq = obj.qq;//qq
            personTxt.personality = obj.personality;//个性
            personTxt.hobby = obj.hobby;//爱好
            personTxt.manifesto = obj.manifesto;//交友宣言
            personTxt.typeLabel = obj.typeLabel;//所属分类标签，多个以英文逗号分隔
            personTxt.publishTime = obj.publishTime;//发布时间
            personTxt.goodNum = 0;//点赞总数
            personTxt.badNum = 0;//点踩总数
            personTxt.beLiked = 0;//被喜欢总数
            personTxt.communicationNum = 0;//交流数量
            personTxt.canPay = obj.canPay;//是否付费查看个人联系方式（微信、qq、手机），0:不能，1：能
            personTxt.payNum = obj.payNum;//付费金额
        }
        if(personTxt.sex == "0"){//女性
            if(isNew){//新增个人信息
                var index = this.femalePerson_list_size;
                this.femalePerson_list_array.put(index,personTxt.id)
                this.femalePerson_list_size +=1;
                //添加分类标签
                var typeLabel = personTxt.typeLabel;
                var typeLabelArr = typeLabel.split(",");
                for(var i=0;i<typeLabelArr.length;i++){
                    var typeLabelPerson = this.femaleTypeLabel_person_list.get(typeLabelArr[i]);
                    if(typeLabelPerson){
                        typeLabelPerson = typeLabelPerson + "," + personTxt.id;
                    }else{
                        typeLabelPerson = personTxt.id;
                    }
                    this.femaleTypeLabel_person_list.put(typeLabelArr[i],typeLabelPerson);
                }
            }
            this.femalePerson_list.put(personTxt.id,personTxt);
        }else{//男性
            if(isNew){//新增个人信息
                var index = this.malePerson_list_size;
                this.malePerson_list_array.put(index,personTxt.id)
                this.malePerson_list_size +=1;
                //添加分类标签
                var typeLabel = personTxt.typeLabel;
                var typeLabelArr = typeLabel.split(",");
                for(var i=0;i<typeLabelArr.length;i++){
                    var typeLabelPerson = this.maleTypeLabel_person_list.get(typeLabelArr[i]);
                    if(typeLabelPerson){
                        typeLabelPerson = typeLabelPerson + "," + personTxt.id;
                    }else{
                        typeLabelPerson = personTxt.id;
                    }
                    this.maleTypeLabel_person_list.put(typeLabelArr[i],typeLabelPerson);
                }
            }
            this.malePerson_list.put(personTxt.id,personTxt);
        }
        addResult.success = true;
        addResult.message = "You successfully add or update a personTxt!";
        return addResult;
    },
    getFemalePerson_list_size : function(){
        var result = {
            type: "getFemalePerson_list_size",
            num: this.femalePerson_list_size
        };
        return result;
    },
    getMalePerson_list_size : function(){
        var result = {
            type: "getMalePerson_list_size",
            num: this.malePerson_list_size
        };
        return result;
    },
    getPerson_list_size : function(){
        var result = {
            type: "getPerson_list_size",
            num: this.femalePerson_list_size + this.malePerson_list_size
        };
        return result;
    },
    // 根据个人id（from）从个人信息list中查找个人信息
    _query_personTxt_by_id: function(key) {
        var result = {
            success : false,
            type: "_query_personTxt_by_id",
            personTxt : ""
        };
        key = key.trim();
        if ( key === "" ) {
            result.success = false;
            result.personTxt = "";
            return result;
        }
        var personTxt = this.femalePerson_list.get(key);
        if(personTxt){
            result.success = true;
            result.personTxt = personTxt;
        }else{
            personTxt = this.malePerson_list.get(key);
            if(personTxt){
                result.success = true;
                result.personTxt = personTxt;
            }else{
                result.success = false;
                result.personTxt = "";
            }
        }
        return result;
    },
    //查找根据id查询个人信息，判断联系方式是否可见
    get_personTxt_by_id : function(key){
        var result = {
            success : false,
            type: "get_personTxt_by_id",
            personTxt : "",
            isNeedPay : "0", //0:不需要支付查看联系信息，1：需要支付查看联系信息
            bHasLikeThisPerson: 0,  // 是否喜欢过这个人
            bIsRegister: 0,
        };
        var from = Blockchain.transaction.from;
        // 先判断当前用户是否注册了
        var rst_register = this._query_personTxt_by_id(from);
        if (rst_register.success) {
            result.bIsRegister = 1;
        } else {
            result.bIsRegister = 0;
        }
        var rst = this._query_personTxt_by_id(key);
        if(rst.success){
            //判断是否是当前操作人自己的个人信息
            var personTxt = rst.personTxt;
            result.success = true;
            if(from==personTxt.from){//是自己的
                result.isNeedPay = "0";
                result.bHasLikeThisPerson = 1;
            }else{
                //判断是否彼此喜欢
                var youLike_person = this.youLike_person_list.get(from);
                var likeYou_person = this.likeYou_person_list.get(from);

                if(youLike_person && youLike_person.indexOf(personTxt.id)!=-1 ){
                    result.bHasLikeThisPerson = 1;
                } else {
                    result.bHasLikeThisPerson = 0;
                }

                if(youLike_person && likeYou_person
                    && youLike_person.indexOf(personTxt.id)!=-1 
                    && likeYou_person.indexOf(personTxt.id)!=-1){
                    result.isNeedPay = "0";
                }else{
                    if(personTxt.canPay=="1"){
                        result.isNeedPay = "1";
                        personTxt.weixin = "还未彼此喜欢，不可查看。或者您可付费查看。";
                        personTxt.phone = "还未彼此喜欢，不可查看。或者您可付费查看。";
                        personTxt.qq = "还未彼此喜欢，不可查看。或者您可付费查看。";
                    }else{
                        result.isNeedPay = "0";
                        personTxt.weixin = "还未彼此喜欢，不可查看。";
                        personTxt.phone = "还未彼此喜欢，不可查看。";
                        personTxt.qq = "还未彼此喜欢，不可查看。";
                    }
                }
            }
            result.personTxt = personTxt;
        }else{
            result.success = false;
        }
        return result;    
    },

    get_myPersonTxt: function() {
        var from = Blockchain.transaction.from;
        var rst = this._query_personTxt_by_id(from);
        rst.type = "get_myPersonTxt";
        return rst;
    },
    //查找根据id查询个人信息，判断联系方式是否可见
    get_person_contactWay_by_id : function(key){
        var result = {
            success : false,
            type: "get_person_contactWay_by_id",
            personTxt : "",
        };
        var rst = this._query_personTxt_by_id(key);
        if(rst.success){
            //判断是否是当前操作人自己的个人信息
            result.success = true;
            result.personTxt = rst.personTxt;
        }else{
            result.success = false;
        }
        return result;    
    },
    //添加一个个人的一条交流信息到list中
    add_communicationItem_to_list: function(text) {
        var addResult = {
            success : false,
            message : "",
            type : "add_communicationItem_to_list"
        };
        var obj = text;
        obj.personTxtId = obj.personTxtId.trim();
        var result = this._query_personTxt_by_id(obj.personTxtId);
        if(result.success){
            obj.from = Blockchain.transaction.from;
            var timestamp = new Date().getTime();//当前时间戳，精确到毫秒，如：1280977330748
            obj.id = obj.from + "_" + timestamp;//id=from+'_'+时间戳
            obj.content = obj.content.trim();
            obj.communicationName = obj.communicationName.trim();
            obj.communicationTime = obj.communicationTime.trim();
            if(obj.content===""|| obj.communicationName===""){
                addResult.success = false;
                throw new Error("empty content / communicationName.");
                return addResult;
            }
            if (obj.communicationName.length > 64 || obj.content.length > 256){
                addResult.success = false;
                throw new Error("content / communicationName  exceed limit length. content'length is 256. communicationName's length is 64.");
                return addResult;
            }
            var communicationItem = new CommunicationItem();
            communicationItem.id = obj.id;
            communicationItem.personTxtId = obj.personTxtId;
            communicationItem.content = obj.content;
            communicationItem.communicationName = obj.communicationName;
            communicationItem.communicationTime = obj.communicationTime;
            communicationItem.from = obj.from;
            this.communicationItem_list.put(communicationItem.id, communicationItem);
            //将个人的交流数量+1
            var personTxt = result.personTxt;
            var communicationNum = personTxt.communicationNum;
            personTxt.communicationNum = communicationNum + 1;
            if(personTxt.sex == "0"){//女
                this.femalePerson_list.put(personTxt.id, personTxt);
            }else{//男
                this.malePerson_list.put(personTxt.id, personTxt);    
            }
            //记录个人的交流信息id
            var person_communication = this.person_communication_list.get(personTxt.id);
            if(person_communication){
                person_communication = person_communication + "," + communicationItem.id;
            }else{
                person_communication = communicationItem.id;
            }
            this.person_communication_list.put(personTxt.id,person_communication);
            addResult.success = true;
            addResult.message = "You successfully add ths person's communicationTxt!";
            return addResult;
        }else{
            addResult.success = false;
            throw new Error("Can not find the person!");
            return addResult;
        }
    },
    //根据个人Id查询该个人的交流列表(按插入顺序倒序)
    query_communication_list_by_personTxtId : function(personTxtId){
        var result = {
            success : false,
            type : "query_communication_list_by_personTxtId",
            message : "",
            data : []
        };
        personTxtId = personTxtId.trim();
        if ( personTxtId === "" ) {
            result.success = false;
            result.message = "empty personTxtId";
            return result;
        }
        var person_communication = this.person_communication_list.get(personTxtId);
        if(person_communication){
            var idsArr = person_communication.split(",");
            var communicationItem;
            for(var i=idsArr.length-1;i>=0;i--){
                communicationItem = this.communicationItem_list.get(idsArr[i]);
                if(communicationItem&&communicationItem.personTxtId==personTxtId){
                    result.data.push(communicationItem);
                }
            }
            if(result.data.length>0){
                result.success = true;
            }else{
                result.success = false;
                result.message = "no data";
            }
        }else{
            result.success = false;
            result.message = "no data";
        }
        return result;
    },
    //添加一个个人的一条点赞记录到list中
    add_goodItem_to_list: function(text) {
        var addResult = {
            success : false,
            message : "",
            type : "add_goodItem_to_list"
        };
        var obj = text;
        obj.personTxtId = obj.personTxtId.trim();
        var result = this._query_personTxt_by_id(obj.personTxtId);
        if(result.success){
            obj.from = Blockchain.transaction.from;
            var timestamp = new Date().getTime();//当前时间戳，精确到毫秒，如：1280977330748
            obj.id = obj.from + "_" + timestamp;//id=from+'_'+时间戳
            obj.recordTime = new Date();
            var goodItem = new GoodItem();
            goodItem.id = obj.id;
            goodItem.personTxtId = obj.personTxtId;
            goodItem.recordTime = obj.recordTime;
            goodItem.from = obj.from;
            this.goodItem_list.put(goodItem.id, goodItem);
            //将个人的点赞数量+1
            var personTxt = result.personTxt;
            var goodNum = personTxt.goodNum;
            personTxt.goodNum = goodNum + 1;
            if(personTxt.sex == "0"){//女
                this.femalePerson_list.put(personTxt.id, personTxt);
            }else{//男
                this.malePerson_list.put(personTxt.id, personTxt);    
            }
            addResult.success = true;
            addResult.message = "You successfully add ths person's Zan!";
            return addResult;
        }else{
            addResult.success = false;
            addResult.message = "Can not find the person!";
            throw new Error("Can not find the person!");
            return addResult;
        }
    },
    //添加一个个人的一条点踩记录到list中
    add_badItem_to_list: function(text) {
        var addResult = {
            success : false,
            message : "",
            type : "add_badItem_to_list"
        };
        var obj = text;
        obj.personTxtId = obj.personTxtId.trim();
        var result = this._query_personTxt_by_id(obj.personTxtId);
        if(result.success){
            obj.from = Blockchain.transaction.from;
            var timestamp = new Date().getTime();//当前时间戳，精确到毫秒，如：1280977330748
            obj.id = obj.from + "_" + timestamp;//id=from+'_'+时间戳
            obj.recordTime = new Date();
            var badItem = new BadItem();
            badItem.id = obj.id;
            badItem.personTxtId = obj.personTxtId;
            badItem.recordTime = obj.recordTime;
            badItem.from = obj.from;
            this.badItem_list.put(badItem.id, badItem);
            //将个人的点踩数量+1
            var personTxt = result.personTxt;
            var badNum = personTxt.badNum;
            personTxt.badNum = badNum + 1;
            if(personTxt.sex == "0"){//女
                this.femalePerson_list.put(personTxt.id, personTxt);
            }else{//男
                this.malePerson_list.put(personTxt.id, personTxt);    
            }
            addResult.success = true;
            addResult.message = "You successfully add ths person's Cai!";
            return addResult;
        }else{
            addResult.success = false;
            addResult.message = "Can not find the person!";
            throw new Error("Can not find the person!");
            return addResult;
        }
    },
    //添加喜欢Ta的信息到列表，personTxtId：喜欢Ta的个人信息id
    add_likeTa_to_list : function(personTxtId){
        var result = {
            success : false,
            type: "add_likeTa_to_list",
        };
        personTxtId = personTxtId.trim();
        var from = Blockchain.transaction.from;//当前操作人
        //判断当前操作人是否创建了个人信息
        var hasMe = this._query_personTxt_by_id(from);
        if(hasMe.success){
            var youLike_person = this.youLike_person_list.get(from);
            if(youLike_person&&youLike_person.indexOf(personTxtId)!=-1){//已经添加到你喜欢的人的列表，不用重复添加
                result.success = true;
            }else{
                var rst = this._query_personTxt_by_id(personTxtId);
                if(rst.success){
                    //你喜欢的人的列表添加此人
                    if(youLike_person){
                        youLike_person = youLike_person + "," + personTxtId;
                    }else{
                        youLike_person = personTxtId;
                    }
                    this.youLike_person_list.put(from,youLike_person);
                    //此人的喜欢你的列表添加上当前操作人
                    var likeYou_person = this.likeYou_person_list.get(personTxtId);
                    if(likeYou_person){
                        likeYou_person = likeYou_person + "," + from;
                    }else{
                        likeYou_person = from;
                    }
                    this.likeYou_person_list.put(personTxtId,likeYou_person);
                    result.success = true;
                }else{
                    result.success = false;
                    throw new Error("Can not find the person!");
                }
            }
        }else{
            result.success = false;
            throw new Error("You have to create your personTxt first!");
        }
        return result;
    },
    /**按插入顺序倒序分页查询当前操作人喜欢的人的列表
     * pagesize：每页大小
     * page：页号，第一页为1
    */
    query_youLike_list_by_page : function(pagesize,page){
        var from = Blockchain.transaction.from;//当前操作人
        var youLike_person = this.youLike_person_list.get(from);
        var result = this._query_likePerson_list_by_page(youLike_person,pagesize,page,"0");
        result["type"] = "query_youLike_list_by_page";
        return result;
    },

    /**
     * 查询我喜欢的列表数量
     */
    query_youLike_list_size: function() {
        var from = Blockchain.transaction.from;//当前操作人
        var youLike_person = this.youLike_person_list.get(from);
        var result = this._query_like_list_size(youLike_person);
        result["type"] = "query_youLike_list_size";
        return result;
    },


    /**按插入顺序倒序分页查询当前操作人彼此喜欢的人的列表
     * pagesize：每页大小
     * page：页号，第一页为1
    */
    query_likeEachOther_list_by_page : function(pagesize,page){
        var from = Blockchain.transaction.from;//当前操作人
        var youLike_person = this.youLike_person_list.get(from);
        var likeYou_person = this.likeYou_person_list.get(from);
		var likeEachOther = "";
		if(youLike_person&&likeYou_person){
			var youLikeIdsArr = youLike_person.split(",");
			var likeYouIdsArr = likeYou_person.split(",");
			for(var i=0;i<youLikeIdsArr.length;i++){
				for(var j=0;j<likeYouIdsArr.length;j++){
					if(youLikeIdsArr[i]==likeYouIdsArr[j]){
						if(likeEachOther){
							likeEachOther = likeEachOther + "," + youLikeIdsArr[i];
						}else{
							likeEachOther = youLikeIdsArr[i];
						}
						break;
					}
				}
			}
			
		}
        var result = this._query_likePerson_list_by_page(likeEachOther,pagesize,page,"1");
        result["type"] = "query_likeEachOther_list_by_page";
        return result;
    },

    /**
     * 查询互相喜欢的列表数量
     */
    query_likeEachOther_list_size: function() {
        var from = Blockchain.transaction.from;//当前操作人
        var youLike_person = this.youLike_person_list.get(from);
        var likeYou_person = this.likeYou_person_list.get(from);
		var likeEachOther = "";
		if(youLike_person&&likeYou_person){
			var youLikeIdsArr = youLike_person.split(",");
			var likeYouIdsArr = likeYou_person.split(",");
			for(var i=0;i<youLikeIdsArr.length;i++){
				for(var j=0;j<likeYouIdsArr.length;j++){
					if(youLikeIdsArr[i]==likeYouIdsArr[j]){
						if(likeEachOther){
							likeEachOther = likeEachOther + "," + youLikeIdsArr[i];
						}else{
							likeEachOther = youLikeIdsArr[i];
						}
						break;
					}
				}
			}
			
        }
        
        var result = this._query_like_list_size(likeEachOther);
        result["type"] = "query_likeEachOther_list_size";
        return result;
    },
    /**
    * 按插入顺序倒序分页查询你喜欢的人或彼此喜欢的个人列表
    * person_ids：要查询的个人id，多个以英文逗号分隔
    * pagesize：每页大小
    * page：页号，第一页为1
    * isYouLike：0-你喜欢的列表，1-彼此喜欢的列表
   */
    _query_likePerson_list_by_page : function(person_ids,pagesize,page,isYouLike){
        var result = {
            success : false,
            message : "",
            maxPage : 1,
            page : 1,
            pagesize : 1,
            data : []
        };
        var list_size = 0;
        var idsArr;
        if(person_ids){
            idsArr = person_ids.split(",");
            list_size = idsArr.length;
        }
        if(list_size <= 0){
            result.success = false;
            result.message = "no data";
            return result;
        }
        pagesize = parseInt(pagesize);
        page = parseInt(page);
        if(pagesize < 1){
            result.success = false;
            result.message = "pagesize is not valid";
            return result;
        }
        if(pagesize > list_size){
            pagesize = list_size;
        }
        if(page < 1){
            page = 1;
        }
        var maxPage = Math.ceil(list_size/pagesize);
        if(page > maxPage){
            result.success = false;
            result.message = "page is not valid";
            return result;
        }
        result.maxPage = maxPage;
        result.page = page;
        result.pagesize = pagesize;
        var offset = list_size-1-(page-1)*pagesize;
        var number = offset-pagesize+1;
        if(number < 0){
          number = 0;
        }
        var key;
        var personTxt;
        for(var i=offset;i>=number;i--){
            key = idsArr[i];
            personTxt = this.femalePerson_list.get(key);
            if(!personTxt){
                personTxt = this.malePerson_list.get(key);
            }
            if(personTxt){
                if(isYouLike == "0"){
                    if(personTxt.canPay=="1"){
                        personTxt.weixin = "暂不可查看。或者您可付费查看。";
                        personTxt.phone = "暂不可查看。或者您可付费查看。";
                        personTxt.qq = "暂不可查看。或者您可付费查看。";
                    }else{
                        personTxt.weixin = "暂不可查看。";
                        personTxt.phone = "暂不可查看。";
                        personTxt.qq = "暂不可查看。";
                    }
                }
                result.data.push(personTxt);
            }
        }
        result.success = true;
        return result;
    },

    _query_like_list_size: function(person_ids) {
        var result = {
            success : false,
            list_size: 0,
        };
        var list_size = 0;
        var idsArr;
        if(person_ids){
            idsArr = person_ids.split(",");
            list_size = idsArr.length;
        }
        if(list_size <= 0){
            result.success = false;
            result.list_size = 0;
            return result;
        }
        result.list_size = list_size;
        result.success = true;
        return result;
    },
    /**按插入顺序倒序分页查询某一个分类标签下的女性列表
     * typeLabel ：某个分类
     * pagesize：每页大小
     * page：页号，第一页为1
    */
    query_femalePerson_list_by_page : function(typeLabel,pagesize,page){
        var result = this._query_person_list_by_typeLabel_by_page(typeLabel,this.femaleTypeLabel_person_list,this.femalePerson_list,pagesize,page);
        result["type"] = "query_femalePerson_list_by_page";
        return result;
    },
    /**按插入顺序倒序分页查询某一个分类标签下的男性列表
     * typeLabel ：某个分类
     * pagesize：每页大小
     * page：页号，第一页为1
    */
    query_malePerson_list_by_page : function(typeLabel,pagesize,page){
        var result = this._query_person_list_by_typeLabel_by_page(typeLabel,this.maleTypeLabel_person_list,this.malePerson_list,pagesize,page);
        result["type"] = "query_malePerson_list_by_page";
        return result;
    },
    /**
     * 按插入顺序倒序分页查询某一个分类标签下的个人列表
     * typeLabel ：某个分类
     * typeLabel_person_list:每个分类标签下个人信息id，多个个人信息id以英文逗号分隔
     * person_list:个人信息列表
     * pagesize：每页大小
     * page：页号，第一页为1
    */
    _query_person_list_by_typeLabel_by_page : function(typeLabel,typeLabel_person_list,person_list,pagesize,page){
        var result = {
            success : false,
            message : "",
            maxPage : 1,
            page : 1,
            pagesize : 1,
            data : []
        };
        var typeLabel_person = typeLabel_person_list.get(typeLabel);
        var list_size = 0;
        var idsArr;
        if(typeLabel_person){
            idsArr = typeLabel_person.split(",");
            list_size = idsArr.length;
        }
        if(list_size <= 0){
            result.success = false;
            result.message = "no data";
            return result;
        }
        pagesize = parseInt(pagesize);
        page = parseInt(page);
        if(pagesize < 1){
            result.success = false;
            result.message = "pagesize is not valid";
            return result;
        }
        if(pagesize > list_size){
            pagesize = list_size;
        }
        if(page < 1){
            page = 1;
        }
        var maxPage = Math.ceil(list_size/pagesize);
        if(page > maxPage){
            result.success = false;
            result.message = "page is not valid";
            return result;
        }
        result.maxPage = maxPage;
        result.page = page;
        result.pagesize = pagesize;
        var offset = list_size-1-(page-1)*pagesize;
        var number = offset-pagesize+1;
        if(number < 0){
          number = 0;
        }
        var key;
        var personTxt;
        for(var i=offset;i>=number;i--){
            key = idsArr[i];
            personTxt = person_list.get(key);
            if(personTxt){
                if(personTxt.canPay=="1"){
                    personTxt.weixin = "暂不可查看。或者您可付费查看。";
                    personTxt.phone = "暂不可查看。或者您可付费查看。";
                    personTxt.qq = "暂不可查看。或者您可付费查看。";
                }else{
                    personTxt.weixin = "暂不可查看。";
                    personTxt.phone = "暂不可查看。";
                    personTxt.qq = "暂不可查看。";
                }
                result.data.push(personTxt);
            }
        }
        result.success = true;
        return result;
    }
};

// window.MyFriendDapp = MyFriendDapp;
module.exports = MyFriendDapp;