(function (window, $) {
    const testThreeJS = () => {
        var camera, scene, renderer, light;

        var clock = new THREE.Clock();

        var mixer;

        init();


        function init() {
            // The canvas-eve-wrapper area to paste
            const canvasEveWrap = document.getElementById("canvas-eve-wrapper");
            canvasEveWrap.addEventListener('dragover', handleDragEvent, false);
            canvasEveWrap.addEventListener('drop', handleDropEvent, false);

            function handleDragEvent(e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                // Not clear why this will help. Should have to reset pointer-events, but still works fine
                $('iframe').css('pointer-events', 'none');
            }

            function handleDropEvent(e) {

                Array.from(e.dataTransfer.files).forEach((file) => {
                    if (file.name.match(/\.(fbx)$/)) {

                        // camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
                        camera = new THREE.PerspectiveCamera(40, 1, 1, 20000);
                        camera.position.set(0, 100, 300);

                        scene = new THREE.Scene();

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


                        e.stopPropagation();
                        e.preventDefault();

                        const $prog = $('#progress-bar');
                        const progress = document.getElementById('progress-bar');

                        const files = e.dataTransfer.files;
                        const fileCount = files.length;
                        const eachProg = 100 / fileCount;
                        var totalProg = 0;
                        var iterate = 0;

                        const readFile = (file) => {
                            var reader = new FileReader();
                            reader.onloadstart = function (e) {
                                if (iterate == 0) {
                                    $prog.addClass('loading');
                                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

                                }
                            };
                            reader.onprogress = function (e) {
                                if (e.lengthComputable) {
                                    var percentLoaded = Math.round((e.loaded / e.total) * eachProg);
                                    if (percentLoaded < eachProg) {
                                        var progWidth = percentLoaded + totalProg;
                                        progress.style.width = progWidth + '%';
                                        // $prog.css('width', progWidth + '%');
                                        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                                    }
                                }
                            };
                            reader.onload = function (e) {
                                iterate++;
                                console.log('iterate', iterate);

                                if (iterate < fileCount) {
                                    totalProg = eachProg * iterate;
                                    progress.style.width = totalProg + '%';
                                    // $prog.css('width', totalProg + '%');
                                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

                                } else {
                                    // progress.style.width = '100%';
                                    // // $prog.css('width', 100 + '%');
                                    // setTimeout(function () {
                                    //     $prog.removeClass('loading');
                                    // }, 1000);
                                }
                            };
                            return reader.readAsArrayBuffer(file);
                        };
                        if (files.length > 0) {
                            // Enable file loading when it is a model
                            Array.from(files).forEach((file) => {
                                if (file.name.match(/\.(fbx)$/)) {
                                    [].forEach.call(files, readFile);
                                    fbx_flg = true;
                                }
                            });
                        } else {
                            return;
                        }


                        var rootFileName;
                        var filePath;
                        var baseURL;

                        var blobs = {};
                        var blobURLs = [];
                        Array.from(files).forEach((file) => {
                            if (file.name.match(/\.(fbx)$/)) {
                                filePath = URL.createObjectURL(file);
                                baseURL = THREE.LoaderUtils.extractUrlBase(filePath).toString();
                                rootFileName = filePath.replace(baseURL, '');
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
                            var fileName = url.replace(baseURL, '');
                            url = URL.createObjectURL(blobs[fileName]);
                            blobURLs.push(url);
                            console.log('url', url, 'fileName', fileName, 'blobs[fileName]', blobs[fileName]);
                            return url;
                        });


                        manager.onStart = function (url, itemsLoaded, itemsTotal) {
                            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
                        };

                        manager.onLoad = function () {
                            console.log('Loading complete!');
                            progress.style.width = '100%';
                            // $prog.css('width', 100 + '%');
                            setTimeout(function () {
                                $prog.removeClass('loading');
                            }, 1000);
                            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                        };


                        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
                            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
                        };

                        manager.onError = function (url) {
                            console.log('There was an error loading ' + url);
                        };


                        // model
                        var loader = new THREE.FBXLoader(manager);
                        loader.load(filePath, function (object) {
                            mixer = new THREE.AnimationMixer(object);
                            // var action = mixer.clipAction(object.animations[0]);
                            // action.play();
                            object.traverse(function (child) {
                                if (child.isMesh) {
                                    // child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            });

                            scene.add(object);
                            // blobURLs.forEach((url) => URL.revokeObjectURL(url));
                        });


                        renderer = new THREE.WebGLRenderer({
                            antialias: true,
                            alpha: true
                        });
                        renderer.setClearColor(0x000000, 0);
                        renderer.setPixelRatio(window.devicePixelRatio);
                        renderer.setSize(598, 598);
                        renderer.shadowMap.enabled = true;

                        console.log('renderer.domElement', renderer.domElement);


                        newFile.id += 1;
                        HIGHEST_Z_INDEX += 1;

                        // Init the values before executing the readAndPreview()
                        var x, y;
                        if (e.changedTouches) {
                            x = e.changedTouches[0].clientX;
                            y = e.changedTouches[0].clientY;
                        } else {
                            x = e.clientX;
                            y = e.clientY;
                        }
                        const left = x - $('#zoom').offset().left;
                        const top = y - $('#zoom').offset().top;

                        const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
                        const assertFile = '<div id ="' + newFile.id + '" class="glsl file-wrap transparent" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="is-flipped"></div></div>';
                        $('#add-files').append(assertFile);
                        $('#' + newFile.id + ' .is-flipped').append(renderer.domElement);


                        const fileId = '#' + newFile.id;
                        const $fileId = $(fileId);


                        $fileId.css({
                            'left': left * mouseWheelVal - 600 / 2 + 'px',
                            'top': top * mouseWheelVal - 600 / 2 + 'px',
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



                        controls = new THREE.OrbitControls(camera, renderer.domElement);
                        controls.target.set(0, 90, 0);
                        controls.update();

                        animate();

                    }
                });

            }
        }


        function animate() {
            requestAnimationFrame(animate);
            var delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            renderer.render(scene, camera);
        }

        $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
            // Resize its size based on .file-wrap
            if (glFlgs.canvas.re.left_top_flg == true || glFlgs.canvas.re.right_top_flg == true || glFlgs.canvas.re.right_bottom_flg == true || glFlgs.canvas.re.left_bottom_flg == true) {
                setTimeout(function () {
                    renderer.setSize($('#' + currentId).width(), $('#' + currentId).width());
                }, 1);
                console.log('currentId', currentId);

            }
        });

        $(document).on(EVENTNAME_TOUCHEND, function () {
            renderer.setSize($('#' + currentId).width(), $('#' + currentId).width());
            console.log('currentId', currentId);

        });

        $(document).on(EVENTNAME_TOUCHMOVE, '.file-wrap', function () {
            // Check whether it is pinned or not
            if ($(this).find('.thumbtack-wrapper').hasClass('active')) {
                controls.enabled = true;
                // controls.enableZoom = false;
            } else {
                controls.enabled = false;
            }
        });


    };
    testThreeJS();
})(window, jQuery);