function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , config = layui.config
            , ppp = layui.ppp;

        var $ = layui.jquery;

        //执行一个 table 实例
        table.render({
            elem: '#person-area-table'
            , url: config.serverApiUrl + 'team/all/userlist' //数据接口
            , toolbar: '#commune-add-toolbar'
            , request: {
                //页码的参数名称，默认：page
                pageName: 'page',
                //每页数据量的参数名，默认：limit
                limitName: 'size'
            }
            , page: true //开启分页

            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "count": res.result.length,
                    "data": res.result //解析数据列表
                };
            }
            , title: '文章列表'
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'team_id', title: 'ID', sort: true}
                , {field: 'team_name', title: '队伍名称'}
                , {
                    field: 'image_url',
                    title: '队伍logo',
                    templet: '<div><img style="height:50px" data-img="{{d.image_url}}" src="{{d.image_url}}"></div>'
                }
                , {field: 'team_content', title: '队伍介绍'}
                , {field: 'num', title: '队伍需要人数'}
                , {
                    field: 'user_list', title: '队伍成员', templet: function (d) {
                        var userList = d.user_list;
                        var text=[];
                        if(userList && userList != 'undefined'){
                            for (var i=0; i<userList.length; i++){
                                console.log(i);
                                text.push(userList[i].user_name);
                            }
                        }

                        return text.length > 0 ? text :"暂无成员";
                    }
                }
                , {field: 'begin_time', title: '队伍开始时间'}
                , {field: 'end_time', title: '队伍结束时间'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
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

        /*
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
}
   