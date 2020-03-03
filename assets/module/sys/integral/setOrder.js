layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload'], function () {
    var layer = layui.layer;
    var ppp = layui.ppp;
    var form = layui.form;
    var $ = layui.jquery;
    var config = layui.config;
    var jq = layui.jquery;
    var findPersonData = ppp.getTempData('person-form');

    //获得所有版式
    $("#edit_type").val(ppp.getTempData('person-type'));
    form.val('person-form', findPersonData);
    //form.render('select');
    // 表单提交事件 itemAmount
    form.on('submit(integral-form-submit)', function (data) {
        layer.load(2);
        var url;
        let formData = new FormData();
        for(let i in data.field){
            console.log(data.field[i]);
            formData.append(i, data.field[i]);
        }
        url = config.serverApiUrl + 'integral/order/edit';
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (data) {
                if (data.result == "ok") {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    ppp.finishPopupCenter();
                    // location.reload();
                } else {
                    layer.msg('修改失败', {icon: 1});
                }
            },
            error: function (responseStr) {
                console.log("error");
            }
        });

        return false;
    });
    form.render();
});