function Lay() {
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var jq = layui.jquery;
        var upload = layui.upload;
        var communeData = ppp.getTempData('commune_data');
var loading;
var coverext
        if(communeData){
            //公社的封面
            var cover = communeData.image_url;
            $('#lowSource').attr('src', cover);
        }

        //缩略图片上传
        var uploadInst = upload.render({
            elem: '#thumbnail'
            , url:'/aly/upload/',
            field: 'image',
            data: {
                dir: "commune"
              }
            , before: function (obj) {
                loading = layer.load(1, {
                    shade: [0.3, '#999'] //0.1透明度的白色背景
                });
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            }
            , done: function (res) {
                //如果上传失败
                if (res.code == 200 ) {
                    $("#cover_id").val(res.data.id);
                    coverext=res.data.ext;
                     console.error(res.data);
                     layer.closeAll('loading');
                   
                }else{
                    layer.closeAll('loading');
                    return layer.msg('上传失败');
                    
                }
               
                //上传成功
               
               
            }
            , error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#failText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
                layer.closeAll('loading');
            }
        });


        //是否是公式管理员  平台管理员查不到 @author lifang  @time 2019-9-28
        if (communeData.is_admin==1)
        {
            $("#index").hide();
        }

        //首页显示 @author lifang @time 2019-9-28
        if (communeData.index==1)
        {
            $("input[name=index]:eq(0)").attr("checked",'checked');
        }
        else
        {
            $("input[name=index]:eq(1)").attr("checked",'checked');
        }

        //获得所有版式
        form.val('commune-form', communeData);
        //form.render('select');
        // 表单提交事件
        form.on('submit(commune-form-submit)', function (data) {
            layer.load(2);

            let formData = new FormData();
            let userid = $("#id").val();
            let name = $("#name").val();
            let info = $("#info").val();
            let cover_id = $("#cover_id").val();

            let index =  $("input[type='radio']:checked").val();


            formData.append("userid", userid);
            formData.append("name", name);
            formData.append("info", info);
            formData.append("index", index);
            formData.append("cover_id", cover_id);
            formData.append("id", communeData.id);
            formData.append("cover_ext", coverext);

            $.ajax({
                url: config.serverUrl+ 'commune/update',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType:'json',
                beforeSend: function () {
                    console.log("正在进行，请稍候");
                },
                success: function (e) {
                    if (e.code==200)
                    {
                        layer.closeAll('loading');
                        layer.msg('添加成功', {icon: 1});
                        ppp.finishPopupCenter();
                    }
                    else
                    {
                        layer.closeAll('loading');
                        layer.msg('添加失败', {icon: 1});
                        ppp.finishPopupCenter();
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