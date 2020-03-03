layui.define(["echarts",'layer','carousel', 'element','ppp','form','laydate','config','table'],function(exports) {
    var $ = layui.$
    ,ppp = layui.ppp
    ,carousel = layui.carousel
    ,eachart = layui.echarts
    ,layer = layui.layer
    ,device = layui.device 
    ,form =layui.form
    ,laydate = layui.laydate
    ,config = layui.config
    ,table = layui.table
    ,layer = layui.layer;
    layer.load(2);
    //开始时间
    laydate.render({
        elem: '#start_time'
        ,type:'datetime'
    });
    laydate.render({
        elem: '#end_time'
        ,type:'datetime'
    });
   
    layer.load(2);
    //获取图表数据
    
    //所有来源网址
    ppp.get('crawler/getSites', {async: true}, function (data) {
          //动态添加父级分类
          data.forEach(function(value,i){
            var optionHmtl = ' <option  data-grade='+value.name+' value="'+value.name+'">'+value.des+'</option>';
            $("#site_id").append(optionHmtl);
          })
          form.render();
    });     
    form.render();
    var crawlerChart = {
        divId: document.getElementById("crawler-dataview-div"),
        result:null,
        option:null,
        setOptionData:function(legend,xAxis,series){
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:legend
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : xAxis
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : series
            };


         
            this.initEchart();
        },
        getChartData:function(site_id,start_time,end_time){
            var thisObj = this;
            ppp.get('crawler/crawlerChart?site_id='+site_id+'&start_time='+start_time+'&end_time='+end_time, {async: true}, function (data) {
                if(data.status == 200){
                    legend = data.result.legend;
                    xAxis = data.result.xAxis;
                    series = data.result.series;
                    thisObj.setOptionData(legend,xAxis,series);
                    layer.closeAll('loading');
                }
            }); 
        },
        init:function(){
            if(!this.divId){
                this.divId = document.getElementById("crawler-dataview-div"); 
            }
            this.getChartData(0,0,0);
        },
        initEchart:function(){
            this.result = eachart.init(this.divId,layui.echartsTheme);
            this.result.setOption(this.option);
        }
    };
    
    // 渲染表格
    var crawlerChartTable = table.render({
        elem: '#crawler-chart-table',
        toolbar: '#crawler-chart-toolbar',
        url: config.serverUrl + 'crawler/crawlerChartData',
        request: config.request,
        parseData: config.parseData,
        response: config.response,
        headers: {Authorization: config.getToken()},
        page: true,
        cols: [],
        done:function(res,curr,count){
            //console.error(res);
            //console.error(curr);
            //console.error(count);
            var mycars=new Array();
            var cols = res.msg;
            var cls = [
                {type: 'numbers'},
                {field: 'name', align: 'center', sort: true, title: '网址'},
                {field: 'des', align: 'center', sort: true, title: '网址名称'},
                {field: 'url', align: 'center', sort: true, title: 'url'},
            ];
            cols.forEach(function(value,i){
                let cl = {field:value, align: 'center', sort: true, title: value};
                cls.push(cl);
            });
            //var newCols =  cls.concat(cols);
            console.error(cls);

            table.init('crawler-chart-table',{
                toolbar: '#crawler-chart-toolbar'
                ,cols:[cls]
                ,data:res.data
                ,limit:1000
            });
        }
    });
    // 搜索按钮点击事件
    $('#crawler-btn-search').click(function () {
        layer.load(2);
        crawlerChartTable.reload({where: ppp.getSearchForm()});
        var site_id = $("#site_id").val();
        var start_time = $("#start_time").val();
        var end_time = $("#end_time").val();
        crawlerChart.getChartData(site_id,start_time,end_time);
    });
   crawlerChart.init();
   exports("crawlerChart", crawlerChart)
});
