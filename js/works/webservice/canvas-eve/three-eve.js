var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize($('#glsl').width(), parseInt($('#glsl').width() * window.innerHeight / window.innerWidth));

    $('#glsl').find('.is-flipped').append(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}