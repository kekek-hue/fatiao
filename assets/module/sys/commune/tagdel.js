function Lay(){
    layui.use(['layer', 'ppp', 'form', 'iconPicker','config'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var communeData = ppp.getTempData('t_commune_data');
        // console.error(communeData);
        //获得所有版式
        form.val('commune-form', communeData);
        //form.render('select');
        // 表单提交事件
        form.on('submit(commune-form-submit)', function (data) {

            console.log(data);
            data.field.name = data.field.tag
            var url = config.serverApiUrl + 'tag/tagDel';
            var url_data = {data:data.field};

            $.post(url,url_data,function(e){
                console.log(e);
            },'JSON');
                location.reload();
            return false;

        });
        form.render();
    });

}//函数结束