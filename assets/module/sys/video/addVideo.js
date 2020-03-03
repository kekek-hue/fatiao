var atlaseArray = new Array();
var globalId = 0;
var words_arr = new Array();
var is_filter = 0;
var filter_text = '';

function Lay(layui) {
    layui.use(['layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config', "laypage"], function () {
        var layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            form = layui.form,
            config = layui.config,
            $ = layui.jquery,
            upload = layui.upload,
            element = layui.element,
            ppp = layui.ppp,
            imgTxtContent = null,
            setter = layui.setter;
        laypage = layui.laypage,
            // imgTextEditor = UE.getEditor('editor');
            element.init(); //防止折叠面板失效
        ppp.get('article/generateGlobalId', {
            async: false
        }, function (data) {
            globalId = data.id;
            $("#globalId").val(globalId);
        });
        var role = config.getRole();
        var articleData = ppp.getTempData('articleInfo');
        //这里以后优化---------->
        var articleId = ppp.getTempData('articleId');

        /*常规信息添加 
          监听提交
        */
        var token;

        function getToken() {
            return new Promise((resolve, reject) => {
                $.get("get/token", {

                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }
        //点击返回
        $('.ppp-back').on('click', function () {
            if(role==226){
                location.replace("./#!VideoList")
            }else{
                location.href = '#!videoList';
            }
            
        });
        async function getTokenfun() {
            var tokenStr = await getToken();
            console.log(tokenStr)
            token = tokenStr.token;
        }
        getTokenfun()
        form.on('submit(form-submit)', function (data) {

            // var data = JSON.stringify(data.field);
            var data = data.field;
            data.file = $("#cover_id").val();
            data.subToken = token;
            if (data.title.trim() == '') {
                layer.msg('标题不能为空');
                return false;
            }
            if (data.path == '') {
                layer.msg('请选择视频');
                return false;
            };
           
            if (data. cover_id== '') {
                layer.msg('请上传封面');
                return false;
            };
            var tagString = tagArr.join(',');;
            data.tags = tagString;
            var commit = 1
            if (commit == 1) {

                $.post('video/add', data, function (data) {

                    if (data.code == 200) {
                        
                        commit = 2
                        layer.msg('添加成功');
                        if(role==226){
                            location.replace("./#!VideoList")
                        } else{
                            location.href = '#/preview/id=' + data.id + '/type=3/' + ppp.getTimestamp() + '.html';
                        }
                        // location.href = '#/preview/id=' + data.id + '/type=3/' + ppp.getTimestamp() + '.html';

                    } else {
                        // 添加失败
                        getTokenfun();
                        layer.msg('添加失败');
                    }
                }, "json");
                return false;

            }


        });
        var aly = window.sessionStorage.getItem("aly")
        console.log(aly)
        var url,path,dataname
        if (aly == 1) {
            url = '/aly/upload/';
            path="/aly/uploadVideo",
            dataname="video"
        } else {
            url = 'article/imgUpload/' + globalId
            path="upload/video";
            dataname="file"
        }

        //缩略图片上传
        var uploadInst = upload.render({
            elem: '#thumbnail',
            // url: setter.serverApiUrl+'upload/video',
            url:path,
            exts: 'avi|rmvb|rm|asf|divx|mpg|mpeg|mpe|wmv|mp4|mkv|vob', //可传输文件的后缀
            accept: 'video',
            field:dataname,
            size:0,
            data: {
                dir: "video"
              },
            before: function (obj) {
                $('#failTextVideo').html('');
                layer.load();
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    console.log(file)
                    // if (file.size > 1578921) {
                    //     layer.alert('视频不能大于1.5M');
                    //     $('#failTextVideo').html('视频不能大于1.5M');
                    //     return false;
                    // }else{
                        $('#preview').html(file.name);
                    // }
                    // $('#demo2').append('<img style="width: 192px;height: 108px" src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
                });
            },
            done: function (res) {
                // layer.msg(res['message']);
                // $("#sdfsdf").attr('src', res['path']).show();
                if(res.code==200){
                   
                    $("input#path").val(res.data.url)
                   
                }  else{
                    $('#preview').html(res.msg);
                }          
                layer.closeAll();
                // return layer.msg('上传成功');
            },
            error: function (e) {
                console.log(e)
                
                $('#preview').html("上传失败");
                layer.closeAll();
            }
        });

        $("#btn").click(function(){
            var formData = new FormData();
            formData.append("video",document.getElementById("upfile").files[0]);
            formData.append('dir',"video");
            $.ajax({
                type: "POST", // 数据提交类型
                url:path, // 发送地址
                data: formData, //发送数据
                async: true, // 是否异步
                processData: false, //processData 默认为false，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data
                contentType: false //
            });
        });


        var aly = window.sessionStorage.getItem("aly")
        var url
        if (aly == 1) {
            url = '/aly/upload/'
        } else {
            url = 'article/imgUpload/' + globalId
        }

        var uploadInst = upload.render({
            elem: '#thumbnail-img',
            url:url,
            data: {
                dir: "article"
              },
            field: 'file',
            size: 0,
            before: function (obj) {
                layer.load();
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                layer.closeAll();
                //如果上传失败
                if (res.code == 200) {
                    $("#cover_id").val(res.data.id);
                    $("#cover_ext").val(res.data.ext);
                }else{
                    return layer.msg(res.msg);
                }
                //上传成功
               
                // console.error(res.data);
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

        //获取所有来源
        function allSource(curr) {
            return new Promise((resolve, reject) => {
                $.post(setter.serverUrl + 'article/source/list', {}, function (data) {
                    resolve(JSON.parse(data));
                });
            });
        }

        //获取所有标签
        function allTag(curr) {
            return new Promise((resolve, reject) => {
                $.post(setter.serverUrl + 'tags/lists', {
                    type: 0,
                    limit: 20,
                    page: curr
                }, function (data) {
                    resolve(JSON.parse(data));
                });
            });
        }
         //获取文章信息
         function getinfo() {
            return new Promise((resolve, reject) => {
                $.get("video/getVideoInfo", {
                    id: videoId
                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }

        //获取所有分类
        function getCategory() {
            return new Promise((resolve, reject) => {
                ppp.get('category/getList', {
                    async: true
                }, function (d) {
                    if (d.status == 200) {
                        resolve(d.result);
                    } else {
                        reject('category error');
                    }
                });
            })
        }
        var tagArr = []
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

        //处理数据
        async function dealData(curr) {
            $("#add_tag_div").html("")
            try {
                //文章信息
                var sourceList = await allSource();
                //标签
                var tag = await allTag();
                //分类
                var category = await getCategory();
                var category_id = 0;
                //渲染分类
                category.forEach(function (value, i) {
                    //外在形象的提升,内在品质的改善
                    var radioHtml = `<input type="radio" name="category_id" value="${value.id}" title="${value.name}" lay-skin="primary">`;
                    $("#category-id").append(radioHtml);
                });

                //渲染来源

                for (var i = 0; i < sourceList.length; i++) {
                    $("#source_type_id").append("<option value='" + sourceList[i].id + "'>" + sourceList[i].name + "</option>");
                }

                //渲染文章数据到form表单中
            } catch (e) {
                console.error('错了:');
                console.log(e);
            }
            form.render();
        };
        dealData()
      tagall();
        var checkedTxt = '';
        async function tagall(curr) {
            //文章信息
            // var liveInfo=await getinfo()
            //标签
            var tag = await allTag(curr);
            $("#add_tag_div").html("");
            if (tag && tag.data.length > 0) {

                //渲染标签
                tag.data.forEach(function (value, i) {
                    laypage.render({
                        elem: 'pagebox',
                        count: tag.total //数据总数，从服务端得到
                            ,
                        limit: tag.pageSize,
                        curr: curr,
                        layout: ['prev', 'page', 'next', 'skip'],
                        jump: function (obj, first) {
                            if (!first) {
                                console.log(obj)
                                var curr = obj.curr;
                                tagall(curr);
                            }
                        }
                    });
                    //已有的标签为选中状态
                    var checkedTxt = '';
                    for (let l in tagArr) {
                        var v = tagArr[l];
                        if (v == value.id) {
                            checkedTxt = 'checked';
                        }
                    }
                    //动态添加分类
                    var html = '<input type="checkbox" ' + checkedTxt + ' name="tagId" value=' + value.id + '  title="' + value.name + '" lay-skin="primary" lay-filter="yuan">';
                    $("#add_tag_div").append(html);
                })
            }
            form.render();

        };


    });
}