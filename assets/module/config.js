layui.define(['setter'], function (exports) {
    var setter = layui.setter;
    var config = {
        serverUrl: setter.serverUrl, // 服务器地址
        serverApiUrl: setter.serverApiUrl, // 服务器API接口地址
        crawlerServerApiUrl: setter.crawlerServerApiUrl, //爬虫api接口
        imgUrl: setter.imgUrl, // 服务器地址
        webSocketUrl: setter.webSocketUrl,//通讯服务器
        scope: 'ppp',  // 作用域
        autoRender: false,  // 窗口大小改变后是否自动重新渲染表格，解决layui数据表格非响应式的问题
        staticVersion: '0.0.1',//静态文件版本号控制
        request: {
            //页码的参数名称，默认：page
            pageName: 'cursor',
            //每页数据量的参数名，默认：limit
            limitName: 'limit'
        },
        parseData: function (res) { //res 即为原始返回的数据

            //没有数据
            if(res.result == null){
                return {
                    "code": 200, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                };
            }else {
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.result.total, //解析数据长度
                    "data": res.result.records //解析数据列表
                };
            }

        },
        response: {
            //规定成功的状态码，默认：0
            statusCode: 200
        },
        // 清空本地缓存
        removeAll: function () {
            layui.data(config.scope, null);
        },
        // 获取缓存的token
        getToken: function () {
            var token = layui.data(config.scope).token;
            if (token) {
                return JSON.parse(token);
            }
        },
        // 缓存token
        putToken: function (token) {
            layui.data(config.scope, {
                key: 'token',
                value: JSON.stringify('ppp ' + token)
            });
        },
        // 获取缓存的菜单
        getMenus: function () {
            var menus = layui.data(config.scope).menus;
            if (menus) {
                return JSON.parse(menus);
            }
        },
        // 获取按钮路由
        getButtonRouter: function () {
            var buttonRoter = layui.data(config.scope).buttonRoter;
            if (buttonRoter) {
                return JSON.parse(buttonRoter);
            }
        },
        // 缓存菜单
        putMenus: function (menus) {
            layui.data(config.scope, {
                key: 'menus',
                value: JSON.stringify(menus)
            });
        },
        //缓存按钮路由
        putButtonRoter: function (buttonRoter) {
            layui.data(config.scope, {
                key: 'buttonRoter',
                value: JSON.stringify(buttonRoter)
            });
        },
        // 获取缓存的权限按钮
        getPermButtons: function () {
            var permButtons = layui.data(config.scope).permButtons;
            if (permButtons) {
                return JSON.parse(permButtons);
            }
        },
        // 缓存权限按钮
        putPermButtons: function (permButtons) {
            layui.data(config.scope, {
                key: 'permButtons',
                value: JSON.stringify(permButtons)
            });
        },
        // 获取缓存的token
        getUid: function () {
            var uid = layui.data(config.scope).uid;
            if (uid) {
                return JSON.parse(uid);
            }
        },
        // 缓存Uid
        putUid: function (uid) {
            layui.data(config.scope, {
                key: 'uid',
                value: JSON.stringify(uid)
            });
        },
        // 缓存Uid
        putRole: function (role) {
            layui.data(config.scope, {
                key: 'role',
                value: JSON.stringify(role)
            });
        },
        // 获取缓存的token
        getRole: function () {
            var role = layui.data(config.scope).role;
            if (role) {
                return JSON.parse(role);
            }
        },
        // 当前登录的用户
        getUser: function () {
            var user = layui.data(config.scope).user;
            if (user) {
                return JSON.parse(user);
            }
        },
        // 缓存user
        putUser: function (user) {
            layui.data(config.scope, {
                key: 'user',
                value: JSON.stringify(user)
            });
        }
    };
    exports('config', config);
});
