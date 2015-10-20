﻿﻿﻿var Nav163 = {};

Nav163.gId = function(id){
	return document.getElementById(id);	
};

//读取cookie
Nav163.getCookie = function(sName){
	    var sRE="(?:(?:^"+sName+")|(?:(?:(?:; ))" + sName + "))=([^;]*);?";
	    var oRE=new RegExp(sRE);
	    if(oRE.test(document.cookie)){
		    return decodeURIComponent(RegExp["$1"]);
		}
		else{return null;}	
};

Nav163.writeNav = function(){

    var hours = new Date().getHours();
	var sayHello = "";
	if(hours > 5 && hours <= 11 ){sayHello = "上午"}
	if(hours > 11 && hours <= 13 ){sayHello = "中午"}
	if(hours > 13 && hours <= 17 ){sayHello = "下午"}
	if(hours > 17 ||  hours <= 2 ){sayHello = "晚上"}
	if(hours > 2 && hours <= 5 ){sayHello = "凌晨"}

	var fixAccount = "";
	var arr = Nav163.account.split("@");
	if(arr[0].length > 12 && (arr[1] == "126.com" || arr[1] == "163.com" || arr[1] == "yeah.net" || arr[1] == "188.com")){
		fixAccount = arr[0].substring(0,12) + "...@" + arr[1];
	}else if(arr[0].length > 8 && (arr[1] == "vip.126.com" || arr[1] == "vip.163.com" || arr[1] == "netease.com" || arr[1] == "popo.163.com")){
		fixAccount = arr[0].substring(0,8) + "...@" + arr[1];
	}else if(arr[0].length + arr[1].length > 19){
		fixAccount = arr[0].substring(0,(19 - arr[1].length)) + "...@" + arr[1];
	}
	
	else{fixAccount = Nav163.account};
	//var str = '<span class="user163_box" id="user163"><span class="user163_name" id="user163_name" title='+ Nav163.account +'>' + fixAccount + '</span><ul id="user163List" style="display:none;"><li><a target="_blank" href=\"http://reg.163.com/Main.jsp?username=' + Nav163.account + '\">进入通行证</a></li>';
	var str = '<span class="user163_box" id="user163"><span class="user163_name" id="user163_name" title='+ Nav163.account +'>' + fixAccount + '</span><ul id="user163List" style="display:none;">';	
	
	var url = document.URL;
	var rep = /@(.+)/;
	rep.test(Nav163.account);	
	var et = RegExp.$1;
	//可用邮箱后缀
	//var email = ["126.com","163.com","vip.126.com","vip.163.com","yeah.net","188.com"];
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*reg\.163\.com$/, url))
		str += '<li><a target="_blank" href=\"http://reg.163.com/Main.jsp?username=' + Nav163.account + '">进入我的账号</a></li>';
	
	if((et == "163.com") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*mail\.163\.com$/, url)){
		str += '<li><a target="_blank" href="http://entry.mail.163.com/coremail/fcg/ntesdoor2?verifycookie=1&lightweight=1\">进入我的邮箱</a></li>';
	}else if((et == "126.com") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*mail\.126\.com$/, url)){
		str += '<li><a target="_blank" href="http://entry.mail.126.com/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1\">进入我的邮箱</a></li>';
	}else if((et == "yeah.net") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*mail\.yeah\.net$/, url)){
		str += '<li><a target="_blank" href="http://entry.yeah.net/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1\">进入我的邮箱</a></li>';
	}else if((et == "188.com") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*mail\.188\.com$/, url)){
		str += '<li><a target="_blank" href="http://reg.mail.188.com/servlet/enter\">进入我的邮箱</a></li>';
	}else if((et == "vip.163.com") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*vip\.163\.com$/, url)){
		str += '<li><a target="_blank" href="http://reg.vip.163.com/enterMail.m?enterVip=true\">进入我的邮箱</a></li>';
	}else if((et == "vip.126.com") && !URLContailDomain(/^http[s]?:\/\/(.*\.)*vip\.126\.com$/, url)){
		str += '<li><a target="_blank" href="http://reg.vip.126.com/enterMail.m\">进入我的邮箱</a></li>';
	}
	
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*epay\.163\.com$/, url))
		str += '<li><a target="_blank" href="http://epay.163.com/index.jsp#from=jsdh">进入我的网易宝</a></li>';
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*mall\.163\.com$/, url))
		str += '<li><a target="_blank" href="http://mall.163.com/#from=jsdh">进入网易商城</a></li>';
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*caipiao\.163\.com$/, url))
		str += '<li><a target="_blank" href="http://caipiao.163.com/#from=jsdh">进入我的彩票</a></li>';
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*baoxian\.163\.com$/, url))
		str += '<li><a target="_blank" href="http://baoxian.163.com/car/?from=jsdh">进入我的车险</a></li>';
	//if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*baojian\.163\.com$/, url))
	//	str += '<li><a target="_blank" href="http://baojian.163.com/#from=ursxlcd">进入我的保健品</a></li>';
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*yxp\.163\.com$/, url))
		str += '<li><a target="_blank" href="http://yxp.163.com/?sss=fromurs">进入我的印像派</a></li>';
	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*blog\.163\.com$/, url))
		str += '<li><a target="_blank" href=\"http://blog.163.com/passportIn.do?entry=' + Nav163.form + '">进入我的博客</a></li>';
	//if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*photo\.163\.com$/, url))
		//str += '<li><a target="_blank" href=\"http://photo.163.com/?username=' + Nav163.account + '\">进入我的相册</a></li>';
	//if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*reader\.youdao\.com$/, url))
		//str += '<li><a target="_blank" href=\"http://reader.youdao.com/?keyfrom=' + Nav163.form + '">进入有道阅读</a></li>';
	//if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*yuehui\.163\.com$/, url))
		//str += '<li><a target="_blank" href=\"http://yuehui.163.com/">进入同城约会</a></li>';
//	if (!URLContailDomain(/^http[s]?:\/\/(.*\.)*t\.163\.com$/, url))
//		str += '<li><a target="_blank" href=\"http://t.163.com\">进入我的微博</a></li>';	
	str += '</ul></span>';
	document.write(str);
	if(Nav163.gId("sayHello")){
		Nav163.gId("sayHello").innerHTML = sayHello + "好， ";
	}
};

Nav163.init = function(id){
    var tmp_p_info = Nav163.getCookie("P_INFO");
    var tmp_p_oinfo = Nav163.getCookie("P_OINFO");
    if(tmp_p_info == null){
        tmp_p_info = tmp_p_oinfo;
    }
//	var p_info = Nav163.getCookie("P_INFO").replace(/\"|\'/g,"").split("|");
	var p_info = tmp_p_info.replace(/\"|\'/g,"").split("|");
	if(p_info.length>=9){
		Nav163.account = p_info[8];
	}else{
		Nav163.account = p_info[0];
	}
	Nav163.form = p_info[3];
	//Nav163.account = "lalasxc@126.com";
	//Nav163.form = "126";
	var stime;
	Nav163.writeNav();
	Nav163.gId("user163_name").onmouseover = function(){
		this.className = "user163_name_act";
	};
	Nav163.gId("user163_name").onmouseout = function(){
		this.className = "user163_name";
	};
	Nav163.gId("user163List").onmouseout = function(){
		stime = setTimeout(hideNav163,200);		
	};
	Nav163.gId("user163").onclick = function(){	
		Nav163.gId("user163List").style.display = "block";
	};
	
	Nav163.gId("user163List").onmouseover = function(){
		clearTimeout(stime);
		Nav163.gId("user163List").style.display = "block";
	}	
};


function hideNav163(){
	Nav163.gId("user163List").style.display = "none";
	//Nav163.gId("user163_name").className = "user163_name";
};

function URLContailDomain(regExpr, fullurl){
	var url = fullurl;
	var idxDelimeter = url.indexOf("?", 0);
	if (idxDelimeter >= 0)
		url = url.substring(0, idxDelimeter);
	idxDelimeter = url.indexOf(":", 0);
	if (idxDelimeter < 0) 
		return false;
	var http = url.substring(0, idxDelimeter + 3);
	url = url.substring(idxDelimeter + 3, url.length);	
	idxDelimeter = url.indexOf("/", 0);
	if (idxDelimeter >= 0)
		url = url.substring(0, idxDelimeter);
	
	url = http + url;
	return regExpr.test(url);
};

Nav163.init();
