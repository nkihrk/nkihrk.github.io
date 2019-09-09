(function (window, $) {
    const testThreeJS = () => {
        var container, glsl, stats, controls;
        var camera, scene, renderer, light;

        var clock = new THREE.Clock();

        var mixer;

        init();
        animate();

        function init() {

            container = document.getElementById('glsl');
            glsl = document.getElementById('add-glsl');

            // camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
            camera = new THREE.PerspectiveCamera(30, 1, 1, 20000);
            camera.position.set(0, 100, 300);

            scene = new THREE.Scene();
            // scene.background = new THREE.Color(0xa0a0a0);
            // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

            light = new THREE.HemisphereLight(0xffffff, 0x444444);
            light.position.set(0, 200, 0);
            scene.add(light);

            light = new THREE.DirectionalLight(0xffffff);
            light.position.set(0, 200, 100);
            light.castShadow = true;
            light.shadow.camera.top = 180;
            light.shadow.camera.bottom = -100;
            light.shadow.camera.left = -120;
            light.shadow.camera.right = 120;
            scene.add(light);

            // ground
            var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
                color: 0x999999,
                depthWrite: false
            }));
            mesh.rotation.x = -Math.PI / 2;
            mesh.receiveShadow = true;
            // scene.add(mesh);

            var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            // scene.add(grid);

            // model
            var loader = new THREE.FBXLoader();
            loader.load('/js/works/webservice/canvas-eve/three/model/fbx/oka_miko.fbx', function (object) {

                mixer = new THREE.AnimationMixer(object);

                // var action = mixer.clipAction(object.animations[0]);
                // action.play();

                object.traverse(function (child) {

                    if (child.isMesh) {

                        child.castShadow = true;
                        child.receiveShadow = true;

                    }

                });

                scene.add(object);

            });

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(window.devicePixelRatio);
            // renderer.setSize(598, 598 * window.innerHeight / window.innerWidth);
            renderer.setSize(598, 598);
            renderer.shadowMap.enabled = true;
            glsl.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 70, 0);
            controls.update();

            // window.addEventListener('resize', onWindowResize, false);

            // stats
            stats = new Stats();
            // glsl.appendChild(stats.dom);
        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }


        function animate() {

            requestAnimationFrame(animate);

            var delta = clock.getDelta();

            if (mixer) mixer.update(delta);

            renderer.render(scene, camera);

            stats.update();

        }


    };
    testThreeJS();
})(window, jQuery);