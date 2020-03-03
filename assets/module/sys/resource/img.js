function Lay(layui) {
    layui.use(['form', 'table', 'config', 'ppp', 'flow', 'jquery'], function () {
        var flow = layui.flow,
            $ = layui.jquery,
            ppp = layui.ppp;
        flow.load({
            elem: '#imgs-flow-auto' //流加载容器
            , scrollElem: '#imgs-flow-auto' //滚动条所在元素，一般不用填，此处只是演示需要。
            , done: function (page, next) { //执行下一页的回调
                var lis = [];
                var totalPages = 0;
                var imgData = null;
                ppp.get('imgs?page=' + page, {async: false}, function (data) {
                    totalPages = data.pageCount;
                    imgData = data.data;
                });
                imgData.forEach(function (value, i) {
                    let resId = value.res_id;
                    var html = ' <div class="layui-col-md2 layui-col-sm4"><div class="cmdlist-container"><a href="javascript:;"><img  data-img="/litImag/' + resId + '"  src="img/' + resId + '"></a><a href="javascript:;"><div class="cmdlist-text"><p class="info">认真学习贯彻落实中央经济工作会议精神 扎实做好201</p><div class="price"><b>2019-12-12 00：:0:00</b><span class="flow"><i class="layui-icon layui-icon-template-1"></i>生成緩存</span></div></div></a></div></div>';
                    lis.push(html)
                })
                ppp.hoverOpenImg();
                next(lis.join(''), page < totalPages); //假设总页数为 10
            }
        });
        ppp.hoverOpenImg();
    });// layui end
}//lay方法结束