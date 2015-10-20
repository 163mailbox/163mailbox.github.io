$(document).ready(function() {
			var location_url = window.location.href;
			if (location_url.indexOf(".aspx") != -1) {
				changeImage();
			} else {
				$('#customer_account,#validateCode').focus(function() {
					if ($.isEmptyObject2($("#validateImage").attr("src"))) {
						changeImage();
					}
				});
			}
			$("#changeImage").click(changeImage);
			$("#validateImage").click(changeImage);
			autoUrs();

			$("#dof").validate({
				focusInvalid : false,
				onsubmit : false,
				// debug:true,
				showErrors : function(errorMap, errorList) {
					if (errorList.length > 0) {
						$(errorList[0].element).errorFocus();
					}

				}
			});

			$("#loading").ajaxStart(function() {
				$(this).show();
			}).ajaxComplete(function() {
				$(this).hide();
			});

			$(".ts").hide();
			$("input").focus(
					function() {
						$(".ts").hide();
						$(this).parent().find(".ts:first").css(
								"background-color", "#FFF9C9").show();
						$(this).parent().parent().find(".ts:first").css(
								"background-color", "#FFF9C9").show();

						$(this).attr("autocomplete", "off");
					});
			$("textarea").focus(
					function() {
						$(".ts").hide();
						$(this).parent().find(".ts:first").css(
								"background-color", "#FFF9C9").show();

					});

			$("select").focus(
					function() {
						$(".ts").hide();
						$(this).parent().find(".ts:first").css(
								"background-color", "#FFF9C9").show();

					});
			
			$("#prdtxt").keyup(function(){
				var myProduct = $('#workBill_gameProduct option');
				myProduct.eq(myProduct.length - 2).attr('value' , $(this).val());
			});
		});
// 判断密码强度
var PasswordStrength = {
	Level : [ 12, 11, 10 ],
	LevelValue : [ 30, 20, 0 ],// 强度值
	Factor : [ 1, 2, 5 ],// 字符加数,分别为字母，数字，其它
	KindFactor : [ 0, 0, 10, 20 ],// 密码含几种组成的加数
	Regex : [ /[a-zA-Z]/g, /\d/g, /[^a-zA-Z\d]/g ]
// 字符正则数字正则其它正则
}
PasswordStrength.StrengthValue = function(pwd) {
	var strengthValue = 0;
	var ComposedKind = 0;
	for ( var i = 0; i < this.Regex.length; i++) {
		var chars = pwd.match(this.Regex[i]);
		if (chars != null) {
			strengthValue += chars.length * this.Factor[i];
			ComposedKind++;
		}
	}
	strengthValue += this.KindFactor[ComposedKind];
	return strengthValue;
}
PasswordStrength.StrengthLevel = function(pwd) {
	var sChar = pwd.charAt(0);
	var sChars = '';
	for ( var ii = 0; ii < pwd.length; ii++) {
		sChars += sChar;
	}
	if (pwd == sChars) {
		return 10;
	}
	var value = this.StrengthValue(pwd);
	for ( var i = 0; i < this.LevelValue.length; i++) {
		if (value >= this.LevelValue[i])
			return this.Level[i];
	}
}

function fileRemove(path, workBillClass) {
	$.getJSON("ts_upload_remove.aspx", {
		'workBillClass' : workBillClass,
		'path' : path
	}, function(data) {
		if (data.result != 'Success') {
			switch (data.result) {
			case "Fail":
				$("#uploadMessage").html("网络错误,请稍候再试");
				break;
			}

		} else {
			if (data.list.length == 3) {
				$("#uploadArea").hide();
				$("#uploadMessage").html("每次最多上传3个证件，如需更换请先移除。");
			} else {
				$("#uploadArea").show();
				$("#uploadMessage").html("继续点击“浏览”，上传下一张扫描件。");

			}
		}
		fileListView(data, workBillClass);
	});
}

function fileUpload2014(workBillClass, uploadid){
	$.ajaxFileUpload({
		url : 'ts_upload.aspx',
		secureuri : false,
		fileElementId : uploadid,
		dataType : 'json',
		data : {
			'workBillClass' : workBillClass,
			'account' : $("#customer_account").val(),
			'uploadid': uploadid.replace("upload200","")
		},
		error : function(data, status, e) {
			$("#uploadMessage").html(
				"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
		},
		success : function(data, status) {
			if ($.isEmptyObject2(data.result)) {
				$("#uploadMessage").html(
					"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
				return;
			}

			if (data.result != 'Success') {
				switch (data.result) {
				case "Upload_Content_Type_No_Allow":
					$("#uploadMessage").html(
						"上传失败：必须为jpg/jpeg/gif/png格式图片<br /><a href=nts/help/picture.htm target=_blank>修改图片格式方法详细说明>>>");
					break;
				case "Upload_Content_Length_0":
					$("#uploadMessage").html("上传失败,文件大小为零。");
					break;
				case "Upload_Content_Length_Exceed":
					$("#uploadMessage").html(
						"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
					break;
				case "Upload_Count_Over":
					$("#uploadMessage").html("上传文件过多");
					break;
				case "Fail":
					$("#uploadMessage").html("网络错误,请稍候再试");
					break;
				}

			} else {
				if (data.list.length == 3) {
					$("#uploadArea").hide();
					$("#uploadMessage").html("每次最多上传3个证件，如需更换请先移除。");
				} else {
					$("#uploadArea").show();
					$("#uploadMessage").html("继续点击“浏览”，上传下一张扫描件。");
				}
			}
			fileListView2014(data, workBillClass);
		}
	});
	return false;
}
function fileListView2014(data, workBillClass) {
	var i=1;
	var defaultImg = ["nts/images/xyimg01.jpg", "nts/images/xyimg02.jpg", "nts/images/xyimg03.jpg"];
	for(imgp in defaultImg){
		$("#iphoto"+i).attr("src", defaultImg[imgp]);
		$("#rdai"+i).html("");
		i++;
	}

	$.each(data.list,function(a, path){
		var src = "ts_upload_view.aspx?path="+path+"&workBillClass="+workBillClass;
		var plength = path.length;
		i = path.substring(plength-5, plength-4);
		$("#iphoto"+i).attr("src", src);
		$("#rdai"+i).html(
			"<a href=javascript:; onclick=fileReview('"
			+ path
			+ "','"
			+ workBillClass
			+ "')>预览</a>&nbsp;<a href=javascript:; onclick=fileRemove2014('"
			+ path + "','" + workBillClass
			+ "')>移除</a></td>");
	});
}
function fileRemove2014(path, workBillClass) {
	$.getJSON("ts_upload_remove.aspx", {
		'workBillClass' : workBillClass,
		'path' : path
	}, function(data) {
		if (data.result != 'Success') {
			switch (data.result) {
			case "Fail":
				$("#uploadMessage").html("网络错误,请稍候再试");
				break;
			}

		} else {
			if (data.list.length == 3) {
				$("#uploadArea").hide();
				$("#uploadMessage").html("每次最多上传3个证件，如需更换请先移除。");
			} else {
				$("#uploadArea").show();
				$("#uploadMessage").html("继续点击“浏览”，上传下一张扫描件。");

			}
		}
		fileListView2014(data, workBillClass);
	});
}
function fileUpload(workBillClass) {

	$
			.ajaxFileUpload({
				url : 'ts_upload.aspx',
				secureuri : false,
				fileElementId : 'upload',
				dataType : 'json',
				data : {
					'workBillClass' : workBillClass,
					'account' : $("#customer_account").val()
				},
				error : function(data, status, e) {
					$("#uploadMessage")
							.html(
									"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
				},
				success : function(data, status) {

					if ($.isEmptyObject2(data.result)) {

						$("#uploadMessage")
								.html(
										"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
						return;
					}

					if (data.result != 'Success') {
						switch (data.result) {
						case "Upload_Content_Type_No_Allow":
							$("#uploadMessage")
									.html(
											"上传失败：必须为jpg/jpeg/gif/png格式图片<br /><a href=nts/help/picture.htm target=_blank>修改图片格式方法详细说明>>>");
							break;
						case "Upload_Content_Length_0":
							$("#uploadMessage").html("上传失败,文件大小为零。");
							break;
						case "Upload_Content_Length_Exceed":
							$("#uploadMessage")
									.html(
											"图片过大，请不要超过1M<br /><a href=nts/help/picture.htm target=_blank>修改图片大小方法详细说明>>>");
							break;
						case "Upload_Count_Over":
							$("#uploadMessage").html("上传文件过多");
							break;
						case "Fail":
							$("#uploadMessage").html("网络错误,请稍候再试");
							break;
						}

					} else {
						if (data.list.length == 3) {
							$("#uploadArea").hide();
							$("#uploadMessage").html("每次最多上传3个证件，如需更换请先移除。");
						} else {
							$("#uploadArea").show();
							$("#uploadMessage").html("继续点击“浏览”，上传下一张扫描件。");
						}
					}

					// $("#ran").val(data.ran);

					fileListView(data, workBillClass);

				}
			});

	return false;
}
function fileListView(data, workBillClass) {

	$("#uploadFileCount").val(data.list.length);
	$("#uploadPreview").html("");

	$
			.each(
					data.list,
					function(a, path) {

						$("#uploadPreview")
								.append(
										"<td><img src=ts_upload_view.aspx?path="
												+ path
												+ "&workBillClass="
												+ workBillClass
												+ "><br /><a href=javascript:; onclick=fileReview('"
												+ path
												+ "','"
												+ workBillClass
												+ "')>预览</a>&nbsp;<a href=javascript:; onclick=fileRemove('"
												+ path + "','" + workBillClass
												+ "')>移除</a></td>");
					});
}

function fileReview(path, workBillClass) {

	if (!$.isEmptyObject2(path)) {
		$("#showUploadReview img").attr(
				"src",
				"ts_upload_view.aspx?path=" + path + "&workBillClass="
						+ workBillClass);
		$("#showUploadReview").dialog({
			width : 800,
			height : 600,
			modal : true
		});
	}

}
function autoUrs() {
	var params = {};
	params["mailList"] = [ "163.com", "qq.com", "sina.com", "vip.163.com", "vip.126.com", "188.com", "126.com" ];
	if (!$.isEmptyObject2($("#customer_account").attr("id"))) {
		AutoUrs.bind("customer_account", params);
	}

}
function changeImage() {
	$("#validateImage").attr("src", "validateImage?r=" + Math.random());

}
function sendSmsCode(system) {
	var mobile = $("#customer_mobile").val();

	if ($.isMobile(mobile) || mobile.indexOf("Encrypt") != -1) {
		$.get("ts_smsValidateCode.aspx", {
			action : "send",
			mobile : mobile,
			system : system,
			time : Math.random()
		}, function(data) {
			data = $.trim(data);
			if (data == 'overSendCount') {
				alert("此手机号获取的验证码太多，无法下发验证码。");
				$("#sendSmsCodeResult").html(
						"<font color=red>此手机号获取的验证码太多，无法下发验证码。</font>");
			} else if (data == 'success') {
				alert("系统已下发验证码到您的手机，请注意查收，30分钟内有效。");
				for ( var i = 0; i <= 60; i++) {
					window.setTimeout("countDown(" + i + ")", i * 1000);
				}
			}
		});
	} else {
		alert("号码格式错误，请正确输入11位的手机号！");
		//$("#customer_mobile").focus();
	}
	return false;
}

function countDown(num) {
	if (num == 60) {
		$("#sendSmsCodeButton").html("免费获取验证码").attr("disabled", false);
	} else {
		secs = 60 - num;
		$("#sendSmsCodeButton").html("请注意查收手机的短信验证码，可在 " + secs + " 秒后重新获取")
				.attr("disabled", true);
	}
}
function hasSmsCode(system) {
	var mobile = $("#customer_mobile").val();
	var code = $("#sms_code").val();
	var correct = false;
	$.ajax({
		url : "ts_smsValidateCode.aspx",
		cache : false,
		async : false,
		data : {
			action : "validate",
			code : code,
			mobile : mobile,
			system : system,
			time : Math.random()
		},
		success : function(data) {
			data = $.trim(data);
			if (data == 'success') {
				correct = true;
			}
		}
	});
	if (!correct) {
		$("#sms_code").errorFocus();
	}

	return correct;
}
function hasSmsMO() {
	var mobile = $("#customer_mobile").val();
	var correct = false;
	$.ajax({
		url : "ts_smsValidateMO.aspx",
		cache : false,
		async : false,
		dataType:"html",
		data : {
			mobile : mobile,
			time : Math.random()
		},
		success : function(data) {
			data = $.trim(data);
			if (data == 'success') {
				correct = true;
			}
		}
	});
	if (!correct) {
		// $("#sms_code").errorFocus();
	}

	return correct;
}
/**
 * 显示密码内容
 * 
 * @param a
 * @param b
 */
function showPassword(checked, a, b) {
	if (!checked) {
		c = a;
		a = b;
		b = c;
	}
	var a = $("#" + a);
	var b = $("#" + b);
	var name = a.attr("name");
	var value = a.attr("value");
	b.attr("value", value);
	b.attr("name", name);
	b.show();

	a.attr("value", "");
	a.attr("name", "");
	a.hide();
}

/**
 * 
 * @param o1
 * @param o2
 */
function showLength(o1, o2) {
	$("#" + o2).html(
			"<font style='color:gray;font-size:12px;padding-left:3px;'>提示：已输入"
					+ $("#" + o1).val().length + "个字符</font>");
}

var tokenList = {
	"大话2" : [ "倩女幽魂", "天工开物", "彩翼仙子", "番天印", "超级金柳露", "鹊桥仙", "版载千秋", "烽火连城",
			"独角蜥蜴", "喷火牛", "麒麟", "冥轿", "超级飞鱼", "超级海龟", "超级毒蛇", "紫霞仙子", "春三十娘",
			"大话精灵", "方寸山", "五庄观" ],
	"梦幻西游" : [ "法宝传奇", "坐骑天下", "门派闯关", "科举大赛", "英雄大会", "剑侠客", "骨精灵", "横扫千军",
			"梦幻精灵", "龙卷雨击", "房都尉", "金银锁", "梦幻知道", "慈航普度", "弱点击破", "超级泡泡",
			"超级大熊猫", "芙蓉仙子", "吸血鬼", "大力金刚" ],
	"飞飞" : [ "太古草原", "紫枫雪地", "恶魔森林", "小花精", "暴牙狼", "多多鸟", "发条娃娃", "绿翼飞兽",
			"赤炎之龙", "爱情使者", "兑换小精灵", "巧克力棒", "圣心巨盾", "暗影之戒", "智慧水晶", "治愈之链",
			"任意翅膀", "光明圣骑", "万鬼之王", "不死战神" ],
	"天下3" : [ "梦源宝藏", " 幽都魔影", "五行盘", "魍魉", "天机", "荒火", "四灵之器", "丹青神笔", "幽谷深处",
			"黄泉幽境", "荒火圣殿", "太古铜门", "猫眼石矿", "寒溟气钻", "幽谷鬼狱", "黄泉幽境", "外锁妖塔",
			"溪木之终", "青纱帐", "苦禅之心" ],
	"大话3" : [ "蟠桃盛会", "宝象国", "狐不归", "慕容", "潇湘", "天花乱坠", "天罗地网", "含情脉脉", "黑风突刺",
			"普渡众生", "倾城之恋", "乌鸡国", "超级金柳露", "决战平顶山", "五色神牛", "骷髅法船", "莲舞轻步",
			"无悔无怨", "太乙生风", "普渡众生" ],
	"战歌" : [ "天下无双", "浪淘沙", "颜如玉", "天使泡泡", "齐天小胜", "五福童子", "比武大会", "天降灵猴",
			"幽冥地府", "普陀山", "玄铁神石", "护心镜", "月光宝盒", "水帘盘丝洞", "兜率宫镇妖", "补天神石",
			"缚灵珠", "冷面师太", "张天师", "乌斯藏抢亲" ],
	"大唐无双" : [ "侠隐岛", "无名庄", "天煞盟", " 屠狼洞", " 程咬金", "李元霸", "宇文成都", "狮子吼",
			"生命燃烧", "琴心三叠", " 平地惊雷", "气贯长虹", " 捕风捉影", "冰霜雪雨", "白屏寨", "夜香阁",
			"游魂堡", "十方导师", "隋军余党", "凤鸣山" ],
	"倩女幽魂" : [ "兰若寺", "吉星高照", "吴山石", "星火燎原", "百发百中", "鹰击长空", "狡兔三窟", "未雨绸缪",
			"踏雪卧冰", "逍遥游", "天雨涤凡", "雷动九天", "引露餐霞", "益气安魂", "换巢鸾凤", "风雨如晦",
			"菩提众生", "沧海桑田", "轮转司", "宁采臣" ],
	"精灵传说" : [ "新叶城", "烈焰戒指", "天赋果", "武器大师", "水晶法杖", "精英勋章", "风险地", "爱心地",
			"动力塔", "自然使", "魔法师", "异能者", "机械师", "风信子", "希望港湾", "竖琴镇", "回头堡",
			"骑士团长", "加林灯塔", "时空门包" ],
	"武魂" : [ "蝶花谷", "玄冰门", "影月山庄", "七煞教", "蜀山剑派", "少林寺", "烈焰斩", "霜雪冰风", "勇气之礼",
			"巴国宝库", "桂杜尼", "夜灵草宝盒", "九转乾坤符", "洗髓经", "天降奇兵卡", "焚天炎魔", "暗格竞技场",
			"御前科举", "梵音震天", "寒冰护体" ],
	"斩魂" : [ "狂刀", "影战", "女乐", "刺杀", "魔道", "神法", "剑侠", "巨阙", "药师", "风雪图腾",
			"黑塔突围", "雾林遗愿", "豫州逆袭", "大爆杀", "疾风走破", "藏伏奔原", "三元融合", "幻七蝶",
			"旋风裂斩", "萤火轰" ],
	"英雄三国" : [ "夏侯惇", "荀攸", "关羽", "大乔", "赵云", "周瑜", "服部半藏", "马岱", "张角", "紫罂粟",
			"诸葛亮", "陈宫", "蓝玉儿", "高顺", "贾诩", "孙策", "臧霸", "庞统", "张梁", "程昱", "元宗",
			"太史慈" ],
	"龙剑" : [ "大鹰若冲", "乾坤三转", "皇极归元", "天波浩渺", "四季天雷剑", "狼人独臂", "鬼王神荼", "蛮荒之主",
			"玄门派", "连山派", "灵台派", "魔教派", "雷神铳", "龙魂炮", "神木瓶", "智通", "石灵", "火龙",
			"荒漠之城", "东方阁楼" ],
	"藏地传奇" : [ "龙王手印", "乾达婆", "妙音鸟", "独角兽", "莲花手印", "修罗族", "伏魔印", "金刚时轮印",
			"施无畏印", "格萨尔王子", "文成公主", "永夜鬼王", "布达拉宫", "十二镇魔寺", "古格王室", "龙将",
			"夜叉", "鬼獒", "鬼蝠", "盘龙" ],
	"其他游戏" : [ "网易新闻", "网易游戏", "网易邮箱", "网易相册", "网易博客" ],
	"other" : [ "网易新闻", "网易游戏", "网易邮箱", "网易相册", "网易博客" ]
};
// 游戏产品
function changeGameProduct() {
	var product = $("#workBill_gameProduct").val();
	var token = $("#token");
	if (token.val() == "") {
		token.empty();
		token.append("<option value=''>请选择..</option>");
		if (product != "") {
			var p = tokenList[product] == null ? tokenList["other"]
					: tokenList[product];
			for (i = 0; i < 5; i++) {
				var r = getRandomNum(0, p.length);
				token.append("<option value='" + p[r] + "'>" + p[r]
						+ "</option>");
			}
		}

	}
	cgpExt();
}

function cgpExt(){
	var prd = $("#workBill_gameProduct").val();/*
	if(prd == "其他游戏"){
		$("#boxprd").css("display","");
		$("#prdtxt").addClass("required");
	}else{
		$("#boxprd").css("display","none")
		$("#prdtxt").removeClass("required");
		$("#prdtxt").attr('value', "");
		var myProduct = $('#workBill_gameProduct option');
		myProduct.eq(myProduct.length - 2).attr('value' , "其他游戏");
	}
	*/
}

// 随机整数
function getRandomNum(lbound, ubound) {
	return (Math.floor(Math.random() * (ubound - lbound)) + lbound);
}
// 添加收藏夹
function addFavorite() {
	if (document.all) {
		window.external.addFavorite('http://mima.163.com/', '网易帐号修复支持中心');
	} else if (window.sidebar) {
		window.sidebar.addPanel('网易帐号修复支持中心', 'http://mima.163.com/', "");
	}
}

// 移动层
function FloatDiv(id) {
	this.ID = id;
	this.ObjMove = document.getElementById(id);
	this.LastScrollY = 0; // 已经移动
	FloatDiv.prototype.Move = function(obj) {
		var scrollTop;
		if (document.documentElement && document.documentElement.scrollTop)
			scrollTop = document.documentElement.scrollTop;
		else if (document.body)
			scrollTop = document.body.scrollTop;
		var percent; // 本次移动像素
		percent = (scrollTop - obj.LastScrollY) * 0.1; // 每次移动10%
		if (percent > 0)
			percent = Math.ceil(percent); // 截掉小数，数字会变大
		else
			percent = Math.floor(percent); // 截掉小数，数字会变小
		obj.ObjMove.style.top = parseInt(obj.ObjMove.style.top) + percent
				+ 'px';
		obj.LastScrollY = obj.LastScrollY + percent;
	};
	FloatDiv.prototype.Init = function(obj) {
		if (!obj.ObjMove) {
			// alert('对象不存在');
			return;
		}
		window.setInterval(this.BindInterval(this.Move, obj), 10);
	};
	// 绑定参数，window.setInterval，不能指定参数，需要绑定
	FloatDiv.prototype.BindInterval = function(funcName) {

		var args = [];
		for ( var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		return function() {
			funcName.apply(this, args);
		}
	};
}

var toCNArray = {
	"Parameter_No_Input" : "输入信息不完整, 带 * 号的项目均为必填项！",
	"Account_Alias" : "您所输入的是别名帐号，请输入对应主帐号申请修复，谢谢。",
	"Account_No_Exist" : "当前通行证帐号不存在！",
	"Account_Special" : "请根据您的帐号情况，选择合适的修复方式提交资料，<a href=http://help.163.com/special/sp/ursfaq_czyjxf.html target=_blank>点击查看修复方式>></a>",
	"URS_Login_Fail" : "通行证帐号/密码不正确！",
	"URS_Lock" : "您的通行证帐号已经被锁定，无法继续操作，请尝试<a href=http://mima.163.com>帐号修复申请</a>",
	"second_mibao" : "您输入的帐号是二代密保帐号，无挂失服务，如密保丢失，可以选择通过验证安全手机进行解除或通过<a href=http://mima.163.com>mima.163.com</a>页面提交资料解除，谢谢。",
	"TS_Login_Fail" : "很抱歉，您输入的用户名/服务号/查询编号错误，请您核对后再次输入。",
	"Sms_Login_Fail" : "很抱歉，您输入的帐号和手机验证失败或无法进行预约服务，请您核对后再尝试。<br />如需全面修复帐号，请点击<a href=ts_game_add.aspx>这里</a>。",
	"CancelDelayTime_Succ" : "成功取消考察期！",
	"CancelDelayTime_none" : "您的帐号并无提交申请或不在可撤销处理范围之内！",
	"ValidateCode_fail" : "验证码错误！",
	"SmsValidateCode_fail" : "短信验证码错误！",
	"SmsValidateMO_fail" : "系统未检测到有短信上行记录！",
	"InDelayTime" : "此帐号已提交资料，如需再次提交,请先取消之前的申请。",
	"Over_Submit_Count" : "您的帐号今天已经提交太多次。<br/>请明天再尝试，谢谢。<br/><br/>  查询<font color=red>处理进度/补充资料</font>，<a href=ts_query.aspx style='color:blue;'>请点击这里>></a><br/><br/><font size=2>如需帮助请联系<a href='http://gm.163.com/service/zhxf/index.html#home_add' target=_blank  style='color:blue;'>在线客服>></a>（服务时间：8:00-24:00）</font>",
	"Over_Submit_Count2" : "您的帐号今天已经提交太多次。<br/>请明天再尝试，谢谢。<br/>",
	"Over_Submit_Count3" : "您提交的信息正在处理，请耐心等待结果。<br/>",
	"CommonAccount" : "您输入的是邮箱帐号，请点击下方链接进行提交或查询。<br/>提交修复申请：<a href=http://pw.163.com target=_blank>http://pw.163.com</a><br/>查询处理结果：<a href=https://pw.help.163.com/TS/login.html target=_blank>https://pw.help.163.com/TS/login.html</a>",
	"IsGameAccount" : "您是网易游戏用户，请在本页面按页面提示提交资料。",
	"Upload_Content_Length_Exceed" : "你要上传的图片中有大于1M的文件,请调整大小后<a href='javascript:history.go(-1);'>重新提交</a>。<br />如有疑问，请查看:<a target='_blank' href='http://help.163.com/09/0205/14/51D5VQ44007525JO.html'>修改图片大小的方法</a>",
	"Upload_Content_Type_No_Allow" : "上传的文件类型不符合要求,图片格式必须为：jpg/jpeg/gif/png。",
	"Upload_Content_Length_0" : "您要上传的图片文件有误，请检测你要上传的文件正确性。",
	"D1" : "您提交的资料有误，请仔细核对后再次提交！",
	"Protection1" : "将军令序号格式不正确,请重新输入。",
	"Protection2" : "将军令动态密码格式不正确,请重新输入。",
	"Protection3" : "手机号码格式不正确,请重新输入。",
	"Security1" : "请输入6到15位长度的安全码。",
	"Security2" : "请输入6到30个字符密码保护问题。",
	"Security3" : "请输入6到30个字符密码保护答案。",
	"Security4" : "请输入正确的邮箱地址,且不能与帐号相同。",
	"Security5" : "请输入正确的出生日期。",
	"Security6" : "帐号密码不能与安全码相同，请修改！",
	"Security7" : "帐号密码和安全码不能设置与帐号名相同，请修改！",
	"Security8" : "请输入6到16位长度的密码。",
	"no_exist" : "您输入的服务号不存在。",
	"Epay_Freeze" : "目前您的帐号状态异常，无法进行网易宝支付密码修复。",
	"Epay_NotExist" : "请检查您的网易宝帐号是否激活。",
	"mibao_no_onBind" : "目前您的帐号没有绑定将军令或密保卡，无法进行密保挂失服务。",
	"charge_no_enough" : "请确定在过去24小时已经充值足够450点或以上网易一卡通点卡，否则无法进行密保挂失服务。",
	"ppc_login_fail" : "密保卡验证错误。",
	"ppc_login_times_fail" : "密保卡验证失败次数过多。",
	"opt_login_fail" : "将军令动态密码错误。",
	"opt_login_times_fail" : "将军令验证失败次数过多。",
	"verifyUserAnswer_463" : "您输入的资料验证错误，请检查您的大小写键是否打开！",
	"verifyUserAnswer_412" : "您输入的资料验证错误次数过多，请稍候尝试其他方式操作。",
	"repair_times_over" : "您短时间内尝试操作次数过多，请稍候再试。",
	"pinma_validate_error" : "您输入的资料验证错误，请检查您的大小写键是否打开！",
	"lose_login_existAppealFaile" : "根据系统检测，此帐号当前无法申请密保挂失服务，请先登录<a target='_blank' href='https://mima.163.com'>https://mima.163.com</a>提交帐号修复申请。（请尽可能提供您了解的帐号信息申诉即可）<br /><br />如有疑问，请联系<a target='_blank' href='http://gm.163.com/service/zhxf/index.html#home_add'>精灵答疑</a>，谢谢！"
}
// 获取URL参数
function GetArgsFromHref(sArgName) {
	var sHref = window.location.href;
	var args = sHref.split("?");
	var retval = "";

	if (args[0] == sHref) {
		return retval;
	}
	var str = args[1];
	args = str.split("&");
	for ( var i = 0; i < args.length; i++) {
		str = args[i];
		var arg = str.split("=");
		if (arg.length <= 1)
			continue;
		if (arg[0] == sArgName)
			retval = escape(arg[1]);
	}
	return retval;
}
function getMessage(value) {
	cn = toCNArray[value];
	if ($.isEmptyObject2(cn)) {
		return value;
	} else {
		return cn;
	}
}

function getElement1(tag, value) {
	// value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return "<" + tag + "><![CDATA[" + value + "]]></" + tag + ">";
}
function getElement2(tag, value, attributeName, attributeValue) {
	// value=value.replace("<","&lt;").replace(">","&gt;");
	return "<" + tag + " " + attributeName + "=\"" + attributeValue + "\""
			+ "><![CDATA[" + value + "]]></" + tag + ">";
}
function getElement3(tag, value) {
	// value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return "<" + tag + ">" + value + "</" + tag + ">";
}

function isValidImage() {
	var code = $("#validateCode").val();
	var correct = false;
	$.ajax({
		url : "ts_validateCode.aspx",
		cache : false,
		async : false,
		data : {
			"code" : code
		},
		success : function(data) {
			correct = eval(data);
		}
	});
	if (!correct) {
		$("#validateCode").errorFocus();
	}

	return correct;
}

jQuery.fn.extend({
	isCheck : function() {
		return this.filter(":checked").length > 0;
	},
	errorFocus : function() {
		$(".ts").hide();
		this.parent().find(".ts:first").css("background-color", "#ffcccc")
				.show();
		this.parent().parent().find(".ts:first").css("background-color",
				"#ffcccc").show();

	}
});

jQuery.extend({
	isMobile : function(value) {
		var length = value.length;
		return (length == 11 && /^(((13)|(14)|(15)|(17)|(18))+\d{9})$/.test(value));
	},
	isEmptyObject2 : function(value) {
		if (!value || value == null || typeof (value) == 'undefined'
				|| value == 'null' || value == '') {
			return true;
		}
		if (value.trim != '') {
			return false;
		}
		return $.isEmptyObject(value);
	}

});
jQuery.extend({
	/**
	 * *
	 * 
	 * @see 将javascript数据类型转换为json字符串 *
	 * @param 待转换对象,支持object,array,string,function,number,boolean,regexp *
	 * @return 返回json字符串
	 */
	toJSON : function(object) {
		if (object == null) {
			return "";
		}
		// 如果object为string则会出现异常
		try {
			object.constructor;
		} catch (e) {
			return object;
		}
		var type = typeof object;
		if ('object' == type) {
			if (Array == object.constructor)
				type = 'array';
			else if (RegExp == object.constructor)
				type = 'regexp';
			else
				type = 'object';
		}

		switch (type) {
		case 'undefined':
		case 'unknown':
			return;
			break;
		// case 'function':
		case 'boolean':
		case 'regexp':
			return object.toString();
			break;
		case 'number':
			return isFinite(object) ? object.toString() : 'null';
			break;
		case 'string':
			return '"'
					+ object.replace(/(\\|\")/g, "\\$1").replace(
							/\n|\r|\t/g,
							function() {
								var a = arguments[0];
								return (a == '\n') ? '\\n'
										: (a == '\r') ? '\\r'
												: (a == '\t') ? '\\t' : ""
							}) + '"';
			break;
		case 'object':
			if (object === null)
				return 'null';
			var results = [];
			for ( var property in object) {
				var value = jQuery.toJSON(object[property]);
				if (value !== undefined)
					results.push(jQuery.toJSON(property) + ':' + value);
			}
			return '{' + results.join(',') + '}';
			break;
		case 'array':
			var results = [];
			for ( var i = 0; i < object.length; i++) {
				var value = jQuery.toJSON(object[i]);
				if (value !== undefined)
					results.push(value);
			}
			return '[' + results.join(',') + ']';
			break;
		}
	}
});
