function Lay() {
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var upload = layui.upload

        var communeData = ppp.getTempData('t_commune_data');

        //获得所有版式
        form.val('commune-form', communeData);
        //form.render('select');
        // 表单提交事件
        form.on('submit(commune-form-submit)', function (data) {
            // layer.load(2);

            var datas = data.field
            datas.file = $("#cover_id").val();

            console.log(datas.name)
            $.post(config.serverUrl + 'commune/create', datas, function (data) {

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
    
          var  url = '/aly/upload/'
        
        var uploadInst = upload.render({
            elem: '#thumbnail-img',
            url: url,
            data: {
                dir: "commune"
            },
            field: 'file',
            size: 0,
            before: function (obj) {
                layer.load(2);
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                layer.closeAll();
                //如果上传失败
                if (res.code != 200) {
                    return layer.msg('上传失败');
                }
                //上传成功
                $("#cover_id").val(res.data.id);
                $("#cover_ext").val(res.data.ext);
                //$('#facePath').val(config.imgUrl+res.data.src[0][0]);
            },
            error: function () {
                layer.closeAll();
                //演示失败状态，并实现重传
                var demoText = $('#failText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });

        form.render();
    });

} //函数结束