var vid = document.getElementById('videoel');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');	

/*********** Setup of video/webcam and checking for webGL support *********/

var videoReady = false;
var imagesReady = false;

function enablestart() {
	if (videoReady && imagesReady) {
		var startbutton = document.getElementById('startbutton');
		startbutton.value = "start";
		startbutton.disabled = null;
	}
}

function initializeFaceSubbing() {

	var uploadedFaceImg = localStorage.getItem('uploaded_face'),
		uploadedFaceCoords = JSON.parse(localStorage.getItem('uploaded_face_coords'));

	var uploadedFaceImgTag = '<img id="upload" class="masks" src="'+uploadedFaceImg+'"/>';
	$('#faceMasks').append(uploadedFaceImgTag);
	masks.upload = uploadedFaceCoords;

	// create canvases for all the faces
	window.imageCanvases = {};
	for (var i = 0;i < images.length;i++) {	
		var ele = document.getElementById(images[i]);
		// copy the images to canvases
		imagecanvas = document.createElement('CANVAS');
		imagecanvas.width = ele.width;
		imagecanvas.height = ele.height;
		imagecanvas.getContext('2d').drawImage(ele,0,0);
		imageCanvases[images[i]] = imagecanvas;
	}

	$('#container').fadeIn(2000, function() {
		$('#container').removeClass('blur');
		setTimeout(function() {
			$('.video-message').fadeOut();
		}, 2000);
		startVideo();
	});
		
}


var insertAltVideo = function(video) {
	if (supports_video()) {
		if (supports_ogg_theora_video()) {
			video.src = "../media/cap13_edit2.ogv";
		} else if (supports_h264_baseline_video()) {
			video.src = "../media/cap13_edit2.mp4";
		} else {
			return false;
		}
		//video.play();
		return true;
	} else return false;
}

// check whether browser supports webGL
var webGLContext;
var webGLTestCanvas = document.createElement('canvas');
if (window.WebGLRenderingContext) {
	webGLContext = webGLTestCanvas.getContext('webgl') || webGLTestCanvas.getContext('experimental-webgl');
	if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
		webGLContext = null;
	}
}
if (webGLContext == null) {
	alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {
	// set up stream
	
	// chrome 19 shim
	var videoSelector = {video : true};
	if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
		var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
		if (chromeVersion < 20) {
			videoSelector = "video";
		}
	};
	
	navigator.getUserMedia(videoSelector, function( stream ) {
		if (vid.mozCaptureStream) {
			vid.mozSrcObject = stream;
		} else {
			vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		vid.play();
	}, function() {
		insertAltVideo(vid);
		alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
	});
} else {
	insertAltVideo(vid);
	alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}

vid.addEventListener('canplay', function() {
	videoReady = true;
	//enablestart();
}, false);









/*********** Code for face substitution *********/

var animationRequest;
var positions;

var ctrack = new clm.tracker();
ctrack.init(pModel);

//document.getElementById('selectmask').addEventListener('change', updateMask, false);

function updateMask(newMask) {
	currentMask = newMask;
	var positions = ctrack.getCurrentPosition(vid);
	if (positions) {
		switchMasks(positions);
	}
}

function startVideo() {
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
	// start drawing face grid
	drawGridLoop();
}

var fd = new faceDeformer();
fd.init(document.getElementById('webgl'));
var wc1 = document.getElementById('webgl').getContext('webgl') || document.getElementById('webgl').getContext('experimental-webgl')
wc1.clearColor(0,0,0,0);

var fd2 = new faceDeformer();
fd2.init(document.getElementById('webgl2'));
var wc2 = document.getElementById('webgl2').getContext('webgl') || document.getElementById('webgl2').getContext('experimental-webgl')
wc2.clearColor(0,0,0,0);

var masks = {
	"walter" : [[21.060764903593935, 23.625922265374243], [24.306589250104111, 82.418736978583837], [29.887480558415291, 123.52324050386761], [39.831216823892362, 169.58896662877407], [56.335070257713795, 208.02264871738436], [80.83703098412272, 239.09972028159933], [112.71581076572778, 260.86442641371349], [148.15849351544631, 266.69887307481594], [187.92956781495144, 259.94808309698487], [224.28242219428836, 232.92409488998584], [248.61360434331704, 197.4132216415324], [267.6255386426007, 159.22848713841142], [274.06946800796993, 115.04205523453288], [279.57264995946605, 75.577994810142314], [274.8147191886797, 27.93465035602847], [243.21321805049308, 34.977887137176154], [222.77074074138181, 27.896989700591064], [190.0620481119081, 30.307609477713669], [159.27010163455151, 35.824855447032391], [51.033153870664592, 38.112001064409583], [75.392081525881991, 35.207713004503645], [102.74022206320058, 37.331330371284338], [124.56616025441463, 38.787179979952285], [67.451381950900242, 57.279940574514285], [90.044614607889713, 50.578228454933793], [111.78861952878373, 57.042466275764184], [90.903644751441476, 61.901327302928138], [90.715389774152072, 55.427091197335699], [223.99115821955013, 52.230403503055442], [205.18136904851377, 47.795771446298119], [184.90200898390299, 54.36443314080293], [204.67995257670333, 57.277939005103178], [204.92195881859544, 50.712535873236902], [146.50907007729293, 46.432109337738268], [115.95255333726485, 107.46593045529727], [109.22792349913794, 119.47849063536196], [117.00821443824393, 134.84341026421072], [145.67296091894715, 139.65462387898862], [173.67398162073596, 137.75538299827045], [185.00619633858076, 121.44588720141769], [180.64955597511778, 108.4547161320798], [147.27934367148265, 85.136485659341048], [124.32188592953989, 129.20306658959251], [167.29393856301289, 130.98984492081911], [101.59640357940233, 178.49694962096316], [118.21488930910681, 170.49617831223611], [139.18293919359641, 169.52754924913722], [151.13320163675684, 173.77693897734923], [167.32315821430757, 170.41084550370888], [182.37144722622213, 172.04427561978318], [198.17756373260085, 178.48935722147763], [184.440295252439, 186.17852019611308], [168.46308888233028, 189.07826517145685], [149.98168191113766, 189.67271148067312], [131.94804230553046, 187.67924933109754], [115.53452060145878, 185.3486212656689], [126.11701238101571, 180.30913427171828], [151.51451552828283, 182.42858464837599], [175.33473635294803, 181.769054498201], [176.96189091245589, 177.03898480289513], [151.40990278903843, 177.58200927291426], [127.15568541835768, 176.24970135595123], [147.26055194223767, 122.55189537474888], [74.747311503817315, 52.428814802906686], [103.91716767645684, 51.310986682531166], [102.84404568037712, 59.974636811905299], [76.675078380855666, 60.093874542162325], [216.58585024902322, 47.512012033316537], [190.54061564242585, 48.580342228676585], [191.79112935486376, 55.322342001097468], [214.83596488608993, 56.255513236279938]],
	"demo": [[246.59171689390942,246.22473287287585],[246.14696503719333,285.809785335828],[253.1520713163788,323.50985904629187],[266.8865850670928,363.2249365355573],[289.02110006513396,394.38950227938017],[317.36513825510076,417.63750502831095],[350.2103345043955,433.79345145281417],[386.59349810096035,435.9217088080022],[417.44907774251453,423.09673623334805],[437.5447845838064,396.78851529559716],[454.41923109154493,366.56963299976724],[465.0218608382335,332.45643468121],[469.35596054582277,294.7673788769257],[467.8940718355759,257.498501430524],[459.8127029323301,220.01015218724754],[445.96680202466683,200.885235711694],[432.8201204160089,194.04050430737857],[407.9580791714145,196.85278863217349],[389.06254254932435,203.0933379102967],[276.46868959906686,225.4299305950146],[294.223673023444,213.1961396951813],[322.33438446251216,208.95762831368006],[343.32017884909317,209.81695366794312],[294.3296224740646,242.13393570407953],[314.18641042824447,228.76158505827954],[335.271424365052,236.311859984877],[316.0962406573681,243.64016875831948],[315.0280422069837,235.96405440982983],[434.45895757173884,222.82496977174029],[415.9574372919081,214.71542709196584],[396.2847909245911,227.6141322415491],[417.4009417125646,229.4610443907108],[416.06797426675723,221.85728617642732],[367.9122323232823,224.81395656567815],[348.8670130701797,274.20735935479047],[338.6300205734337,293.4839494403863],[349.96408926595,304.8878093220767],[379.2664217333115,306.47554595439533],[402.7491323574257,297.420926562726],[409.7631904085225,284.52968808487583],[396.8659256441992,268.16049637173774],[373.99272918900124,256.7246450962772],[358.93350544214826,297.8954685797489],[396.03982325593586,293.6180787927138],[332.25733019119514,347.61379625493834],[350.29278544578546,336.55323024888975],[368.17566675854465,331.26858028499953],[380.36913837058376,332.15973429498564],[391.2542996170166,328.228923929239],[406.191426612711,328.75490798152475],[419.9505875530479,335.5627857279099],[412.4233759985614,349.2494909309619],[400.8737012204755,359.43899481743216],[382.7989516799554,364.8402625080863],[362.5789148109524,365.50916088769736],[344.92734286448524,359.17060224372017],[357.7174149909972,352.73991765124254],[380.99282555883406,352.680710695701],[401.1072210256069,346.05037297542856],[400.60924332853256,335.63700502320944],[380.569666615784,340.01641847070573],[357.7104119566366,341.50822594882516],[379.6751821517524,287.3566510901311],[302.593672539913,233.47895432025535],[326.32817907949044,229.94223057064772],[326.3467315014771,240.2899184988591],[304.8155112966821,243.68649516492846],[426.8676033768547,216.34528485588345],[404.2398118882412,219.04775271877728],[406.54109587323745,229.16791408524847],[426.9549417810048,226.61878349842834]]
};



var images = ["walter", "demo", "upload"];
var currentMask = 2; //use upload only

// canvas for copying the warped face to
var newcanvas = document.createElement('CANVAS');
newcanvas.width = vid.width;
newcanvas.height = vid.height;
// canvas for copying videoframes to
var videocanvas = document.createElement('CANVAS');
videocanvas.width = vid.width;
videocanvas.height = vid.height;
// canvas for masking
var maskcanvas = document.createElement('CANVAS');
maskcanvas.width = vid.width;
maskcanvas.height = vid.height;	


var extended_vertices = [
  [0,71,72,0],
  [0,72,1,0],
  [1,72,73,1],
  [1,73,2,1],
  [2,73,74,2],
  [2,74,3,2],
  [3,74,75,3],
  [3,75,4,3],
  [4,75,76,4],
  [4,76,5,4],
  [5,76,77,5],
  [5,77,6,5],
  [6,77,78,6],
  [6,78,7,6],
  [7,78,79,7],
  [7,79,8,7],
  [8,79,80,8],
  [8,80,9,8],
  [9,80,81,9],
  [9,81,10,9],
  [10,81,82,10],
  [10,82,11,10],
  [11,82,83,11],
  [11,83,12,11],
  [12,83,84,12],
  [12,84,13,12],
  [13,84,85,13],
  [13,85,14,13],
  [14,85,86,14],
  [14,86,15,14],
  [15,86,87,15],
  [15,87,16,15],
  [16,87,88,16],
  [16,88,17,16],
  [17,88,89,17],
  [17,89,18,17],
  [18,89,90,18],
  [18,90,22,18],
  [22,90,21,22],
  [21,90,91,21],
  [21,20,91,21],
  [20,91,92,20],
  [20,92,19,20],
  [19,92,93,19],
  [19,93,71,19],
  [19,0,71,19],
  [44,61,56,44],
  [60,61,56,60],
  [60,56,57,60],
  [60,59,57,60],
  [58,59,57,58],
  [58,59,50,58]
];

function drawGridLoop() {
	// get position of face
	positions = ctrack.getCurrentPosition(vid);

	overlayCC.clearRect(0, 0, 500, 375);
	if (positions) {
		// draw current grid
		ctrack.draw(overlay);
	}
	// check whether mask has converged
	var pn = ctrack.getConvergence();
	if (pn < 0.4) {
		switchMasks(positions);
	} else {
		requestAnimFrame(drawGridLoop);
	}
}
	
function switchMasks(pos) {
	videocanvas.getContext('2d').drawImage(vid,0,0,videocanvas.width,videocanvas.height);
	
	// we need to extend the positions with new estimated points in order to get pixels immediately outside mask
	var newMaskPos = masks[images[currentMask]].slice(0);
	var newFacePos = pos.slice(0);
	var extInd = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,21,20,19];
	var newp;
	for (var i = 0;i < 23;i++) {
		newp = [];
		newp[0] = (newMaskPos[extInd[i]][0]*1.3) - (newMaskPos[62][0]*0.3);// short for ((newMaskPos[extInd[i]][0]-newMaskPos[62][0])*1.1)+newMaskPos[62][0]
		newp[1] = (newMaskPos[extInd[i]][1]*1.3) - (newMaskPos[62][1]*0.3);
		newMaskPos.push(newp);
		newp = [];
		newp[0] = (newFacePos[extInd[i]][0]*1.3) - (newFacePos[62][0]*0.3);
		newp[1] = (newFacePos[extInd[i]][1]*1.3) - (newFacePos[62][1]*0.3);
		newFacePos.push(newp);
	}
	// also need to make new vertices incorporating area outside mask
	var newVertices = pModel.path.vertices.concat(extended_vertices);

	//console.log(imageCanvases[images[currentMask]]);

	// deform the mask we want to use to face form

	if (typeof(imageCanvases[images[currentMask]]) === "undefined") {
		throw new Error('imageCanvas element wasn\'t ready!');
		return false;
	}

	fd2.load(imageCanvases[images[currentMask]], newMaskPos, pModel, newVertices);
	fd2.draw(newFacePos);
	// and copy onto new canvas
	newcanvas.getContext('2d').drawImage(document.getElementById('webgl2'),0,0);

	// create masking
	var tempcoords = positions.slice(0,18);
	tempcoords.push(positions[21]);
	tempcoords.push(positions[20]);
	tempcoords.push(positions[19]);
	createMasking(maskcanvas, tempcoords);

	/*document.body.appendChild(newcanvas);
	document.body.appendChild(videocanvas);
	document.body.appendChild(maskcanvas);
	debugger;*/

	// do poisson blending
	Poisson.load(newcanvas, videocanvas, maskcanvas, function() {
		var result = Poisson.blend(30, 0, 0);
		// render to canvas
		newcanvas.getContext('2d').putImageData(result, 0, 0);
		// get mask

		var maskname = Object.keys(masks)[currentMask];
		fd.load(newcanvas, pos, pModel);
		requestAnimFrame(drawMaskLoop);
	});
}

function drawMaskLoop() {
	// get position of face
	positions = ctrack.getCurrentPosition();
	
	/*for (var i = 0;i < positions.length;i++) {
		positions[i][1] += 1;
	}*/

	overlayCC.clearRect(0, 0, 400, 300);
	if (positions) {
		// draw mask on top of face
		fd.draw(positions);
	}
	animationRequest = requestAnimFrame(drawMaskLoop);
}

function createMasking(canvas, modelpoints) {
	// fill canvas with black
	var cc = canvas.getContext('2d');
	cc.fillStyle="#d69cb8";
	cc.fillRect(0,0,canvas.width, canvas.height);
	cc.beginPath();
	cc.moveTo(modelpoints[0][0], modelpoints[0][1]);
	for (var i = 1;i < modelpoints.length;i++) {
		cc.lineTo(modelpoints[i][0], modelpoints[i][1]);
	}
	cc.lineTo(modelpoints[0][0], modelpoints[0][1]);
	cc.closePath();
	cc.fillStyle="#ffffff";
	cc.fill();
}