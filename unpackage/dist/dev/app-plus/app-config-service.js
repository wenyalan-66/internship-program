
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/sso/login","pages/sso/register","pages/userCenter/user-center","pages/quotation/quotation","pages/quotation/add","pages/quotation/preview","pages/contract/contract","pages/contract/add","pages/contract/preview","pages/userManage/user-manage"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"RDD报价管理系统","navigationBarBackgroundColor":"#ffc72c","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#8c8c8c","selectedColor":"#ffc72c","borderStyle":"#8c8c8c","backgroundColor":"#ffffff","list":[{"pagePath":"pages/quotation/quotation"},{"pagePath":"pages/contract/contract"},{"pagePath":"pages/userManage/user-manage"},{"pagePath":"pages/userCenter/user-center"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":false,"autoclose":true},"appname":"Epiroc RDD","compilerVersion":"3.1.18","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"titleNView":false}},{"path":"/pages/sso/login","meta":{},"window":{"navigationBarTitleText":"登录","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/sso/register","meta":{},"window":{"navigationBarTitleText":"注册","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/userCenter/user-center","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":false,"titleNView":{"buttons":[{"text":"注销","fontSize":"14px"}]}}},{"path":"/pages/quotation/quotation","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"报价管理","enablePullDownRefresh":true,"onReachBottomDistance":100,"pullToRefresh":{"support":true,"color":"#ffc72c","style":"circle"}}},{"path":"/pages/quotation/add","meta":{},"window":{"navigationBarTitleText":"新建报价","enablePullDownRefresh":false}},{"path":"/pages/quotation/preview","meta":{},"window":{"navigationBarTitleText":"报价单预览","enablePullDownRefresh":false}},{"path":"/pages/contract/contract","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"合同管理","enablePullDownRefresh":true,"onReachBottomDistance":100,"pullToRefresh":{"support":true,"color":"#ffc72c","style":"circle"}}},{"path":"/pages/contract/add","meta":{},"window":{"navigationBarTitleText":"新建合同","enablePullDownRefresh":false}},{"path":"/pages/contract/preview","meta":{},"window":{"navigationBarTitleText":"合同预览","enablePullDownRefresh":false}},{"path":"/pages/userManage/user-manage","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"用户管理","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});