var paths = {
    "jquery"                : "vendors/jquery-2.0.3.min",
    "leap"                  : "vendors/leap",
    "Threejs"               : "vendors/three/three",
    "TweenLite"             : "vendors/TweenLite.min",
    "dat.gui"               : "vendors/dat.gui.min",
    "RAF"                   : "vendors/requestAnimationFrame",
    "Stats"                 : "vendors/Stats",
    "TrackballControls"     : "vendors/three/TrackballControls",
    "FirstPersonControls"   : "vendors/three/FirstPersonControls",
    "ColladaLoader"         : "vendors/three/ColladaLoader",
    "BufferLoader"          : "vendors/BufferLoader",
    "Physi"                 : "vendors/physi"
};

var libs = [];
for(var n in paths) libs.push(n);

requirejs.config({

    paths: paths,

    shim: {
        'TrackballControls': {
            deps: ['Threejs']
        },
        'ColladaLoader': {
            deps: ['Threejs']
        },
        'Physi': {
            deps: ['Threejs']
        },
        'FirstPersonControls': {
            deps: ['Threejs']
        },
    },

    waitSeconds: 30

});

require(libs, function()
{
    require(['main']);
});
