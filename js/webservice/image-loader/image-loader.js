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
                            // let imgStyle = 'position: absolute; width: 30%;';

                            console.log(e.dataTransfer.files.length);


                            reader.onload = function (e) {

                                dropImage.id += 1;
                                dropImage.flag = 0;
                                // let assertImg = '<img id ="' + dropImage.id + '" style="' + imgStyle + '">';
                                let assertImg = '<div class="img-style in-active"><img id ="' + dropImage.id + '" style="width: 100%;"></div>';
                                // $('#image').prepend(assertImg);
                                $('#image').append(assertImg);
                                const id = dropImage.id;
                                // console.log(id);
                                const img = document.getElementById(id);
                                img.src = e.target.result;
                                // console.log('done reader');

                            }
                            reader.readAsDataURL(file);
                            console.log('done');


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

                var pos1;
                var posX1;
                var posY1;
                var $imgId;

                // const resizeBoxPos = [
                //     "leftTop",
                //     "rightTop",
                //     "rightBottom",
                //     "leftBottom"
                // ];
                const resizeBox =
                    '<div class="left-top"></div>' +
                    '<div class="right-top"></div>' +
                    '<div class="right-bottom"></div>' +
                    '<div class="left-bottom"></div>';

                $(document).on('mousedown', '.img-style', function (e) {
                    // console.log('move()');

                    $('div').removeClass('selected move-pointer');
                    $('div').remove('.left-top');
                    $('div').remove('.right-top');
                    $('div').remove('.right-bottom');
                    $('div').remove('.left-bottom');

                    $(this).addClass('selected move-pointer');
                    $(this).prepend(resizeBox);


                    if (drag_flg == false) {

                        $imgId = $(this);
                        $imgId.appendTo('#image');

                        pos1 = $imgId.position();

                        // console.log($imgId);

                        posX1 = e.clientX - pos1.left;
                        posY1 = e.clientY - pos1.top;

                        drag_flg = true;
                        console.log('drag_flg true');
                    }
                });

                var down_flg = false;
                var resize_flg = false;

                var $target;
                var targetPosX;
                var targetPosY;


                $(document).on('mousedown', '.right-bottom', function (e) {
                    console.log('right-bottom detected');

                    if (down_flg == false) {
                        $target = $(this).parent();
                        targetPos = $(this).parent().position();
                        targetPosX = targetPos.left;
                        targetPosY = targetPos.top;

                        down_flg = true;
                        resize_flg = true;
                        console.log('down_flg true');
                        console.log('resize_flg true');
                    }
                });


                $(document).mouseup(function () {
                    if (drag_flg == true) {
                        drag_flg = false;
                        console.log('drag_flg false');

                    }

                    if (down_flg == true) {
                        down_flg = false;
                        console.log('down_flg false');

                    }

                    if (resize_flg == true) {
                        resize_flg = false;
                        console.log('resize_flg false');

                    }
                });


                $(document).mousemove(function (e) {
                    // Prevent from the default drag event
                    e.preventDefault();

                    if (drag_flg == true && resize_flg == false) {
                        $imgId.css('left', (e.clientX - posX1));
                        $imgId.css('top', (e.clientY - posY1));
                        console.log('drag one is called');

                    }

                    if (down_flg == true && resize_flg == true) {
                        $target.css({
                            'top': targetPosY + 'px',
                            'left': targetPosX + 'px',
                            'width': e.clientX - targetPosX + 'px',
                        });
                        console.log('down one is called');

                    }
                });
            };
            move();


        };
        imgLoader();


    });
})(window, jQuery);