(function (window, $) {
    //
    // Model`s directories => /js/works/webservice/canvas-eve/three/model/
    //

    var scenes = [],
        renderer;
    const canvas = document.getElementById("c");
    const canvasEveWrap = document.getElementById("canvas-eve-wrapper");


    const loaderEve = {

        OBJLoader: (manager, rootFilePath, scene) => {
            var loader = new THREE.OBJLoader(manager);
            loader.load(

                rootFilePath,

                function (obj) {

                    obj.traverse(function (child) {
                        if (child.isMesh) {
                            // child.material.map = texture;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    threeEve.fit2Scene(scene, obj);

                    scene.add(obj);

                }

            );
        },


        //


        MTLLoader: (manager, rootFilePath, scene, mtlFilePath) => {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load(

                mtlFilePath,

                function (materials) {

                    materials.preload();
                    materials.materials.default.map.magFilter = THREE.NearestFilter;
                    materials.materials.default.map.minFilter = THREE.LinearFilter;

                    loaderEve.OBJLoader(manager, rootFilePath, scene, materials);

                }

            );
        },


        //


        FBXLoader: (manager, rootFilePath, scene) => {
            var loader = new THREE.FBXLoader(manager);
            loader.load(

                rootFilePath,

                function (fbx) {

                    fbx.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.transparent = false;
                            child.material.alphaTest = 0.5;
                        }
                    });

                    threeEve.fit2Scene(scene, fbx);

                    scene.add(fbx);

                }

            );
        },


        //


        MMDLoader: (manager, rootFilePath, scene, modelFormat) => {
            var loader = new THREE.MMDLoader(manager);
            loader.modelFormat = modelFormat;
            loader.load(

                rootFilePath,

                function (mmd) {

                    threeEve.fit2Scene(scene, mmd);

                    // var box = new THREE.BoxHelper(mmd, 0xffff00);
                    // scene.add(box);

                    scene.add(mmd);

                }

            );
        },


    };


    const readFileEve = {

        OBJReader: (files, mousePos, progSet) => {

            var rootFileName, rootFilePath;
            var baseURL;

            var blobs = {};

            var id = readFileEve.addFileWrap(mousePos);
            var scene = threeEve.setScene(id);

            Array.from(files).forEach((file) => {
                if (/\.(obj)$/i.test(file.name)) {
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

                // console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
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

                console.log('------------------------------------------');
            };

            manager.onError = function (url) {
                console.log('There was an error loading ' + url);
                console.log('blobURLs', blobURLs);
            };


            loaderEve.OBJLoader(manager, rootFilePath, scene);

        },


        //


        FBXReader: (files, mousePos, progSet) => {
            var rootFileName, rootFilePath;
            var baseURL;

            var blobs = {};

            var id = readFileEve.addFileWrap(mousePos);
            var scene = threeEve.setScene(id);

            Array.from(files).forEach((file) => {
                if (/\.(fbx)$/i.test(file.name)) {
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
            manager.setURLModifier((url) => {
                var n = url.replace(baseURL, '');
                url = URL.createObjectURL(blobs[n]);

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

                console.log('------------------------------------------');
            };

            manager.onError = function (url) {
                console.log('There was an error loading ' + url);
            };


            loaderEve.FBXLoader(manager, rootFilePath, scene);

        },


        //


        MMDReader: (files, mousePos, progSet) => {
            var rootFileName, rootFilePath;
            var baseURL;
            var modelFormat;

            var blobs = {};

            var id = readFileEve.addFileWrap(mousePos);
            var scene = threeEve.setScene(id);

            Array.from(files).forEach((file) => {
                if (/\.(pmx|pmd)$/i.test(file.name)) {
                    rootFilePath = URL.createObjectURL(file);
                    baseURL = THREE.LoaderUtils.extractUrlBase(rootFilePath);
                    rootFileName = rootFilePath.replace(baseURL, '');
                    blobs[rootFileName] = file;
                    modelFormat = file.name.split('.').slice(-1)[0];
                    console.log('blobs', blobs, 'baseURL', baseURL, 'rootFilePath', rootFilePath);
                } else {
                    blobs[file.name] = file;
                    console.log('blobs', blobs);
                }
            });


            var manager = new THREE.LoadingManager();
            manager.setURLModifier((url) => {
                console.log('url', url);
                console.log('---------------------------');

                if (!url.match(/base64/)) {
                    var n = url.replace(baseURL, '');
                    url = URL.createObjectURL(blobs[n]);
                }

                // console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
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
                    $('div').remove('.hide-scissor');
                }, 1000);

                console.log('------------------------------------------');
            };

            manager.onError = function (url) {
                console.log('There was an error loading ' + url);
            };


            loaderEve.MMDLoader(manager, rootFilePath, scene, modelFormat);

        },


        //


        addFileWrap: (mousePos) => {
            newFile.id += 1;
            HIGHEST_Z_INDEX += 1;


            const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="trash-wrapper"></div>';
            const assertFile = '<div id ="' + newFile.id + '" class="glsl file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main"></div></div>';
            $('#add-files').append(assertFile);


            const hide = $('<div class="hide-scissor"></div>').css({
                'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
                'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
                'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
            });
            $('#add-files').append(hide);


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
                var modelFormat;
                Array.from(files).forEach((file) => {
                    if (readFileEve.isSupported(file.name)) {
                        supported_model_flg = true;
                        modelFormat = file.name.split('.').slice(-1)[0];
                        console.log('modelFormat', modelFormat);
                    }
                });
                if (supported_model_flg == true) {

                    switch (modelFormat) {
                        case 'obj':
                            readFileEve.OBJReader(files, mousePos, progSet);
                            break;

                        case 'fbx':
                            readFileEve.FBXReader(files, mousePos, progSet);
                            break;

                        case 'pmx':
                            readFileEve.MMDReader(files, mousePos, progSet);
                            break;

                        case 'pmd':
                            readFileEve.MMDReader(files, mousePos, progSet);
                            break;

                        default:
                            break;
                    }
                }
            } else {
                return;
            }
        },


        //


        isSupported: (fileName) => {
            return /\.(obj|fbx|pmx|pmd)$/i.test(fileName);
        }

    };


    const threeEve = {
        init: () => {
            readFileEve.drop();

            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true,
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
        },


        //


        setScene: (newFileId) => {
            var scene = new THREE.Scene();

            scene.userData.element = document.getElementById(newFileId).getElementsByClassName('eve-main')[0];

            scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

            var light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(1, 1, 1);
            scene.add(light);

            scenes.push(scene);

            return scene;
        },


        //


        fit2Scene: (scene, object) => {
            var fovy = 40;
            var camera = new THREE.PerspectiveCamera(fovy, 1, 0.1, 1000);

            var BB = new THREE.Box3().setFromObject(object);
            var centerpoint = BB.getCenter();
            var size = BB.getSize();
            var backup = (size.y / 2) / Math.sin((camera.fov / 2) * (Math.PI / 180));
            var camZpos = BB.max.z + backup + camera.near;

            camera.position.set(centerpoint.x, centerpoint.y, camZpos);
            camera.far = camera.near + 10 * size.z;
            camera.updateProjectionMatrix();

            scene.userData.camera = camera;

            var controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
            controls.target.set(0, size.y / 2, 0);
            controls.enableKeys = false;
            controls.screenSpacePanning = true;
            controls.update();
            scene.userData.controls = controls;
        },


        //


        animate: () => {
            threeEve.render();
            requestAnimationFrame(threeEve.animate);
        },


        //


        updateSize: () => {
            var cWidth = canvas.clientWidth;
            var cHeight = canvas.clientHeight;

            if (canvas.width !== cWidth || canvas.height !== cHeight) {
                renderer.setSize(cWidth, cHeight, false);
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
                if (controls) {
                    controls.rotateSpeed = 1 * mouseWheelVal;
                    controls.panSpeed = 1 * mouseWheelVal;
                    if ($('#' + currentId).find('.thumbtack-wrapper').hasClass('active')) {
                        controls.enabled = true;
                    } else {
                        controls.enabled = false;
                    }
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

                // console.log('width', width, 'height', height, 'left', left, 'bottom', bottom);

                renderer.setViewport(left, bottom, width, height);
                renderer.setScissor(left, bottom, width, height);

                var camera = scene.userData.camera;
                if (camera) {
                    renderer.render(scene, camera);
                    renderer.autoClear = false;
                }
            });
        }
    };
    threeEve.init();
    threeEve.animate();


})(window, jQuery);