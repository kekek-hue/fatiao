layui.use(['jquery','config','ppp'], function(){
	var $ = layui.jquery
		,ppp = layui.ppp;
	$('#totalInformation').hide();
	ppp.get('index', {async: true}, function (data) {
		var vm =  $('#totalInformation').vm(data);
		$('#totalInformation').show();
	});
});