/**
 全局配置
 */
layui.define(function (exports) {
    var domain =  'http://admin2.ceh.com.cn/';
    var imgDomain = 'http://ce.admin.com/';
    var setter = {
        serverUrl: domain // 服务器地址
        , serverApiUrl: "http://api2.ceh.com.cn/" // 服务器地址
        , crawlerServerApiUrl: 'http://crawler2.ceh.com.cn/'
        , imgUrl: imgDomain // 服务器地址
        , webSocketUrl: 'ws://chat.finemedia.com.cn:8200'//通讯服务器
        , container: 'LAY_app' //容器ID
        , views: layui.cache.dynamicBase + 'tpl/' //动态模板所在目录
        , entry: 'index' //默认视图文件名
        , engine: '.html' //视图文件后缀名
        , MOD_NAME: 'admin' //模块事件名
        , tableName: 'ppp' //本地存储表名
        , debug: true, //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息
        roleArticle: {
            zebian:10,
            zhubian:11,
            zhengshen:12,
            zongbian:13
        },
        // deng开头的是等待某角色审核
        // bu开头的是不通过某角色审核   只要是不的都是小写 其他的都是大写
        // zhong 开头是审核中   
        statusArticle: {
            weiti: 11,
            dengZhu:12,
            zhongZhu:13,
            buzhu:14,
            dengZheng:15,
            zhongZheng:16,
            buzheng:17,
            dengZong:18,
            zhongZong:19,
            buzong:20,
            tongguo:21,
            fabu:22
        }
        //主题配置
        , theme: {
            //内置主题配色方案
            color: [{
                main: '#fff' //主题色
                , selected: '#009688' //选中色
                , alias: 'default' //默认别名
            }, {
                main: '#03152A'
                , selected: '#3B91FF'
                , alias: 'dark-blue' //藏蓝
            }, {
                main: '#2E241B'
                , selected: '#A48566'
                , alias: 'coffee' //咖啡
            }, {
                main: '#50314F'
                , selected: '#7A4D7B'
                , alias: 'purple-red' //紫红
            }, {
                main: '#344058'
                , logo: '#1E9FFF'
                , selected: '#1E9FFF'
                , alias: 'ocean' //海洋
            }, {
                main: '#3A3D49'
                , logo: '#2F9688'
                , selected: '#5FB878'
                , alias: 'green' //墨绿
            }, {
                main: '#20222A'
                , logo: '#F78400'
                , selected: '#F78400'
                , alias: 'red' //橙色
            }, {
                main: '#28333E'
                , logo: '#AA3130'
                , selected: '#AA3130'
                , alias: 'fashion-red' //时尚红
            }, {
                main: '#24262F'
                , logo: '#3A3D49'
                , selected: '#009688'
                , alias: 'classic-black' //经典黑
            }, {
                logo: '#226A62'
                , header: '#2F9688'
                , alias: 'green-header' //墨绿头
            }, {
                main: '#344058'
                , logo: '#0085E8'
                , selected: '#1E9FFF'
                , header: '#1E9FFF'
                , alias: 'ocean-header' //海洋头
            }, {
                header: '#393D49'
                , alias: 'classic-black-header' //经典黑头
            }, {
                main: '#50314F'
                , logo: '#50314F'
                , selected: '#7A4D7B'
                , header: '#50314F'
                , alias: 'purple-red-header' //紫红头
            }, {
                main: '#28333E'
                , logo: '#28333E'
                , selected: '#AA3130'
                , header: '#AA3130'
                , alias: 'fashion-red-header' //时尚红头
            }, {
                main: '#28333E'
                , logo: '#009688'
                , selected: '#009688'
                , header: '#009688'
                , alias: 'green-header' //墨绿头
            }]
            //初始的颜色索引，对应上面的配色方案数组索引
            //如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
            , initColorIndex: 0
        },
        themeBg: {
            imgs: [
                {
                    path: '',
                    alias: '简约',
                },
                {
                    path: '/assets/libs/layui/css/modules/layim/skin/1.jpg',
                    alias: '北自所',
                },
                {
                    path: '/assets/libs/layui/css/modules/layim/skin/2.jpg',
                    alias: '山水',
                },
                {
                    path: '/assets/libs/layui/css/modules/layim/skin/3.jpg',
                    alias: '梅花',
                },
                {
                    path: '/assets/libs/layui/css/modules/layim/skin/4.jpg',
                    alias: '田园',
                },
                {
                    path: '/assets/libs/layui/css/modules/layim/skin/5.jpg',
                    alias: '科技',
                },
            ],
            initBgIndex: 0,
        },
        opacityValue: 100,
    };
    exports('setter', setter);
});
