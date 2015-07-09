define(function (require, exports, module) {
    var Util = require('./Util');

    /**
     * 粒子构造函数
     * @param config
     *          id              唯一标识
     *          world           世界宿主
     *          launcher        发射器宿主
     *
     *          x               位置x
     *          y               位置y
     *          vx              水平速度
     *          vy              垂直速度
     *
     *          sizeX           横向大小
     *          sizeY           纵向大小
     *
     *          mass            质量
     *          life            生命长度
     *          birthTime       出生时间
     *
     *          color_r
     *          color_g
     *          color_b
     *          alpha           透明度
     *          initAlpha       初始化时的透明度
     *
     *          influencedByWorldWind
     *          influencedByWorldHeat
     *          influencedByWorldGravity
     *          influencedByLauncherWind
     *          influencedByLauncherHeat
     *
     * @constructor
     */
    function Grain(config) {
        this.id = config.id;

        this.world = config.world;
        this.launcher = config.launcher;

        this.x = config.x;
        this.y = config.y;

        this.vx = config.vx || 0;
        this.vy = config.vy || 0;

        this.sizeX = config.sizeX;
        this.sizeY = config.sizeY;

        this.mass = config.mass;
        this.life = config.life;
        this.birthTime = config.birthTime;

        this.color_r = config.color_r || 0;
        this.color_g = config.color_g || 0;
        this.color_b = config.color_b || 0;
        this.initAlpha = this.alpha = config.alpha || 1;

        //是否受到世界的Wind Heat Gravity影响
        this.influencedByWorldWind = config.influencedByWorldWind;
        this.influencedByWorldHeat = config.influencedByWorldHeat;
        this.influencedByWorldGravity = config.influencedByWorldGravity;

        //是否受到Launcher的Wind Heat Gravity影响
        this.influencedByLauncherWind = config.influencedByLauncherWind;
        this.influencedByLauncherHeat = config.influencedByLauncherHeat;

    }

    /**
     * 粒子是否已经死亡
     * @returns {boolean}
     */
    Grain.prototype.isDead = function () {
        return Math.abs(this.world.time - this.birthTime)>this.life;
    };


    Grain.prototype.calculate = function () {
        //计算位置
        if (this.influencedByWorldGravity) {
            this.vy += this.world.gravity+Util.randomFloat(0,0.3*this.world.gravity);
        }
        if (this.influencedByWorldHeat && this.world.heatEnable) {
            this.vy -= this.world.heat+Util.randomFloat(0,0.3*this.world.heat);
        }
        if (this.influencedByLauncherHeat && this.launcher.heatEnable) {
            this.vy -= this.launcher.heat+Util.randomFloat(0,0.3*this.launcher.heat);
        }
        if (this.influencedByWorldWind && this.world.windEnable) {
            this.vx += this.world.wind+Util.randomFloat(0,0.3*this.world.wind);
        }
        if (this.influencedByLauncherWind && this.launcher.windEnable) {
            this.vx += this.launcher.wind+Util.randomFloat(0,0.3*this.launcher.wind);
        }
        this.y += this.vy;
        this.x += this.vx;
        this.alpha = this.initAlpha * (1 - (this.world.time - this.birthTime) / this.life);


        //TODO 计算颜色 和 其他

    };

    Grain.prototype.paint = function () {
        if (this.isDead()) {
            this.launcher.swipeDeadGrain(this.id);
        } else {
            this.calculate();
            this.world.context.save();
            this.world.context.globalCompositeOperation = 'lighter';
            this.world.context.globalAlpha = this.alpha;
            this.world.context.drawImage(this.launcher.grainImage, this.x-(this.sizeX)/2, this.y-(this.sizeY)/2, this.sizeX, this.sizeY);
            this.world.context.restore();
        }
    };


    module.exports = Grain;


});