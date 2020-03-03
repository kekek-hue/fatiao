layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload', 'laydate'], function () {
    var layer = layui.layer;
    var ppp = layui.ppp;
    var form = layui.form;
    var $ = layui.jquery;
    var config = layui.config;
    var upload = layui.upload;
    var laydate = layui.laydate

    var communeData = ppp.getTempData('t_commune_data');
    laydate.render({
        elem: '#start',
        type: 'datetime',
    });

    //时间选择器
    laydate.render({
        elem: '#end',
        type: 'datetime',


    });

    //文章栏目渲染category/getList
    (function(){
        $.get(config.serverUrl+'category/getList',{}, function (d) {
            if(d.status == '200'){

                // 要渲染的select对象
                var obj = $('#type-form');
                //封面
                var img = $('#lowSource');

                var data = d.result;
                for(let i in data){
                    var val = data[i];
                    obj.append(`<option value="${val.id}">${val.name}</option>`)
                }

                form.render('select');

                if(communeData !==undefined){
                    communeData.cover_ext = communeData.ext
                    //渲染完select标签再渲染数据
                    form.val('commune-form', communeData);

                    //渲染图片
                    img.attr('src', communeData.coverPath)
                }else{

                }

            }else{
                layer.alert('栏目数据请求失败,请联系管理员')
            }
        }, 'json')
    })();

    //form.render('select');
    // 表单提交事件
    form.on('submit(commune-form-submit)', function (data) {
        // layer.load(2);

        var datas = data.field
        datas.file = $("#cover_id").val();

        var url = config.serverUrl

        if(communeData!==undefined && communeData.hasOwnProperty('id')){

            //修改
            url = url+'adv/update'

            datas.id = communeData.id
        }else {
            //添加
            url = url + 'adv/add'
        }

        $.post(url, datas, function (data) {

            if (data.code == '200') {
                layer.closeAll('loading');
                layer.msg('添加成功', {
                    icon: 1
                });
                ppp.finishPopupCenter();
            } else {
                layer.msg(data.msg)
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
            dir: "dav"
        },
        field: 'file',
        size: 0,
        before: function (obj) {
            obj.preview(function (index, file, result) {
                $('#lowSource').attr('src', result); //图片链接（base64）
            });
        },
        done: function (res) {
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