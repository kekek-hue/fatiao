function Lay(layui) {
    layui.use(['layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config', 'setter', "laypage"], function () {
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
            // imgTextEditor = UE.getEditor('editor'),
            setter = layui.setter;
        var is_filter = 0;
        element.init(); //防止折叠面板失效

        layui.use(['layer'], function () {
            var router = layui.router();
            previewid = router.search.id;
            type_id = router.search.type;

        })


        var role = config.getRole();
        var userid = config.getUid();
        var articleData;
     
        //获取文章信息
        function articleInfo() {
            return new Promise((resolve, reject) => {
                if (type_id == 1 || type_id == 2) {
                    ppp.get('article/getArticleById/' + previewid + '/1', {
                        async: false
                    }, function (info) {
                        resolve(info);
                    });
                } else if (type_id == 3) {
                    $.get("video/getVideoInfo", {
                        id: previewid
                    }, function (data) {
                        resolve(data);
                    }, "json");
                } else if (type_id == 4 || type_id == 5) {
                    $.get("live/info", {
                        id: previewid
                    }, function (data) {
                        resolve(data);
                    }, "json");
                }
            });
        }
        // 操作记录
        function auditHistory() {
            return new Promise((resolve, reject) => {
                $.get("audit/log/list", {
                    id: previewid
                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }
        //点击返回

        //处理数据
        dealData();
        async function dealData(curr) {
            
            try {
                var type
                var tagArr;
                //文章信息
                var info = await articleInfo();
                var historyList = await auditHistory();
                // 操作记录
                historyList.forEach(function (value, i) {
                    var histroyHtml = ` <div class="his"><span class="name">${value.name}</span><span class="time">${value.create_time}</span><span class="dosomething">${value.auditName}</span></div>`;
                    $("#historyBox").append(histroyHtml);
                });
                // 文章信息
                if (type_id == 1 || type_id == 2) {
                    articleData = info.newData;
                    imgText=info.imgTxtContent;
                    tagArr=info.tags;
                    // 图文图集
                  type="图文"
                    $(".title").html(info.newData.title)
                    $(".creatTime").html(info.newData.created)
                    $(".content").html(info.imgTxtContent.data)
                    if (type_id==2) {
                        type="图集"
                        $(".content").html("")
                        info.newData.imagePath.forEach(function (value, i) {
                            var imgAll = `<img src="${value.path}" alt="" srcset=""><p>${value.alt}</p>`;
                            $(".content").append(imgAll);
                        });
                    }
                } else if (type_id == 3) {
                    articleData = info.video; 
                    tagArr=info.tagArr;
                    type="视频"
                    // 视频
                    $(".title").html(info.video.title);
                    $(".creatTime").html(info.video.published);
                    var videoSrc = `<video width="70%" height="314" autoplay="autoplay" controls="controls" loop="loop" src="${info.video.path}">
				                          
                                     </video>`
                    $(".content").html(videoSrc)
                } else if (type_id == 4 || type_id == 5) {
                    articleData = info;
                    tagArr=info.tags;
                    // 专题 直播
                    $(".title").html(info.title)
                    if (type_id == 4) {
                        type="专题"
                        $(".creatTime").html(info.published)
                        $(".content").html(info.abstract)
                    } else {
                        type="直播"
                        var time = ` ${info.startTime} --  ${info.endTime}`
                        $(".creatTime").html(time)
                        $(".content").html("直播路径 : " + info.path)
                    }
                }
                $(".cover").attr("src",articleData.coverPath)
                $(".type").text(type)
                $(".from").text(articleData.sourceName?articleData.sourceName:articleData.source_name);
                var tagstring;
                var tags=[]
                for(let i in tagArr){
                 tags.push(tagArr[i].name);
                }
                tagstring=tags.join(" , ")
                $(".tags").text(tagstring)
               
                btnShow()
            } catch (e) {
                console.error('.............错了:');
                console.log(e);
            }
        }

        function btnShow() {
            console.log(role)
            if((articleData.status ? articleData.status : articleData.state) != setter.statusArticle.weiti){
                $(".zisShow").addClass("layui-hide")
            }
            if (role == setter.roleArticle.zebian && userid != articleData.creator_id) {
              $(".isshow").addClass("layui-hide")
              $(".zisShow").addClass("layui-hide")
            } else if (role == setter.roleArticle.zhubian && (articleData.status ? articleData.status : articleData.state) > setter.statusArticle.zhongZhu) {
                $(".isshow").addClass("layui-hide")
                $(".zisShow").addClass("layui-hide")
            } else if (role == setter.roleArticle.zhengshen && (articleData.status ? articleData.status : articleData.state) > setter.statusArticle.zhongZheng) {
                $(".isshow").addClass("layui-hide")
                $(".zisShow").addClass("layui-hide")
            } else if (role == setter.roleArticle.zongbian && (articleData.status ? articleData.status : articleData.state) > setter.statusArticle.zhongZong) {
                $(".isshow").addClass("layui-hide")
                $(".zisShow").addClass("layui-hide")
            }else if(role == setter.roleArticle.zebian && userid == articleData.creator_id){
                $(".isshow").addClass("layui-hide")
            }
           

        }
       
        $(".allbut").on("click", function (e) {

            switch (e.target.name) {
                case 'editArticle':
                    openEdit()
                    break;
                case 'passArticles':
                    addAudit(1)
                    break;
                case 'nopassArticles':
                    addAudit(2)
                    break;
                case 'gobanck':
                    if (type_id == 1 || type_id == 2) {
                        location.replace("./#!auditList")
                    } else {
                        location.replace("./#!videoList")
                    }

                    break;
                case 'lookPhone':
                    openPhone()
                    break;
            };
        });

        /*
         *编辑内容
         */
        var openEdit = function () {
            if (type_id == "2") {
                location.href = `#!editPic/${articleData.id}`
            } else if (type_id == "1") {
                location.href = "#/articleInfo/" + articleData.id + '/' + ppp.getTimestamp() + '.html';
            } else if (type_id == "3") {
                location.href = '#/updateVideo/id=' + articleData.id + '/' + ppp.getTimestamp() + '.html';
                // gourl = "#!editPic";
            } else if (type_id == "5") {
                location.href = '#/updateLive/id=' + articleData.id + '/' + ppp.getTimestamp() + '.html';
                // gourl = "#!editTopic";
            } else if (type_id == "4") {
                location.href = "#/editTopic//id=" + articleData.id + '/' + ppp.getTimestamp() + '.html';

            }
        }
        // 审核   
        async function addAudit(type) {
            
                var tijiao = await submitAudit(articleData, type)
                if (tijiao.code == 200) {
                    layer.msg("提交成功");
                } else {
                   return layer.msg(tijiao.msg);
                }
                if (type_id == 1 || type_id == 2) {
                    location.replace("./#!auditList")
                } else {
                    location.replace("./#!videoList")
                }
        }
        var url;
       if (type_id == 1 || type_id == 2) {
           url="../../audit/subAudit"
        } else {
            url="../../audit/submit/special"
        } 

        function submitAudit(articleData, type) {
            return new Promise((resolve, reject) => {
                $.post(url, {
                    "article_id": articleData.id,
                    "type": type
                }, function (data) {
                    resolve(data);
                }, "json");

            });
        }
     
        // 手机预览
        function openPhone() {
            var openUrl;
            var api = setter.serverUrl;
            if (type_id == "1") {
                openUrl =api+"homeDetail/imgtextdetail.html" 
            } else if (type_id == "2") {
                openUrl =api+ "homeDetail/picturedetail.html"
            } else if (type_id == "3") {
                // openUrl=$('#videoBox')
                openUrl =api+ "homeDetail/videodetail.html"
            } else if (type_id == "5") {
                openUrl =api+ "homeDetail/liveDetail.html"
            } else if (type_id == "4") {
                openUrl =api+ "homeDetail/zhuanti.html"
            }
            layer.open({
                type: 2,
                shadeClose: true,
                shade: 0.3,
                offset: "20%",
                shadeClose: false,
                title: "文章详情",
                area: ["375px", "667px"],
                content:openUrl,
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    if (type_id == "1") {
                        body.find("h3").html(articleData.title);
                        body.find('.titfoot').html(articleData.created);
                        body.find('.contentinfo').html(imgText.data)
                    } else if (type_id == "2") {
                        body.find("h3").html(articleData.title);
                        if (articleData.image_ids) {
                            articleData.imagePath.forEach(function (value, i) {
                                var imgAll = `<div class="swiper-slide">
                                <p><img src="${value.path}"></p>
                                <p class="imgTitle">${i+1}/${articleData.imagePath.length} <span>${value.alt}</span></p>
                            </div>`;
                                body.find('.swiper-wrapper').append(imgAll);

                            });
                        }
                        iframeWin.getswiper()
                    } else if (type_id == "3") {
                        body.find("h4").html(articleData.title);
                        body.find('.titbottom').html(articleData.published);
                        body.find('video').attr("src", articleData.path);
                  
                    

                    } else if (type_id == "5") {
                        body.find(".tit").html(articleData.title);
                        body.find('.right-time').html(articleData.startTime);
                        body.find('#source').attr("src", articleData.path);
                        body.find('.endtime').html(articleData.startTime);

                    } else if (type_id == "4") {
                        body.find("h4").html(articleData.title);
                        body.find('.time').html(articleData.published);
                        body.find('img').attr("src", articleData.coverPath);
                        body.find('.zhaiyao').html(articleData.abstract);
                    }
                }
            });
        }
    });
}