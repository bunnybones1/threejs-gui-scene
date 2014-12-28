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
		camera: new THREE.OrthographicCamera(-10, 10, 10, -10, -1000, 1000),
		autoRender: true
	}, options || {})
	_.assign(this, options);
	if(this.autoRender && !this.renderer) throw new Error('You must provide a renderer if you want to autorender the GUI');
	THREE.Scene.call(this);

	var _this = this;

	if(this.autoRender) {
		// awesome hack to wrap the renderers render function
		// so normal renders always include the GUI on them even though the gui isn't part of the main scene
		var oldRender = this.renderer.render.bind(this.renderer);
		this.renderer.autoClear = false;
		this.renderer.clear();
		this.renderer.render = function(scene, camera, renderTarget, forceClear) {
			oldRender(scene, camera, renderTarget, forceClear);
			oldRender(_this, _this.camera, renderTarget, false);
		}
	}
	this.resize = this.resize.bind(this);
	onResizeSignal.add(this.resize);
	ResizeManager.bump();
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
	this.camera.updateProjectionMatrix();
}


module.exports = GUIScene;