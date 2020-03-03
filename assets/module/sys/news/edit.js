function Lay(layui){
    layui.use(['layer','form','layedit','laydate','jquery','upload'], function(){
         var  layer = layui.layer,
              layedit=layui.layedit,
              laydate = layui.laydate,
              form=layui.form,
              $ = layui.jquery,
              upload = layui.upload;
        form.render();
        /*常规信息添加
        监听提交
        */
        form.on('submit(routineInformation)', function(data){
            var editContent =  UE.getEditor('editor').getContent();
            var data = JSON.stringify(data.field);
            var likes = Array();
            $("input:checkbox[name='like']:checked").each(function(i){
                likes[i] = $(this).val();
            });
            var paramData = {
            	"editContent":editContent,
            };
            $.post("edit",paramData,function(data) {
	            if(data.code == 200) {
                    layer.msg('添加成功');
                    location.href = '/news';
	            } else {

	            }
        	},"json");
            return false;
        });

    });
}
//使用百度编辑器构建编辑器
var ue = UE.getEditor('editor');


