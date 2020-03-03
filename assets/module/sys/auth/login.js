if(navigator.onLine){

}else{
    alert('请检查网络');
}
  var codeflag = false;
  $("#imageAuthentication").val(-1);
    layui.config({
        base: 'assets/module/',
        version: true,
        debug: true
    }).extend({
        jigsaw: 'jigsaw/jigsaw',
    }).use(['config', 'form','jigsaw'], function () {
        var $ = layui.jquery;
        var form = layui.form;
        var config = layui.config;
        var jigsaw = layui.jigsaw;
        if (config.getToken()) {
            location.replace('./');
            return;
        }
        form.verify({
            loginName: function (value) {
                if (/^\s*$/g.test(value)) {
                    return '请填写用户名';
                }
            },
            password: function (value) {
                if (/^\s*$/g.test(value)) {
                    return '请填写密码';
                }
            }
        });
        // 表单提交
        form.on('submit(login-submit)', function (obj) {
            if(navigator.onLine){

            }else{
                layer.alert('请检查网络');
                return false;
            }
            //验证是否开启 codeflag
            if (codeflag==true) {
                layer.load(2);
                var data = {
                    name:obj.field.loginName,
                    pwd:obj.field.password,
                    authentication:obj.field.imageAuthentication
                };
                $.ajax({
                    url: config.serverUrl + 'auth/login',
                    data: data,
                    type: 'post',
                    dataType:"json",
                    success: function (data) {



                        if(data.result.aly==true){
                            window.sessionStorage.setItem("aly","1")
                        }else{
                            window.sessionStorage.setItem("aly","2")
                        }

                        if(data.code == 500){
                            layer.msg('请检查用户名或密码',{icon:5});
                            layer.closeAll('loading');
                            return false;
                        }
                        if(data.code == -1){
                            layer.msg(data.msg,{icon:5});
                            layer.closeAll('loading');
                            return false;
                        }
                        config.removeAll();
                        config.putUid(data.result.uid);
                        config.putRole(data.result.role_id);
                        config.putToken(data.result.token);

                        if(data.result.role_id=== '1'){
                            location.replace('./#!member.html');
                        }else if(data.result.role_id>=10 && data.result.role_id<=13 ){
                            location.replace("./#!auditList")
                        }
                        else{
                            location.replace('./index.html');
                        }
                    },
                    error: function (xhr) {
                        layer.msg(xhr.responseText, {icon: 5});
                        layer.closeAll('loading');
                    }
                });
            } else {
                layer.msg('请滑动验证框', {icon: 5});
            }
        });

        jigsaw.init(document.getElementById('captcha'), function () {
            if(navigator.onLine){

            }else{
                layer.alert('请检查网络');
                return false;
            }

            codeflag = true;
            layer.msg('验证成功', {time: 888});
            $("#imageAuthentication").val(200);
        }, function () {
            if(navigator.onLine){

            }else{
                layer.alert('请检查网络');
                return false;
            }
            codeflag = false;
            layer.msg('请继续验证', {time: 888});
            $("#imageAuthentication").val(-1);
        });
    });