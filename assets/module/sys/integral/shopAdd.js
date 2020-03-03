layui.use(['element', 'ppp', 'form', 'layer', 'setter'], function () {
    var ppp = layui.ppp, form = layui.form, layer = layui.layer, setter = layui.setter;
    let formData = new FormData();

    $('#image').on('click', function () {
        ppp.popupCenter({
            title: '图片',
            path: 'components/views/photo/index.html',
            finish: function (data) {
                //图片
                var img = new Image();
                img.src = data;
                var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');
                img.onload = function () {
                    context.drawImage(img, 0, 0, 400, 400, 0, 0, 100, 100);
                    canvas.toBlob(function (blob) {
                        formData.append('file', blob);
                    });
                };
            }
        });
    });

    form.on('submit(integral-form-submit)', function (data) {

        //必须上传封面
        if (!formData.has('file')) {
            layer.alert('请上传封面');
            return false;
        }

        layer.load(2);
        for (let i in data.field) {
            console.log(i);
            formData.append(i, data.field[i]);
        }
        var url = setter.serverApiUrl + 'integral/shop/add';
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (data) {
                if (data.result === "ok") {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                    location.href = '#!integralShop';
                } else {
                    layer.msg('添加失败', {icon: 1});
                }
            },
            error: function (responseStr) {
                console.log("error");
            }
        });

        return false;
    });


    //取消
    $('#cancel').on('click', function () {
        location.href = '#!integralShop';
    });
});