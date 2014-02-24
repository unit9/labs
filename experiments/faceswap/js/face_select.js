var cc = document.getElementById('convergence_image').getContext('2d');
var overlay = document.getElementById('convergence_overlay');
var overlayCC = overlay.getContext('2d');

// var img = new Image();
// img.onload = function() {
// 	cc.drawImage(img,0,0,625, 500);
// };
// img.src = '/img/walter_crop_small_light.jpg';

// detect if tracker fails to find a face
document.addEventListener("clmtrackrNotFound", function(event) {
	ctrack_detect.stop();
	alert("The tracking had problems with finding a face in this image. Try a different image, or a different crop.")
}, false);

// detect if tracker loses tracking of face
document.addEventListener("clmtrackrLost", function(event) {
	ctrack_detect.stop();
	alert("The tracking had problems converging on a face in this image. Try a different image, or a different crop.")
}, false);

// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function(event) {
	localStorage.setItem('uploaded_face_coords', JSON.stringify(ctrack_detect.getCurrentPosition()));
	$('.upload-continue').removeClass('hide');
	// stop drawloop
	cancelRequestAnimFrame(drawRequest);
}, false);


var ctrack_detect = new clm.tracker({stopOnConvergence : true});
ctrack_detect.init(pModel);

var drawRequest;

function animate(box) {
	ctrack_detect.start(document.getElementById('convergence_image'), box);
	drawLoop();
}

function drawLoop() {
	drawRequest = requestAnimFrame(drawLoop);
	overlayCC.clearRect(0, 0, 720, 576);
	if (ctrack_detect.getCurrentPosition()) {
		ctrack_detect.draw(overlay);
	}
}

function useSampleImage(sample) {
	if (sample) {
		cc.clearRect(0,0,600,450);
		var img = new Image(),
			imgWidth = $('#'+sample).attr('width'),
			imgHeight = $('#'+sample).attr('height');

		img.onload = function() {
			cc.drawImage(img,0,0,imgWidth,imgHeight);
		};
		img.src = 'img/'+sample+'.jpg';

		var canvas = document.getElementById('convergence_image');
		var imgString = canvas.toDataURL();

		console.log(imgString);

		//wipe localstorage
		localStorage.clear();

		// store uploaded pic in localstorage for use on face sub page.
		localStorage.setItem('uploaded_face', imgString);
	}
}

// function to start showing images
function loadImage() {
	if (fileList.indexOf(fileIndex) < 0) {
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {

				//wipe localstorage
				localStorage.clear();

				// store uploaded pic in localstorage for use on face sub page.
				localStorage.setItem('uploaded_face', e.target.result);

				$('.uploadCol').removeClass('active');
				$('.startCol').addClass('active');
			
				// Render thumbnail.
				var canvas = document.getElementById('convergence_image')
				var cc = canvas.getContext('2d');
				var img = new Image();
				img.onload = function() {
					if (img.height > 500 || img.width > 700) {
						var rel = img.height/img.width;
						var neww = 700;
						var newh = neww*rel;
						if (newh > 500) {
							newh = 500;
							neww = newh/rel;
						}
						canvas.setAttribute('width', neww);
						canvas.setAttribute('height', newh);
						cc.drawImage(img,0,0,neww, newh);
					} else {
						canvas.setAttribute('width', img.width);
						canvas.setAttribute('height', img.height);
						cc.drawImage(img,0,0,img.width, img.height);
					}
				}
				img.src = e.target.result;
			};
		})(fileList[fileIndex]);
		reader.readAsDataURL(fileList[fileIndex]);
		overlayCC.clearRect(0, 0, 720, 576);
		ctrack_detect.reset();
	}

}

// set up file selector and variables to hold selections
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList && window.FileError) {
	function handleFileSelect(evt) {
		var files = evt.target.files;
		fileList = [];
		for (var i = 0;i < files.length;i++) {
			if (!files[i].type.match('image.*')) {
				continue;
			}
			fileList.push(files[i]);
		}
		if (files.length > 0) {
			fileIndex = 0;
		}
		
		loadImage();
	}
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
	$('#files').addClass("hide");
	//$('#loadimagetext').addClass("hide");
}

$('.samples').on('change', function(e) {
	var sample = $(this).val();
	useSampleImage(sample);
})