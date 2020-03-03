
function Lay(layui){
 
 layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form' ], function(){
    var laypage = layui.laypage //分页
    ,table = layui.table //表格
    ,jq = layui.jquery
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate
    //执行一个 table 实例
    table.render({
      elem: '#article-table'
      ,height: 420
      ,url: '../article/lists/1' //数据接口
      ,title: '文章列表'
      ,page: true //开启分页
      ,cols: [[ //表头
        {type: 'checkbox', fixed: 'left'}
        ,{field: 'id', title: 'ID',sort: true, fixed: 'left'}
        ,{field: 'title', title: '文章标题'}
        ,{field: 'face', title: '封面' ,templet:'<div><img style="height:50px" src="/article/showFace/{{ d.face}}"></div>'}
        ,{field: 'date', title: '发布时间', sort: true, totalRow: true}
        ,{field: 'update_time', title: '更新时间', sort: true, totalRow: true}
        ,{field: 'type', title: '文章类型',  sort: true,templet:'#articleType'}
        ,{field: 'score', title: '点击', sort: true, totalRow: true}
        ,{field: 'url', title: '来源网址'} 
        ,{field: 'status', title: '状态',templet:'#newState'}
        ,{field: 'classify', title: '提交者'}
      ]]
    });
    //分页
    laypage.render({
      elem: 'pageNews' //分页容器的id
      ,count: 100 //总页数
      ,skin: '#1E9FFF' //自定义选中色值
      //,skip: true //开启跳页
      ,jump: function(obj, first){
        if(!first){
          layer.msg('第'+ obj.curr +'页', {offset: 'b'});
        }
      }
    });
     //执行一个 table 实例
    table.render({
      elem: '#alts-table'
      ,height: 420
      ,url: '../article/lists/2' //图集数据接口
      ,title: '文章列表'
      ,page: true //开启分页
      ,cols: [[ //表头
        {field: 'id', title: 'ID',sort: true, fixed: 'left'}
        ,{field: 'title', title: '文章标题'}
        ,{field: 'face', title: '封面' ,templet:'<div><img style="height:50px" src="/article/showFace/{{ d.face}}"></div>'}
        ,{field: 'date', title: '发布时间', sort: true, totalRow: true}
        ,{field: 'update_time', title: '更新时间', sort: true, totalRow: true}
        ,{field: 'type', title: '文章类型',templet:'#articleType'}
        ,{field: 'source', title: '来源网址'} 
        ,{field: 'status', title: '状态',templet:'#newState'}
        ,{field: 'author_id', title: '作者'}
        ,{field: 'commit_id', title: '提交者'}
      ]]
    });
     //构建一个默认的编辑器
    layedit.set({
      uploadImage: {
          url: 'imgUpload' //接口url
        , type: 'post' //默认post
      }
    });
    //分页
    laypage.render({
      elem: 'pageChapter' //分页容器的id
      ,count: 100 //总页数
      ,skin: '#1E9FFF' //自定义选中色值
      //,skip: true //开启跳页
      ,jump: function(obj, first){
        if(!first){
          layer.msg('第'+ obj.curr +'页', {offset: 'b'});
        }
      }
    });
  });
}
