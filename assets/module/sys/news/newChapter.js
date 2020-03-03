
function Lay(layui){
 
 layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form' ], function(){
    var laypage = layui.laypage //分页
    ,table = layui.table //表格
    ,jq = layui.jquery
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate;
    function Chapter(){};
    var updateChapter = new Chapter();

    //执行一个 table 实例
    var url = '../newChapter/lists';
    if(newId > 0 ){
      url = '../newChapter/lists/'+newId;
    }
    table.render({
      elem: '#article-table'
      ,height: 420
      ,url: url //数据接口
      ,title: '文章列表'
      ,skin: 'row'
      ,even: true
      ,page: true //开启分页
      ,cols: [[ //表头
        {type: 'checkbox', fixed: 'left'}
        ,{field: 'id', title: '全局ID',sort: true, fixed: 'left'}
        ,{field: 'info_id', title: '文章ID',sort: true}
        ,{field: 'sort', title: '序号'}
        ,{field: 'content', title: '文章内容'}
        ,{field: 'num', title: '字数'}
        ,{field: 'check_user', title: '审核者'}
        ,{field: 'current_time', title: '入库时间', sort: true}
        ,{field: 'check_time', title: '审核时间', sort: true}
        ,{field: 'status', title: '审核结果',templet:'#chapterState'}
        ,{field: 'is_del', title: '状态',templet:'#isDel'}
        ,{fixed: 'right',align:'center',title:'操作', toolbar: '#barControl'}
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
      elem: 'pageDemo' //分页容器的id
      ,count: 100 //总页数
      ,skin: '#1E9FFF' //自定义选中色值
      //,skip: true //开启跳页
      ,jump: function(obj, first){
        if(!first){
          layer.msg('第'+ obj.curr +'页', {offset: 'b'});
        }
      }
    });
    //监听提交
    form.on('submit(newChapterUpdateForm)', function(data) {
        form.render();
        layer.load(2,{shade:false});
        updateChapter.status = jq("#status").val();
        jq.post("newChapter/updateStatus",data.field
          ,function(data) {
            if(data.code == 200) {
              location.reload();
            } else {

            }
        },"json");
        return false;
    });
    table.on('tool(test)', function(obj){
      var data = obj.data;
      switch(obj.event){
        case 'edit-attr':
          openUpdate(data);          
        break;
        case 'edit-content':
          console.log('edit-content');
          console.log(data);
          location.href = '../newChapter/edit?info_id='+data.info_id;
        break;
      };
    });
    function openUpdate(data){
      layer.open({
          type: 1,
          title:'快速属性操作',
          shade: 0.8,
          shadeClose: true, 
          moveType:1,  
          area: ['420px', '240px'], //宽高
          content: jq('.form-dv').html(),
          success:function(layero,index){
            //将文章id和章节id放入到json对象
            updateChapter.info_id = data.info_id;
            updateChapter.chapter_id = data.id;
            layero.find('#info_id').val(data.info_id);
            layero.find('#chapter_id').val(data.id);

            jq("select[name='status']").val(data.status)

            form.render();
          }
      });
    }
    /*
    *关闭当前窗口
    */
    function closeDialog()
    {
       var index = parent.layer.getFrameIndex(window.name);  
       parent.layer.close(index);
    }


    /*
    *搜索章节id
    */
    function searchChapter()
    {
      let chapterId = jq('#chapterId').val();
      console.error(chapterId);
    }

    
    function tableReload() {
        var demoReload = jq('#chapterId');
        //执行重载
        table.reload('article-table', {
          page: {
            curr: 1 //重新从第 1 页开始
          }
          ,where: {
            chapterId: demoReload.val()
          }
        });
      }
    jq('.layui-btn').on('click', function(){
      tableReload();
    });

  });
}
 
function addNews(){
   location.href ='news/add';
}