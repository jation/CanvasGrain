define(function(require, exports, module) {
    var Util = require('./Util');
    var Launcher = require('./Launcher');

    /**
     * 世界构造函数
     * @param config
     *          backgroundImage     背景图片
     *          canvas              canvas引用
     *          context             canvas的context
     *
     *          time                世界时间
     *
     *          gravity             重力加速度
     *
     *          heat                热力
     *          heatEnable          热力开关
     *          minHeat             随机最小热力
     *          maxHeat             随机最大热力
     *
     *          wind                风力
     *          windEnable          风力开关
     *          minWind
     *          maxWind
     *
     *          timeProgress        时间进步单位，用于控制时间速度
     *
     *          launchers           属于这个世界的发射器队列
     *
     *
     * @constructor
     */
    function World(config){
        this.backgroundImage = config.backgroundImage;
        this.canvas = config.canvas;
        this.context = config.canvas.getContext('2d');

        this.time = 0;

        /*
            重力加速度，方向是垂直的
            一般来说一个世界重力加速度是稳定的
            允许突变，但变化不会像Heat或者Wind一样不稳定
         */
        this.gravity = config.gravity || 1;

        /*
            热气 Heat
            热气强度总是随机的，方向垂直向上的
            当heatEnable时，热气大小会随着updateStatus()做改变
            变动幅度是minHeat到maxHeat
         */
        this.heat = 8;
        this.heatEnable = true;
        this.minHeat = config.minHeat || 16;
        this.maxHeat = config.maxHeat || 20;

        /*
            风力 Wind
            风力强度总是随机的，方向是左右的，正方向为右向
            当windEnable时，热气大小会随着updateStatus()做改变
            变动幅度是minHeat到maxHeat
         */
        this.wind = 0;
        this.windEnable = true;
        this.minWind = config.minWind || -5 ;
        this.maxWind = config.maxWind || 5;

        /*
            World的时间递增速度
            每一次TimeTick都会让time加上这个值
            如果为负数，那么时间逆流
         */
        this.timeProgress = config.timeProgress || 0.1;

        this.launchers = []; //发射器列表
    }

    /**
     * 减缓时间
     */
    World.prototype.timeSlower = function(){
        this.timeProgress -= 0.01;
    };
    /**
     * 加速时间
     */
    World.prototype.timeFaster = function(){
        this.timeProgress += 0.01;
    };
    /**
     * 时光倒流
     */
    World.prototype.timeReverse = function(){
        this.timeProgress = -this.timeProgress;
    };

    /**
     * 风的开关
     */
    World.prototype.enableWind = function(){
        this.windEnable = true;
    };
    World.prototype.disableWind = function(){
        this.windEnable = false;
    };
    /**
     * 热气开关
     */
    World.prototype.enableHeat = function(){
        this.heatEnable = true;
    };
    World.prototype.disableHeat = function(){
        this.heatEnable = false;
    };

    /**
     * World的状态更新
     */
    World.prototype.updateStatus = function(){
        this.wind = Util.randomFloat(this.minWind,this.maxWind);
        this.heat = Util.randomFloat(this.minHeat,this.maxHeat);
    };

    /**
     * 循环触发函数
     * 在满足条件的时候触发
     * 比如RequestAnimationFrame回调，或者setTimeout回调之后循环触发的
     * 用于维持World的生命
     */
    World.prototype.timeTick = function(){
        this.time+=this.timeProgress;

        //更新世界各种状态
        this.updateStatus();

        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawBackground();

        //触发所有发射器的循环调用函数
        for(var i = 0;i<this.launchers.length;i++){
            this.launchers[i].updateLauncherStatus();
            this.launchers[i].createGrain(1);
            this.launchers[i].paintGrain();
        }
    };

    /**
     * 新建一个发射点
     * @param config
     */
    World.prototype.createLauncher = function(config){
        var _launcher = new Launcher(config);
        this.launchers.push(_launcher);
    };


    World.prototype.drawBackground = function(){
        this.context.save();
        this.context.drawImage(this.backgroundImage,0,0,this.canvas.width,this.canvas.height);
        this.context.restore();
    };



    module.exports = World;
});