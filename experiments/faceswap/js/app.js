$(window).load(function() {
	imagesReady = true;
});

$(document).ready(function() {
	if (typeof(initializeFaceSubbing) !== "undefined") {
		initializeFaceSubbing();
	} else {
		$('#video_wrapper').hide();
	}
});