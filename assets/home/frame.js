layui.config({
    //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
    base: 'assets/module/',
    dynamicBase: 'components/',//动态模板路径
    //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    version: true,
    //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    debug: true
}).extend({
    echarts: 'extend/echarts',
    echartsTheme: 'extend/echartsTheme',
    formSelects: 'formSelects/formSelects-v4',
    iconPicker: 'iconPicker/iconPicker',
    treetable: 'treetable/treetable',
    dragDrop: 'dragDrop/dragDrop',
    jigsaw: 'jigsaw/jigsaw',
    transfer: 'transfer/transfer',
    strpy: 'strpy/strpy',

}).use(['config', 'index', 'element', 'ppp'], function () {
    var config = layui.config;
    var index = layui.index;
    var element = layui.element;
    var ppp = layui.ppp;
    Pandyle.config({
        comPath: {
            home: '/components/dynamicViews/home/{name}.html'
        }
    });
    // 检查是否登录
    if (!config.getToken() || config.getToken() == '') {
        location.replace('login.html');
        return;
    }
    //获取当前用户信息
    index.getUser(
        function (user) {
            localStorage.setItem('pppUser', JSON.stringify(user));
            $('.layui-layout-admin .layui-header').vm(user);
            index.initLeftNav();//初始化左菜单
            element.render('nav');//渲染上上菜单
            index.initRouter();//初始化前端路由
            index.bindEvent();//绑定常用方法
        }
    );
    ppp.get('../admin/getMenus', {async: false}, function (data) {
        if (data.code == 500) {
            config.removeAll();
            location.replace('login');
        }
        var menus = data.result;
        config.putMenus(menus);
    });
    ppp.get('../admin/getButtonRouter', {async: false}, function (data) {
        if (data.code == 500) {
            config.removeAll();
            location.replace('login');
        }
        config.putButtonRoter(data.result);
    });
    ppp.get('../admin/buttons/aliases', {async: false}, function (data) {
        if (data.code == 500) {
            config.removeAll();
            location.replace('login');
        }
        config.putPermButtons(data.result);
    });
});


