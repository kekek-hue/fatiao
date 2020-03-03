/** layuiAdmin.std-v1.1.0 LPPL License By http://www.layui.com/admin/ */
;
layui.define(function(e) {
   // var a = layui.admin;
    layui.use(["carousel","setter"],
    function() {
        var e = layui.$,
        o = e("body"),
        a = (layui.admin, layui.carousel),
        l = layui.element,
        t = layui.device();
        e(".layadmin-carousel").each(function() {
            var l = e(this);
            a.render({
                elem: this,
                width: "100%",
                arrow: "none",
                interval: l.data("interval"),
                autoplay: l.data("autoplay") === !0,
                trigger: t.ios || t.android ? "click": "hover",
                anim: l.data("anim")
            })
        }),
        l.render("progress")
    }),
    layui.use(["carousel", "echarts"],
    function() {
        var e = layui.$,
        a = (layui.carousel, layui.echarts),
        l = [],
        t = [{
            title: {
                subtext: "完全实况球员数据",
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                x: "left",
                data: ["罗纳尔多", "舍普琴科"]
            },
            polar: [{
                indicator: [{
                    text: "进攻",
                    max: 100
                },
                {
                    text: "防守",
                    max: 100
                },
                {
                    text: "体能",
                    max: 100
                },
                {
                    text: "速度",
                    max: 100
                },
                {
                    text: "力量",
                    max: 100
                },
                {
                    text: "技巧",
                    max: 100
                }],
                radius: 130
            }],
            series: [{
                type: "radar",
                center: ["50%", "50%"],
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: "default"
                        }
                    }
                },
                data: [{
                    value: [97, 42, 88, 94, 90, 86],
                    name: "舍普琴科"
                },
                {
                    value: [97, 32, 74, 95, 88, 92],
                    name: "罗纳尔多"
                }]
            }]
        }],
        i = e("#LAY-index-pageone").children("div"),
        n = function(e) {
            l[e] = a.init(i[e], layui.echartsTheme),
            l[e].setOption(t[e]),
            window.onresize = l[e].resize
        };
        i[0] && n(0)
    }),
    layui.use(["carousel", "echarts"],
    function() {
        var e = layui.$,
        a = (layui.carousel, layui.echarts),
        l = [],
        t = [{
            tooltip: {
                trigger: "axis"
            },
            calculable: !0,
            legend: {
                data: ["访问量", "下载量", "平均访问量"]
            },
            xAxis: [{
                type: "category",
                data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
            }],
            yAxis: [{
                type: "value",
                name: "访问量",
                axisLabel: {
                    formatter: "{value} 万"
                }
            },
            {
                type: "value",
                name: "下载量",
                axisLabel: {
                    formatter: "{value} 万"
                }
            }],
            series: [{
                name: "访问量",
                type: "line",
                data: [900, 850, 950, 1e3, 1100, 1050, 1e3, 1150, 1250, 1370, 1250, 1100]
            },
            {
                name: "下载量",
                type: "line",
                yAxisIndex: 1,
                data: [850, 850, 800, 950, 1e3, 950, 950, 1150, 1100, 1240, 1e3, 950]
            },
            {
                name: "平均访问量",
                type: "line",
                data: [870, 850, 850, 950, 1050, 1e3, 980, 1150, 1e3, 1300, 1150, 1e3]
            }]
        }],
        i = e("#LAY-index-pagetwo").children("div"),
        n = function(e) {
            l[e] = a.init(i[e], layui.echartsTheme),
            l[e].setOption(t[e]),
            window.onresize = l[e].resize
        };
        i[0] && n(0)
    }),
    layui.use(["carousel", "echarts"],
    function() {
        var e = layui.$,
        a = (layui.carousel, layui.echarts),
        l = [],
        t = [{
            title: {
                text: "全国的 ppp 用户分布",
                subtext: "不完全统计"
            },
            tooltip: {
                trigger: "item"
            },
            dataRange: {
                orient: "horizontal",
                min: 0,
                max: 6e4,
                text: ["高", "低"],
                splitNumber: 0
            },
            series: [{
                name: "全国的 ppp 用户分布",
                type: "map",
                mapType: "china",
                selectedMode: "multiple",
                itemStyle: {
                    normal: {
                        label: {
                            show: !0
                        }
                    },
                    emphasis: {
                        label: {
                            show: !0
                        }
                    }
                },
                data: [{
                    name: "西藏",
                    value: 60
                },
                {
                    name: "青海",
                    value: 167
                },
                {
                    name: "宁夏",
                    value: 210
                },
                {
                    name: "海南",
                    value: 252
                },
                {
                    name: "甘肃",
                    value: 502
                },
                {
                    name: "贵州",
                    value: 570
                },
                {
                    name: "新疆",
                    value: 661
                },
                {
                    name: "云南",
                    value: 8890
                },
                {
                    name: "重庆",
                    value: 10010
                },
                {
                    name: "吉林",
                    value: 5056
                },
                {
                    name: "山西",
                    value: 2123
                },
                {
                    name: "天津",
                    value: 9130
                },
                {
                    name: "江西",
                    value: 10170
                },
                {
                    name: "广西",
                    value: 6172
                },
                {
                    name: "陕西",
                    value: 9251
                },
                {
                    name: "黑龙江",
                    value: 5125
                },
                {
                    name: "内蒙古",
                    value: 1435
                },
                {
                    name: "安徽",
                    value: 9530
                },
                {
                    name: "北京",
                    value: 51919
                },
                {
                    name: "福建",
                    value: 3756
                },
                {
                    name: "上海",
                    value: 59190
                },
                {
                    name: "湖北",
                    value: 37109
                },
                {
                    name: "湖南",
                    value: 8966
                },
                {
                    name: "四川",
                    value: 31020
                },
                {
                    name: "辽宁",
                    value: 7222
                },
                {
                    name: "河北",
                    value: 3451
                },
                {
                    name: "河南",
                    value: 9693
                },
                {
                    name: "浙江",
                    value: 62310
                },
                {
                    name: "山东",
                    value: 39231
                },
                {
                    name: "江苏",
                    value: 35911
                },
                {
                    name: "广东",
                    value: 55891
                }]
            }]
        }],
        i = e("#LAY-index-pagethree").children("div"),
        n = function(e) {
            l[e] = a.init(i[e], layui.echartsTheme),
            l[e].setOption(t[e]),
            window.onresize = l[e].resize
        };
        i[0] && n(0)
    }),
    layui.use("table",
    function() {
        var e = (layui.$, layui.table);
        e.render({
            elem: "#LAY-index-prograss",
            url: "json/console/prograss.js",
            cols: [[{
                type: "checkbox",
                fixed: "left"
            },
            {
                field: "prograss",
                title: "任务"
            },
            {
                field: "time",
                title: "所需时间"
            },
            {
                field: "complete",
                title: "完成情况",
                templet: function(e) {
                    return "已完成" == e.complete ? '<del style="color: #5FB878;">' + e.complete + "</del>": "进行中" == e.complete ? '<span style="color: #FFB800;">' + e.complete + "</span>": '<span style="color: #FF5722;">' + e.complete + "</span>"
                }
            }]],
            skin: "line"
        })
    }),
    o.on("click", "*[layadmin-event]",
	    function(e) {
	    	console.error(this);
	        var $ = layui.$,
	        a = $(this).data("id");
	        layer.prompt({
	            title: "回复留言 ID:" + a,
	            formType: 2
	        },
	        function(e, a) {
	            layer.msg("得到：" + e),
	            layer.close(a)
	        })
	    }
    ),
    e("sample", {})
});