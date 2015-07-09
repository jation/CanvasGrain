define(function (require, exports, module) {
    var Util = require('./Util');
    var Grain = require('./Grain');

    /**
     * 发射器构造函数
     * @param config
     *          id              身份标识用于后续可视化编辑器的维护
     *          world           这个launcher的宿主
     *
     *          grainImage      粒子图片
     *          grainList       粒子队列
     *          grainLife       产生的粒子的生命
     *          grainLifeRange  粒子生命波动范围
     *          maxAliveCount   最大存活粒子数量
     *
     *          x               发射器位置x
     *          y               发射器位置y
     *          rangeX          发射器位置x波动范围
     *          rangeY          发射器位置y波动范围
     *
     *          sizeX           粒子横向大小
     *          sizeY           粒子纵向大小
     *          sizeRange       粒子大小波动范围
     *
     *          mass            粒子质量（暂时没什么用）
     *          massRange       粒子质量波动范围
     *
     *          heat            发射器自身体系的热气
     *          heatEnable      发射器自身体系的热气生效开关
     *          minHeat         随机热气最小值
     *          maxHeat         随机热气最小值
     *
     *          wind            发射器自身体系的风力
     *          windEnable      发射器自身体系的风力生效开关
     *          minWind         随机风力最小值
     *          maxWind         随机风力最小值
     *
     *          grainInfluencedByWorldWind      粒子受到世界风力影响开关
     *          grainInfluencedByWorldHeat      粒子受到世界热气影响开关
     *          grainInfluencedByWorldGravity   粒子受到世界重力影响开关
     *
     *          grainInfluencedByLauncherWind   粒子受到发射器风力影响开关
     *          grainInfluencedByLauncherHeat   粒子受到发射器热气影响开关
     *
     * @constructor
     */

    function Launcher(config) {
        this.id = config.id;
        this.world = config.world;

        this.grainImage = config.grainImage;//粒子图片
        this.grainList = [];
        this.grainLife = config.grainLife || 3;
        this.grainLifeRange = config.grainLifeRange || 1;
        this.maxAliveCount = config.maxAliveCount || 100;

        this.x = config.x;
        this.y = config.y;
        this.rangeX = config.rangeX || 0;
        this.rangeY = config.rangeY || 0;

        this.sizeX = config.sizeX || 16;
        this.sizeY = config.sizeY || 16;
        this.sizeRange = config.sizeRange || 0;

        this.initGrainVx = config.initGrainVx || 0;
        this.initGrainVxRange = config.initGrainVxRange || 0;
        this.initGrainVy = config.initGrainVy || 0;
        this.initGrainVyRange = config.initGrainVyRange || 0;

        this.mass = config.mass || 16;
        this.massRange = config.massRange || 0;

        this.heat = 0;
        this.heatEnable = true;
        this.minHeat = config.minHeat || 0;
        this.maxHeat = config.maxHeat || 0;

        this.wind = 0;
        this.windEnable = true;
        this.minWind = config.minWind || 0;
        this.maxWind = config.maxWind || 0;

        this.grainInfluencedByWorldWind = config.grainInfluencedByWorldWind ;
        this.grainInfluencedByWorldHeat = config.grainInfluencedByWorldHeat ;
        this.grainInfluencedByWorldGravity = config.grainInfluencedByWorldGravity ;

        this.grainInfluencedByLauncherWind = config.grainInfluencedByLauncherWind ;
        this.grainInfluencedByLauncherHeat = config.grainInfluencedByLauncherHeat ;

    }

    Launcher.prototype.enableWind = function () {
        this.windEnable = true;
    };
    Launcher.prototype.disableWind = function () {
        this.windEnable = false;
    };
    Launcher.prototype.enableHeat = function () {
        this.heatEnable = true;
    };
    Launcher.prototype.disableHeat = function () {
        this.heatEnable = false;
    };


    Launcher.prototype.updateLauncherStatus = function () {
        if (this.grainInfluencedByLauncherWind) {
            this.wind = Util.randomFloat(this.minWind, this.maxWind);
        }
        if(this.grainInfluencedByLauncherHeat){
            this.heat = Util.randomFloat(this.minHeat, this.maxHeat);
        }
    };

    Launcher.prototype.swipeDeadGrain = function (grain_id) {

        for (var i = 0; i < this.grainList.length; i++) {
            if (grain_id == this.grainList[i].id) {
                this.grainList = this.grainList.remove(i);
                this.createGrain(1);
                break;
            }
        }
    };

    /**
     * 创建一批新的粒子，最多创建count个
     * @param count
     */
    Launcher.prototype.createGrain = function (count) {
        if (count + this.grainList.length <= this.maxAliveCount) {
            //新建了count个加上旧的还没达到最大数额限制
        } else if (this.grainList.length >= this.maxAliveCount &&
            count + this.grainList.length > this.maxAliveCount) {
            //光是旧的粒子数量还没能达到最大限制
            //新建了count个加上旧的超过了最大数额限制
            count = this.maxAliveCount - this.grainList.length;
        } else {
            count = 0;
        }
        for (var i = 0; i < count; i++) {
            var _rd = Util.randomFloat(0, Math.PI * 2);
            var _grain = new Grain({
                id: Util.randomString("", 8),
                world: this.world,
                launcher: this,
                x: this.x + Util.randomFloat(-this.rangeX,this.rangeX),
                y: this.y + Util.randomFloat(-this.rangeY,this.rangeY),
                sizeX: this.sizeX + this.sizeRange * Math.cos(_rd),
                sizeY: this.sizeY + this.sizeRange * Math.sin(_rd),
                vx:this.initGrainVx+Util.randomInt(-this.initGrainVxRange,this.initGrainVxRange),
                vy:this.initGrainVy+Util.randomInt(-this.initGrainVyRange,this.initGrainVyRange),
                mass: this.mass + this.massRange * Math.random(),
                alpha: 1,
                life: this.grainLife + Util.randomFloat(-this.grainLifeRange,this.grainLifeRange),
                birthTime: parseFloat(this.world.time),
                influencedByWorldWind: this.grainInfluencedByWorldWind,
                influencedByWorldHeat: this.grainInfluencedByWorlHeat,
                influencedByWorldGravity: this.grainInfluencedByWorldGravity,
                influencedByLauncherWind: this.grainInfluencedByLauncherWind,
                influencedByLauncherHeat: this.grainInfluencedByLauncherHeat
            });
            this.grainList.push(_grain);
        }
    };

    /**
     * 绘制所有的粒子
     */
    Launcher.prototype.paintGrain = function () {
        for (var i = 0; i < this.grainList.length; i++) {
            this.grainList[i].paint();
        }
    };


    module.exports = Launcher;

});