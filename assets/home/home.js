
function Lay(layui){
 layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form','treetable','config'], function(){
    var laypage = layui.laypage //分页
    ,table = layui.table //表格
    ,jq = layui.jquery
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate
    ,treetable = layui.treetable
    ,tableId = '#data-crawler-table'
    config = layui.config,
    ppp = layui.ppp,
    element = layui.element;
    //加载热搜标签开始
    table.render({
      elem: '#hot-tags-table'
      ,url: '../tags/hotTop' //数据接口
      ,title: '今日热搜'
      ,cols: [[ //表头
        ,{field: 'id', title: 'id',sort: true}
        ,{field: 'name', title: '标签词'}
        ,{field: 'total', title: '搜索次数',sort: true},
        ,{field: 'create_time', title: '创建时间',sort: true}
        ,{field: 'is_del', title: '状态',templet:'#tagState'}
      ]]
    });
     //加载精修文章
     var jx = table.render({
         elem: '#data-index-table'
         ,url: '../scheme/index' //数据接口
         ,title: '精修文章'
         ,headers: {Authorization: config.getToken()}
         ,cols: [[ //表头
             ,{field: 'id', title: 'id',sort: true}
             ,{field: 'sku_name', title: '位置',sort: true}
             ,{field: 'title', title: '标题'}
             ,{field: 'type_name', title: '分类名称',sort: true},
             ,{field: 'publish_time', title: '发布时间',sort: true}
             ,{align: 'center', toolbar: '#data-index-table-bar', title: '操作'}
         ]]
     });
     // 工具条点击事件
     table.on('tool(data-index-table)', function (obj) {
         var data = obj.data;
         if (obj.event === 'delete') {
             layer.confirm('确定删除吗？', function(index) {
                 ppp.post('schemeArticle/delete', {data:data}, function () {
                     layer.closeAll('loading');
                     jx.reload();
                 });
                 layer.close(index);
             });
         }
     });
   // 渲染表格
   //数据汇总
  ppp.get('index', {async: true}, function (data) {
   var vm = jq('#totalInformation').vm(data);
  });
  /**
  * 数字转整数 如 100000 转为10万
  * @param {需要转化的数} num 
  * @param {需要保留的小数位数} point 
  */
  function tranNumber(num, point) {
    let numStr = num.toString()
    // 十万以内直接返回 
    if (numStr.length < 6) {
        return numStr;
    }
    //大于8位数是亿
    else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
    }
    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 5) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
    }
  }

  var renderTable = function () {
      treetable.render({
          elem: tableId,
          treeColIndex: 1,
          treeSpid: 0,
          treeIdName: 'id',
          treePidName: 'parent_id',
          treeDefaultClose: true,
          url: config.serverUrl + 'crawler/newData',
          headers: {Authorization: config.getToken()},
          cols: [[
              {type: 'numbers'},
              {field: 'id', align: 'center', sort: true, title: '采集域名'},
              {
                  align: 'center', templet: function (d) {
                      if (d.url === 2) {
                          return '';
                      } else {
                          return d.name;
                      }
                  }, title: '采集网址名称'
              },
              {
                  align: 'center', templet: function (d) {
                      if (d.url === 2) {
                          return '<span class="layui-badge layui-bg-blue">'+d.name+'</span>';
                      } else {
                          return '';
                      }
                  }, title: '文章标题'
              },
              {field: 'total', align: 'center', sort: true, title: '数据总量'},
              {
                  align: 'center', templet: function (d) {
                      if (d.newData > 0) {
                          return '<span class="layui-badge layui-bg-blue">今日新数据'+d.newData+'条</span>';
                      } else if(d.url === 2) {
                          return '';
                      }else{
                          return '<span class="layui-badge layui-bg-gray">今日无新数据</span>';
                      }
                  }, title: '今日新增数据'
              },
              {
                  align: 'center', templet: function (d) {
                      if (d.url ==  2) {
                          return '<a class="layui-btn layui-btn-normal layui-btn-xs preview" data-title= "'+d.name+'"   data-author= "'+d.author+'"  data-cate= "'+d.cate+'"  data-res-id= "'+d.res_id+'" data-aid = "'+d.id+'" lay-event="">预览</a>';
                      }else{
                        return '<a href ="'+d.url+'" target="_blank"> '+d.url+'</a>';
                      }
                  }, title: 'url'
              },
              {field: 'publishtime', align: 'center', sort: true, title: '发布时间'},
          ]]
      });
  };
  /*预览原始文件*/
  $(document).on("click", '.preview',function(){
    var data = {
      id:$(this).attr('data-aid'),
      resId:$(this).attr('data-res-id'),
      cate:$(this).attr('data-cate'),
      author:$(this).attr('data-author'),
      title:$(this).attr('data-title'),
    };
    ppp.putTempData('draftArticle',data);
    ppp.post('draftArticle/', {data: data}, function (data) {
        layer.closeAll('loading');
        ppp.putTempData('articleId',data.result.id);
        location.href = '#/previewArticle.html';
      });
  });   

  renderTable();
  //layui加载结束  
  });
  //Lay方法结束
}
