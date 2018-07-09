var three = require('three');
var View = require('threejs-managed-view').View;
var CameraControllerFPS = require('threejs-camera-controller-first-person-desktop');
var GuiScene = require('./');
var view = new View({
	useRafPolyfill: false
});
var scene = view.scene;

var sphereGeometry = new three.SphereGeometry(1.5);
var size = 500;
var sizeHalf = size * .5;
var bounds = new three.Box3(
	new three.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
	new three.Vector3(sizeHalf, sizeHalf, sizeHalf)
)
var random = new three.Vector3();
var boundSize = bounds.size();
for (var i = 0; i < 1200; i++) {
	var ball = new three.Mesh(sphereGeometry);
	scene.add(ball);
	random.set(
		Math.random(),
		Math.random(),
		Math.random()
	);
	ball.position.copy(bounds.min).add(random.multiply(boundSize));
};

var fpsController = new CameraControllerFPS(view.camera, view.canvasContainer);

var guiScene = new GuiScene({
	renderer: view.renderer
});

var cursorGeometry = new three.SphereGeometry(.1);
var cursor = new three.Mesh(cursorGeometry, new three.MeshBasicMaterial({
	wireframe: true,
	color: 0xffffff
}));
guiScene.add(cursor);

view.renderManager.onExitFrame.add(function() {
	guiScene.render();
})

view.renderManager.onEnterFrame.add(function() {
	fpsController.update();
})
