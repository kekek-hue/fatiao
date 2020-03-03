
function Lay(layui){
  layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form','ppp' ], function(){
      var laypage = layui.laypage //分页
      ,table = layui.table //表格
      ,jq = layui.jquery
      ,ppp = layui.ppp
      ,form = layui.form
      ,layedit = layui.layedit
      //执行一个 table 实例
      jq(document).on('click','#add',function(){
          editWords();
      });
      //分页
      laypage.render({
        elem: 'pageNews' //分页容器的id
        ,count: 100 //总页数
        ,skin: '#1E9FFF' //自定义选中色值
        ,theme: '#1E9FFF'

        //,skip: true //开启跳页
        ,jump: function(obj, first){
          if(!first){
            layer.msg('第'+ obj.curr +'页', {offset: 'b'});
          }
        }
      });
      table.on('tool(tags-table)', function(obj){
        var data = obj.data;
        switch(obj.event){
          case 'edit':
            editWords(data);
          break;
          case 'del':
            delWords(data);
          break;
        };
      });
      /*编辑敏感词*/
      var editWords=function(data){
          ppp.putTempData('t_sensitive', data);
          ppp.popupCenter({
              title: data ? '编辑敏感词' : '添加敏感词',
              path: 'components/views/sensitive/form.html',
              finish: function () {
                  renderTable();
              }
          });
      };
      function delWords(data)
      {
        layer.confirm('确定删除吗？', function(index) {
            del(data.f_id);
          });
      }
      function del(id){
        jq.post("sensitive_words/del",{f_id: id},function(data) {
          // console.log(data);
            table.reload('tags-table');
            layer.msg('已删除');
          },"json");
      }
      //执行一个 table 实例
      var renderTable = function () {
          table.render({
              elem: '#tags-table'
              , url: 'sensitive_words/lists' //数据接口
              , title: '列表'
              , page: true //开启分页
              , toolbar: '#tagTool'
              , cols: [[ //表头
                   {field: 'left', align: 'center', type: 'checkbox'}
                  , {field: 'f_id', title: 'id', sort: true}
                  , {field: 'f_words', title: '敏感词', sort: true}
                  , {field: 'f_type', title: '类型'}
                  , {field: 'is_del', title: '是否删除',templet:function (d) {
                          if (d.is_del == 1) {
                              return '<span class="layui-badge layui-bg-badge">已删除</span>';
                          } else if (d.is_del == 0) {
                              return '<span class="layui-badge layui-bg-black">未删除</span>';
                          }
                      }}
                  , {field: 'left', align: 'center', title: '操作', toolbar: '#barDemo'}
              ]]
          });
      }
      renderTable();
      /*表格头控制按钮*/
      table.on('toolbar(tags-table)', function(obj){
      var checkStatus = table.checkStatus(obj.config.id),
          data = checkStatus.data;
        switch(obj.event){
          case 'getCheckData':
            if(data.length == 0){
              layer.msg('请选择一行');
              return false;
            }
            var articles = data;
            layer.confirm('确定删除吗？', function(index) {
                batch_delete(articles);
                layer.close(index);
            });
          break;
        };
      });

      //批量删除
      function batch_delete(data){
          var len = data.length;
          var j;
          var ids='';
          console.log(len);
          for(j = 0; j < len; j++){
              var  articleId = data[j].f_id;
              ids += articleId;
              if(j !=len-1)
                  ids +=',';
              // jq.post("sensitive_words/del",ids,function(data) {
              //     if(data.code == 200) {
              //         layer.alert('删除成功！',{icon:1,title:'提示'});
              //         table.reload('article-table');
              //     } else {
              //     }
              // },"json");
          }
          del(ids);
          // console.log(ids);
      }
      //分页
      laypage.render({
        elem: 'pageChapter' //分页容器的id
        ,count: 100 //总页数
        ,skin: '#1E9FFF' //自定义选中色值
        ,theme: '#1E9FFF'

        //,skip: true //开启跳页
        ,jump: function(obj, first){
          if(!first){
            layer.msg('第'+ obj.curr +'页', {offset: 'b'});
          }
        }
      });
      jq('.reload-btn').on('click', function(){
        var id = jq('#id').val();
        var f_words = jq('#f_words').val();
        var f_type = jq('#f_type').val();

        //执行重载
        table.reload('tags-table', {
          page: {
            curr: 1 //重新从第 1 页开始
          }
          ,where: {
            id: id,
                f_words: f_words,
            f_type: f_type
          }
        });
      //查询结束
      });
    });
}
