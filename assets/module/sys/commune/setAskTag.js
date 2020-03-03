function Lay(layui) {
    layui.use(['layer', 'ppp', 'form', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var formSelects = layui.formSelects;
        var temp_data = ppp.getTempData('t_tag');
        console.log(temp_data);
        var role_id;
        var commune_id;
        var role_list = [];
        var commune_list = [];
        var t_admin_user = [];
        if (temp_data) {
            t_tag = temp_data.data;

            form.val('tag-form', t_tag);

            role_list = temp_data.role_list;

        }

        //渲染用户
        var renderSelectOption = function (data) {
            data.forEach(function (value, i) {
                var select = '';
                if (role_id == value.id) {
                    select = 'selected'
                }
                var optionHmtl = ' <option  data-grade=' + value.res_id + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
                $("#appCategory").append(optionHmtl);
            })
            form.render();
        }

        // if (role_list.length > 0) {


        // 表单提交事件
        form.on('submit(tag-form-submit)', function (data) {
            var tagData = data.field;
            if (data.field.id) {
                $.post('occupation/set',tagData,function (e) {
                    //弹框显示提示信息
                    layer.msg(e.result);
                    //关闭所有弹框
                    layer.closeAll('loading');
                    //调用上一页刷新列表
                    ppp.finishPopupCenter();
                },'JSON');
            } else {
                $.post('occupation/add',tagData,function (e) {
                    //弹框显示提示信息
                    layer.msg(e.result);
                    //关闭所有弹框
                    layer.closeAll('loading');
                    //调用上一页刷新列表
                    ppp.finishPopupCenter();
                },'JSON');
            }
        });
    });


}//方法结束