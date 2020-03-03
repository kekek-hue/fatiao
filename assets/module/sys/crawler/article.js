function Lay(layui) {
    layui.use(['ppp', 'layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'config'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , config = layui.config
        ppp = layui.ppp;
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
        //所有分类
        ppp.get('crawler/getTypes', {async: true}, function (data) {
            //动态添加父级分类
            data.forEach(function (value, i) {
                var optionHmtl = ' <option  data-grade=' + value.name + ' value="' + value.id + '">' + value.name + '</option>';
                $("#tag_id").append(optionHmtl);
            })
            form.render();
        });
        //所有来源网址

        jq.get(config.serverUrl + 'crawler/getSites', function (site) {
            var json = JSON.parse(site);
            var sites = json;

            if (sites) {
                sites.forEach(function (value, i) {
                    var optionHmtl = ' <option  data-grade=' + value.des + ' value="' + value.name + '">' + value.des + '</option>';
                    $("#site_id").append(optionHmtl);
                })
                form.render();
            }

        });


        //执行一个 table 实例
        var articleTable = table.render({
            elem: '#crawler-article-table'
            , url: 'crawler/article/lists' //数据接口
            , toolbar: '#articleTool'
            , title: '文章列表'
            , page: true //开启分页
            , cols: [[ //表头
                 {type: 'checkbox',width:40},
                { align: 'center', title: '操作', toolbar: '#barDemo',width:70}
                , {field: 'id', title: 'ID',width:200}
                , {field: 'title', title: '文章标题',width:600}
                , {field: 'tag_name', title: '命中分类',width:170}
                , {field: 'tag_info', title: '命中关键字',width:170}
                , {field: 'site_id', title: '来源网站id', sort: true,width:120}
                , {field: 'cate', title: '来源类型分类', sort: true,width:140}
                , {
                    align: 'center', templet: function (d) {
                        var spanHtml = '';
                        if (d.status == 3) {
                            spanHtml = '<span style="color:#009688;" class="status_' + d.id + '">下载失败</span>';
                        } else if (d.status == 4) {
                            spanHtml = '<span style="color:#F581B1;"  class="status_' + d.id + '">已解析</span>';
                        } else if (d.status == 8) {
                            spanHtml = '<span style="color:#f5ac23;"  class="status_' + d.id + '">草稿</span>';
                        } else if (d.status == 2) {
                            spanHtml = '<span style="color:#f5ac23;"  class="status_' + d.id + '">未解析</span>';
                        } else if (d.status == 1) {
                            spanHtml = '<span style="color:#f5ac23;"  class="status_' + d.id + '">未下载</span>';
                        } else if (d.status == 5) {
                            spanHtml = '<span style="color:#f5ac23;"  class="status_' + d.id + '">解析失败</span>';
                        }
                        return spanHtml;
                    }, title: '状态',
                    width:200
                }
                , {field: 'created', title: '创建时间',width:200}
                , {field: 'datetime', title: '来源时间', sort: true ,width:200}
                , { title: '来源网址', templet: function (d) {
                    var aHtml = '';
                        aHtml = '<a target="_blank" style="color:#009688;" href="' + d.url + '">'+d.url+'</a>';
                    return aHtml;
                },width:500}
            ]]
            , done: function (res, curr, count) {
                $('.layui-laypage > a').each(function(){
                    $(this).attr('onclick',"pageLoading(this)");
                })
                // top.layer.close(loadingIndex); // 渲染完成后关闭动画
                ppp.hoverOpenImg();
            }
        });
        function pageLoading(that){
            var disa = $(that).hasClass('layui-disabled');
            if(disa){ // 如果是最后一页或者是只有一页,那就不可点击
                return false;
            }
            // loadingIndex = pageCommon.layerLoad(true); // 打开加载中动画
         }

        //排序
        table.on('sort(crawler-article-table)', function (obj) { //注：sort 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            table.reload('crawler-article-table', {
                initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
                , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                    field: obj.field //排序字段
                    , order: obj.type //排序方式
                }
            });
        });


        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
            , count: 100 //总页数
            , skin: '#1E9FFF' //自定义选中色值
            //,skip: true //开启跳页
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            , jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {offset: 'b'});
                }
            }
        });

        //查询开始
        jq('.reload-btn').on('click', function () {
            var id = jq('#id').val();
            var title = jq('#title').val();
            var author = jq('#author').val();
            var tagId = jq('#tag_id').val();
            var site_id = jq('#site_id').val();
            var start_time = jq('#start_time').val();
            var end_time = jq('#end_time').val();
            var content = jq('#content').val();
            var status = jq('#status').val();
          if(start_time !="" && end_time !=""){
              if(Date.parse(start_time)>Date.parse(end_time)){
                  return layer.msg("开始时间不能大于结束时间");
              }else{}
          }else{}

            //执行重载
            table.reload('crawler-article-table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    id: id,
                    title: title,
                    author: author,
                    tag_id: tagId,
                    site_id: site_id,
                    start_time: start_time,
                    end_time: end_time,
                    content: content,
                    status: status,
                }
            });
        });
        //查询结束
        //监听提交
        form.on('submit(newsUpdateForm)', function (data) {
            form.render();
            
            jq.post("../article/update", data.field, function (data) {
                if (data.code == 200) {
                    layer.alert('修改成功', {icon: 1, title: '提示'});
                    location.reload()
                } else {

                }
            }, "json");
            return false;
        });
        var isscress=1;
        /*控制按钮*/
        table.on('tool(crawler-article-table)', function (obj) {
            var data = obj.data;
            switch (obj.event) {
                case 'import':
                    importArticle(data);
                    if(isscress==2){
                        layer.alert('导入成功', {icon: 1, title: '提示'});
                    }
                    break;
                case 'preview':
                    previewArticle(data);
                    table.reload('crawler-article-table');
                    break;
                case 'examine':
                    examineArticle(data);
                    table.reload('crawler-article-table');
                    
                    break;
            }
            ;
        });
        /*预览原始文件*/
        var previewArticle = function (data) {
            if (data) {
                ppp.putTempData('draftArticle', data);
                ppp.post('draftArticle/', {data: data}, function (data) {
                    layer.closeAll('loading');
                    //console.error(data.result.id);
                    ppp.putTempData('articleId', data.result);
                    window.open('#/previewArticle.html');
                    //location.href = '#/previewArticle.html';
                });
            }
        }
        /*导入新文章*/


        function importdata(d){
            return new Promise((resolve, reject) => {
                ppp.post('importArticle/', {data: d}, function (data) {
                    resolve(data);
                });
            });
        }
      async function  importArticle(data) {
          var data=await importdata(data)
                layer.closeAll('loading');
                console.log(data+"kkekkkkekkk");
                if (data.status != 200) {
                    layer.alert(data.msg, {icon: 2, title: '提示'});
                    isscress=1;
                    return false;
                }
                isscress=2;
                table.reload('crawler-article-table');
                //window.location.reload();
         
           
            var spanEle = $(".status_" + data.id);
            spanEle.css('color', '#009688');
            // spanEle.html('已导入');
        }
        /*表格头控制按钮*/
        table.on('toolbar(crawler-article-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data;
            switch (obj.event) {
                case 'getCheckData': 
                    if (data.length == 0) {
                        layer.msg('请至少选择一行');
                        return false;
                    }
                    var articles = data;
                    layer.confirm('确定导入？', function (index) {
                        importArticles(articles);
                        layer.close(index);
                    });
                    break;
                case 'addArticle':
                    location.href = '#!addArticle';
                    break;
            }
            ;
        });

        //批量导入文章
     function importArticles(data) {
            for (var j = 0, len = data.length; j < len; j++) {
                var article = data[j];
                importArticle(article);
            }
            if(isscress==2){
                layer.alert('导入成功', {icon: 1, title: '提示'});
            }
        }
    });
}

