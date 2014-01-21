App = function() {
	this.currentExperimentName = '';

	this.mainEl = document.getElementsByClassName('main')[0];
	this.experimentEl = document.getElementsByClassName('experiment')[0];

	var experimentsThumbnailsEl = document.getElementsByTagName('nav')[0].getElementsByTagName('a');
	for (var i = 0; i < experimentsThumbnailsEl.length; i++) {
		experimentsThumbnailsEl[i].addEventListener('click', this.onExperimentClick.bind(this));
	}
	this.experimentEl.addEventListener('transitionend', this.onExperimentElTransitionEnd.bind(this), true);
	this.mainEl.getElementsByTagName('header')[0].addEventListener('click', this.onHeaderClick.bind(this));
	window.onhashchange = this.onHashChange.bind(this);
};

App.prototype.displayExperiment = function(name) {
	if(name) {
		this.experimentEl.classList.remove('hide');
		this.mainEl.classList.add('hide');
		window.location = '#/' + name;
	}
	else {
		this.experimentEl.classList.add('hide');
		this.mainEl.classList.remove('hide');
		window.location = '';
	}
	this.currentExperimentName = name;
};

App.prototype.onExperimentClick = function(e) {
	e.preventDefault();
	this.displayExperiment(e.currentTarget.getAttribute('href').split('experiments/')[1]);
};

App.prototype.onHeaderClick = function() {
	this.mainEl.classList.remove('hide');
};

App.prototype.onExperimentElTransitionEnd = function(e) {
	if(e.target !== this.experimentEl) {return;}
	this.experimentEl.innerHTML = "";
	if(this.currentExperimentName) {
		var iframe = document.createElement('iframe');
		iframe.src = 'experiments/' + this.currentExperimentName;
		iframe.classList.add('hide');
		this.experimentEl.appendChild(iframe);
		setTimeout(function() {
			iframe.classList.remove('hide');
		}, 200);
	}
};

App.prototype.onHashChange = function(e) {
	var splittedHash = window.location.hash.split('/');
	var name = (splittedHash.length === 3) ? splittedHash[2] : splittedHash[1];
	this.displayExperiment(name);
};

app = new App();