define(function (require, exports, module) {
    var Util = require('./mod/Util');
    var World = require('./mod/World');
    var ImgLoader = require('./mod/ImgLoad.js');


    var arrPreLoadImg = ['./img/bg.jpg', './img/lizi.png'];
    ImgLoader(arrPreLoadImg, function (o) {
        if (o == 1) {
            sourcesLoaded();
        }
    });

    function sourcesLoaded() {
        var imgBackground = new Image(),
            imgLizi = new Image();
        imgBackground.src = './img/bg.jpg';
        imgLizi.src = './img/lizi2.png';

        var canvas = document.getElementById('stage');

        var world = new World({
            backgroundImage: imgBackground,
            canvas: canvas,
            minWind: -1,
            maxWind: 1,
            minHeat: 0.91,
            maxHeat: 0.01,
            gravity: 1
        });

        /*world.createLauncher({
            id: Util.randomString("", 8),
            world: world,
            grainImage: imgLizi,
            x: 512,
            y: 0,
            rangeX: 768,
            rangeY:0,
            sizeX: 16,
            sizeY: 16,
            sizeRange: 0,

            initGrainVx:0,
            initGrainVy:0,
            initGrainVxRange:5,
            initGrainVyRange:5,

            grainInfluencedByLauncherWind: false,
            grainInfluencedByLauncherHeat: false,
            grainInfluencedByWorldWind: true,
            grainInfluencedByWorlHeat: true,
            grainInfluencedByWorldGravity: true,
            maxAliveCount:400,
            grainLife:3,
            grainLifeRange:1.5
        });
*/

        canvas.addEventListener('click', function (e) {
            var minSize = parseInt($('#minSize').val()),
                maxSize = parseInt($('#maxSize').val());

            var _rdSize = Util.randomInt(minSize,maxSize);
            world.createLauncher({
                id: Util.randomString("", 8),
                world: world,
                grainImage: imgLizi,
                rangeX: parseInt($('#rangeX').val()),
                rangeY: parseInt($('#rangeY').val()),
                x: e.x,
                y: e.y,
                sizeX: _rdSize,
                sizeY: _rdSize,
                sizeRange: 0,

                initGrainVx:parseInt($('#initVx').val()),
                initGrainVy:parseInt($('#initVy').val()),
                initGrainVxRange:parseInt($('#initVxRange').val()),
                initGrainVyRange:parseInt($('#initVyRange').val()),

                grainInfluencedByLauncherWind: $("#ifByLaucherWind").is(":checked"),
                grainInfluencedByLauncherHeat: $("#ifByLaucherHeat").is(":checked"),
                grainInfluencedByWorldWind: $("#ifByWorldWind").is(":checked"),
                grainInfluencedByWorldHeat: $("#ifByWorldHeat").is(":checked"),
                grainInfluencedByWorldGravity: $("#ifByWorldGravity").is(":checked"),
                maxHeat: parseFloat($('#minHeat').val()),
                minHeat: parseFloat($('#maxHeat').val()),
                maxWind: parseFloat($('#minWind').val()),
                minWind: parseFloat($('#maxWind').val()),
                maxAliveCount:parseInt($('#maxAliveCount').val()),
                grainLife:parseFloat($("#grainLife").val()),
                grainLifeRange:parseFloat($("#grainLifeRange").val())
            });
        }, false);


        setInterval(function () {
            world.timeTick();
        }, 60);

    }



});