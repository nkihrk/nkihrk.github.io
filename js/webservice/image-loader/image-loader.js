(function (window, $) {
    // When DOM tree is constructed
    $(function () {

        // Drag-and-Paste event
        const imgLoader = function () {

            const dragAndPaste = function () {
                console.log('dragAndPaste()');
                // Global scope
                var dropImage = {
                    'id': 0,
                    // To identify being dropped or not
                    'flag': 0,
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

                    const files = e.dataTransfer.files;

                    function readAndPreview(file) {
                        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                            const reader = new FileReader();

                            reader.onload = function (e) {

                                dropImage.id += 1;
                                dropImage.flag = 0;
                                let assertImg = '<div class="grab-pointer img-style in-active"><div class="flip-wrapper"></div><div class="rotate-wrapper"></div><img id ="' + dropImage.id + '" style="width: 100%;"></div>';
                                $('#image').append(assertImg);
                                const id = dropImage.id;
                                // console.log(id);
                                const img = document.getElementById(id);
                                img.src = e.target.result;
                                // console.log('done reader');

                            }
                            reader.readAsDataURL(file);


                            // Get mouse pos in real-time
                            $(window).mousemove(function (e) {
                                let mouseClientX = e.clientX;
                                let mouseClientY = e.clientY;
                                const imgId = '#' + dropImage.id;
                                const $img = $(imgId).parent();
                                const imgWidth = $img.width();
                                const imgHeight = $img.height();


                                if (dropImage.flag == 0) {
                                    console.log('done mousemove');
                                    $img.css({
                                        'top': mouseClientY - imgHeight / 2 + 'px',
                                        'left': mouseClientX - imgWidth / 2 + 'px',
                                    });
                                    $('div').removeClass('in-active');
                                    dropImage.flag = 1;
                                }
                            });
                        }
                    }


                    if (files) {
                        [].forEach.call(files, readAndPreview);
                    }


                }, false);
            };
            dragAndPaste();


            const move = function () {
                // console.log('move()');

                var drag_flg = false;
                var rotate_flg = false;

                var $imgStyle;
                var imgStylePos;
                var imgStylePosX;
                var imgStylePosY;

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


                    // Added a selected symbol and other functions
                    $(this).addClass('selected');
                    $(this).prepend(resizeBox);
                    if ($(this).children('.rotate-wrapper').hasClass('active')) $(this).prepend(rotateBox);

                    $(this).children('.flip-wrapper').addClass('flip-icon');
                    $(this).children('.rotate-wrapper').addClass('rotate-icon');


                    if (drag_flg == false) {
                        $imgStyle = $(this);
                        $imgStyle.appendTo('#image');
                        imgStylePos = $imgStyle.offset();
                        // Fixing Pos to be matched to the relative pos of mouse coordinates
                        imgStylePosX = e.clientX - imgStylePos.left;
                        imgStylePosY = e.clientY - imgStylePos.top;

                        drag_flg = true;
                        console.log('drag_flg is true');
                    }
                });


                // Activate flipping
                $(document).on('mousedown', '.flip-wrapper', function (e) {
                    e.stopPropagation();
                    $(this).toggleClass('active');
                    if ($(this).hasClass('active')) {
                        $(this).parent().children('img').addClass('flipped');
                    } else {
                        $(this).parent().children('img').removeClass('flipped');
                    }
                });


                //Activate rotating
                $(document).on('mousedown', '.rotate-wrapper', function (e) {
                    e.stopPropagation();
                    $(this).toggleClass('active');
                    if ($(this).hasClass('active')) {
                        if (!$(this).parent().hasClass('ro-left-top')) {
                            $(this).parent().prepend(rotateBox);
                        }

                    } else {
                        $('div').remove('.ro-left-top');
                        $('div').remove('.ro-right-top');
                        $('div').remove('.ro-right-bottom');
                        $('div').remove('.ro-left-bottom');

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


                var down_flg = false;
                var resize_flg = false;
                var left_top_flg = false;
                var right_top_flg = false;
                var right_bottom_flg = false;
                var left_bottom_flg = false;

                var $target;
                var targetWidth;
                var targetHeight;
                var targetRatio;
                var targetPosX;
                var targetPosY;

                const resize = function () {

                    const whichResizeBox = function (b, n) {
                        $(document).on('mousedown', b, function (e) {
                            console.log(b + ' is detected');

                            if (down_flg == false) {
                                $target = $(this).parent();
                                targetWidth = $target.outerWidth();
                                targetHeight = $target.outerHeight();
                                targetRatio = targetHeight / targetWidth;
                                targetPos = $(this).parent().offset();
                                targetPosX = targetPos.left;
                                targetPosY = targetPos.top;


                                down_flg = true;
                                resize_flg = true;

                                if (n == 0) left_top_flg = true;
                                if (n == 1) right_top_flg = true;
                                if (n == 2) right_bottom_flg = true;
                                if (n == 3) left_bottom_flg = true;

                                console.log('down_flg true');
                                console.log('resize_flg true');
                                console.log('left_top_flg true');
                                console.log('right_top_flg true');
                                console.log('right_bottom_flg true');
                                console.log('left_bottom_flg true');
                            }
                        });
                    };


                    whichResizeBox('.re-left-top', 0);
                    whichResizeBox('.re-right-top', 1);
                    whichResizeBox('.re-right-bottom', 2);
                    whichResizeBox('.re-left-bottom', 3);
                }
                resize();


                const rotate = function () {
                    const whichRotateBox = function (b) {
                        $(document).on('mousedown', b, function (e) {
                            e.stopPropagation();

                            console.log(b + ' is detected');
                            $target = $(this).parent();

                            if (rotate_flg == false) {
                                down_flg = true;
                                drag_flg = false;
                                rotate_flg = true;
                                console.log('drag_flg is false');
                                console.log('rotate_flg is true');
                            }

                            // targetWidth = $target.outerWidth();
                            // targetHeight = $target.outerHeight();
                            // targetRatio = targetHeight / targetWidth;
                            // targetPos = $(this).parent().offset();
                            // targetPosX = targetPos.left;
                            // targetPosY = targetPos.top;
                        });
                    }


                    whichRotateBox('.ro-left-top');
                    whichRotateBox('.ro-right-top');
                    whichRotateBox('.ro-right-bottom');
                    whichRotateBox('.ro-left-bottom');
                };
                rotate();


                // Reset flags
                $(document).mouseup(function () {
                    // When dragged
                    if (drag_flg == true) {
                        drag_flg = false;
                        console.log('drag_flg is false');

                    }

                    // When clicked
                    if (down_flg == true) {
                        down_flg = false;
                        console.log('down_flg is false');

                    }

                    // Flags for resizing
                    if (resize_flg == true) {
                        resize_flg = false;
                        console.log('resize_flg is false');

                    }
                    if (left_top_flg == true) left_top_flg = false;
                    if (right_top_flg == true) right_top_flg = false;
                    if (right_bottom_flg == true) right_bottom_flg = false;
                    if (left_bottom_flg == true) left_bottom_flg = false;

                    if (rotate_flg == true) {
                        rotate_flg = false;
                        console.log('rotate_flg is false');

                    }
                });


                $(document).mousemove(function (e) {
                    // Prevent from the default drag events
                    e.preventDefault();

                    // When an image is dragged
                    if (drag_flg == true && resize_flg == false) {
                        $imgStyle.css('left', (e.clientX - imgStylePosX));
                        $imgStyle.css('top', (e.clientY - imgStylePosY));
                        console.log('drag function is called');

                    }

                    // When an image is rotated
                    if (drag_flg == false && resize_flg == false && rotate_flg == true) {

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
                    if (down_flg == true && resize_flg == true && left_top_flg == true) {
                        $target.css({
                            'top': targetPosY + (targetHeight - (targetWidth - (e.clientX - targetPosX)) * targetRatio) + 'px',
                            'left': e.clientX + 'px',
                            'width': targetWidth - (e.clientX - targetPosX) + 'px',
                        });
                        console.log('mousedown is called');

                    }

                    if (down_flg == true && resize_flg == true && right_top_flg == true) {
                        $target.css({
                            'top': targetPosY + (targetHeight - (e.clientX - targetPosX) * targetRatio) + 'px',
                            'left': targetPosX + 'px',
                            'width': e.clientX - targetPosX + 'px',
                        });
                        // console.log('down one is called');

                    }

                    if (down_flg == true && resize_flg == true && right_bottom_flg == true) {
                        $target.css({
                            'top': targetPosY + 'px',
                            'left': targetPosX + 'px',
                            'width': e.clientX - targetPosX + 'px',
                        });
                        // console.log('down one is called');

                    }

                    if (down_flg == true && resize_flg == true && left_bottom_flg == true) {
                        $target.css({
                            'top': targetPosY + 'px',
                            'left': targetPosX + (e.clientX - targetPosX) + 'px',
                            'width': targetWidth - (e.clientX - targetPosX) + 'px',
                        });
                        // console.log('down one is called');

                    }
                });
            };
            move();


        };
        imgLoader();


    });
})(window, jQuery);