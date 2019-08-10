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
                                const assertImg = '<div class="grab-pointer img-style"><div class="function-wrapper"><div class="flip-wrapper"></div><div class="rotate-wrapper"></div></div><img id ="' + newImg.id + '" src="' + e.target.result + '" style="width: 100%;"></div>';
                                $('#image').append(assertImg);
                                // console.log('reader.onload is successfully executed');
                            };
                            reader.onloadend = function (e) {
                                if (e.target.readyState == FileReader.DONE) {
                                    for (let i = newImg.prevId + 1; i < newImg.id + 1; i++) {
                                        newImg.flg = 0;
                                        var imgId = '#' + i;
                                        var $img = $(imgId).parent();
                                        var imgWidth = $img.width();
                                        var imgHeight = $img.height();
                                        // console.log('clientX : ' + clientX + ', clientY : ' + clientY + ', imgWidth : ' + imgWidth + ', imgHeight : ' + imgHeight);

                                        if (newImg.flg == 0) {
                                            $img.css({
                                                'top': clientY - imgHeight / 2 + 'px',
                                                'left': clientX - imgWidth / 2 + 'px',
                                            });
                                            newImg.flg = 1;
                                        }
                                    }
                                }


                            };
                            reader.readAsDataURL(file);
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
                var $imgStyle;
                var imgStylePos;
                var imgStylePosX;
                var imgStylePosY;

                // For the specific variables. using it to iterate the function
                var $target;
                var targetWidth;
                var targetHeight;
                var targetRatio;
                var targetPosX;
                var targetPosY;

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
                        'left_bottom_flg': false
                    },
                    'ro': {
                        'left_top_flg': false,
                        'right_top_flg': false,
                        'right_bottom_flg': false,
                        'left_bottom_flg': false
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


                // Prefix for pasted-images
                $(document).on('mousedown', '.img-style', function (e) {

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
                    $(this).addClass('selected'); // Selected border
                    $(this).prepend(resizeBox); // Resizing boxes
                    if ($(this).find('.rotate-wrapper').hasClass('active')) $(this).prepend(rotateBox); // Rotating circles

                    $(this).find('.flip-wrapper').addClass('flip-icon'); // Add flipping icon
                    $(this).find('.rotate-wrapper').addClass('rotate-icon'); // Add rotating icon


                    // Add .imgStyle to #image, and set a flag to allow free-dragging
                    if (flgs.drag_flg == false) {
                        $imgStyle = $(this);
                        $imgStyle.appendTo('#image');
                        imgStylePos = $imgStyle.offset();
                        // Fixing Pos to be matched to the relative pos of mouse coordinates
                        imgStylePosX = e.clientX - imgStylePos.left;
                        imgStylePosY = e.clientY - imgStylePos.top;

                        flgs.drag_flg = true;
                        console.log('flgs.drag_flg is true');
                    }
                });


                // Reset a selected area
                $(document).on('mousedown', '#reset-res', function () {
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
                        e.stopPropagation();
                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            $(this).parents('.img-style').children('img').addClass('flipped');
                        } else {
                            $(this).parents('.img-style').children('img').removeClass('flipped');
                        }
                    });


                    //Activate rotating
                    $(document).on('mousedown', '.rotate-wrapper', function (e) {
                        e.stopPropagation();
                        $(this).toggleClass('active');

                        if ($(this).hasClass('active')) {
                            if (!$(this).parents('.img-style').hasClass('ro-left-top')) {
                                $(this).parents('.img-style').prepend(rotateBox);
                            }
                        } else {
                            $('div').remove('.ro-left-top');
                            $('div').remove('.ro-right-top');
                            $('div').remove('.ro-right-bottom');
                            $('div').remove('.ro-left-bottom');
                        }
                    });


                };
                activate();


                // Set of functions for image
                const functions = function () {
                    // Configuring flags for resizing function
                    const resize = function () {
                        const whichResizeBox = function (b, n) {
                            $(document).on('mousedown', b, function (e) {
                                console.log(b + ' is detected');

                                if (flgs.mousedown_flg == false) {
                                    $target = $(this).parent();
                                    targetWidth = $target.outerWidth();
                                    targetHeight = $target.outerHeight();
                                    targetRatio = targetHeight / targetWidth;
                                    targetPos = $(this).parent().offset();
                                    targetPosX = targetPos.left;
                                    targetPosY = targetPos.top;


                                    flgs.mousedown_flg = true;
                                    flgs.resize_flg = true;

                                    if (n == 0) flgs.re.left_top_flg = true;
                                    if (n == 1) flgs.re.right_top_flg = true;
                                    if (n == 2) flgs.re.right_bottom_flg = true;
                                    if (n == 3) flgs.re.left_bottom_flg = true;
                                }
                            });
                        };


                        whichResizeBox('.re-left-top', 0);
                        whichResizeBox('.re-right-top', 1);
                        whichResizeBox('.re-right-bottom', 2);
                        whichResizeBox('.re-left-bottom', 3);
                    }
                    resize();


                    // Configuring flags for rotating function
                    const rotate = function () {
                        const whichRotateBox = function (b, n) {
                            $(document).on('mousedown', b, function (e) {
                                e.stopPropagation();

                                console.log(b + ' is detected');
                                $target = $(this).parent();

                                if (flgs.rotate_flg == false) {
                                    flgs.mousedown_flg = true;
                                    flgs.drag_flg = false;
                                    flgs.rotate_flg = true;
                                    // console.log('flgs.drag_flg is false');
                                    console.log('flgs.rotate_flg is true');

                                    if (n == 0) flgs.ro.left_top_flg = true;
                                    if (n == 1) flgs.ro.right_top_flg = true;
                                    if (n == 2) flgs.ro.right_bottom_flg = true;
                                    if (n == 3) flgs.ro.left_bottom_flg = true;
                                }
                            });
                        };


                        whichRotateBox('.ro-left-top', 0);
                        whichRotateBox('.ro-right-top', 1);
                        whichRotateBox('.ro-right-bottom', 2);
                        whichRotateBox('.ro-left-bottom', 3);
                    };
                    rotate();


                };
                functions();


                // Reset flags
                $(document).mouseup(function () {
                    // A flag for drag event
                    if (flgs.drag_flg == true) {
                        flgs.drag_flg = false;
                        console.log('flgs.drag_flg is false');
                    }


                    // A flag for mousedown event
                    if (flgs.mousedown_flg == true) {
                        flgs.mousedown_flg = false;
                        console.log('flgs.mousedown_flg is false');
                    }


                    // Flags for resizing
                    if (flgs.resize_flg == true) {
                        flgs.resize_flg = false;
                        console.log('flgs.resize_flg is false');
                    }
                    if (flgs.re.left_top_flg == true) flgs.re.left_top_flg = false;
                    if (flgs.re.right_top_flg == true) flgs.re.right_top_flg = false;
                    if (flgs.re.right_bottom_flg == true) flgs.re.right_bottom_flg = false;
                    if (flgs.re.left_bottom_flg == true) flgs.re.left_bottom_flg = false;

                    // A flag for rotating
                    if (flgs.rotate_flg == true) {
                        flgs.rotate_flg = false;
                        console.log('flgs.rotate_flg is false');
                    }
                });


                // Allow events when flags are in specific values
                $(document).mousemove(function (e) {
                    // Prevent from the default drag events
                    e.preventDefault();


                    // When an image is dragged
                    if (flgs.drag_flg == true && flgs.resize_flg == false) {
                        $imgStyle.css('left', (e.clientX - imgStylePosX));
                        $imgStyle.css('top', (e.clientY - imgStylePosY));
                        console.log('drag function is called');
                    }


                    // When an image is rotated
                    if (flgs.drag_flg == false && flgs.resize_flg == false && flgs.rotate_flg == true) {

                        const calcAngleDegrees = function (x, y) {
                            return Math.atan2(y, x);
                        };

                        let imgCenterPosX = $target.outerWidth() / 2 + $target.offset().left;
                        let imgCenterPosY = $target.outerHeight() / 2 + $target.offset().top;

                        let d = calcAngleDegrees(e.clientX - imgCenterPosX, e.clientY - imgCenterPosY);

                        console.log('d = ' + d);
                        // console.log('d2 = ' + d2);

                        $target.css('transform', 'rotate(' + d + 'rad)');
                        console.log('rotate function is called');
                    }


                    // When resizing-boxes are clicked
                    if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_top_flg == true) {
                        $target.css({
                            'top': targetPosY + (targetHeight - (targetWidth - (e.clientX - targetPosX)) * targetRatio) + 'px',
                            'left': e.clientX + 'px',
                            'width': targetWidth - (e.clientX - targetPosX) + 'px',
                        });
                        console.log('mousedown is called');
                    }


                    if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_top_flg == true) {
                        $target.css({
                            'top': targetPosY + (targetHeight - (e.clientX - targetPosX) * targetRatio) + 'px',
                            'left': targetPosX + 'px',
                            'width': e.clientX - targetPosX + 'px',
                        });
                        // console.log('down one is called');
                    }


                    if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.right_bottom_flg == true) {
                        $target.css({
                            'top': targetPosY + 'px',
                            'left': targetPosX + 'px',
                            'width': e.clientX - targetPosX + 'px',
                        });
                        // console.log('down one is called');
                    }


                    if (flgs.mousedown_flg == true && flgs.resize_flg == true && flgs.re.left_bottom_flg == true) {
                        $target.css({
                            'top': targetPosY + 'px',
                            'left': targetPosX + (e.clientX - targetPosX) + 'px',
                            'width': targetWidth - (e.clientX - targetPosX) + 'px',
                        });
                        // console.log('down one is called');
                    }
                });
            };
            imgSet();


        };
        canvasEve();


    });
})(window, jQuery);