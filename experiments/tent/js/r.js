var paths = {
    "three"          : "vendor/three/three.min",
    "modernizr"      : "vendor/modernizr-2.6.2.min",
    "jquery"         : "vendor/jquery-1.8.3.min",
    "jquery.pause"   : "vendor/jquery.pause.min",
    "transit"        : "vendor/jquery.transit.min",
    "jqueryui"       : "vendor/jquery-ui.min",
    "underscore"     : "vendor/underscore-1.3.3.min",
    "backbone"       : "vendor/backbone-0.9.2.min",
    "raf"            : "vendor/requestAnimationFrame",
    "tween"          : "vendor/Tween",
    "signals"        : "vendor/signals",
    "library"        : "vendor/Library",
    'preloadJS'      : "vendor/preloadjs-0.2.0.min",
    'htmlAudioPlugin': "vendor/soundjs/HTMLAudioPlugin",
    'soundJS'        : "vendor/soundjs/SoundJS",
    "stats"          : "vendor/Stats",
    "dat.gui"        : "vendor/dat.gui.min",
    "plugins"        : "plugins",
    "sonic"          : "vendor/sonic",
    // "webglinspector" : "vendor/webglinspector",
    "detector"       : "vendor/Detector"

};

var threeModules = [
    // "vendor/three/loaders/GeometryLoader",
    // "vendor/three/loaders/LoadingMonitor",
    // "vendor/three/ShaderGodRays",
    // "vendor/three/WebGLShaders",
    "vendor/three/ShaderExtras",
    "vendor/three/postprocessing/EffectComposer",
    "vendor/three/postprocessing/RenderPass",
    "vendor/three/postprocessing/BloomPass",
    "vendor/three/postprocessing/ShaderPass",
    "vendor/three/postprocessing/MaskPass",
    "vendor/three/postprocessing/SavePass",
    "vendor/three/postprocessing/FilmPass",
    "vendor/three/postprocessing/BokehShader",
    "vendor/three/ShaderUtils"
];

var libs = [];
for(var n in paths) libs.push(n);

requirejs.config({

    baseUrl: 'js',

    paths: paths,

    shim: {
        'three' : {
            exports: 'THREE'
        },

        'transit' : {
            deps : ['jquery']
        },

        'jqueryui' : {
            deps : ['jquery']
        },

        'jquery.pause': {
            deps : ['jquery']
        },

        'backbone': {
            deps: ['underscore', 'jquery']
        },


        'htmlAudioPlugin': {
            deps: ['soundJS']
        },

        'signals': {
            deps: ['jquery']
        },

        'library': {
            deps: ['signals']
        }
    }
});

require(libs, function()
{
    require(threeModules, function ()
    {
        require(['app']);
    });
});
