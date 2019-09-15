(function (window, $) {

    var scenes = [],
        renderer;
    const canvas = document.getElementById("c");
    const canvasEveWrap = document.getElementById("canvas-eve-wrapper");


    const loaderEve = {
        FBXLoader: (manager, rootFilePath, scene, blobURLs) => {
            var loader = new THREE.FBXLoader(manager);
            loader.load(rootFilePath, function (object) {

                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                scene.add(object);
                // blobURLs.forEach((url) => URL.revokeObjectURL(url));

            });
        }


    };


    const readFileEve = {

        // To visualize current loading state
        blobReader: (files, mousePos, progSet) => {

            read().then(function () {
                // readFileEve.readerPromise(progSet);
                console.log('progSet.iterate', progSet.iterate);
            });


            function read() {
                return new Promise(function (resolve, reject) {
                    var rootFileName, rootFilePath;
                    var fileName, filePath;
                    var baseURL;

                    var blobs = {},
                        blobURLs = [];

                    Array.from(files).forEach((file) => {
                        if (readFileEve.isSupported(file.name)) {
                            rootFilePath = URL.createObjectURL(file);
                            baseURL = THREE.LoaderUtils.extractUrlBase(rootFilePath);
                            rootFileName = rootFilePath.replace(baseURL, '');
                            blobs[rootFileName] = file;
                            console.log('blobs', blobs, 'baseURL', baseURL);
                        } else {
                            blobs[file.name] = file;
                            console.log('blobs', blobs);
                        }
                    });


                    var manager = new THREE.LoadingManager();
                    // Initialize loading manager with URL callback.
                    manager.setURLModifier((url) => {
                        var n = url.replace(baseURL, '');
                        url = URL.createObjectURL(blobs[n]);
                        blobURLs.push(url);

                        console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
                        return url;
                    });


                    manager.onStart = function (url, itemsLoaded, itemsTotal) {
                        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

                        if (progSet.iterate == 0) {
                            progSet.progress.classList.add('loading');
                        }
                    };

                    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
                        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

                        progSet.iterate++;
                        console.log('progSet.iterate', progSet.iterate);

                        if (progSet.iterate < progSet.fileCount) {
                            progSet.totalProg = progSet.eachProg * progSet.iterate;
                            progSet.progress.style.width = progSet.totalProg + '%';
                            console.log('progSet.totalProg', progSet.totalProg);
                        }
                    };

                    manager.onLoad = function () {
                        console.log('Loading complete!');

                        progSet.progress.style.width = '100%';
                        setTimeout(function () {
                            progSet.progress.classList.remove('loading');
                        }, 1000);

                        setTimeout(function () {
                            $('div').removeClass('transparent');
                        }, 1000);
                        console.log('------------------------------------------');
                    };

                    manager.onError = function (url) {
                        console.log('There was an error loading ' + url);
                        console.log('blobURLs', blobURLs);
                    };


                    var id = readFileEve.addFileWrap(mousePos);
                    var scene = threeEve.setScene(id);
                    loaderEve.FBXLoader(manager, rootFilePath, scene, blobURLs);

                });
            };


        },


        //


        addFileWrap: (mousePos) => {
            newFile.id += 1;
            HIGHEST_Z_INDEX += 1;


            const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
            const assertFile = '<div id ="' + newFile.id + '" class="glsl file-wrap transparent" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main is-flipped"></div></div>';
            $('#add-files').append(assertFile);


            const fileId = '#' + newFile.id;
            const $fileId = $(fileId);


            $fileId.css({
                'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
                'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
                'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                'z-index': HIGHEST_Z_INDEX,
            });


            // For colpick-eve.js
            if ($('#toggle-colpick').length > 0) {
                if (!$('#toggle-colpick').hasClass('active')) {
                    $fileId.addClass('grab-pointer');
                }
            } else {
                $fileId.addClass('grab-pointer');
            }


            return newFile.id;
        },


        //


        // readerPromise: (progSet) => {

        //     if (progSet.iterate == progSet.fileCount) {
        //         setTimeout(function () {
        //             $('div').removeClass('transparent');
        //         }, 0);
        //     }


        // },


        //


        drop: () => {
            canvasEveWrap.addEventListener('dragover', readFileEve.handleDragEvent, false);
            canvasEveWrap.addEventListener('drop', readFileEve.handleDropEvent, false);
        },


        //


        handleDragEvent: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            // Not clear why this will help. Should have to reset pointer-events, but still works fine
            $('iframe').css('pointer-events', 'none');
        },


        //


        handleDropEvent: (e) => {
            e.stopPropagation();
            e.preventDefault();

            let x, y;
            if (e.changedTouches) {
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }

            const mousePos = {
                left: x - $('#zoom').offset().left,
                top: y - $('#zoom').offset().top
            };

            const files = e.dataTransfer.files;
            console.log('files', files);


            const progSet = {
                progress: document.getElementById('progress-bar'),
                fileCount: files.length,
                eachProg: parseFloat(100 / files.length),
                totalProg: 0,
                iterate: 0
            };


            if (progSet.fileCount > 0) {
                var supported_model_flg = false;
                Array.from(files).forEach((file) => {
                    if (readFileEve.isSupported(file.name)) {
                        supported_model_flg = true;
                    }
                });
                if (supported_model_flg == true) {
                    readFileEve.blobReader(files, mousePos, progSet);
                    console.log('files', files);
                }
            } else {
                return;
            }
        },


        //


        isSupported: (fileName) => {
            return /\.(fbx)$/i.test(fileName);
        }

    };


    const threeEve = {
        init: () => {
            readFileEve.drop();

            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
        },


        //


        setScene: (newFileId) => {
            var scene = new THREE.Scene();

            scene.userData.element = document.getElementById(newFileId).getElementsByClassName('eve-main')[0];

            camera = new THREE.PerspectiveCamera(40, 1, 1, 20000);
            camera.position.set(0, 100, 300);
            scene.userData.camera = camera;

            var controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
            controls.target.set(0, 90, 0);
            controls.update();
            scene.userData.controls = controls;

            scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

            var light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(1, 1, 1);
            scene.add(light);

            scenes.push(scene);

            return scene;
        },


        //


        animate: () => {
            threeEve.render();
            requestAnimationFrame(threeEve.animate);
        },


        //


        updateSize: () => {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;

            if (canvas.width !== width || canvas.height !== height) {

                renderer.setSize(width, height, false);

            }
        },


        //


        render: () => {
            threeEve.updateSize();

            renderer.setScissorTest(false);
            renderer.clear(true, true);
            renderer.setScissorTest(true);


            scenes.forEach(function (scene) {

                var element = scene.userData.element;

                var controls = scene.userData.controls;
                if ($('#' + currentId).find('.thumbtack-wrapper').hasClass('active')) {
                    controls.enabled = true;
                    // controls.enableZoom = false;
                } else {
                    controls.enabled = false;
                }

                var rect = element.getBoundingClientRect();

                if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
                    rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
                    return;
                }

                var width = rect.right - rect.left;
                var height = rect.bottom - rect.top;
                var left = rect.left;
                var bottom = renderer.domElement.clientHeight - rect.bottom;

                console.log('width', width, 'height', height, 'left', left, 'bottom', bottom);

                renderer.setViewport(left, bottom, width, height);
                renderer.setScissor(left, bottom, width, height);

                var camera = scene.userData.camera;

                renderer.render(scene, camera);

            });
        }
    };
    threeEve.init();
    threeEve.animate();


})(window, jQuery);