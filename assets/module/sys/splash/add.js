function Lay() {
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects', 'upload'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var formSelects = layui.formSelects;
        var typeObj = ppp.getTempData('t_splash');
        var upload = layui.upload;
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#upload-btn'
            , url: '/splash/upload'
            , before: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    $('#show-img').attr('src', result); //图片链接（base64）
                });
            }
            , done: function (res) {
                //如果上传失败
                if (res.code != 200) {
                    return layer.msg('上传失败');
                }
                $('#image_id').val(res.data.id);
                $('#image_ext').val(res.data.ext);
            }
            , error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });

        // 获取所有菜单
        ppp.get('type/lists', {}, function (data) {
            $('#pId').vm({parents: data.result});
            form.render('select');
        });
        if (typeObj) {
            $('#upload-btn').hide();
            ppp.fromVal('type-form', typeObj);
            $('#show-img').attr('src', typeObj.image_url);
        } else {

        }
        // 表单提交事件
        form.on('submit(menu-form-submit)', function (data) {
            //定义一数组
            layer.load(2);
            if (data.field.row != '0') {
                ppp.post('splash/edit', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            } else {
                ppp.post('splash/add', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            }
            return false;
        });
        form.render();
    });

}//函数结束