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
        var smallVideoid;
        layui.use(['layer'], function () {
            var router = layui.router();
            smallVideoid = router.search.id;


        })


        var role = config.getRole();

        
        //获取文章信息
        function articleInfo() {
            return new Promise((resolve, reject) => {

                $.get("found/info", {
                    id: smallVideoid
                }, function (data) {
                    resolve(data);
                }, "json");

            });
        }

    
        //处理数据
        dealData();
        async function dealData(curr) {
            try {

                var info = await articleInfo();
               
                $(".content").html(info.content);
                $(".time").html(info.create_time)
                if (info.images_path) {
                    for (let i in info.images_path) {
                        var imgstr = `  <img src="${info.images_path[i]}" alt="" srcset=""> `
                    }
                    $(".imgContent").append(imgstr)
                } else {
                    var videoSrc = `<video width="70%" height="314" autoplay="autoplay" controls="controls" loop="loop" src="${info.video_path}">
				                          
                    </video>`
                    $(".imgContent").html(videoSrc)

                }

                // 视频

                btnShow(info.status);


            } catch (e) {
                console.error('.............错了:');
                console.log(e);
            }
        }

        function btnShow(datashow) {
            console.log(datashow=="3")
            if (datashow == "3") {
                $(".isshow").hide()
                $(".isShow").addClass("layui-hide")
            }
        }                                                         

        $(".allbut").on("click",async function (e) {

            switch (e.target.name) {
              
                case 'nopassArticles':
                var tijiao = await submitAudit()
                $(".isshow").hide()
                $(".isShow").addClass("layui-hide")
                layer.msg(tijiao.msg);
                
                break;
                case 'gobanck':
                  
                        location.replace("./#!smallVideo.html")
                  

                    break;
               
            };
           

        });


     
        function submitAudit() {
            return new Promise((resolve, reject) => {
                $.post("/found/audit", {
                    id:smallVideoid
                }, function (data) {
                    resolve(data);
                }, "json");

            });
        }


    });
}