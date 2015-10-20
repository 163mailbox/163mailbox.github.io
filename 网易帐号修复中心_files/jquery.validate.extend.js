jQuery.validator.addMethod("type1", function(value, element) {
	var reg = /^[0-9a-zA-Z]*$/;
	return this.optional(element) || (reg.test($.trim(value)));
}, "��ʽ����");

jQuery.validator.addMethod("account_type", function(value, element) {
	return this.optional(element) || (value.indexOf('#')==-1);
}, "��ʽ����");

jQuery.validator.addMethod("rangeBlength", function(value, element, params) {
	var length = value.replace(/[^\x00-\xff]/g, "**").length;
	return (length >= params[0] && length <= params[1]);

}, "������һ�����Ƚ��� {0} �� {1} ֮����ַ���(1������ռ2���ַ�)");

jQuery.validator.addMethod("regex", function(value, element, params) {
	var exp = new RegExp(params);
	return exp.test(value);
}, "��ʽ����");

jQuery.extend(jQuery.validator.messages, {
	required : "��������ֶ�",
	remote : "���������ֶ�",
	email : "��������ȷ��ʽ�ĵ����ʼ�",
	url : "������Ϸ�����ַ",
	date : "������Ϸ�������",
	dateISO : "������Ϸ������� (ISO).",
	number : "������Ϸ�������",
	digits : "ֻ����������",
	creditcard : "������Ϸ������ÿ���",
	equalTo : "���ٴ�������ͬ��ֵ",
	accept : "������ӵ�кϷ���׺�����ַ���",
	maxlength : jQuery.format("������һ����������� {0} ���ַ���"),
	minlength : jQuery.format("������һ������������ {0} ���ַ���"),
	rangelength : jQuery.format("������һ�����Ƚ��� {0} �� {1} ֮����ַ���"),
	range : jQuery.format("������һ������ {0} �� {1} ֮���ֵ"),
	max : jQuery.format("������һ�����Ϊ {0} ��ֵ"),
	min : jQuery.format("������һ����СΪ {0} ��ֵ")
});

// �ֻ�������֤
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	return this.optional(element)
			|| (length == 11 && /^(((13)|(14)|(15)|(17)|(18))+\d{9})$/.test(value));
}, "���������ֻ�����");

// �绰������֤
jQuery.validator
		.addMethod(
				"phone",
				function(value, element) {
					var ph = /(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}$)|(^[1-9][0-9]{6,7}$)|(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^0{0,1}13[0-9]{9}$)|(^0{0,1}15[0-9]{9}$|^0{0,1}18[0-9]{9}$)/;
					return this.optional(element) || (ph.test(value));
				}, "�������ĵ绰����");

// ����������֤
jQuery.validator.addMethod("zipcode", function(value, element) {
	var tel = /^\d{6}$/;
	return this.optional(element) || (tel.test(value));
}, "����������������");

// ���֤---������ʹ��
jQuery.validator.addMethod("idcard", function(value, element) {
	if (this.optional(element))
		return "dependency-mismatch";
	if (value.length != 15 && value.length != 18)
		return false;// "���֤�Ź��� 15 ���18λ";
	var Ai = value.length == 18 ? value.substring(0, 17) : value.slice(0, 6)
			+ "19" + value.slice(6, 16);
	if (!/^\d+$/.test(Ai))
		return false;// "���֤�����һλ�⣬����Ϊ���֣�";
	var yyyy = Ai.slice(6, 10), mm = Ai.slice(10, 12) - 1, dd = Ai
			.slice(12, 14);
	var d = new Date(yyyy, mm, dd), now = new Date();
	var year = d.getFullYear(), mon = d.getMonth(), day = d.getDate();
	if (year != yyyy || mon != mm || day != dd || d > now || year < 1900)
		return false;// "���֤�������";
	return true;
}, "�����������֤����");

// ���֤
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
}, "�����������֤����");

// ���֤
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
				}, "�����������֤����");

// ������
jQuery.validator.addMethod("chinese", function(value, element) {
	var exp = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (exp.test(value));
}, "ֻ�����뺺��");

// �Ǻ���
jQuery.validator.addMethod("noCharacter", function(value, element) {
	// var reg = /^[\u4e00-\u9fa5]+$/;
	var reg = /^[^\u4e00-\u9fa5]+$/;
	return this.optional(element) || (reg.test(value));
}, "������������");
