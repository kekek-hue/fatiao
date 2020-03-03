function Lay() {
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var jq = layui.jquery;
        var upload = layui.upload
        var data = ppp.getTempData('t_commune_data');
        var communeData = data.data;

        //获得所有版式
        form.val('commune-form', communeData);

        //公社
        let commune  = data.commune;
        let userData  = data.userData;
        if(userData.role_id == 1){//如果是公社管理员,就不渲染公社选项
            jq('#commune-role').remove();
        }else{
            for(let i  in commune){
                let val = commune[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#commune-id').append(option)
            }
            form.render('select');
        }

        // 表单提交事件
        form.on('submit(commune-form-submit)', function (data) {
            var datas = data.field
            console.log(datas.name)
            $.post(config.serverUrl+'topic/add', datas, function (data) {

                if (data.code == '200') {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {
                        icon: 1
                    });
                    ppp.finishPopupCenter();
                } else {
                    layui.msg(data.msg)
                }
                commit = 1
            }, "json");

            return false;
        });
       

        form.render();
    });

}//函数结束