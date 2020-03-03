function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , config = layui.config
            , ppp = layui.ppp;
        var communeAskData = ppp.getTempData('commune_ask_data');

        //开始时间
        laydate.render({
            elem: '#start_time'
            , type: 'datetime'
        });
        //结束时间
        laydate.render({
            elem: '#end_time'
            , type: 'datetime'
        });

        form.val('commune-ask-top-form', communeAskData);

        // 表单提交事件
        form.on('submit(commune-ask-top-form-submit)', function (data) {
            layer.load(2);

            let formData = new FormData();
            let askId = $("#ask_id").val();
            let beginTime = $("#start_time").val();
            let endTime = $("#end_time").val();
            let sort = $("#sort").val();

            if(!beginTime){
                layer.closeAll('loading');
                layer.msg('开始时间不能为空', {icon: 2});
                return false;
            }
            if(!endTime){
                layer.closeAll('loading');
                layer.msg('结束时间不能为空', {icon: 2});
                return false;
            }
            if(!sort){
                layer.closeAll('loading');
                layer.msg('排序不能为空', {icon: 2});
                return false;
            }
            formData.append("userId", '1');
            formData.append("beginTime", beginTime);
            formData.append("endTime", endTime);
            formData.append("askId", askId);
            formData.append("sort", sort);
            formData.append("targetType", communeAskData.type);

            jq.ajax({
                url: config.serverUrl + 'commune/ask/set/top',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {

                    if (data.code == 200) {
                        layer.closeAll('loading');
                        layer.msg('置顶成功', {icon: 1});
                        ppp.finishPopupCenter();
                    } else {
                        layer.msg(data.msg);
                        layer.closeAll('loading');
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
}
   