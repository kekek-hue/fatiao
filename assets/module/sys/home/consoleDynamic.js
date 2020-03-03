function LayCosoleDynamic(layui){
	layui.use(['jquery','config','ppp'], function(){
		var $ = layui.jquery;
		var ppp = layui.ppp;
		//获用户评论
		ppp.get('ajax/comment', {async: true}, function (data) {
            var records = data.result.records; 
            if(records){
            	records.forEach(function(item){
            		if(!item.user.name){
            			item.user.name = '佚名';
            		}
    	            var li= ' <li> <h5><font class ="comment-font">'+item.user.name+'('+item.user.id+')</font> 評論文章 <a><font class ="comment-font">'+item.publish.title+'</font></a></h5><p>'+item.content+'</p> <span>'+item.create_time+'</span><a href="javascript:;" layadmin-event="replyNote" data-id="'+item.id+'" class="layui-btn layui-btn-xs layuiadmin-reply">回复</a></li>';
    				$('#userComment').append(li);
            	});
            }
            
        });












	}); // layui end 
}//function end