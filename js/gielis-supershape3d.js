if (!Modernizr.webgl) {
	alert("You're browser does not support WebGL :(");
} else {

	var viewX = viewportSize.getWidth(),
		viewY = viewportSize.getHeight(),
		viewHalfX = viewX/2.0,
		viewHalfY = viewY/2.0;
		
	var mouseX,
		mouseY,
		camera, 
		scene,
		renderer,
		container,		
		controls,
		line,
		lineGeometry;
		
	var π  = Math.PI,
		τ  = 2.0*π,
		vθ = 50.0,
		vφ = 50.0,
		dθ = τ/vθ,
		dφ = π/vφ,
		θ  = 0.0,
		φ  = 0.0,		
		m =  randomFloatBetween( 1.0, 27.0, 2),
		a =  randomFloatBetween( 1.0, 5.0, 2),
		b =  randomFloatBetween( 1.0, 5.0, 2),
		n1 = randomFloatBetween( 0.0, 4.0, 2),
		n2 = randomFloatBetween( 0.0, 4.0, 2),
		n3 = randomFloatBetween( 0.0, 4.0, 2),
		ρ1 = 0.0,
		ρ2 = 0.0,
		ρx1 = 0.0,
		ρy1 = 0.0,
		ρx2 = 0.0,
		ρy2 = 0.0;
		
	init();
	setupControls();
	animate();
}

function setupControls() {

	controls = new THREE.TrackballControls(camera);

	controls.rotateSpeed = 0.5;
	controls.zoomSpeed = 4.0;
	controls.noZoom = false;
	controls.noPan = true;
	controls.noRotate = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = .15;
}

function init() {

	container = document.createElement('div');
	
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(75, viewX/viewY, 0.0001, 10000);
	camera.position.z = 5;
		
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(viewX, viewY);	
	
	container.appendChild(renderer.domElement);
				
	setupItems();
}

function setupItems() {
	
	lineGeometry = new THREE.Geometry();
	
	θ = -τ;
	
	while (θ <= τ)
	{
		φ = -π;
		
		ρx1 = Math.pow(Math.abs(Math.cos(m*θ/2))/a, n2);
		ρy1 = Math.pow(Math.abs(Math.sin(m*θ/2))/b, n3);
		
		ρ1 = Math.pow(ρx1 + ρy1, -1/n1);
		
		while (φ <= π)
		{			
			ρx2 = Math.pow(Math.abs(Math.cos(m*φ/2))/a, n2);
			ρy2 = Math.pow(Math.abs(Math.sin(m*φ/2))/b, n3);			
			
			ρ2 = Math.pow(ρx2 + ρy2, -1/n1);
					
			lineGeometry.vertices.push(new THREE.Vector3(
				ρ1 * Math.cos(θ) * ρ2 * Math.cos(φ),
				ρ1 * Math.sin(θ) * ρ2 * Math.cos(φ),
				ρ2 * Math.sin(φ)
			));
			
        	φ += dφ;
		}
		
		θ += dθ;
	}
	
	line = new THREE.Line(
		lineGeometry, new THREE.LineBasicMaterial({
			color : 0x003f8f,
			opacity : 0.5,
			blending: THREE.AdditiveBlending , 
			transparent: true
		})
	);
		
	scene.add(line);	
	
	document.addEventListener('mousemove',  onDocumentMouseMove,  false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove',  onDocumentTouchMove,  false);
}

function onDocumentMouseMove(event) {

	mouseX = event.clientX - viewHalfX;
	mouseY = event.clientY - viewHalfY;
}

function onDocumentTouchStart(event) {

	if (event.touches.length > 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - viewHalfX;
		mouseY = event.touches[0].pageY - viewHalfY;
	}
}

function onDocumentTouchMove(event) {

	if (event.touches.length == 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - viewHalfX;
		mouseY = event.touches[0].pageY - viewHalfY;
	}
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	
	render();
}

function render() {
	renderer.render( scene, camera );
}

function randomFloatBetween(minValue, maxValue, precision) {
    if(typeof(precision) == 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}