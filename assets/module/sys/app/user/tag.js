function Lay(){
    layui.use(['layer', 'ppp', 'form', 'iconPicker','config'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var config = layui.config;
        var $ = layui.jquery;
        var communeData = ppp.getTempData('t_commune_data');
        // console.error(communeData);
        //获得所有版式
       
        if(communeData.check_status==1){
            $("#status").val(2)
        }else{
            $("#status").val(1)
        }
        form.val('commune-form', communeData);
        //form.render('select');
        // 表单提交事件
        form.on('submit(dav-form-submit)', function (data) {

            var data =data.field
           
            data.user_id=data.id;
            data.user_name=communeData.nickname;
            if(data.status=="1"){
                data.check_status="2";
            }else{
                data.check_status="1";
            }
           
            
                var url='set/vip';
                $.ajax({
                    type:'post',
                    url:url,
                    data:data,
                    dataType:'json',
                    success:function(e){
                        if(e.code == 200){
                            layer.msg("设置成功")
                            // location.href = '#!ask.html';
                            ppp.finishPopupCenter();
                        }
                    }
                })

        });
        form.render();
    });

}//函数结束