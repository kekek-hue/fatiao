function Lay(){
    
    layui.use(['layer', 'ppp', 'form', 'iconPicker','config'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var communeData = ppp.getTempData('t_commune_data');
        console.error(communeData);
        //获得所有版式
        form.val('commune-form', communeData);
        //form.render('select');
        // 表单提交事件
        form.on('submit(dav-form-submit)', function (data) {

            console.log(data);
            var url ='set/vip';
            var data =data.field
           
            data.user_id=data.userid;
            data.user_name=communeData.nickname;
            data.check_status=data.checkid;
            $.post(url,data,function(e){
             
             
                ppp.finishPopupCenter()

            },'JSON');
                // location.reload();
            return false;

        
        });
        form.render();
    });

}//函数结束