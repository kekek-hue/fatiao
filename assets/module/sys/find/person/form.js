function Lay() {
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
        form.on('submit(person-form-submit)', function (data) {
            layer.load(2);

            var url;
            let formData = new FormData();
            let editType = $("#edit_type").val();
            let id = $("#id").val();
            let name = $("#name").val();

            if (editType == "area" || editType == "profession" || editType == "returnMechanism" || editType == "itemAmount"|| editType == "demonstration" || editType == "stages") {
                formData.append("id", id);
                url = config.serverApiUrl + 'occupation/edit';
            } else if (editType == "addArea") {
                url = config.serverApiUrl + 'address/add';
            } else if (editType == "addProfession") {
                url = config.serverApiUrl + 'occupation/add';
            } else if (editType == "addReturnMechanism") {
                url = config.serverApiUrl + 'mechanism/add';
            } else if (editType == "addItemAmount") {
                url = config.serverApiUrl + 'investment_amount/add';
            } else if (editType == "addJob"){
                url = config.serverUrl + 'occupation/add';
                formData.append("type", "5");
            } else if (editType == "addDemonstration"){
                url = config.serverUrl + 'occupation/add';
                formData.append("type", "5");
            }else if (editType == "addStage"){
                url = config.serverUrl + 'occupation/add';
                formData.append("type", "5");
            }

            formData.append("name", name);
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
                    } else {
                        layer.closeAll('loading');
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

}//函数结束