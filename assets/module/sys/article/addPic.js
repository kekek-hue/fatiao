layui.use(['setter', 'layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config', "laypage"], function () {
    var layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        form = layui.form,
        config = layui.config,
        $ = layui.jquery,
        upload = layui.upload,
        element = layui.element,
        ppp = layui.ppp,
        laypage = layui.laypage,
        setter = layui.setter,
        imgTxtContent = null,
        globalId = 0;
        var aly= window.sessionStorage.getItem("aly")
        var url
    if(aly==1){
      url='/aly/upload/'
    }else{
        url='/upload/'  
    }
    var role = config.getRole();
    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test1',
        url: url,
        data: {
            dir: "article"
          },
        before: function (obj) {
            layer.load();
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, image, result) {
                $('#demo1').attr('src',result); //图片链接（base64）
            });
        },
        done: function (res) {
            layer.closeAll();
            if (res.code == 200 ||(res.code ==0)) {
                $("#cover_id").val(res.data.id);
                $("#cover_ext").val(res.data.ext);
            }else{
                return layer.msg('上传失败');
            }
        },
        error: function () {
            layer.closeAll();
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
    //点击返回
    $('.ppp-back').on('click', function () {
        if(role==226){
            location.replace("./#!atlases.html")
        }else{
            location.href = '#!auditList';
        }
        
    });

    //多图片上传
    upload.render({
        elem: '#test2',
        url: url,
        data: {
            dir: "article"
          },
        multiple: true,
        field: "image",
        before: function (obj) {
            layer.load();
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, imgage, result) {
                // $('#demo2').append('<img style="width: 192px;height: 108px" src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
            });
        },
        done: function (res) {
            layer.closeAll();
            console.log(res.data.url)
            $('#demo2').append(`<div class="value-image" data-val="${res.data.id}">
<img style="width: 192px;height: 108px" src= "${res.data.url}"  class="layui-upload-img">
<label for="image-${res.data.id}">描述:</label>
<input type="text" id="image-${res.data.id}" name="alt[${res.data.id}]" value="">
<input type="hidden" name="ext[${res.data.id}]" value="${res.data.ext}">
<input type="hidden" name="images_ids[]" value="${res.data.id}"/>
<span style="cursor: pointer;" class="del-img">删除</span>
</div>`);
        }
    });



    //分类列表
    $.get("../../scheme/lists?article_id=" + globalId, function (d) {
        // debugger
        var data = d.result;
        data.forEach(function (value, i) {
            var html = '<input type="radio" name="type_id" value=' + value.id + '  title="' + value.name + '" lay-skin="primary">';
            $("#types-div").append(html);
        })
        form.render();
    }, 'json');

    //来源列表
    $.post("../../article/source/list", function (d) {
        d.forEach(function (value, i) {
            var html = ' <option value="' + value.id + '">' + value.name + '</option>';
            $("#frompic").append(html);
        })
        form.render();
    }, 'json');
    //获取系统标签
    var tagArr=[];
    function getTags(curr) {
        $("#add_tag_div").html("")
        var re = {
            type: 0,
            limit: 20,
            page: curr
        };
        $.post("../../tags/lists", re, function (data) {
            //完整功能
            laypage.render({
                elem: 'pagebox',
                count: data.total //数据总数，从服务端得到
                    ,
                limit: data.pageSize,
                curr: curr,
                layout: ['prev', 'page', 'next', 'skip'],
                jump: function (obj, first) {
                    if (!first) {
                        var curr = obj.curr;
                        getTags(curr);
                    }
                }
            });
            var data = data.data;
            data.forEach(function (value, i) {
                var checkedTxt = '';
                for (let l in tagArr) {
                    var v = tagArr[l];
                    if (v == value.id) {
                        checkedTxt = 'checked';
                    }
                }
                var html = '<input type="checkbox" name="tagId" ' + checkedTxt + ' value=' + value.id + '  title="' + value.name + '" lay-skin="primary" lay-filter="yuan">';
                $("#add_tag_div").append(html);
            })
            form.render();
        }, 'JSON');
    }
    getTags();
    // $('#add_tag_btn').on('click', function () {

    // });
    form.on('checkbox(yuan)', function (data) {
        console.log(data.elem.checked)
        var islike = 1;
        var spliceNum;
        if (tagArr.length == 0) {
            tagArr.push(data.value)
        }
        for (let l in tagArr) {
            var v = tagArr[l];
            if (v != data.value) {
                islike = 2
            } else {
                spliceNum=l;
                islike = 1
            }
        }
        console.log(spliceNum)
        if(spliceNum){
            if (data.elem.checked == false) {
                tagArr.splice(spliceNum, 1)
            }
        }else{
            if (islike == 2) {
                tagArr.push(data.value)
            } else {
            }

        }
       
        console.log(tagArr)
    });


    //删除图集文件
    $(document).on('click', '.del-img', function () {
        $(this).parent('div').remove();
        form.render();
    });
    var token;
    function getToken() {
        return new Promise((resolve, reject) => {
            $.get("get/token", {

            }, function (data) {
                resolve(data);
            }, "json");
        });
    }
    async function getTokenfun() {
        var tokenStr = await getToken();
        console.log(tokenStr)
        token = tokenStr.token;
    }
    getTokenfun()
    var commit=1
    form.on('submit(form-submit)', function (data) {
        if(commit==2){
            return
        }
        commit=2
      
        /***
         * add_tag: ""
         category_id: "1002"
         cover_id: ""
         file: ""
         tags[0]: "123123"
         tags[1]: "4231"
         tags[2]: "123"
         title: ""
         type_id: "2"
         */
        var reqData = data.field;
        reqData.file = $("#cover_id").val();
        reqData.subToken=token;
        console.log(reqData);
        delete reqData.add_tag;
        delete reqData.file;
        if (reqData.cover_id === '') {
            layer.alert('请上传封面');
            return false;
        }

        if (!reqData["images_ids[0]"]) {
            layer.alert('请上传内容图');
            return false;
        }
       
         var tagString = tagArr.join(',');;
         reqData.tags = tagString;
        reqData.fromtype = $("#frompic").val()
      
            $.post(setter.serverUrl + 'article/pic/add', reqData, function (d) {
                if (d.code == 200) {    
                    layer.msg('添加成功');
                    if(role==226){
                        location.replace("./#!atlases.html")
                    }else{
                    location.href = '#/preview/id=' + d.id + '/type=2/' + ppp.getTimestamp() + '.html';
                    }
                } else {
                    getTokenfun();
                    layer.msg('添加失败');
                }
                commit=2
            }, 'json');

  
       
    });
});