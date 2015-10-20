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
// �ж�����ǿ��
var PasswordStrength = {
	Level : [ 12, 11, 10 ],
	LevelValue : [ 30, 20, 0 ],// ǿ��ֵ
	Factor : [ 1, 2, 5 ],// �ַ�����,�ֱ�Ϊ��ĸ�����֣�����
	KindFactor : [ 0, 0, 10, 20 ],// ���뺬������ɵļ���
	Regex : [ /[a-zA-Z]/g, /\d/g, /[^a-zA-Z\d]/g ]
// �ַ���������������������
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
				$("#uploadMessage").html("�������,���Ժ�����");
				break;
			}

		} else {
			if (data.list.length == 3) {
				$("#uploadArea").hide();
				$("#uploadMessage").html("ÿ������ϴ�3��֤����������������Ƴ���");
			} else {
				$("#uploadArea").show();
				$("#uploadMessage").html("�����������������ϴ���һ��ɨ�����");

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
				"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
		},
		success : function(data, status) {
			if ($.isEmptyObject2(data.result)) {
				$("#uploadMessage").html(
					"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
				return;
			}

			if (data.result != 'Success') {
				switch (data.result) {
				case "Upload_Content_Type_No_Allow":
					$("#uploadMessage").html(
						"�ϴ�ʧ�ܣ�����Ϊjpg/jpeg/gif/png��ʽͼƬ<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��ʽ������ϸ˵��>>>");
					break;
				case "Upload_Content_Length_0":
					$("#uploadMessage").html("�ϴ�ʧ��,�ļ���СΪ�㡣");
					break;
				case "Upload_Content_Length_Exceed":
					$("#uploadMessage").html(
						"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
					break;
				case "Upload_Count_Over":
					$("#uploadMessage").html("�ϴ��ļ�����");
					break;
				case "Fail":
					$("#uploadMessage").html("�������,���Ժ�����");
					break;
				}

			} else {
				if (data.list.length == 3) {
					$("#uploadArea").hide();
					$("#uploadMessage").html("ÿ������ϴ�3��֤����������������Ƴ���");
				} else {
					$("#uploadArea").show();
					$("#uploadMessage").html("�����������������ϴ���һ��ɨ�����");
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
			+ "')>Ԥ��</a>&nbsp;<a href=javascript:; onclick=fileRemove2014('"
			+ path + "','" + workBillClass
			+ "')>�Ƴ�</a></td>");
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
				$("#uploadMessage").html("�������,���Ժ�����");
				break;
			}

		} else {
			if (data.list.length == 3) {
				$("#uploadArea").hide();
				$("#uploadMessage").html("ÿ������ϴ�3��֤����������������Ƴ���");
			} else {
				$("#uploadArea").show();
				$("#uploadMessage").html("�����������������ϴ���һ��ɨ�����");

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
									"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
				},
				success : function(data, status) {

					if ($.isEmptyObject2(data.result)) {

						$("#uploadMessage")
								.html(
										"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
						return;
					}

					if (data.result != 'Success') {
						switch (data.result) {
						case "Upload_Content_Type_No_Allow":
							$("#uploadMessage")
									.html(
											"�ϴ�ʧ�ܣ�����Ϊjpg/jpeg/gif/png��ʽͼƬ<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��ʽ������ϸ˵��>>>");
							break;
						case "Upload_Content_Length_0":
							$("#uploadMessage").html("�ϴ�ʧ��,�ļ���СΪ�㡣");
							break;
						case "Upload_Content_Length_Exceed":
							$("#uploadMessage")
									.html(
											"ͼƬ�����벻Ҫ����1M<br /><a href=nts/help/picture.htm target=_blank>�޸�ͼƬ��С������ϸ˵��>>>");
							break;
						case "Upload_Count_Over":
							$("#uploadMessage").html("�ϴ��ļ�����");
							break;
						case "Fail":
							$("#uploadMessage").html("�������,���Ժ�����");
							break;
						}

					} else {
						if (data.list.length == 3) {
							$("#uploadArea").hide();
							$("#uploadMessage").html("ÿ������ϴ�3��֤����������������Ƴ���");
						} else {
							$("#uploadArea").show();
							$("#uploadMessage").html("�����������������ϴ���һ��ɨ�����");
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
												+ "')>Ԥ��</a>&nbsp;<a href=javascript:; onclick=fileRemove('"
												+ path + "','" + workBillClass
												+ "')>�Ƴ�</a></td>");
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
				alert("���ֻ��Ż�ȡ����֤��̫�࣬�޷��·���֤�롣");
				$("#sendSmsCodeResult").html(
						"<font color=red>���ֻ��Ż�ȡ����֤��̫�࣬�޷��·���֤�롣</font>");
			} else if (data == 'success') {
				alert("ϵͳ���·���֤�뵽�����ֻ�����ע����գ�30��������Ч��");
				for ( var i = 0; i <= 60; i++) {
					window.setTimeout("countDown(" + i + ")", i * 1000);
				}
			}
		});
	} else {
		alert("�����ʽ��������ȷ����11λ���ֻ��ţ�");
		//$("#customer_mobile").focus();
	}
	return false;
}

function countDown(num) {
	if (num == 60) {
		$("#sendSmsCodeButton").html("��ѻ�ȡ��֤��").attr("disabled", false);
	} else {
		secs = 60 - num;
		$("#sendSmsCodeButton").html("��ע������ֻ��Ķ�����֤�룬���� " + secs + " ������»�ȡ")
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
 * ��ʾ��������
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
			"<font style='color:gray;font-size:12px;padding-left:3px;'>��ʾ��������"
					+ $("#" + o1).val().length + "���ַ�</font>");
}

var tokenList = {
	"��2" : [ "ٻŮ�Ļ�", "�칤����", "��������", "����ӡ", "��������¶", "ȵ����", "����ǧ��", "�������",
			"��������", "���ţ", "����", "ڤ��", "��������", "��������", "��������", "��ϼ����", "����ʮ��",
			"�󻰾���", "����ɽ", "��ׯ��" ],
	"�λ�����" : [ "��������", "��������", "���ɴ���", "�ƾٴ���", "Ӣ�۴��", "������", "�Ǿ���", "��ɨǧ��",
			"�λþ���", "�������", "����ξ", "������", "�λ�֪��", "�Ⱥ��ն�", "�������", "��������",
			"��������è", "ܽ������", "��Ѫ��", "�������" ],
	"�ɷ�" : [ "̫�Ų�ԭ", "�Ϸ�ѩ��", "��ħɭ��", "С����", "������", "�����", "��������", "�������",
			"����֮��", "����ʹ��", "�һ�С����", "�ɿ�����", "ʥ�ľ޶�", "��Ӱ֮��", "�ǻ�ˮ��", "����֮��",
			"������", "����ʥ��", "���֮��", "����ս��" ],
	"����3" : [ "��Դ����", " �Ķ�ħӰ", "������", "����", "���", "�Ļ�", "����֮��", "�������", "�Ĺ��",
			"��Ȫ�ľ�", "�Ļ�ʥ��", "̫��ͭ��", "è��ʯ��", "��������", "�Ĺȹ���", "��Ȫ�ľ�", "��������",
			"Ϫľ֮��", "��ɴ��", "����֮��" ],
	"��3" : [ "���ʢ��", "�����", "������", "Ľ��", "����", "�컨��׹", "���޵���", "��������", "�ڷ�ͻ��",
			"�ն�����", "���֮��", "�ڼ���", "��������¶", "��սƽ��ɽ", "��ɫ��ţ", "���÷���", "�����Ჽ",
			"�޻���Թ", "̫������", "�ն�����" ],
	"ս��" : [ "������˫", "����ɳ", "������", "��ʹ����", "����Сʤ", "�帣ͯ��", "������", "�콵���",
			"��ڤ�ظ�", "����ɽ", "������ʯ", "���ľ�", "�¹ⱦ��", "ˮ����˿��", "���ʹ�����", "������ʯ",
			"������", "����ʦ̫", "����ʦ", "��˹������" ],
	"������˫" : [ "������", "����ׯ", "��ɷ��", " ���Ƕ�", " ��ҧ��", "��Ԫ��", "���ĳɶ�", "ʨ�Ӻ�",
			"����ȼ��", "��������", " ƽ�ؾ���", "���᳤��", " ����׽Ӱ", "��˪ѩ��", "����կ", "ҹ���",
			"�λ걤", "ʮ����ʦ", "����൳", "����ɽ" ],
	"ٻŮ�Ļ�" : [ "������", "���Ǹ���", "��ɽʯ", "�ǻ���ԭ", "�ٷ�����", "ӥ������", "��������", "δ�����",
			"̤ѩ�Ա�", "��ң��", "����ӷ�", "�׶�����", "��¶��ϼ", "��������", "������", "�������",
			"��������", "�׺�ɣ��", "��ת˾", "���ɳ�" ],
	"���鴫˵" : [ "��Ҷ��", "�����ָ", "�츳��", "������ʦ", "ˮ������", "��Ӣѫ��", "���յ�", "���ĵ�",
			"������", "��Ȼʹ", "ħ��ʦ", "������", "��еʦ", "������", "ϣ������", "������", "��ͷ��",
			"��ʿ�ų�", "���ֵ���", "ʱ���Ű�" ],
	"���" : [ "������", "������", "Ӱ��ɽׯ", "��ɷ��", "��ɽ����", "������", "����ն", "˪ѩ����", "����֮��",
			"�͹�����", "�����", "ҹ��ݱ���", "��תǬ����", "ϴ�辭", "�콵�����", "������ħ", "���񾺼���",
			"��ǰ�ƾ�", "��������", "��������" ],
	"ն��" : [ "��", "Ӱս", "Ů��", "��ɱ", "ħ��", "��", "����", "����", "ҩʦ", "��ѩͼ��",
			"����ͻΧ", "������Ը", "ԥ����Ϯ", "��ɱ", "��������", "�ط���ԭ", "��Ԫ�ں�", "���ߵ�",
			"������ն", "ө���" ],
	"Ӣ������" : [ "�ĺ", "����", "����", "����", "����", "���", "�������", "���", "�Ž�", "�����",
			"�����", "�¹�", "�����", "��˳", "��ڼ", "���", "갰�", "��ͳ", "����", "����", "Ԫ��",
			"̫ʷ��" ],
	"����" : [ "��ӥ����", "Ǭ����ת", "�ʼ���Ԫ", "�첨����", "�ļ����׽�", "���˶���", "������ݱ", "����֮��",
			"������", "��ɽ��", "��̨��", "ħ����", "�����", "������", "��ľƿ", "��ͨ", "ʯ��", "����",
			"��Į֮��", "������¥" ],
	"�صش���" : [ "������ӡ", "Ǭ����", "������", "������", "������ӡ", "������", "��ħӡ", "���ʱ��ӡ",
			"ʩ��ηӡ", "����������", "�ĳɹ���", "��ҹ����", "��������", "ʮ����ħ��", "�Ÿ�����", "����",
			"ҹ��", "����", "����", "����" ],
	"������Ϸ" : [ "��������", "������Ϸ", "��������", "�������", "���ײ���" ],
	"other" : [ "��������", "������Ϸ", "��������", "�������", "���ײ���" ]
};
// ��Ϸ��Ʒ
function changeGameProduct() {
	var product = $("#workBill_gameProduct").val();
	var token = $("#token");
	if (token.val() == "") {
		token.empty();
		token.append("<option value=''>��ѡ��..</option>");
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
	if(prd == "������Ϸ"){
		$("#boxprd").css("display","");
		$("#prdtxt").addClass("required");
	}else{
		$("#boxprd").css("display","none")
		$("#prdtxt").removeClass("required");
		$("#prdtxt").attr('value', "");
		var myProduct = $('#workBill_gameProduct option');
		myProduct.eq(myProduct.length - 2).attr('value' , "������Ϸ");
	}
	*/
}

// �������
function getRandomNum(lbound, ubound) {
	return (Math.floor(Math.random() * (ubound - lbound)) + lbound);
}
// ����ղؼ�
function addFavorite() {
	if (document.all) {
		window.external.addFavorite('http://mima.163.com/', '�����ʺ��޸�֧������');
	} else if (window.sidebar) {
		window.sidebar.addPanel('�����ʺ��޸�֧������', 'http://mima.163.com/', "");
	}
}

// �ƶ���
function FloatDiv(id) {
	this.ID = id;
	this.ObjMove = document.getElementById(id);
	this.LastScrollY = 0; // �Ѿ��ƶ�
	FloatDiv.prototype.Move = function(obj) {
		var scrollTop;
		if (document.documentElement && document.documentElement.scrollTop)
			scrollTop = document.documentElement.scrollTop;
		else if (document.body)
			scrollTop = document.body.scrollTop;
		var percent; // �����ƶ�����
		percent = (scrollTop - obj.LastScrollY) * 0.1; // ÿ���ƶ�10%
		if (percent > 0)
			percent = Math.ceil(percent); // �ص�С�������ֻ���
		else
			percent = Math.floor(percent); // �ص�С�������ֻ��С
		obj.ObjMove.style.top = parseInt(obj.ObjMove.style.top) + percent
				+ 'px';
		obj.LastScrollY = obj.LastScrollY + percent;
	};
	FloatDiv.prototype.Init = function(obj) {
		if (!obj.ObjMove) {
			// alert('���󲻴���');
			return;
		}
		window.setInterval(this.BindInterval(this.Move, obj), 10);
	};
	// �󶨲�����window.setInterval������ָ����������Ҫ��
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
	"Parameter_No_Input" : "������Ϣ������, �� * �ŵ���Ŀ��Ϊ�����",
	"Account_Alias" : "����������Ǳ����ʺţ��������Ӧ���ʺ������޸���лл��",
	"Account_No_Exist" : "��ǰͨ��֤�ʺŲ����ڣ�",
	"Account_Special" : "����������ʺ������ѡ����ʵ��޸���ʽ�ύ���ϣ�<a href=http://help.163.com/special/sp/ursfaq_czyjxf.html target=_blank>����鿴�޸���ʽ>></a>",
	"URS_Login_Fail" : "ͨ��֤�ʺ�/���벻��ȷ��",
	"URS_Lock" : "����ͨ��֤�ʺ��Ѿ����������޷������������볢��<a href=http://mima.163.com>�ʺ��޸�����</a>",
	"second_mibao" : "��������ʺ��Ƕ����ܱ��ʺţ��޹�ʧ�������ܱ���ʧ������ѡ��ͨ����֤��ȫ�ֻ����н����ͨ��<a href=http://mima.163.com>mima.163.com</a>ҳ���ύ���Ͻ����лл��",
	"TS_Login_Fail" : "�ܱ�Ǹ����������û���/�����/��ѯ��Ŵ��������˶Ժ��ٴ����롣",
	"Sms_Login_Fail" : "�ܱ�Ǹ����������ʺź��ֻ���֤ʧ�ܻ��޷�����ԤԼ���������˶Ժ��ٳ��ԡ�<br />����ȫ���޸��ʺţ�����<a href=ts_game_add.aspx>����</a>��",
	"CancelDelayTime_Succ" : "�ɹ�ȡ�������ڣ�",
	"CancelDelayTime_none" : "�����ʺŲ����ύ������ڿɳ�������Χ֮�ڣ�",
	"ValidateCode_fail" : "��֤�����",
	"SmsValidateCode_fail" : "������֤�����",
	"SmsValidateMO_fail" : "ϵͳδ��⵽�ж������м�¼��",
	"InDelayTime" : "���ʺ����ύ���ϣ������ٴ��ύ,����ȡ��֮ǰ�����롣",
	"Over_Submit_Count" : "�����ʺŽ����Ѿ��ύ̫��Ρ�<br/>�������ٳ��ԣ�лл��<br/><br/>  ��ѯ<font color=red>�������/��������</font>��<a href=ts_query.aspx style='color:blue;'>��������>></a><br/><br/><font size=2>�����������ϵ<a href='http://gm.163.com/service/zhxf/index.html#home_add' target=_blank  style='color:blue;'>���߿ͷ�>></a>������ʱ�䣺8:00-24:00��</font>",
	"Over_Submit_Count2" : "�����ʺŽ����Ѿ��ύ̫��Ρ�<br/>�������ٳ��ԣ�лл��<br/>",
	"Over_Submit_Count3" : "���ύ����Ϣ���ڴ��������ĵȴ������<br/>",
	"CommonAccount" : "��������������ʺţ������·����ӽ����ύ���ѯ��<br/>�ύ�޸����룺<a href=http://pw.163.com target=_blank>http://pw.163.com</a><br/>��ѯ��������<a href=https://pw.help.163.com/TS/login.html target=_blank>https://pw.help.163.com/TS/login.html</a>",
	"IsGameAccount" : "����������Ϸ�û������ڱ�ҳ�水ҳ����ʾ�ύ���ϡ�",
	"Upload_Content_Length_Exceed" : "��Ҫ�ϴ���ͼƬ���д���1M���ļ�,�������С��<a href='javascript:history.go(-1);'>�����ύ</a>��<br />�������ʣ���鿴:<a target='_blank' href='http://help.163.com/09/0205/14/51D5VQ44007525JO.html'>�޸�ͼƬ��С�ķ���</a>",
	"Upload_Content_Type_No_Allow" : "�ϴ����ļ����Ͳ�����Ҫ��,ͼƬ��ʽ����Ϊ��jpg/jpeg/gif/png��",
	"Upload_Content_Length_0" : "��Ҫ�ϴ���ͼƬ�ļ�����������Ҫ�ϴ����ļ���ȷ�ԡ�",
	"D1" : "���ύ��������������ϸ�˶Ժ��ٴ��ύ��",
	"Protection1" : "��������Ÿ�ʽ����ȷ,���������롣",
	"Protection2" : "�����̬�����ʽ����ȷ,���������롣",
	"Protection3" : "�ֻ������ʽ����ȷ,���������롣",
	"Security1" : "������6��15λ���ȵİ�ȫ�롣",
	"Security2" : "������6��30���ַ����뱣�����⡣",
	"Security3" : "������6��30���ַ����뱣���𰸡�",
	"Security4" : "��������ȷ�������ַ,�Ҳ������ʺ���ͬ��",
	"Security5" : "��������ȷ�ĳ������ڡ�",
	"Security6" : "�ʺ����벻���밲ȫ����ͬ�����޸ģ�",
	"Security7" : "�ʺ�����Ͱ�ȫ�벻���������ʺ�����ͬ�����޸ģ�",
	"Security8" : "������6��16λ���ȵ����롣",
	"no_exist" : "������ķ���Ų����ڡ�",
	"Epay_Freeze" : "Ŀǰ�����ʺ�״̬�쳣���޷��������ױ�֧�������޸���",
	"Epay_NotExist" : "�����������ױ��ʺ��Ƿ񼤻",
	"mibao_no_onBind" : "Ŀǰ�����ʺ�û�а󶨽�������ܱ������޷������ܱ���ʧ����",
	"charge_no_enough" : "��ȷ���ڹ�ȥ24Сʱ�Ѿ���ֵ�㹻450�����������һ��ͨ�㿨�������޷������ܱ���ʧ����",
	"ppc_login_fail" : "�ܱ�����֤����",
	"ppc_login_times_fail" : "�ܱ�����֤ʧ�ܴ������ࡣ",
	"opt_login_fail" : "�����̬�������",
	"opt_login_times_fail" : "��������֤ʧ�ܴ������ࡣ",
	"verifyUserAnswer_463" : "�������������֤�����������Ĵ�Сд���Ƿ�򿪣�",
	"verifyUserAnswer_412" : "�������������֤����������࣬���Ժ���������ʽ������",
	"repair_times_over" : "����ʱ���ڳ��Բ����������࣬���Ժ����ԡ�",
	"pinma_validate_error" : "�������������֤�����������Ĵ�Сд���Ƿ�򿪣�",
	"lose_login_existAppealFaile" : "����ϵͳ��⣬���ʺŵ�ǰ�޷������ܱ���ʧ�������ȵ�¼<a target='_blank' href='https://mima.163.com'>https://mima.163.com</a>�ύ�ʺ��޸����롣���뾡�����ṩ���˽���ʺ���Ϣ���߼��ɣ�<br /><br />�������ʣ�����ϵ<a target='_blank' href='http://gm.163.com/service/zhxf/index.html#home_add'>�������</a>��лл��"
}
// ��ȡURL����
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
	 * @see ��javascript��������ת��Ϊjson�ַ��� *
	 * @param ��ת������,֧��object,array,string,function,number,boolean,regexp *
	 * @return ����json�ַ���
	 */
	toJSON : function(object) {
		if (object == null) {
			return "";
		}
		// ���objectΪstring�������쳣
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
