layui.use(["echarts", 'layer', 'echartsTheme', 'setter', 'carousel'], function () {
    var $ = layui.$,
        carousel = layui.carousel,
        eachart = layui.echarts,
        echartsTheme = layui.echartsTheme,
        layer = layui.layer,
        device = layui.device,
        setter = layui.setter,
        ppp = layui.ppp,
        data = [],
        lfdata=[]

    var consoleChart = {

        childerDivs: $("#console-dataview-div-like").children("div").children("div"),
        result: [],
        init: function () {
            let that=this
            async function datainfo() {
                lfdata = await that.getdata()
            }
            datainfo()
            this.renderCarousel()
        },
        getdata: function () {
            return new Promise((resolve, reject) => {
                ppp.get('user/action', {
                    async: true
                }, function (data) {
                    resolve(data)


                });

            })
        },

        initEchart: function (e) {
            let that = this
            var num = [];
            var date = [];
          
            setTimeout(() => {
                let res
                if (e == 0) {
                    res = lfdata.like
                } else {
                    res = lfdata.fav
                }
            
                res.forEach(function (value, i) {
                    num.push(value.count)
                    date.push(value.date)
                })
                data = [{
                    title: {
                        text: "按星期统计点赞数量",
                        x: "center",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["", ""]
                    },
                    xAxis: [{
                        type: "category",
                        boundaryGap: !1,
                        data: date
                    }],
                    yAxis: [{
                        type: "value",
                        min: 0,
                        max: 400,
                        splitArea: {
                            show: true
                        }
    
                    }],
                    series: [{
                        name: "PV",
                        type: "line",
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: "default"
                                }
                            }
                        },
                        data: num
                    }]
                }, {
                    title: {
                        text: "按星期统计收藏数量",
                        x: "center",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["", ""]
                    },
                    xAxis: [{
                        type: "category",
                        boundaryGap: !1,
                        data: date
                    }],
                    yAxis: [{
                        type: "value",
                        min: 0,
                        max: 400,
                        splitArea: {
                            show: true
                        }
    
                    }],
                    series: [{
                        name: "PV",
                        type: "line",
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: "default"
                                }
                            }
                        },
                        data: num
                    }]
                }];
                that.result[e] = eachart.init(that.childerDivs[e], echartsTheme),
                    that.result[e].setOption(data[e]),
                    window.onresize = that.result[e].resize,
                    layer.closeAll('loading');
    
            },800);
           
        },
        renderCarousel: function () {
            var thisObj = this;
            // if (this.childerDivs[0]) {
            thisObj.initEchart(0);
            carousel.on("change(console-dataview-div-like)", function (e) {
                thisObj.initEchart(e.index);

            })

        }
    };

var infob;
     //获取文章信息
     function articleInfo() {
        return new Promise((resolve, reject) => {
            ppp.get('basis/info', {async: false}, function (info) {
                resolve(info);
            });
        });
    }

dealData()
    //处理数据
    async function dealData() { 
        try {
            //文章信息
            var info = await articleInfo();
            infob=info;
            document.querySelector(".afterdata").innerHTML=info[0].adminVersion;
            document.querySelector(".beforedata").innerHTML=info[0].apiVersion

        } catch (e) {
            console.error('错了:');
            console.log(e);
        }
    }
   $(".clicklianxi").on("click",function(e){
       if(e.target.name=="admin"){
           layer.alert(infob[0].adminContact)
       }else{
        layer.alert(infob[0].serverContact)
       }
       console.log(e.target.name)
   })

    $(function () {
        // layer.load(3);
        carousel.render({
            elem: '#console-dataview-div-like',
            width: '100%',
            height: '60px',
            autoplay: true,
            trigger: device.ios || device.android ? 'click' : 'hover',
            anim: 'default',
            interval: 7000,
            indicator: "none"
        });

        consoleChart.init();
    });
    //exports("consoleChart", consoleChart)
});