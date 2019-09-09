var camera, scene, renderer, mesh, controls;
var group;

// Create default material
// material = new THREE.MeshPhongMaterial();

init();
animate();

// // file input button
// document.getElementById('pickFile').addEventListener('change', openFile, false);

// // file load
// function openFile(evt) {

//     var fileObject = evt.target.files[0];

//     // delete previous objects from scene 
//     while (group.children.length > 0) {
//         group.remove(group.children[0]);
//     }

//     var reader = new FileReader();
//     reader.onload = function () {
//         var loader = new THREE.FBXLoader();
//         // parse the .stl file
//         var geometry = loader.parse(this.result);
//         var mesh = new THREE.Mesh(geometry, material);
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;
//         scene.add(mesh);
//         // group.add(mesh);
//     };
//     // --> update here 
//     reader.readAsArrayBuffer(fileObject);
// };

// and the rest of my three.js code there : init() and animate() functions ...


function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // // grid
    // var gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030);
    // gridHelper.position.set(0, -0.04, 0);
    // scene.add(gridHelper);

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