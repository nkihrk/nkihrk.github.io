(function (window, $) {
    // When DOM tree is constructed
    $(function () {

        // Drag-and-Paste event
        const canvasEve = function () {

            const dragAndPaste = function () {
                // Global scope
                var newImg = {
                    'id': 0,
                    'prevId': 0,
                    // To identify whether being dropped or not
                    'flg': 0,
                };

                const handleDragEvent = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'copy';
                };

                // The target area to paste
                const target = document.getElementById("target");
                target.addEventListener("dragover", handleDragEvent, false);
                target.addEventListener("drop", function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    var clientX = e.clientX;
                    var clientY = e.clientY;

                    const files = e.dataTransfer.files;
                    const readAndPreview = function (file) {
                        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                newImg.prevId = newImg.id;
                                newImg.id += 1;
                                // console.log('newImg.id : ' + newImg.id + ', newImg.flg  : ' + newImg.flg);
                                const assertImg = '<div id ="' + newImg.id + '" class="grab-pointer img-wrap"><div class="function-wrapper"><div class="flip-wrapper"></div><div class="rotate-wrapper"></div></div><img src="' + e.target.result + '" style="width: 100%;"></div>';
                                $('#image').append(assertImg);
                                // console.log('reader.onload is successfully executed');
                            };
                            reader.onloadend = function (e) {
                                if (e.target.readyState == FileReader.DONE) {
                                    for (let i = newImg.prevId + 1; i < newImg.id + 1; i++) {
                                        newImg.flg = 0;
                                        var imgId = '#' + i;
                                        var $imgId = $(imgId);
                                        var imgIdWidth = $imgId.outerWidth();
                                        var imgIdHeight = $imgId.outerHeight();
                                        // console.log('clientX : ' + clientX + ', clientY : ' + clientY + ', imgWidth : ' + imgWidth + ', imgHeight : ' + imgHeight);

                                        if (newImg.flg == 0) {
                                            $imgId.css({
                                                'top': clientY - imgIdHeight / 2 + 'px',
                                                'left': clientX - imgIdWidth / 2 + 'px',
                                            });
                                            newImg.flg = 1;
                                        }
                                    }
                                }
                            };
                            reader.readAsDataURL(file);
                        } else {
                            console.log('The invalid input type is detected.');
                            return;
                        }
                    };
                    if (files) {
                        [].forEach.call(files, readAndPreview);
                    }
                }, false);


            };
            dragAndPaste();


            const imgSet = function () {
                // Global scope
                const img = {
                    '$imgId': null,
                    'imgId': 0,
                    //
                    'imgIdPos': 0,
                    //
                    'imgIdRelPosX': 0,
                    'imgIdRelPosY': 0,
                    //
                    'imgIdWidth': 0,
                    'imgIdHeight': 0,
                    //
                    'imgIdRatio': 0,
                    'imgIdTheta': 0,
                    //
                    'rotatedSize': {
                        'width': 0,
                        'height': 0,
                    },
                    'rotatedCenterPos': {
                        'left': 0,
                        'top': 0,
                    },
                };

                // Flags
                const flgs = {
                    'drag_flg': false,
                    'rotate_flg': false,
                    'mousedown_flg': false,
                    'resize_flg': false,
                    're': {
                        'left_top_flg': false,
                        'right_top_flg': false,
                        'right_bottom_flg': false,
                        'left_bottom_flg': false,
                    },
                    'ro': {
                        'left_top_flg': false,
                        'right_top_flg': false,
                        'right_bottom_flg': false,
                        'left_bottom_flg': false,
                    }
                };

                // Stored datas temporarily
                const tmp = {
                    'ro': {
                        'left_top_initRad': null,
                        'right_top_initRad': null,
                        'right_bottom_initRad': null,
                        'left_bottom_initRad': null,
                        //
                        'left_top_pos': null,
                        'right_top_pos': null,
                        'right_bottom_pos': null,
                        'left_bottom_pos': null,
                    }
                };

                const resizeBox =
                    '<div class="re-left-top"></div>' +
                    '<div class="re-right-top"></div>' +
                    '<div class="re-right-bottom"></div>' +
                    '<div class="re-left-bottom"></div>';

                const rotateBox =
                    '<div class="ro-left-top"></div>' +
                    '<div class="ro-right-top"></div>' +
                    '<div class="ro-right-bottom"></div>' +
                    '<div class="ro-left-bottom"></div>';


                // Get transform values of a specific selector
                const transformValue = function (e) {
                    let values = e.split('(')[1];
                    values = values.split(')')[0];
                    values = values.split(', ');
                    const matrix = {
                        'scaleX': values[0],
                        'rotateP': values[1],
                        'rotateM': values[2],
                        'scaleY': values[3],
                        'transformX': values[4],
                        'transformY': values[5],
                    };
                    return matrix;
                };

                // Get a target`s specific transform-rotate value, and return the value as radian. The value will be in between 0 and 2PI
                const getRotationRad = function (obj) {
                    var matrix = obj.css("-webkit-transform") ||
                        obj.css("-moz-transform") ||
                        obj.css("-ms-transform") ||
                        obj.css("-o-transform") ||
                        obj.css("transform");
                    if (matrix !== 'none') {
                        var values = matrix.split('(')[1].split(')')[0].split(',');
                        var a = values[0];
                        var b = values[1];
                        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                    } else {
                        var angle = 0;
                    }
                    return (angle < 0) ? (angle + 360) / 180 * Math.PI : angle / 180 * Math.PI;
                }

                // Calcurate radians. The value will be in between 0 and 2PI
                const calcRadians = function (x, y) {
                    var rad = Math.atan2(y, x) / Math.PI * 180 + (Math.atan2(y, x) > 0 ? 0 : 360);
                    // console.log('The radian value : ' + rad);

                    return rad / 180 * Math.PI;
                };

                const debugCircle = function (name, col, posX, posY) {
                    $('#target').append('<div id="' + name + '"></div>')
                    $('#' + name).css({
                        // For -1, it is a prefix due to a border-width and -height(1px each)
                        'top': posY - 1 + 'px',
                        'left': posX - 1 + 'px',
                        'width': 14 + 'px',
                        'height': 14 + 'px',
                        'background': col,
                        'border-radius': 50 + '%',
                        'position': 'absolute',
                        'z-index': 999,
                        'transform': 'translateX(-50%) translateY(-50%)',
                        'opacity': 0.8,
                    });
                };

                // Just for separation
                const sep = () => console.log('-------------------------------------');

                //////


                // Prefix for pasted-images
                $(document).on('mousedown', '.img-wrap', function (e) {
                    console.log('mousedown .img-wrap is detected.');

                    $('div').removeClass('selected');
                    $('div').removeClass('flip-icon');
                    $('div').removeClass('rotate-icon');

                    $('div').remove('.re-left-top');
                    $('div').remove('.re-right-top');
                    $('div').remove('.re-right-bottom');
                    $('div').remove('.re-left-bottom');

                    $('div').remove('.ro-left-top');
                    $('div').remove('.ro-right-top');
                    $('div').remove('.ro-right-bottom');
                    $('div').remove('.ro-left-bottom');


                    // Added selected symbols and other functions
                    $(this).addClass('selected'); // A selected border
                    $(this).prepend(resizeBox); // Resizing boxes
                    if ($(this).find('.rotate-wrapper').hasClass('active')) $(this).prepend(rotateBox); // Rotating circles

                    $(this).find('.flip-wrapper').addClass('flip-icon'); // Add a flipping icon
                    $(this).find('.rotate-wrapper').addClass('rotate-icon'); // Add a rotating icon


                    // Add #id to #image, and initialize its values
                    if (flgs.drag_flg == false) {
                        img.imgId = '#' + $(this).attr('id');
                        img.$imgId = $(img.imgId);
                        console.log('id : ' + $(this).attr('id'));

                        img.imgIdWidth = img.$imgId.outerWidth();
                        img.imgIdHeight = img.$imgId.outerHeight();
                        img.imgIdRatio = img.imgIdHeight / img.imgIdWidth;

                        img.imgIdTheta = getRotationRad(img.$imgId);
                        console.log('img.imgIdTheta : ' + img.imgIdTheta);
                        img.rotatedSize.width = img.imgIdWidth * Math.abs(Math.cos(img.imgIdTheta)) + img.imgIdHeight * Math.abs(Math.sin(img.imgIdTheta));
                        img.rotatedSize.height = img.imgIdHeight * Math.abs(Math.cos(img.imgIdTheta)) + img.imgIdWidth * Math.abs(Math.sin(img.imgIdTheta));

                        img.imgIdPos = img.$imgId.offset();
                        // Image-space mouse coordinates
                        img.imgIdRelPosX = e.clientX - img.imgIdPos.left;
                        img.imgIdRelPosY = e.clientY - img.imgIdPos.top;
                        // debugCircle('test-pos_1', 'blue', img.imgIdPos.left, img.imgIdPos.top);
                        // debugCircle('test-pos_4', 'white', img.imgIdRelPosX, img.imgIdRelPosY);

                        // Initialize img.rotatedCenterPos
                        img.rotatedCenterPos.left = (e.clientX - img.imgIdRelPosX) + img.rotatedSize.width / 2;
                        img.rotatedCenterPos.top = (e.clientY - img.imgIdRelPosY) + img.rotatedSize.height / 2;

                        // Initialize the initRads for a rotating function
                        tmp.ro.left_top_initRad = calcRadians(-img.imgIdWidth / 2, -img.imgIdHeight / 2);
                        tmp.ro.right_top_initRad = calcRadians(img.imgIdWidth / 2, -img.imgIdHeight / 2);
                        tmp.ro.right_bottom_initRad = calcRadians(img.imgIdWidth / 2, img.imgIdHeight / 2);
                        tmp.ro.left_bottom_initRad = calcRadians(-img.imgIdWidth / 2, img.imgIdHeight / 2);
                        sep();
                        console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);
                        console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);
                        console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);
                        console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);
                        sep();

                        // Set the $imgId to be the highest of all the other unselected elements
                        img.$imgId.appendTo('#image');
                        flgs.drag_flg = true;
                        console.log('flgs.drag_flg is ' + flgs.drag_flg);
                        console.log('mousedown-left : ' + img.imgIdPos.left + ', mousedown-top : ' + img.imgIdPos.top + ', e.clientX : ' + e.clientX + ', e.clientY : ' + e.clientY + ', img.imgIdRelPosX : ' + img.imgIdRelPosX + ', img.imgIdRelPosY : ' + img.imgIdRelPosY);
                    }
                });


                // Reset a selected area
                $(document).on('mousedown', '#reset-res', function () {
                    console.log('mousedown #reset-res is detected.');
                    $('div').removeClass('selected');
                    $('div').removeClass('flip-icon');
                    $('div').removeClass('rotate-icon');

                    $('div').remove('.re-left-top');
                    $('div').remove('.re-right-top');
                    $('div').remove('.re-right-bottom');
                    $('div').remove('.re-left-bottom');

                    $('div').remove('.ro-left-top');
                    $('div').remove('.ro-right-top');
                    $('div').remove('.ro-right-bottom');
                    $('div').remove('.ro-left-bottom');
                });


                // Activate functions
                const activate = function () {
                    // Activate flipping
                    $(document).on('mousedown', '.flip-wrapper', function (e) {
                        console.log('mousedown .flip-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            $(img.imgId + ' img').addClass('flipped');
                        } else {
                            $(img.imgId + ' img').removeClass('flipped');
                        }
                    });


                    //Activate rotating
                    $(document).on('mousedown', '.rotate-wrapper', function (e) {
                        console.log('mousedown .rotate-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');

                        if ($(this).hasClass('active')) {
                            if (!img.$imgId.hasClass('ro-left-top')) {
                                img.$imgId.removeClass('not-rotated');
                                img.$imgId.prepend(rotateBox);
                            }
                        } else {
                            img.$imgId.addClass('not-rotated');
                            img.$imgId.children('.ro-left-top').remove();
                            img.$imgId.children('.ro-right-top').remove();
                            img.$imgId.children('.ro-right-bottom').remove();
                            img.$imgId.children('.ro-left-bottom').remove();
                        }
                    });

                    sep();
                };
                activate();


                // A set of functions for image configuring
                const functions = function () {
                    // Configuring flags for resizing function
                    const resize = function () {
                        const whichResizeBox = function (b, n) {
                            $(document).on('mousedown', b, function (e) {
                                console.log('mousedown ' + b + ' is detected');

                                if (flgs.mousedown_flg == false) {
                                    flgs.mousedown_flg = true;
                                    flgs.resize_flg = true;
                                    console.log('flgs.mousedown_flg is ' + flgs.mousedown_flg);
                                    console.log('flgs.resize_flg is ' + flgs.resize_flg);

                                    if (n == 0) {
                                        flgs.re.left_top_flg = true;
                                        console.log('flgs.re.left_top_flg is ' + flgs.re.left_top_flg);
                                    }
                                    if (n == 1) {
                                        flgs.re.right_top_flg = true;
                                        console.log('flgs.re.right_top_flg is ' + flgs.re.right_top_flg);
                                    }
                                    if (n == 2) {
                                        flgs.re.right_bottom_flg = true;
                                        console.log('flgs.re.right_bottom_flg is ' + flgs.re.right_bottom_flg);
                                    }
                                    if (n == 3) {
                                        flgs.re.left_bottom_flg = true;
                                        console.log('flgs.re.left_bottom_flg is ' + flgs.re.left_bottom_flg);
                                    }
                                }
                            });
                        };
                        whichResizeBox('.re-left-top', 0);
                        whichResizeBox('.re-right-top', 1);
                        whichResizeBox('.re-right-bottom', 2);
                        whichResizeBox('.re-left-bottom', 3);
                        sep();
                    }
                    resize();


                    // Configuring flags for a rotating function and a reset function
                    const rotate = function () {
                        const whichRotateBox = function (b, n) {
                            $(document).on('mousedown', b, function (e) {
                                console.log('mousedown ' + b + ' is detected');
                                e.stopPropagation();


                                if (flgs.rotate_flg == false) {
                                    flgs.mousedown_flg = true;
                                    flgs.drag_flg = false;
                                    flgs.rotate_flg = true;
                                    console.log('flgs.mousedown_flg is ' + flgs.mousedown_flg);
                                    console.log('flgs.drag_flg is ' + flgs.drag_flg);
                                    console.log('flgs.rotate_flg is ' + flgs.rotate_flg);

                                    if (n == 0) {
                                        flgs.ro.left_top_flg = true;
                                        console.log('flgs.ro.left_top_flg is ' + flgs.ro.left_top_flg);
                                    }
                                    if (n == 1) {
                                        flgs.ro.right_top_flg = true;
                                        console.log('flgs.ro.right_top_flg is ' + flgs.ro.right_top_flg);
                                    }
                                    if (n == 2) {
                                        flgs.ro.right_bottom_flg = true;
                                        console.log('flgs.ro.right_bottom_flg is ' + flgs.ro.right_bottom_flg);
                                    }
                                    if (n == 3) {
                                        flgs.ro.left_bottom_flg = true;
                                        console.log('flgs.ro.left_bottom_flg is ' + flgs.ro.left_bottom_flg);
                                    }
                                }
                            });
                        };
                        whichRotateBox('.ro-left-top', 0);
                        whichRotateBox('.ro-right-top', 1);
                        whichRotateBox('.ro-right-bottom', 2);
                        whichRotateBox('.ro-left-bottom', 3);
                        sep();
                    };
                    rotate();


                };
                functions();


                // Reset flags
                $(document).mouseup(function () {
                    // A flag for drag event
                    if (flgs.drag_flg == true) {
                        flgs.drag_flg = false;
                        console.log('flgs.drag_flg is ' + flgs.drag_flg);
                    }


                    // A flag for mousedown event
                    if (flgs.mousedown_flg == true) {
                        flgs.mousedown_flg = false;
                        console.log('flgs.mousedown_flg is ' + flgs.mousedown_flg);
                    }


                    // Flags for resizing
                    if (flgs.resize_flg == true) {
                        flgs.resize_flg = false;
                        console.log('flgs.resize_flg is ' + flgs.resize_flg);
                    }
                    if (flgs.re.left_top_flg == true) flgs.re.left_top_flg = false;
                    if (flgs.re.right_top_flg == true) flgs.re.right_top_flg = false;
                    if (flgs.re.right_bottom_flg == true) flgs.re.right_bottom_flg = false;
                    if (flgs.re.left_bottom_flg == true) flgs.re.left_bottom_flg = false;

                    // A flag for rotating
                    if (flgs.rotate_flg == true) {
                        flgs.rotate_flg = false;
                        console.log('flgs.rotate_flg is ' + flgs.rotate_flg);
                    }
                    if (flgs.ro.left_top_flg == true) flgs.ro.left_top_flg = false;
                    if (flgs.ro.right_top_flg == true) flgs.ro.right_top_flg = false;
                    if (flgs.ro.right_bottom_flg == true) flgs.ro.right_bottom_flg = false;
                    if (flgs.ro.left_bottom_flg == true) flgs.ro.left_bottom_flg = false;

                    sep();
                });

                // just for the tmp debug
                var test_flg = false;

                // Allow events when flags are in specific values
                $(document).mousemove(function (e) {
                    // Prevent from the default drag events
                    e.preventDefault();


                    // When an image is dragged
                    const dragged = function () {
                        let targetPosLeft = e.clientX - img.imgIdRelPosX;
                        let targetPosTop = e.clientY - img.imgIdRelPosY;
                        let w = img.rotatedSize.width;
                        let h = img.rotatedSize.height;
                        let resLeft = (w - img.imgIdWidth) / 2 + targetPosLeft;
                        let resTop = (h - img.imgIdHeight) / 2 + targetPosTop;


                        if (flgs.drag_flg == true && flgs.resize_flg == false && flgs.rotate_flg == false) {
                            img.$imgId.css('left', resLeft + 'px');
                            img.$imgId.css('top', resTop + 'px');

                            // Update img.rotatedCenterPos for the later-use in rotating function
                            img.rotatedCenterPos.left = (e.clientX - img.imgIdRelPosX) + w / 2;
                            img.rotatedCenterPos.top = (e.clientY - img.imgIdRelPosY) + h / 2;
                            // debugCircle('test-pos_3', 'orange', e.clientX - img.imgIdRelPosX, e.clientY - img.imgIdRelPosY);
                            if (test_flg == false) {
                                console.log('img.$imgId.css("left") : ' + img.$imgId.css('left') + ', img.$imgId.css("top") : ' + img.$imgId.css('top') + ', e.clientX : ' + e.clientX + ', e.clientY : ' + e.clientY + ', img.imgIdRelPosX : ' + img.imgIdRelPosX + ', img.imgIdRelPosY : ' + img.imgIdRelPosY);
                                test_flg = true;
                            }
                            console.log('drag function is called');
                        }
                    };


                    // When an image is rotated
                    const rotated = function () {
                        let imgCenterPosX = img.rotatedCenterPos.left;
                        let imgCenterPosY = img.rotatedCenterPos.top;
                        // debugCircle('test-pos_5', 'purple', imgCenterPosX, imgCenterPosY);
                        // A current radian value of the mouse
                        let rad = calcRadians(e.clientX - imgCenterPosX, e.clientY - imgCenterPosY);
                        // debugCircle('test-pos_6', 'black', 50 * Math.cos(rad) + imgCenterPosX, 50 * Math.sin(rad) + imgCenterPosY);

                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.left_top_flg == true) {
                            let resRad = rad - tmp.ro.left_top_initRad;
                            console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);

                            img.$imgId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.right_top_flg == true) {
                            let resRad = rad - tmp.ro.right_top_initRad;
                            console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);

                            img.$imgId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.right_bottom_flg == true) {
                            let resRad = rad - tmp.ro.right_bottom_initRad;
                            console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);

                            img.$imgId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.left_bottom_flg == true) {
                            let resRad = rad - tmp.ro.left_bottom_initRad;
                            console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);

                            img.$imgId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }
                    };


                    // When resizing-boxes are clicked
                    const resized = function () {
                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_top_flg == true) {
                            img.$imgId.css({
                                'top': img.imgIdPos.top + (img.imgIdHeight - (img.imgIdWidth - (e.clientX - img.imgIdPos.left)) * img.imgIdRatio) + 'px',
                                'left': e.clientX + 'px',
                                'width': img.imgIdWidth - (e.clientX - img.imgIdPos.left) + 'px',
                            });
                            console.log('mousedown is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_top_flg == true) {
                            img.$imgId.css({
                                'top': img.imgIdPos.top + (img.imgIdHeight - (e.clientX - img.imgIdPos.left) * img.imgIdRatio) + 'px',
                                'left': img.imgIdPos.left + 'px',
                                'width': e.clientX - img.imgIdPos.left + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_bottom_flg == true) {
                            img.$imgId.css({
                                'top': img.imgIdPos.top + 'px',
                                'left': img.imgIdPos.left + 'px',
                                'width': e.clientX - img.imgIdPos.left + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_bottom_flg == true) {
                            img.$imgId.css({
                                'top': img.imgIdPos.top + 'px',
                                'left': img.imgIdPos.left + (e.clientX - img.imgIdPos.left) + 'px',
                                'width': img.imgIdWidth - (e.clientX - img.imgIdPos.left) + 'px',
                            });
                            // console.log('down one is called');
                        }
                    };


                    const executed = function () {
                        dragged();
                        rotated();
                        resized();
                    };
                    executed();


                });
            };
            imgSet();


        };
        canvasEve();


    });
})(window, jQuery);