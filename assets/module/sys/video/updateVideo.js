var atlaseArray = new Array();
var globalId = 0;
var words_arr = new Array();
var is_filter = 0;
var filter_text = '';

function Lay(layui) {
    //atlases(layui)//图集上传
    layui.use(['layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config',"laypage"], function () {
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
        element.init();//防止折叠面板失效
        
        // 获取url中参数
        layui.use(['layer'], function(){
            var router = layui.router();
            console.log(router)
            videoId = router.search.id;
        })
        var token;
        var role = config.getRole();
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

        
        /*
         * 常规信息添加
         * 监听提交
         */
               //点击返回
    $('.ppp-back').on('click', function () {
         if(role==226){
                location.replace("./#!VideoList")
            }else{
        location.href = '#!videoList';
            }
    });
        var commit=1
        form.on('submit(routineInformation)', function (d) {
            if(commit==2){
                return false;
            }
            commit=2;
            var data = d.field;
            data.cover_ext=data.img_ext
            
            data.subToken=token
            data.file= $("#cover_id").val();
            data.id = videoId;
            if (!data.title) {
                layer.msg('标题不能为空');
                return false;
            }
            if (!data.path) {
                layer.msg('请选择视频');
                return false;
            }
          
          
             var tagString = tagArr.join(',');;
             data.tags = tagString;
            
           
                $.post('video/updateVideo', data, function (data) {
                    if (data.code == 200) { 
                    if(role==226){
                        location.replace("./index.html#!VideoList")
                    } else{
                        location.href = '#/preview/id=' + data.id + '/type=3/' + ppp.getTimestamp() + '.html';
                    }
                        // location.href = '#/preview/id=' + data.id + '/type=3/' + ppp.getTimestamp() + '.html';
                        layer.msg("修改成功");
                    } else {
                        layer.msg(data.msg);
                        // 添加失败
                        getTokenfun()
                       
                    }
                    commit=1
                }, "json");

       
            return false;
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

        // 视频图片上传
        var uploadInst = upload.render({  
            elem: '#thumbnail',
            url: path,
            field:dataname,
            data: {
                dir: "video"
              },
            exts: 'avi|rmvb|rm|asf|divx|mpg|mpeg|mpe|wmv|mp4|mkv|vob',        //可传输文件的后缀
            accept: 'video',
            before: function (obj) {
                layer.load();
             $(".isshow").show()
            },
             done: function (res) {
                 if(res.code==200){
                    $("#path").val(res.data.url)
                    $("#videoUpdate").attr('src',res.data.url);
                     layer.msg('上传成功');
                 }else{
                    layer.msg("上传失败")

                 }
                 layer.closeAll('loading');
                 
                 $(".isshow").hide()
               
               
            }
            , error: function (e) {
                layer.msg('上传失败,请重新上传');
                layer.closeAll();

            }
        });
       
        // 上传图片
        var uploadInst = upload.render({
            elem: '#thumbnail-img',
            url: url,
            data: {
                dir: "article"
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
                
                //上传成功
                if (res.code == 200 ||(res.code ==0)) {
                    $("#cover_id").val(res.data.id);
                    $("#cover_ext").val(res.data.ext);
                    $("#img_ext").val(res.data.ext);
                }else{
                    return layer.msg('上传失败');
                }
                //$('#facePath').val(config.imgUrl+res.data.src[0][0]);
            },
            error: function () {
                layer.closeAll();
                //演示失败状态，并实现重传
                var demoText = $('#failText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        }); 
  
        /***
         * @des 获取敏感词
         */
        function get_words() {
            return new Promise((resolve, reject) => {
                $.get("sensitive_words/check_works", {
                    words: ''
                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }

        //检查
        var check_words = function (words, words_arr) {
            if (words.length < 1) {
                return false;
            } else {

            }

            var arr = [];
            for (var i = 0; i < words_arr.length; i++) {
                var r = new RegExp(words_arr[i], "ig");
                var k1 = r.exec(words);
                if (k1 != null) {
                    // filter_text=filter_text+k1+',';
                    // filter_text = filter_text.replace(filter_text, "");
                    if (!arr.hasOwnProperty(k1[0])) {
                        arr.push(k1[0]);
                    }
                    is_filter = is_filter + 1;
                }
            }
            filter_text = uniques(arr);
            if (is_filter > 0) {
                $('#filter_text').show();
                $('#filter_text').find('.text').html(filter_text);
                layer.msg('该内容当中有敏感词，请注意');
            } else {
                $('#filter_text').hide();
                $('#filter_text').find('.text').html('');
            }
        };


        //去除重复并转换成字符串
        function uniques(arr) {
            var hash = [];
            for (var i = 0; i < arr.length; i++) {
                if (hash.indexOf(arr[i]) == -1) {
                    hash.push(arr[i]);
                }
            }
            return hash.join(',');
        }
        //获取所有来源
    function allSource(curr) {
        return new Promise((resolve, reject) => {
            $.post(setter.serverUrl + 'article/source/list', {}, function (data) {
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

        //获取所有标签
        function allTag(curr) {
           
            return new Promise((resolve, reject) => {
                $.post(setter.serverUrl + 'tags/lists', {
                    type: 0,
                    limit: 20,
                    page:curr
                }, function (data) {
                    resolve(JSON.parse(data));
                });
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

        //处理数据
        async function dealData(curr) {
            $("#add_tag_div").html("")
            try {
                //文章来源
    //渲染来源article/source/list
    var sourceList = await await allSource();
                var liveInfo=await getinfo()
                //分类
                var category = await getCategory();
                // //敏感词
                var words = await get_words();

                var category_id = 0;
                if (liveInfo) {
                    //当info存在,newData也存在的时候才这么做
                    var category_id = liveInfo.video.category_id;
                } else {

                }

                $('#lowSource').attr('src', liveInfo.video.coverPath);
                $("#videoUpdate").attr('src',liveInfo.video.path);
                //     $("video").attr('src', d.videoPath)
                //渲染分类
                category.forEach(function (value, i) {
                    var checked;
                    if (value.id == category_id) {
                        checked = 'checked';
                    } else {
                        checked = '';
                    }

                    //外在形象的提升,内在品质的改善
                    var radioHtml = `<input type="radio" name="category_id" value="${value.id}" ${checked} title="${value.name}" lay-skin="primary">`;
                    $("#category-id").append(radioHtml);
                });

                //设置文章内容的编辑器
                var imgTxtContent =liveInfo;
                // imgTextEditor.setContent(imgTxtContent);

                //检查敏感词
                check_words(imgTxtContent, words);

                //渲染来源
             
                for (var i = 0; i < sourceList.length; i++) {
                    $("#source_type_id").append("<option value='" + sourceList[i].id + "'>" + sourceList[i].name + "</option>");
                }

    
                var articleData = liveInfo.video;
                    form.val('article-form', articleData);
                    form.render();
            } catch (e) {
                console.error('错了:');
                console.log(e);
            }
        };
        dealData()
        var tagArr=[]
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
            if (islike == 2) {
                tagArr.push(data.value)
            } else {
                if (data.elem.checked == false) {
                    tagArr.splice(spliceNum, 1)
                }
            }
            console.log(tagArr)
        });
        var checkedTxt = '';
        async function tagall(curr){
         
             //文章信息
             var liveInfo=await getinfo()
            //标签
            var tag = await allTag(curr);
            $("#add_tag_div").html("");
            if (tag && tag.data.length > 0) {
                //文章已经有的标签
                var labels = liveInfo.tagArr;
                //渲染标签
                tag.data.forEach(function (value, i) {
                    for (let l in labels) {
                        var v = labels[l].tag_id;
                        if (v === value.id) {
                           tagArr.push(v)
                        }
                    }
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
                                tagcheck(curr);
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
  
      
         async function tagcheck(curr) {
            //标签
            var tag = await allTag(curr);
            $("#add_tag_div").html("");
            if (tag && tag.data.length > 0) {
                //渲染标签
                tag.data.forEach(function (value, i) {
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
         tagall()
      

    });
}


