jQuery.validator.addMethod("type1", function(value, element) {
	var reg = /^[0-9a-zA-Z]*$/;
	return this.optional(element) || (reg.test($.trim(value)));
}, "格式错误");

jQuery.validator.addMethod("account_type", function(value, element) {
	return this.optional(element) || (value.indexOf('#')==-1);
}, "格式错误");

jQuery.validator.addMethod("rangeBlength", function(value, element, params) {
	var length = value.replace(/[^\x00-\xff]/g, "**").length;
	return (length >= params[0] && length <= params[1]);

}, "请输入一个长度介于 {0} 和 {1} 之间的字符串(1个汉字占2个字符)");

jQuery.validator.addMethod("regex", function(value, element, params) {
	var exp = new RegExp(params);
	return exp.test(value);
}, "格式错误");

jQuery.extend(jQuery.validator.messages, {
	required : "请输入此字段",
	remote : "请修正该字段",
	email : "请输入正确格式的电子邮件",
	url : "请输入合法的网址",
	date : "请输入合法的日期",
	dateISO : "请输入合法的日期 (ISO).",
	number : "请输入合法的数字",
	digits : "只能输入整数",
	creditcard : "请输入合法的信用卡号",
	equalTo : "请再次输入相同的值",
	accept : "请输入拥有合法后缀名的字符串",
	maxlength : jQuery.format("请输入一个长度最多是 {0} 的字符串"),
	minlength : jQuery.format("请输入一个长度最少是 {0} 的字符串"),
	rangelength : jQuery.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
	range : jQuery.format("请输入一个介于 {0} 和 {1} 之间的值"),
	max : jQuery.format("请输入一个最大为 {0} 的值"),
	min : jQuery.format("请输入一个最小为 {0} 的值")
});

// 手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	return this.optional(element)
			|| (length == 11 && /^(((13)|(14)|(15)|(17)|(18))+\d{9})$/.test(value));
}, "请检查您的手机号码");

// 电话号码验证
jQuery.validator
		.addMethod(
				"phone",
				function(value, element) {
					var ph = /(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}$)|(^[1-9][0-9]{6,7}$)|(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^0{0,1}13[0-9]{9}$)|(^0{0,1}15[0-9]{9}$|^0{0,1}18[0-9]{9}$)/;
					return this.optional(element) || (ph.test(value));
				}, "请检查您的电话号码");

// 邮政编码验证
jQuery.validator.addMethod("zipcode", function(value, element) {
	var tel = /^\d{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请检查您的邮政编码");

// 身份证---不建议使用
jQuery.validator.addMethod("idcard", function(value, element) {
	if (this.optional(element))
		return "dependency-mismatch";
	if (value.length != 15 && value.length != 18)
		return false;// "身份证号共有 15 码或18位";
	var Ai = value.length == 18 ? value.substring(0, 17) : value.slice(0, 6)
			+ "19" + value.slice(6, 16);
	if (!/^\d+$/.test(Ai))
		return false;// "身份证除最后一位外，必须为数字！";
	var yyyy = Ai.slice(6, 10), mm = Ai.slice(10, 12) - 1, dd = Ai
			.slice(12, 14);
	var d = new Date(yyyy, mm, dd), now = new Date();
	var year = d.getFullYear(), mon = d.getMonth(), day = d.getDate();
	if (year != yyyy || mon != mm || day != dd || d > now || year < 1900)
		return false;// "身份证输入错误！";
	return true;
}, "请检查您的身份证号码");

// 身份证
jQuery.validator.addMethod("idCode", function(value, element) {
	if (this.optional(element))
		return "dependency-mismatch";
	var exp = /(^[0-9]{18}$)|(^[0-9]{17}[Xx]$)/;
	var reg = value.match(exp);
	if (reg == null)
		return false;

	var inYear = (value.length == 18) ? value.substring(6, 10) : "19"
			+ value.substring(6, 8);
	var inMonth = (value.length == 18) ? value.substring(10, 12) - 1 : value
			.substring(8, 10) - 1;
	var inDay = (value.length == 18) ? value.substring(12, 14) : value
			.substring(10, 12);
	var d = new Date(inYear, inMonth, inDay);
	var now = new Date();
	var year = d.getFullYear();
	if (year < 1900)
		return false;
	var month = d.getMonth();
	var day = d.getDate();
	if (inYear != year || inMonth != month || inDay != day || d > now
			|| year < 1800)
		return false;

	var no = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
	var id = [ '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' ];
	var i = 0, wi = 0, sum = 0;
	for (; i < 17; i++) {
		wi = value.substring(i, i + 1) * no[i];
		sum += wi;
	}
	var idIndex = sum % 11;
	return id[idIndex] == value.toUpperCase().charAt(17);
}, "请检查您的身份证号码");

// 身份证
jQuery.validator
		.addMethod(
				"idCodeUpdate",
				function(value, element) {
					if (this.optional(element))
						return "dependency-mismatch";
					var exp = /(^[1-9]{1}[0-9]{14}$)|(^[1-9]{1}[0-9]{17}$)|(^[1-9]{1}[0-9]{16}X$)|(^[1-9]{1}[0-9]{16}x$)/;
					var reg = value.match(exp);
					if (reg == null)
						return false;

					var inYear = (value.length == 18) ? value.substring(6, 10)
							: "19" + value.substring(6, 8);
					var inMonth = (value.length == 18) ? value
							.substring(10, 12) - 1 : value.substring(8, 10) - 1;
					var inDay = (value.length == 18) ? value.substring(12, 14)
							: value.substring(10, 12);
					var d = new Date(inYear, inMonth, inDay);
					var now = new Date();
					var year = d.getFullYear();
					if (year < 1900)
						return false;
					var month = d.getMonth();
					var day = d.getDate();
					if (inYear != year || inMonth != month || inDay != day
							|| d > now || year < 1800)
						return false;
					if (value.length != 18)
						return true;

					var no = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8,
							4, 2 ];
					var id = [ '1', '0', 'X', '9', '8', '7', '6', '5', '4',
							'3', '2' ];
					var i = 0, wi = 0, sum = 0;
					for (; i < 17; i++) {
						wi = value.substring(i, i + 1) * no[i];
						sum += wi;
					}

					var idIndex = sum % 11;
					return id[idIndex] == value.toUpperCase().charAt(17);
				}, "请检查您的身份证号码");

// 纯中文
jQuery.validator.addMethod("chinese", function(value, element) {
	var exp = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (exp.test(value));
}, "只能输入汉字");

// 非汉字
jQuery.validator.addMethod("noCharacter", function(value, element) {
	// var reg = /^[\u4e00-\u9fa5]+$/;
	var reg = /^[^\u4e00-\u9fa5]+$/;
	return this.optional(element) || (reg.test(value));
}, "不能输入中文");
