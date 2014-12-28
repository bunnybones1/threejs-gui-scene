var ResizeManager = require('input-resize');
var onResizeSignal = ResizeManager.onResize;
var _ = require('lodash');

var origin = new THREE.Vector3();
var adjustWidth = false;
var NONE = 0;
var FIT = 1;
var CROP = 2;
var fitMode = NONE;

var X = 0,
	Y = 1;

function GUIScene (options) {
	options = _.merge({
		renderer: undefined,
		camera: new THREE.OrthographicCamera(-1, 1, -1, 1, -100, 100)
	}, options || {})
	_.assign(this, options);
	if(!this.renderer) throw new Error('You need a renderer for GUI to work.');
	THREE.Scene.call(this);

	this.resize = this.resize.bind(this);
	onResizeSignal.add(this.resize);
	ResizeManager.bump();
	
	this.render = this.render.bind(this);
}

GUIScene.prototype = Object.create(THREE.Scene.prototype);

GUIScene.prototype.resize = function(width, height) {
	var aspect = adjustWidth ? width/height : height/width;
	if(adjustWidth) {
		this.camera.left = this.camera.bottom * aspect;
		this.camera.right = this.camera.top * aspect;
	} else {
		this.camera.bottom = this.camera.left * aspect;
		this.camera.top = this.camera.right * aspect;
	}
	this.camera.width = this.camera.right - this.camera.left;
	this.camera.height = this.camera.bottom - this.camera.top;
	this.camera.updateProjectionMatrix();
}

var backupAutoClear;
GUIScene.prototype.render = function() {
	backupAutoClear = this.renderer.autoClear;
	this.renderer.autoClear = false;
	this.renderer.clear(false, true, true);
	this.renderer.render(this, this.camera, undefined, false);
	this.renderer.autoClear = backupAutoClear;
}

GUIScene.prototype.positionRelative = function(x, y, object) {
	object.position.x = this.camera.left + this.camera.width * x;
	object.position.y = this.camera.top + this.camera.height * y;
}

module.exports = GUIScene;