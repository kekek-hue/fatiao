layui.use(['table', 'layer', 'jquery', 'form', 'setter', 'ppp', 'element'], function () {
    var layer = layui.layer
        , ppp = layui.ppp
        , form = layui.form
        , $ = layui.jquery
        , setter = layui.setter
        , config = layui.config
        , element = layui.element
        , form_data = ppp.getTempData('form_data');
    form.val('demo-form', form_data);
    form.render();

    form.on('submit(demo-form-submit)', function (data) {
        layer.load(2);
        let formElem = document.querySelector('#demo-form');

        let formData = new FormData(formElem);
        let id = formData.get('id');

        //添加地址
        var url = 'crawler/type/add';

        //修改地址
        if(id!=0){
            url = 'crawler/type/set';
        }

        $.ajax({
            url: setter.serverUrl + url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                console.log("正在进行，请稍候");
            },
            success: function (responseStr) {
                layer.closeAll('loading');
                layer.msg('成功', {icon: 1});
                ppp.finishPopupCenter();
            },
            error: function (responseStr) {
                console.log("error");
            }
        });

        //取消按钮
        $('.cancel-btn').on('click', function(){
            ppp.finishPopupCenter();
        })
    });
});