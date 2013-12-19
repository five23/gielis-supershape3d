
function randomFloatBetween(minValue, maxValue, precision) {
    if (typeof (precision) == 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}

var m = randomFloatBetween(1.0, 27.0, 2),
    a = randomFloatBetween(1.0, 5.0, 2),
    b = randomFloatBetween(1.0, 5.0, 2),
    n1 = randomFloatBetween(0.0, 4.0, 2),
    n2 = randomFloatBetween(0.0, 4.0, 2),
    n3 = randomFloatBetween(0.0, 4.0, 2);

var lineGeometry = new THREE.Geometry();

var line = new THREE.Line(
        lineGeometry, new THREE.LineBasicMaterial({
            color: 0x013f8f,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            transparent: true
        })
    );

var mouseX, mouseY, camera, scene, renderer, controls;

init();

function init() {

    container = document.createElement('div');

    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 10000);
    camera.position.z = 5;
    camera.position.y = Math.random();
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.0;
    controls.noZoom = false;
    controls.noPan = true;
    controls.noRotate = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = .2;
    updateVertices();
    animate();
}

function updateVertices() {

    var theta = -(2 * Math.PI), p1, p2;

    while (theta <= (2 * Math.PI)) {

        var phi = -Math.PI;

        var px1 = Math.pow(Math.abs(Math.cos(m * theta / 2)) / a, n2);
        var py1 = Math.pow(Math.abs(Math.sin(m * theta / 2)) / b, n3);

        p1 = Math.pow(px1 + py1, -1 / n1);

        while (phi <= Math.PI) {

            var px2 = Math.pow(Math.abs(Math.cos(m * phi / 2)) / a, n2);
            var py2 = Math.pow(Math.abs(Math.sin(m * phi / 2)) / b, n3);

            p2 = Math.pow(px2 + py2, -1 / n1);

            lineGeometry.vertices.push(
                new THREE.Vector3(
                    (p1 * Math.cos(theta) * p2 * Math.cos(phi)),
                    (p1 * Math.sin(theta) * p2 * Math.cos(phi)),
                    (p2 * Math.sin(phi))));

            phi += 0.1;
        }

        theta += 0.1;
    }

    scene.add(line);
}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - window.innerWidth / 2.0;
    mouseY = event.clientY - window.innerHeight / 2.0;
}

function onDocumentTouchStart(event) {

    if (event.touches.length > 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - window.innerWidth / 2.0;
        mouseY = event.touches[0].pageY - window.innerHeight / 2.0;
    }
}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - window.innerWidth / 2.0;
        mouseY = event.touches[0].pageY - window.innerHeight / 2.0;
    }

}

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function render() {
}
