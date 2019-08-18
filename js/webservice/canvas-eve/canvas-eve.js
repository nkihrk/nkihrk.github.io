// Global scope
var newFile = {
    'id': 0,
    'prevId': 0,
    // To identify whether being dropped or not
    'flg': 0,
};
// Restrict the drag-and-paste event
var drag_paste_avail_flg = true;
// A max length of the HIGHEST_Z_INDEX is 2147483647
var HIGHEST_Z_INDEX = 1;


(function (window, $) {
    // When DOM tree is constructed
    $(function () {

        // Drag-and-Paste event
        const canvasEve = function () {

            const dragAndPaste = function () {
                // Global scope

                const handleDragEvent = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'copy';
                    // Not clear why this will help. Should have to reset pointer-events, but still works fine
                    $('iframe').css('pointer-events', 'none');
                };

                // The canvas-eve area to paste
                const canvasEve = document.getElementById("canvas-eve");
                canvasEve.addEventListener("dragover", handleDragEvent, false);
                canvasEve.addEventListener("drop", function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    var clientX = e.clientX;
                    var clientY = e.clientY;

                    const files = e.dataTransfer.files;
                    const readAndPreview = function (file) {
                        if (/\.(jpe?g|png|gif|webm|mp4)$/i.test(file.name)) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                newFile.prevId = newFile.id;
                                newFile.id += 1;
                                // console.log('newFile.id : ' + newFile.id + ', newFile.flg  : ' + newFile.flg);
                                const imgTag = '<img class="is-flipped" src="' + e.target.result + '" style="width: 100%;">';
                                const videoTag = '<video class="is-flipped" controls playsinline preload="metadata" style="width: 100%;">' +
                                    '<source src="' + e.target.result + '" type="video/webm">' +
                                    '<source src="' + e.target.result + '" type="video/mp4">' +
                                    '</video>';
                                const resTag = /\.(jpe?g|png|gif)$/i.test(file.name) ? imgTag : videoTag;
                                const funcTags = '<div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>'
                                const assertFile = '<div id ="' + newFile.id + '" class="grab-pointer file-wrap"><div class="function-wrapper">' + funcTags + '</div>' + resTag + '</div>';
                                $('#add-files').append(assertFile);
                                // console.log('reader.onload is successfully executed');
                            };
                            reader.onloadend = function (e) {
                                if (e.target.readyState == FileReader.DONE) {
                                    for (let i = newFile.prevId + 1; i < newFile.id + 1; i++) {
                                        newFile.flg = 0;
                                        var fileId = '#' + i;
                                        var $fileId = $(fileId);
                                        var fileIdWidth = $fileId.outerWidth();
                                        var fileIdHeight = $fileId.outerHeight();
                                        // console.log('clientX : ' + clientX + ', clientY : ' + clientY + ', fileWidth : ' + fileWidth + ', fileHeight : ' + fileHeight);

                                        HIGHEST_Z_INDEX += 1;
                                        if (newFile.flg == 0) {
                                            $fileId.css({
                                                'top': clientY - fileIdHeight / 2 + 'px',
                                                'left': clientX - fileIdWidth / 2 + 'px',
                                                'z-index': HIGHEST_Z_INDEX,
                                            });
                                            newFile.flg = 1;
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
            if (drag_paste_avail_flg == true) {
                dragAndPaste();
            }


            const fileSet = function () {
                // Global scope
                const file = {
                    '$fileId': null,
                    'fileId': 0,
                    //
                    'fileIdPos': 0,
                    //
                    'fileIdRelPosX': 0,
                    'fileIdRelPosY': 0,
                    //
                    'fileIdWidth': 0,
                    'fileIdHeight': 0,
                    //
                    'fileIdRatio': 0,
                    'fileIdTheta': 0,
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
                    'only_draggable_flg': false,
                    'iframe_draggable_flg': false,
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
                    // The max length of highest_z_index is 2147483647
                    // 'highest_z_index': 0,
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
                    $('#canvas-eve').append('<div id="' + name + '"></div>')
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

                // For the iframe pointer problem
                const iframePointerNone = function () {
                    $('iframe').css('pointer-events', 'none');
                };
                const iframePointerReset = function () {
                    $('iframe').css('pointer-events', '');
                };

                // Just for separation
                const sep = () => console.log('-------------------------------------');

                //////


                // Prefix for pasted-images
                $(document).on('mousedown', '.file-wrap', function (e) {
                    console.log('mousedown .file-wrap is detected.');

                    // To restrict preferred functions
                    if ($(this).children().hasClass('only-draggable')) {
                        flgs.only_draggable_flg = true;
                    } else {
                        flgs.only_draggable_flg = false;
                    }


                    $('div').removeClass('selected');
                    $('div').removeClass('resize-icon');
                    $('div').removeClass('rotate-icon');
                    $('div').removeClass('flip-icon');
                    $('div').removeClass('trash-icon');

                    $('div').remove('.re-left-top');
                    $('div').remove('.re-right-top');
                    $('div').remove('.re-right-bottom');
                    $('div').remove('.re-left-bottom');

                    $('div').remove('.ro-left-top');
                    $('div').remove('.ro-right-top');
                    $('div').remove('.ro-right-bottom');
                    $('div').remove('.ro-left-bottom');

                    $(this).addClass('selected'); // A selected border
                    // Added selected symbols and other functions
                    if (flgs.only_draggable_flg == false) {
                        // $(this).prepend(resizeBox); // Resizing boxes

                        // Resizing boxes
                        if ($(this).find('.resize-wrapper').hasClass('active')) {
                            $(this).prepend(resizeBox);
                        }
                        if ($(this).find('.rotate-wrapper').hasClass('active')) $(this).prepend(rotateBox); // Rotating circles

                        $(this).find('.resize-wrapper').addClass('resize-icon'); // Add a resizing icon
                        $(this).find('.rotate-wrapper').addClass('rotate-icon'); // Add a rotating icon
                        $(this).find('.flip-wrapper').addClass('flip-icon'); // Add a flipping icon
                        $(this).find('.trash-wrapper').addClass('trash-icon'); // Add a trash icon
                    }


                    // Add #id to #image, and initialize its values
                    if (flgs.drag_flg == false) {
                        file.fileId = '#' + $(this).attr('id');
                        file.$fileId = $(file.fileId);
                        console.log('id : ' + $(this).attr('id'));

                        file.fileIdWidth = file.$fileId.outerWidth();
                        file.fileIdHeight = file.$fileId.outerHeight();
                        file.fileIdRatio = file.fileIdHeight / file.fileIdWidth;

                        file.fileIdTheta = getRotationRad(file.$fileId);
                        console.log('file.fileIdTheta : ' + file.fileIdTheta);
                        file.rotatedSize.width = file.fileIdWidth * Math.abs(Math.cos(file.fileIdTheta)) + file.fileIdHeight * Math.abs(Math.sin(file.fileIdTheta));
                        file.rotatedSize.height = file.fileIdHeight * Math.abs(Math.cos(file.fileIdTheta)) + file.fileIdWidth * Math.abs(Math.sin(file.fileIdTheta));

                        file.fileIdPos = file.$fileId.offset();
                        // Image-space mouse coordinates
                        file.fileIdRelPosX = e.clientX - file.fileIdPos.left;
                        file.fileIdRelPosY = e.clientY - file.fileIdPos.top;
                        // debugCircle('test-pos_1', 'blue', file.fileIdPos.left, file.fileIdPos.top);
                        // debugCircle('test-pos_4', 'white', file.fileIdRelPosX, file.fileIdRelPosY);

                        // Initialize file.rotatedCenterPos
                        file.rotatedCenterPos.left = (e.clientX - file.fileIdRelPosX) + file.rotatedSize.width / 2;
                        file.rotatedCenterPos.top = (e.clientY - file.fileIdRelPosY) + file.rotatedSize.height / 2;

                        // Initialize the initRads for a rotating function
                        tmp.ro.left_top_initRad = calcRadians(-file.fileIdWidth / 2, -file.fileIdHeight / 2);
                        tmp.ro.right_top_initRad = calcRadians(file.fileIdWidth / 2, -file.fileIdHeight / 2);
                        tmp.ro.right_bottom_initRad = calcRadians(file.fileIdWidth / 2, file.fileIdHeight / 2);
                        tmp.ro.left_bottom_initRad = calcRadians(-file.fileIdWidth / 2, file.fileIdHeight / 2);
                        sep();
                        console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);
                        console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);
                        console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);
                        console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);
                        sep();

                        // Set the $fileId to be the highest of all the other unselected elements
                        // file.$fileId.appendTo('#add-files');
                        HIGHEST_Z_INDEX += 1;
                        file.$fileId.css('z-index', HIGHEST_Z_INDEX);
                        flgs.drag_flg = true;
                        console.log('flgs.drag_flg is ' + flgs.drag_flg);
                        console.log('mousedown-left : ' + file.fileIdPos.left + ', mousedown-top : ' + file.fileIdPos.top + ', e.clientX : ' + e.clientX + ', e.clientY : ' + e.clientY + ', file.fileIdRelPosX : ' + file.fileIdRelPosX + ', file.fileIdRelPosY : ' + file.fileIdRelPosY);
                    }
                });


                // Reset a selected area
                $(document).on('mousedown', '#reset-res', function () {
                    console.log('mousedown #reset-res is detected.');
                    $('div').removeClass('selected');
                    $('div').removeClass('resize-icon');
                    $('div').removeClass('rotate-icon');
                    $('div').removeClass('flip-icon');
                    $('div').removeClass('trash-icon');

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
                    // Activate resizing
                    $(document).on('mousedown', '.resize-wrapper', function (e) {
                        console.log('mousedown .resize-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');

                        if ($(this).hasClass('active')) {
                            if (!file.$fileId.hasClass('ro-left-top')) {
                                file.$fileId.prepend(resizeBox);
                            }
                        } else {
                            file.$fileId.children('.re-left-top').remove();
                            file.$fileId.children('.re-right-top').remove();
                            file.$fileId.children('.re-right-bottom').remove();
                            file.$fileId.children('.re-left-bottom').remove();
                        }
                    });


                    //Activate rotating
                    $(document).on('mousedown', '.rotate-wrapper', function (e) {
                        console.log('mousedown .rotate-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');

                        if ($(this).hasClass('active')) {
                            if (!file.$fileId.hasClass('ro-left-top')) {
                                file.$fileId.removeClass('not-rotated');
                                file.$fileId.prepend(rotateBox);
                            }
                        } else {
                            file.$fileId.addClass('not-rotated');
                            file.$fileId.children('.ro-left-top').remove();
                            file.$fileId.children('.ro-right-top').remove();
                            file.$fileId.children('.ro-right-bottom').remove();
                            file.$fileId.children('.ro-left-bottom').remove();
                        }
                    });


                    // Activate flipping
                    $(document).on('mousedown', '.flip-wrapper', function (e) {
                        console.log('mousedown .flip-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            $(file.fileId + ' .is-flipped').addClass('flipped');
                        } else {
                            $(file.fileId + ' .is-flipped').removeClass('flipped');
                        }
                    });


                    // Trash the selected element
                    $(document).on('mousedown', '.trash-wrapper', function (e) {
                        console.log('mousedown .trash-wrapper is detected.');

                        e.stopPropagation();
                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            $(file.fileId).remove();
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
                                iframePointerNone();

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
                                iframePointerNone();


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
                    iframePointerReset();

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
                        let targetPosLeft = e.clientX - file.fileIdRelPosX;
                        let targetPosTop = e.clientY - file.fileIdRelPosY;
                        let w = file.rotatedSize.width;
                        let h = file.rotatedSize.height;
                        let resLeft = (w - file.fileIdWidth) / 2 + targetPosLeft;
                        let resTop = (h - file.fileIdHeight) / 2 + targetPosTop;


                        if (flgs.drag_flg == true && flgs.resize_flg == false && flgs.rotate_flg == false) {
                            file.$fileId.css('left', resLeft + 'px');
                            file.$fileId.css('top', resTop + 'px');

                            // Update file.rotatedCenterPos for the later-use in rotating function
                            file.rotatedCenterPos.left = (e.clientX - file.fileIdRelPosX) + w / 2;
                            file.rotatedCenterPos.top = (e.clientY - file.fileIdRelPosY) + h / 2;
                            // debugCircle('test-pos_3', 'orange', e.clientX - file.fileIdRelPosX, e.clientY - file.fileIdRelPosY);
                            if (test_flg == false) {
                                console.log('file.$fileId.css("left") : ' + file.$fileId.css('left') + ', file.$fileId.css("top") : ' + file.$fileId.css('top') + ', e.clientX : ' + e.clientX + ', e.clientY : ' + e.clientY + ', file.fileIdRelPosX : ' + file.fileIdRelPosX + ', file.fileIdRelPosY : ' + file.fileIdRelPosY);
                                test_flg = true;
                            }
                            console.log('drag function is called');
                        }
                    };


                    // When an image is rotated
                    const rotated = function () {
                        let fileCenterPosX = file.rotatedCenterPos.left;
                        let fileCenterPosY = file.rotatedCenterPos.top;
                        // debugCircle('test-pos_5', 'purple', fileCenterPosX, fileCenterPosY);
                        // A current radian value of the mouse
                        let rad = calcRadians(e.clientX - fileCenterPosX, e.clientY - fileCenterPosY);
                        // debugCircle('test-pos_6', 'black', 50 * Math.cos(rad) + fileCenterPosX, 50 * Math.sin(rad) + fileCenterPosY);

                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.left_top_flg == true) {
                            let resRad = rad - tmp.ro.left_top_initRad;
                            console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.right_top_flg == true) {
                            let resRad = rad - tmp.ro.right_top_initRad;
                            console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.right_bottom_flg == true) {
                            let resRad = rad - tmp.ro.right_bottom_initRad;
                            console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true && flgs.ro.left_bottom_flg == true) {
                            let resRad = rad - tmp.ro.left_bottom_initRad;
                            console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }
                    };


                    // When resizing-boxes are clicked
                    const resized = function () {
                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_top_flg == true) {
                            file.$fileId.css({
                                'top': file.fileIdPos.top + (file.fileIdHeight - (file.fileIdWidth - (e.clientX - file.fileIdPos.left)) * file.fileIdRatio) + 'px',
                                'left': e.clientX + 'px',
                                'width': file.fileIdWidth - (e.clientX - file.fileIdPos.left) + 'px',
                            });
                            console.log('mousedown is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_top_flg == true) {
                            file.$fileId.css({
                                'top': file.fileIdPos.top + (file.fileIdHeight - (e.clientX - file.fileIdPos.left) * file.fileIdRatio) + 'px',
                                'left': file.fileIdPos.left + 'px',
                                'width': e.clientX - file.fileIdPos.left + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_bottom_flg == true) {
                            file.$fileId.css({
                                'top': file.fileIdPos.top + 'px',
                                'left': file.fileIdPos.left + 'px',
                                'width': e.clientX - file.fileIdPos.left + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_bottom_flg == true) {
                            file.$fileId.css({
                                'top': file.fileIdPos.top + 'px',
                                'left': file.fileIdPos.left + (e.clientX - file.fileIdPos.left) + 'px',
                                'width': file.fileIdWidth - (e.clientX - file.fileIdPos.left) + 'px',
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
            fileSet();


        };
        canvasEve();


    });
})(window, jQuery);