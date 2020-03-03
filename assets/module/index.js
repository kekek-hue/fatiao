layui.define(['config', 'ppp', 'layer','setter','view','slider'], function (exports) {
    var $ = layui.$;
    var config = layui.config;
    var ppp = layui.ppp;
    var layer = layui.layer;
    var setter = layui.setter;
    var slider = layui.slider;
    o = $("body"),
    h = $("html"),
    i = layui.laytpl,
    l = layui.view;
    var y = "layui-this";

    var index = {
        // 渲染左侧导航栏
        initLeftNav: function () {
            var menus = config.getMenus();
            if(menus){
                
            }else{
                ppp.get('../admin/getMenus', {async: false}, function (data) {
                if(data.code == 500){
                        config.removeAll();
                        location.replace('login');
                    }
                    config.putMenus(data.result);
                });
                menus = config.getMenus();
                //location.replace('index.html');
            }
            $('.layui-layout-admin .layui-side').vm({menus: menus});
            ppp.activeNav(Q.lash);
        },
        // 路由注册
        initRouter: function () {
            index.regRouter(config.getMenus());
            index.regRouter(config.getButtonRouter());
            Q.init({
                key:'/',
                index: 'index.html',
                pop:function(){
                    //console.log('pop 当前参数是:',arguments);
                }
            });
        },
        // 使用递归循环注册
        regRouter: function (menus) {
            $.each(menus, function (i, data) {
                if (data.router) {
                    //处理编辑文章路由加参数
                    if(data.router == 'articleInfo'){
                        Q.reg(data.router, function (articleId) {
                            //console.error('articleId--------->');
                            //console.error(articleId);
                            ppp.putTempData('articleId',articleId);
                            globalId = articleId;
                            ppp.loadView('components/' + data.path);
                        }); 
                    }else if(data.router == 'editPic'){
                        Q.reg(data.router, function (articleId) {
                            // console.error('articleId--------->');
                            // console.error(articleId);
                            ppp.putTempData('articleId',articleId);
                            globalId = articleId;
                            ppp.loadView('components/' + data.path);
                        });
                    }else if(data.router == 'editTopicArticle'){
                        Q.reg(data.router, function (articleId) {
                            ppp.putTempData('articleId',articleId);
                            globalId = articleId;
                            ppp.loadView('components/' + data.path);
                        });
                    }else if(data.router == 'editTopic'){//编辑专题基本信息
                        Q.reg(data.router, function (articleId) {
                            ppp.putTempData('articleId',articleId);
                            globalId = articleId;
                            ppp.loadView('components/' + data.path);
                        });
                    }else if(data.router == 'editTopicLabel'){//编辑专题的label
                        Q.reg(data.router, function (articleId) {
                            ppp.putTempData('articleId',articleId);
                            globalId = articleId;
                            ppp.loadView('components/' + data.path);
                        });
                    }else{
                        Q.reg(data.router, function () {
                            ppp.loadView('components/' + data.path);
                        });    
                    }
                }
                if (data.childrens) {
                    index.regRouter(data.childrens);
                }
            });
        },
        // 从服务器获取登录用户的信息
        getUser: function (success) {
            ppp.get('../admin/info', {}, function (data) {
                let user = data.result;
                config.putUser(user);
                success(user);
            });
        },
        theme: function(e) {
            //console.error(e);
            var t = (setter.theme, layui.data(setter.tableName)),
            l = "LAY_layadmin_theme",
            s = document.createElement("style"),
            r = i([".layui-side-menu,", ".layadmin-pagetabs .layui-tab-title li:after,", ".layadmin-pagetabs .layui-tab-title li.layui-this:after,", ".layui-layer-admin .layui-layer-title,", ".layadmin-side-shrink .layui-side-menu .layui-nav>.layui-nav-item>.layui-nav-child", "{background-color:{{d.color.main}} !important;}", ".layui-nav-tree .layui-this,", ".layui-nav-tree .layui-this>a,", ".layui-nav-tree .layui-nav-child dd.layui-this,", ".layui-nav-tree .layui-nav-child dd.layui-this a", "{background-color:{{d.color.selected}} !important;}", ".layui-layout-admin .layui-logo{background-color:{{d.color.logo || d.color.main}} !important;}", "{{# if(d.color.header){ }}", ".layui-layout-admin .layui-header{background-color:{{ d.color.header }};}", ".layui-layout-admin .layui-header a,", ".layui-layout-admin .layui-header a cite{color: #f8f8f8;}", ".layui-layout-admin .layui-header a:hover{color: #fff;}", ".layui-layout-admin .layui-header .layui-nav .layui-nav-more{border-top-color: #fbfbfb;}", ".layui-layout-admin .layui-header .layui-nav .layui-nav-mored{border-color: transparent; border-bottom-color: #fbfbfb;}", ".layui-layout-admin .layui-header .layui-nav .layui-this:after, .layui-layout-admin .layui-header .layui-nav-bar{background-color: #fff; background-color: rgba(255,255,255,.5);}", ".layadmin-pagetabs .layui-tab-title li:after{display: none;}", "{{# } }}"].join("")).render(e = $.extend({},
            t.theme, e)),
            u = document.getElementById(l);
            "styleSheet" in s ? (s.setAttribute("type", "text/css"), s.styleSheet.cssText = r) : s.innerHTML = r,
            s.id = l,
            u && o[0].removeChild(u),
            //o[0].appendChild(s),
            o.attr("layadmin-themealias", e.color.alias),
            t.theme = t.theme || {},
            layui.each(e,
            function(e, a) {
                t.theme[e] = a
            }),
            layui.data(setter.tableName, {
                key: "theme",
                value: t.theme
            })
        },
        setOpacity:function(e){
            var opacityValue = e;
            var opacityValue_t = opacityValue/100;
            var t = (setter.opacityValue, layui.data(setter.tableName));
            var l = "LAY_layadmin_setOpacity",
            s = document.createElement("style"),
            r = i([".layui-layout-admin .layui-side{opacity: "+opacityValue_t+";}" ,".layui-layout-body{opacity: "+opacityValue_t+";}"].join("")).render(e = $.extend({},
            t.opacityValue, e))
            u = document.getElementById(l);
            "styleSheet" in s ? (s.setAttribute("type", "text/css"), s.styleSheet.cssText = r) : s.innerHTML = r,
            s.id = l,
            u && o[0].removeChild(u),
            o[0].appendChild(s),
            t.opacityValue = t.opacityValue || {},
            layui.data(setter.tableName, {
                key: "opacityValue",
                value: opacityValue
            })
        },
        initOpacity:function(e){
            index.setOpacity(e)
        },
        themeBg: function(e) {
            var t = (setter.themeBg, layui.data(setter.tableName)),
            l = "LAY_layadmin_themeBg",
            s = document.createElement("style"),
            r = i([".htmlBg{background-image:url({{d.imgs.path}});}",].join("")).render(e = $.extend({},t.themeBg, e)),
            u = document.getElementById(l);
            "styleSheet" in s ? (s.setAttribute("type", "text/css"), s.styleSheet.cssText = r) : s.innerHTML = r,
            s.id = l,
            u && h[0].removeChild(u),
            h[0].appendChild(s),
            t.themeBg = t.themeBg || {},
            layui.each(e,
                function(e, a) {
                    t.themeBg[e] = a
                }
            ),
           // h.att(e.imgs.path);
            layui.data(setter.tableName, {
                key: "themeBg",
                value: t.themeBg
            })
        },
        initTheme: function(e) {
            var a = setter.theme;
            e = e || 0,
            a.color[e] && (a.color[e].index = e, index.theme({
                color: a.color[e]
            }))
        },
        initThemeBg:function(e){
            var a = setter.themeBg;
            e = e || 0,
            a.imgs[e] && (a.imgs[e].index = e, index.themeBg({
                imgs: a.imgs[e]
            }))  
        },
        popup: l.popup,
        popupRight: function(e) {
            return index.popup.index = layer.open($.extend({
                type: 1,
                id: "LAY_adminPopupR",
                anim: -1,
                title: !1,
                closeBtn: !1,
                offset: "r",
                shade: .1,
                shadeClose: !0,
                skin: "layui-anim layui-anim-rl layui-layer-adminRight",
                area: "300px"
            },
            e))
        },
        initData:function(){
            var e = layui.data(setter.tableName);
            e.theme ? index.theme(e.theme) : setter.theme && index.initTheme(setter.theme.initColorIndex);
            e.themeBg ? index.themeBg(e.themeBg) : setter.themeBg && index.initThemeBg(setter.themeBg.initBgIndex);
            e.opacityValue ? index.setOpacity(e.opacityValue) : setter.opacityValue && index.initOpacity(setter.opacityValue);
        },
        // 页面元素绑定事件监听
        bindEvent: function () {
            //console.error('绑定事件');
            // 退出登录
            $('#logout').click(function () {
                layer.confirm('确定退出登录？', function (i) {
                    ppp.post('/logout',{async: false}, function () {
                        layer.close(i);
                        config.removeAll();
                        location.replace('/login.html');    
                    });
                });
            });

            // 主题设置
            $('#setTheme').click(function () {
                index.initData();
               // ppp.popupRight('components/tpl/theme.html');
                index.popupRight({
                    id: "LAY_adminPopupTheme",
                    success: function() {
                        l(this.id).render("theme")
                    }
                })
            });
            // 修改密码
            $('#setPassword').click(function () {
                ppp.popupRight('components/tpl/password.html');
            });
            // 个人信息
            $('#setInfo').click(function () {
                ppp.popupRight('components/tpl/userinfo.html');
            });
            // 消息
            $('#btnMessage').click(function () {
                ppp.popupRight('components/tpl/message.html');
            });
        }
    };
    //默认样式
   var ev = index.events = {
        //设置主题色
        setTheme: function(e) {
            var a = e.data("index");
            e.siblings(".layui-this").data("index");
            e.hasClass(y) || (e.addClass(y).siblings(".layui-this").removeClass(y), index.initTheme(a))
        },
        setThemeBg:function(e){
            var a = e.data('index');
            e.siblings(".layui-this").data("index");
            e.hasClass(y) || (e.addClass(y).siblings(".layui-this").removeClass(y), index.initThemeBg(a))
        },
    };
    o.on("click", "*[layadmin-event]",
    function() {
        var e = $(this),
        i = e.attr("layadmin-event");
        ev[i] && ev[i].call(this, e)
    })
    //初始化数据
    index.initData();
    //console.error('-------theme-----');
    //console.error(e);
    exports('index', index);
});
