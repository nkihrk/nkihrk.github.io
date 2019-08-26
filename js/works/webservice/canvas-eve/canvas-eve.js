(function (window, $) {
    // Drag-and-Paste event
    const canvasEve = function () {
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

        //////


        // Prefix for pasted-images. Initialize the values
        const init = function () {
            $(document).on(EVENTNAME_TOUCHSTART, '.file-wrap', function (e) {
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
                    console.log('file.fileIdPos', file.fileIdPos);

                    file.fileIdRelPosX = clientX - file.fileIdPos.left;
                    file.fileIdRelPosY = clientY - file.fileIdPos.top;
                    // debugCircle('test-pos_1', 'blue', file.fileIdPos.left, file.fileIdPos.top);
                    // debugCircle('test-pos_4', 'white', file.fileIdRelPosX, file.fileIdRelPosY);

                    // Initialize file.rotatedCenterPos
                    file.rotatedCenterPos.left = (clientX - file.fileIdRelPosX) + (file.rotatedSize.width / 2);
                    file.rotatedCenterPos.top = (clientY - file.fileIdRelPosY) + (file.rotatedSize.height / 2);

                    // Initialize the initRads for a rotating function
                    tmp.ro.left_top_initRad = calcRadians(-file.fileIdWidth / 2, -file.fileIdHeight / 2);
                    tmp.ro.right_top_initRad = calcRadians(file.fileIdWidth / 2, -file.fileIdHeight / 2);
                    tmp.ro.right_bottom_initRad = calcRadians(file.fileIdWidth / 2, file.fileIdHeight / 2);
                    tmp.ro.left_bottom_initRad = calcRadians(-file.fileIdWidth / 2, file.fileIdHeight / 2);

                    // Set the $fileId to be the highest of all the other unselected elements
                    // file.$fileId.appendTo('#add-files');
                    HIGHEST_Z_INDEX += 1;
                    file.$fileId.css('z-index', HIGHEST_Z_INDEX);
                    flgs.drag_flg = true;
                    console.log('flgs.drag_flg is ' + flgs.drag_flg);
                }
            });
        }
        init();


        // Reset a selected area
        const reset = function () {
            $(document).on(EVENTNAME_TOUCHSTART, '#reset-res', function () {
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
        }
        reset();


        // Update variables everytime a mousemove event is called on wherever
        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function () {
                // Set the #reset-res at a mouse pos
                $('#reset-res').css({
                    'left': (clientX - $('#plain').offset().left) - 50 + 'px',
                    'top': (clientY - $('#plain').offset().top) - 50 + 'px'
                });
            });
        };
        Update();


        // Configuring flags
        const configFlgs = function () {
            const activateFlgs = function () {

                // Configuring flags for resizing function
                const resize = function () {
                    const whichResizeBox = function (b, n) {
                        $(document).on(EVENTNAME_TOUCHSTART, b, function (e) {
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
                        $(document).on(EVENTNAME_TOUCHSTART, b, function (e) {
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
            activateFlgs();

            // Reset flags
            $(document).on(EVENTNAME_TOUCHEND, function () {
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


        };
        configFlgs();


        // Execute if flags are true
        const main = function () {

            // Show icons to be active, and do something if needed
            const clickedIcon = function () {
                // Activate resizing
                $(document).on(EVENTNAME_TOUCHSTART, '.resize-wrapper', function (e) {
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
                $(document).on(EVENTNAME_TOUCHSTART, '.rotate-wrapper', function (e) {
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
                $(document).on(EVENTNAME_TOUCHSTART, '.flip-wrapper', function (e) {
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
                $(document).on(EVENTNAME_TOUCHSTART, '.trash-wrapper', function (e) {
                    console.log('mousedown .trash-wrapper is detected.');

                    e.stopPropagation();
                    $(this).toggleClass('active');
                    if ($(this).hasClass('active')) {
                        $(file.fileId).remove();
                    }
                });

                sep();
            };
            clickedIcon();

            // Allow events when flags are in specific values
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                var pClientX = (clientX - $('#plain').offset().left);
                var pClientY = (clientY - $('#plain').offset().top);


                // When an image is dragged
                const dragged = function () {
                    let targetPosLeft = pClientX - file.fileIdRelPosX;
                    let targetPosTop = pClientY - file.fileIdRelPosY;
                    let w = file.rotatedSize.width;
                    let h = file.rotatedSize.height;
                    let resLeft = (w - file.fileIdWidth) / 2 + targetPosLeft;
                    let resTop = (h - file.fileIdHeight) / 2 + targetPosTop;


                    if (glFlgs.mousewheel_avail_flg == false && flgs.resize_flg == false && flgs.rotate_flg == false) {
                        if (flgs.drag_flg == true) {
                            file.$fileId.css('left', resLeft + 'px');
                            file.$fileId.css('top', resTop + 'px');

                            // Update file.rotatedCenterPos for the later-use in rotating function
                            file.rotatedCenterPos.left = (clientX - file.fileIdRelPosX) + (w / 2);
                            file.rotatedCenterPos.top = (clientY - file.fileIdRelPosY) + (h / 2);
                            // debugCircle('test-pos_3', 'orange', file.rotatedCenterPos.left, file.rotatedCenterPos.top);
                            console.log('drag function is called');
                        }
                    }
                };


                // When an image is rotated
                const rotated = function () {
                    let fileCenterPosX = file.rotatedCenterPos.left;
                    let fileCenterPosY = file.rotatedCenterPos.top;
                    // debugCircle('test-pos_5', 'purple', fileCenterPosX, fileCenterPosY);
                    // A current radian value of the mouse
                    let rad = calcRadians(clientX - fileCenterPosX, clientY - fileCenterPosY);
                    // debugCircle('test-pos_6', 'black', 50 * Math.cos(rad) + fileCenterPosX, 50 * Math.sin(rad) + fileCenterPosY);

                    if (glFlgs.mousewheel_avail_flg == false && flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true) {
                        if (flgs.ro.left_top_flg == true) {
                            let resRad = rad - tmp.ro.left_top_initRad;
                            console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.ro.right_top_flg == true) {
                            let resRad = rad - tmp.ro.right_top_initRad;
                            console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.ro.right_bottom_flg == true) {
                            let resRad = rad - tmp.ro.right_bottom_initRad;
                            console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }


                        if (flgs.ro.left_bottom_flg == true) {
                            let resRad = rad - tmp.ro.left_bottom_initRad;
                            console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);

                            file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
                            console.log('rotate function is called');
                        }
                    }
                };


                // When resizing-boxes are clicked
                const resized = function () {
                    if (glFlgs.mousewheel_avail_flg == false && flgs.mousedown_flg == true && flgs.resize_flg == true) {
                        if (flgs.re.left_top_flg == true) {
                            file.$fileId.css({
                                'top': (file.fileIdPos.top - $('#plain').offset().top) + (file.fileIdHeight - (file.fileIdWidth - (clientX - file.fileIdPos.left)) * file.fileIdRatio) + 'px',
                                'left': ((file.fileIdPos.left - $('#plain').offset().left) + (clientX - file.fileIdPos.left)) + 'px',
                                'width': file.fileIdWidth - (clientX - file.fileIdPos.left) + 'px',
                            });
                            console.log('mousedown is called');
                        }


                        if (flgs.re.right_top_flg == true) {
                            file.$fileId.css({
                                'top': (file.fileIdPos.top - $('#plain').offset().top) + (file.fileIdHeight - (clientX - file.fileIdPos.left) * file.fileIdRatio) + 'px',
                                'left': (file.fileIdPos.left - $('#plain').offset().left) + 'px',
                                'width': (clientX - file.fileIdPos.left) + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.re.right_bottom_flg == true) {
                            file.$fileId.css({
                                'top': (file.fileIdPos.top - $('#plain').offset().top) + 'px',
                                'left': (file.fileIdPos.left - $('#plain').offset().left) + 'px',
                                'width': (clientX - file.fileIdPos.left) + 'px',
                            });
                            // console.log('down one is called');
                        }


                        if (flgs.re.left_bottom_flg == true) {
                            file.$fileId.css({
                                'top': (file.fileIdPos.top - $('#plain').offset().top) + 'px',
                                'left': ((file.fileIdPos.left - $('#plain').offset().left) + (clientX - file.fileIdPos.left)) + 'px',
                                'width': file.fileIdWidth - (clientX - file.fileIdPos.left) + 'px',
                            });
                            // console.log('down one is called');
                        }
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
        main();


    };
    canvasEve();
})(window, jQuery);