var NumberUtils;

NumberUtils = (function() {
  NumberUtils.PI = Math.PI;

  NumberUtils.PIBy2 = Math.PI / 2;

  NumberUtils.PI2 = Math.PI * 2;

  function NumberUtils() {
    console.log("You musn't instanciate Utils");
    return;
  }

  NumberUtils.map = function(num, min1, max1, min2, max2, round, constrainMin, constrainMax) {
    var num1, num2;
    if (round == null) {
      round = false;
    }
    if (constrainMin == null) {
      constrainMin = true;
    }
    if (constrainMax == null) {
      constrainMax = true;
    }
    if (constrainMin && num < min1) {
      return min2;
    }
    if (constrainMax && num > max1) {
      return max2;
    }
    num1 = (num - min1) / (max1 - min1);
    num2 = (num1 * (max2 - min2)) + min2;
    if (round) {
      return Math.round(num2);
    }
    return num2;
  };

  NumberUtils.toRadians = function(degree) {
    return degree * (Math.PI / 180);
  };

  NumberUtils.toDegree = function(radians) {
    return radians * (180 / Math.PI);
  };

  NumberUtils.isInRange = function(num, min, max) {
    return num >= min && num <= max;
  };

  NumberUtils.random = function(min, max, negative) {
    if (negative == null) {
      negative = false;
    }
    if (!negative) {
      return Math.floor(Math.random() * max) + min;
    } else {
      return Math.floor(Math.random() * (max * 2)) - min;
    }
  };

  return NumberUtils;

})();

var Player,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Player = (function() {
  Player.prototype.controls = null;

  function Player() {
    this.update = __bind(this.update, this);
    this.controls = new PlayerControls;
    null;
  }

  Player.prototype.update = function(frame) {
    this.controls.update(frame);
    return null;
  };

  return Player;

})();

var PlayerControls,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PlayerControls = (function() {
  PlayerControls.prototype.palm = null;

  PlayerControls.prototype.hand = null;

  PlayerControls.prototype.handId = 0;

  PlayerControls.prototype.cameraPositionTween = null;

  PlayerControls.prototype.cameraRotationTween = null;

  PlayerControls.prototype.factorGravity = 1;

  PlayerControls.prototype.gravityX = 0;

  PlayerControls.prototype.gravityY = -100;

  PlayerControls.prototype.gravityZ = 0;

  function PlayerControls() {
    this.update = __bind(this.update, this);
    this.moveCamera = __bind(this.moveCamera, this);
    this.initEvents();
    null;
  }

  PlayerControls.prototype.initEvents = function() {
    window.addEventListener('mousemove', this.moveCamera);
    window.addEventListener('mousedown', this.increaseGravityFactor);
    window.addEventListener('mouseup', this.decreaseGravityFactor);
    return null;
  };

  PlayerControls.prototype.increaseGravityFactor = function() {
    console.log('FULL POWER');
    this.factorGravity = 100;
    return null;
  };

  PlayerControls.prototype.decreaseGravityFactor = function() {
    console.log('NORMAL POWER');
    this.factorGravity = 1;
    return null;
  };

  PlayerControls.prototype.moveCamera = function(e) {
    this.gravityX = NumberUtils.map(e.pageX, 0, STAGE_WIDTH, -50, 50);
    this.gravityY = NumberUtils.map(e.pageY, 0, STAGE_HEIGHT, 50, -50);
    this.cameraRotationTween = new TweenLite(camera.rotation, .3, {
      x: NumberUtils.map(e.pageY, 0, STAGE_HEIGHT, .3, -.3),
      y: NumberUtils.map(e.pageX, 0, STAGE_WIDTH, .05, -.05)
    });
    scene.setGravity(new THREE.Vector3(this.gravityX * this.factorGravity, this.gravityY * this.factorGravity, this.gravityZ * this.factorGravity));
    return null;
  };

  PlayerControls.prototype.update = function(frame) {
    var normalizedPosition, x, y;
    if (!frame.hands || !frame.hands[0]) {
      return;
    }
    if (!this.hand) {
      this.handId = frame.hands[0].id;
    }
    this.hand = frame.hands[0];
    if (frame.hands[1]) {
      this.factorGravity = 100;
    } else {
      this.factorGravity = 1;
    }
    normalizedPosition = frame.interactionBox.normalizePoint(this.hand.stabilizedPalmPosition, true);
    x = NumberUtils.map(normalizedPosition[0], 0, 1, 0, STAGE_WIDTH);
    y = NumberUtils.map(normalizedPosition[1], 0, 1, STAGE_HEIGHT, 0);
    this.gravityX = NumberUtils.map(normalizedPosition[0], 0, 1, -50, 50);
    this.gravityY = NumberUtils.map(normalizedPosition[1], 0, 1, -50, 50);
    this.gravityZ = NumberUtils.map(normalizedPosition[2], .4, 1, -50, 50);
    this.cameraRotationTween = new TweenLite(camera.rotation, .3, {
      x: NumberUtils.map(y, 0, STAGE_HEIGHT, .3, -.3),
      y: NumberUtils.map(x, 0, STAGE_WIDTH, .05, -.05)
    });
    scene.setGravity(new THREE.Vector3(this.gravityX * this.factorGravity, this.gravityY * this.factorGravity, this.gravityZ * this.factorGravity));
    return null;
  };

  PlayerControls.prototype.removeEvents = function() {
    return null;
  };

  PlayerControls.prototype.dispose = function() {
    return null;
  };

  return PlayerControls;

})();

var PlayerInteractionsManager;

PlayerInteractionsManager = (function() {
  function PlayerInteractionsManager() {
    null;
  }

  PlayerInteractionsManager.prototype.initEvents = function() {
    return null;
  };

  PlayerInteractionsManager.prototype.removeEvents = function() {
    return null;
  };

  PlayerInteractionsManager.prototype.onMove = function() {
    return null;
  };

  return PlayerInteractionsManager;

})();

var Cube;

Cube = (function() {
  Cube.prototype.el = null;

  function Cube(geometry, material, mass) {
    this.el = new Physijs.BoxMesh(geometry, material, mass);
    null;
  }

  Cube.prototype.update = function() {
    return null;
  };

  return Cube;

})();

var CubesManager;

CubesManager = (function() {
  CubesManager.prototype.cubes = null;

  CubesManager.prototype.textureSize = 60;

  CubesManager.prototype.xgrid = 0;

  CubesManager.prototype.ygrid = 0;

  CubesManager.prototype.nbCubes = 5;

  CubesManager.prototype.cubeSize = 0;

  CubesManager.prototype.uvSize = 0;

  function CubesManager() {
    var cube, _i, _len, _ref;
    this.cubes = [];
    this.cubeSize = this.textureSize / this.nbCubes;
    this.uvSize = 1 / this.cubeSize;
    this.initCubes();
    this.initDynamicsCubes();
    _ref = this.cubes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cube = _ref[_i];
      scene.add(cube.el);
    }
    null;
  }

  CubesManager.prototype.initCubes = function() {
    var cube, geometry, i, j, mass, material, offsetx, offsety, posx, posy, posz, texture, _i, _j, _ref, _ref1;
    texture = new THREE.ImageUtils.loadTexture('./assets/img/trainingStageTexture.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    material = new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    for (i = _i = 0, _ref = this.cubeSize; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.cubeSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        offsetx = i;
        offsety = j;
        geometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        this.change_uvs(geometry, offsetx, offsety);
        mass = 0;
        posx = ((i - this.cubeSize / 2) * this.cubeSize) + 6;
        posy = ((j - this.cubeSize / 2) * this.cubeSize) + 77;
        posz = -75 + this.cubeSize / 2;
        cube = new Cube(geometry, material, mass);
        cube.el.position.x = posx;
        cube.el.position.y = posy;
        cube.el.position.z = posz;
        this.cubes.push(cube);
      }
    }
    return null;
  };

  CubesManager.prototype.initDynamicsCubes = function() {
    var i, _i;
    this.dynamicCubes = [];
    this.cubes = this.shuffleArray(this.cubes);
    for (i = _i = 0; _i < 10; i = ++_i) {
      this.cubes[i].el.position.x = (NumberUtils.random(-66, 66, true)) - 127;
      this.cubes[i].el.position.y = this.cubeSize / 2 + 10;
      this.cubes[i].el.position.z = (NumberUtils.random(50, 80)) - 127;
      this.cubes[i].el.rotation.x = Math.random() * (Math.PI * 2);
      this.cubes[i].el.rotation.y = Math.random() * (Math.PI * 2);
      this.cubes[i].el.mass = 100;
      this.cubes[i].el.scale.x = this.cubes[i].el.scale.y = this.cubes[i].el.scale.z = .6;
      this.dynamicCubes.push(this.cubes[i]);
    }
    return null;
  };

  CubesManager.prototype.change_uvs = function(geometry, offsetx, offsety) {
    var faceVertexUvs, i, j, uv, uvs, _i, _j, _ref, _ref1;
    faceVertexUvs = geometry.faceVertexUvs[0];
    for (i = _i = 0, _ref = faceVertexUvs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      uvs = faceVertexUvs[i];
      for (j = _j = 0, _ref1 = uvs.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        uv = uvs[j];
        uv.x = (uv.x + offsetx) * this.uvSize;
        uv.y = (uv.y + offsety) * this.uvSize;
      }
    }
    return null;
  };

  /*
  Randomize array element order in-place.
  Using Fisher-Yates shuffle algorithm.
  */


  CubesManager.prototype.shuffleArray = function(array) {
    var i, j, temp;
    i = array.length - 1;
    while (i > 0) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      i--;
    }
    return array;
  };

  CubesManager.prototype.update = function() {
    return null;
  };

  return CubesManager;

})();

var Room;

Room = (function() {
  Room.prototype.sides = null;

  Room.prototype.cubesManager = null;

  function Room() {
    var backMaterial, bottomMaterial, bottomTexture, frontMaterial, frontTexture, geometry, sideMaterial, sideTexture;
    this.sides = {
      bottom: null,
      top: null,
      left: null,
      right: null,
      front: null,
      back: null
    };
    sideTexture = new THREE.ImageUtils.loadTexture('./assets/img/trainingStageTexture.jpg');
    sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping;
    sideTexture.repeat.set(10, 10);
    sideMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({
      map: sideTexture,
      side: THREE.DoubleSide
    }), .8, .4);
    sideMaterial.map.wrapS = sideMaterial.map.wrapT = THREE.RepeatWrapping;
    sideMaterial.map.repeat.set(1, 1);
    bottomTexture = new THREE.ImageUtils.loadTexture('./assets/img/roomBottom.jpg');
    bottomTexture.wrapS = bottomTexture.wrapT = THREE.RepeatWrapping;
    bottomTexture.repeat.set(10, 10);
    bottomMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({
      map: bottomTexture
    }), .8, .4);
    bottomMaterial.map.wrapS = bottomMaterial.map.wrapT = THREE.RepeatWrapping;
    bottomMaterial.map.repeat.set(1, 1);
    frontTexture = new THREE.ImageUtils.loadTexture('./assets/img/trainingStageTexture_alpha.jpg');
    frontTexture.wrapS = frontTexture.wrapT = THREE.RepeatWrapping;
    frontTexture.repeat.set(10, 10);
    frontMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({
      map: frontTexture
    }), .8, .4);
    frontMaterial.map.wrapS = frontMaterial.map.wrapT = THREE.RepeatWrapping;
    frontMaterial.map.repeat.set(1, 1);
    backMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({
      map: frontTexture
    }), .8, .4);
    backMaterial.map.wrapS = backMaterial.map.wrapT = THREE.RepeatWrapping;
    backMaterial.map.repeat.set(1, 1);
    geometry = new THREE.CubeGeometry(150, 2, 150);
    this.sides.bottom = new Physijs.BoxMesh(geometry, bottomMaterial, 0);
    this.sides.top = new Physijs.BoxMesh(geometry, bottomMaterial, 0);
    this.sides.left = new Physijs.BoxMesh(geometry, sideMaterial, 0);
    this.sides.right = new Physijs.BoxMesh(geometry, sideMaterial, 0);
    this.sides.front = new Physijs.BoxMesh(geometry, frontMaterial, 0);
    this.sides.back = new Physijs.BoxMesh(geometry, backMaterial, 0);
    this.sides.back.material.opacity = 0;
    this.initCubesManager();
    null;
  }

  Room.prototype.initCubesManager = function() {
    this.cubesManager = new CubesManager;
    return null;
  };

  Room.prototype.update = function() {
    this.cubesManager.update();
    return null;
  };

  return Room;

})();

var SoundsManager,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SoundsManager = (function() {
  SoundsManager.prototype.context = null;

  SoundsManager.prototype.audioBuffer = null;

  SoundsManager.prototype.bufferLoader = null;

  SoundsManager.prototype.sourceNode = null;

  SoundsManager.prototype.filesToLoad = null;

  SoundsManager.prototype.ambiantSoundSource = null;

  SoundsManager.prototype.ambiantGainNode = null;

  SoundsManager.prototype.ambiantVolume = 1;

  SoundsManager.prototype.AMBIANT_LOOP_START = 30;

  SoundsManager.prototype.AMBIANT_LOOP_END = 100;

  SoundsManager.prototype.distortionSoundSource = null;

  SoundsManager.prototype.distortionGainNode = null;

  SoundsManager.prototype.distortionVolume = 0.2;

  SoundsManager.prototype.DISTORTION_LOOP_START = 0;

  SoundsManager.prototype.DISTORTION_LOOP_END = 18;

  SoundsManager.prototype.isMute = false;

  SoundsManager.prototype.isReady = false;

  function SoundsManager() {
    this.updateVolumes = __bind(this.updateVolumes, this);
    this.onBufferLoaded = __bind(this.onBufferLoaded, this);
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
        console.log('no audio context');
      } else {
        window.AudioContext = window.webkitAudioContext;
      }
    }
    this.context = new AudioContext;
    this.filesToLoad = ['./assets/sounds/ambiant.mp3', './assets/sounds/distortion.mp3'];
    this.load();
    null;
  }

  SoundsManager.prototype.load = function() {
    this.bufferLoader = new BufferLoader(this.context, this.filesToLoad, this.onBufferLoaded);
    return this.bufferLoader.load();
  };

  null;

  SoundsManager.prototype.onBufferLoaded = function(bufferList) {
    this.ambiantSoundSource = this.context.createBufferSource();
    this.distortionSoundSource = this.context.createBufferSource();
    this.ambiantSoundSource.buffer = bufferList[0];
    this.distortionSoundSource.buffer = bufferList[1];
    this.ambiantSoundSource.connect(this.context.destination);
    this.distortionSoundSource.connect(this.context.destination);
    this.ambiantGainNode = this.context.createGain();
    this.distortionGainNode = this.context.createGain();
    this.ambiantSoundSource.connect(this.ambiantGainNode);
    this.distortionSoundSource.connect(this.distortionGainNode);
    this.ambiantGainNode.connect(this.context.destination);
    this.distortionGainNode.connect(this.context.destination);
    this.ambiantSoundSource.loop = true;
    this.ambiantSoundSource.loopStart = this.AMBIANT_LOOP_START;
    this.ambiantSoundSource.loopEnd = this.AMBIANT_LOOP_END;
    this.distortionSoundSource.loop = true;
    this.distortionSoundSource.loopStart = this.DISTORTION_LOOP_START;
    this.distortionSoundSource.loopEnd = this.DISTORTION_LOOP_END;
    this.isReady = true;
    this.onReady();
    return null;
  };

  SoundsManager.prototype.play = function(soundName) {
    if (soundName === 'ambiant') {
      this.ambiantSoundSource.start(0);
    } else if (soundName === 'distortion') {
      this.distortionSoundSource.start(0);
    }
    return null;
  };

  SoundsManager.prototype.stop = function(soundName) {
    if (soundName === 'ambiant') {
      this.ambiantSoundSource.stop(this.ambiantSoundSource.context.currentTime);
    } else if (soundName === 'distortion') {
      this.distortionSoundSource.stop(this.distortionSoundSource.context.currentTime);
    }
    return null;
  };

  SoundsManager.prototype.unmuteAll = function() {
    this.ambiantVolume = 1;
    this.distortionVolume = 1;
    return null;
  };

  SoundsManager.prototype.muteAll = function() {
    this.ambiantVolume = 0;
    this.distortionVolume = 0;
    return null;
  };

  SoundsManager.prototype.fadeAmbiantVolume = function(value, speed) {
    if (speed == null) {
      speed = .3;
    }
    TweenLite.to(this, speed, {
      ambiantVolume: value,
      onUpdate: this.updateVolumes
    });
    return null;
  };

  SoundsManager.prototype.fadeDistortionVolume = function(value, speed) {
    if (speed == null) {
      speed = .3;
    }
    TweenLite.to(this, speed, {
      distortionVolume: value,
      onUpdate: this.updateVolumes
    });
    return null;
  };

  SoundsManager.prototype.updateVolumes = function() {
    this.ambiantGainNode.gain.value = this.ambiantVolume;
    this.distortionGainNode.gain.value = this.distortionVolume;
    return null;
  };

  SoundsManager.prototype.onReady = function() {
    return null;
  };

  return SoundsManager;

})();

var GUIControls;

GUIControls = (function() {
  GUIControls.prototype.el = null;

  function GUIControls() {
    console.log(scene);
  }

  GUIControls.prototype.update = function() {
    return null;
  };

  return GUIControls;

})();

var STAGE_HEIGHT, STAGE_WIDTH, animate, camera, checkIfAllLoaded, controls, fog, getElapsedTime, guiControls, init, initControls, initCube, initGUI, initLight, initPlayer, initRoom, initSoundsManager, initStats, onIntroEnded, onLoopLeap, onSceneUpdate, playIntro, player, render, renderer, room, scene, setup, soundsManager, spotlight, stats, update;

STAGE_WIDTH = 0;

STAGE_HEIGHT = 0;

camera = null;

scene = null;

renderer = null;

fog = null;

soundsManager = null;

room = null;

player = null;

spotlight = null;

guiControls = null;

controls = null;

stats = null;

init = function() {
  var ambientLight, controllerOptions;
  STAGE_WIDTH = window.innerWidth;
  STAGE_HEIGHT = window.innerHeight;
  setup();
  initSoundsManager();
  initRoom();
  initPlayer();
  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  initGUI();
  controllerOptions = {
    enableGestures: true
  };
  Leap.loop(controllerOptions, onLoopLeap);
  animate();
  return null;
};

setup = function() {
  var axes, cameraTarget, clock;
  scene = new Physijs.Scene({
    fixedTimeStep: 1 / 120
  });
  scene.setGravity(new THREE.Vector3(0, -100, 0));
  scene.addEventListener('update', update);
  camera = new THREE.PerspectiveCamera(45, STAGE_WIDTH / STAGE_HEIGHT, 1, 20000);
  camera.position.x = 0;
  camera.position.y = 20;
  camera.position.z = 97;
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  cameraTarget = new THREE.Vector3(0, 0, 0);
  camera.lookAt(cameraTarget);
  renderer = new THREE.WebGLRenderer;
  renderer.setSize(STAGE_WIDTH, STAGE_HEIGHT);
  renderer.setClearColor(0x000000);
  renderer.shadowMapEnabled = true;
  clock = new THREE.Clock;
  document.body.appendChild(renderer.domElement);
  axes = new THREE.AxisHelper(20);
  scene.add(axes);
  return null;
};

initLight = function() {
  spotlight = new THREE.SpotLight(0xffff00);
  spotlight.position.set(0, 20, 0);
  spotlight.shadowCameraVisible = true;
  spotlight.shadowDarkness = 0.95;
  spotlight.intensity = 2;
  spotlight.castShadow = true;
  scene.add(spotlight);
  return null;
};

initControls = function() {
  return null;
};

initStats = function() {
  stats = new Stats;
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  return null;
};

initGUI = function() {
  guiControls = new GUIControls;
  return null;
};

initLight = function() {
  var spotLight;
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);
  return null;
};

initSoundsManager = function() {
  soundsManager = new SoundsManager;
  soundsManager.onReady = checkIfAllLoaded;
  return null;
};

initRoom = function() {
  room = new Room;
  room.sides.bottom.position.x = 0;
  room.sides.bottom.position.y = 0;
  room.sides.bottom.position.z = 0;
  room.sides.top.position.x = 0;
  room.sides.top.position.y = 150;
  room.sides.top.position.z = 0;
  room.sides.front.position.x = 0;
  room.sides.front.position.y = 75;
  room.sides.front.position.z = -75;
  room.sides.front.rotation.x = 0.5 * Math.PI;
  room.sides.back.position.x = 0;
  room.sides.back.position.y = 75;
  room.sides.back.position.z = 95;
  room.sides.back.rotation.x = 0.5 * Math.PI;
  room.sides.left.position.x = -75;
  room.sides.left.position.y = 75;
  room.sides.left.position.z = 0;
  room.sides.left.rotation.x = 0.5 * Math.PI;
  room.sides.left.rotation.z = 0.5 * Math.PI;
  room.sides.right.position.x = 75;
  room.sides.right.position.y = 75;
  room.sides.right.position.z = 0;
  room.sides.right.rotation.x = 0.5 * Math.PI;
  room.sides.right.rotation.z = 0.5 * Math.PI;
  scene.add(room.sides.bottom);
  scene.add(room.sides.top);
  scene.add(room.sides.front);
  scene.add(room.sides.left);
  scene.add(room.sides.right);
  return null;
};

initCube = function() {
  var cube;
  cube = new Cube;
  cube.el.position.set(0, 100, -200);
  scene.add(cube.el);
  return null;
};

initPlayer = function() {
  player = new Player;
  return null;
};

getElapsedTime = function() {
  var delta;
  delta = clock.getDelta();
  return clock.getElapsedTime() * .5;
};

update = function(frame) {
  if (controls) {
    controls.update();
  }
  if (stats) {
    stats.update();
  }
  room.update();
  scene.simulate(void 0, 2);
  camera.position.distanceTo(room.sides.bottom.position);
  return null;
};

onLoopLeap = function(frame) {
  player.update(frame);
  return null;
};

render = function() {
  renderer.render(scene, camera);
  return null;
};

animate = function() {
  window.requestAnimationFrame(animate);
  update();
  render();
  return null;
};

checkIfAllLoaded = function() {
  if (soundsManager.isReady) {
    onIntroEnded();
  }
  return null;
};

playIntro = function() {
  TweenLite.to(camera.position, 3, {
    x: 0.13668025853400195,
    y: 20,
    z: 70
  });
  TweenLite.to(camera.rotation, 3, {
    x: -0.2796162529901533,
    y: 0.001866518381297032,
    z: -0.016777568321920903,
    onComplete: onIntroEnded
  });
  return null;
};

onIntroEnded = function() {
  initControls();
  console.log(controls);
  return null;
};

onSceneUpdate = function() {};

$(function() {
  Physijs.scripts.worker = './js/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';
  return init();
});
