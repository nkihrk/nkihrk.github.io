(function (window, $) {
    // When DOM tree is constructed
    $(function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


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
                    const file = e.dataTransfer.files[0];
                    const reader = new FileReader();
                    // let imgStyle = 'position: absolute; width: 30%;';


                    // if (dropImage.flag == 0) {
                    reader.onload = function (e) {

                        dropImage.id += 1;
                        dropImage.flag = 0;
                        // let assertImg = '<img id ="' + dropImage.id + '" style="' + imgStyle + '">';
                        let assertImg = '<div class="img-style"><img id ="' + dropImage.id + '" style="width: 100%;"></div>';
                        // $('#image').prepend(assertImg);
                        $('#image').append(assertImg);
                        const id = dropImage.id;
                        // console.log(id);
                        const img = document.getElementById(id);
                        img.src = e.target.result;
                        // console.log('done reader');

                    }
                    reader.readAsDataURL(file);
                    // console.log('done');
                    // }


                    // Get mouse pos in real-time
                    $(window).mousemove(function (e) {
                        let mouseClientX = e.clientX;
                        let mouseClientY = e.clientY;
                        const imgId = '#' + dropImage.id;
                        const $img = $(imgId).parent();
                        const imgWidth = $img.width();
                        const imgHeight = $img.height();


                        if (dropImage.flag == 0) {
                            // console.log('done mousemove');
                            $img.css({
                                'top': mouseClientY - imgHeight / 2 + 'px',
                                'left': mouseClientX - imgWidth / 2 + 'px'
                            });
                            dropImage.flag = 1;
                        }
                    });


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

                $(document).on('mousedown', '.img-style', function (evt1) {
                    // console.log('move()');

                    if (drag_flg == false) {

                        $imgId = $(this);

                        pos1 = $imgId.position();
                        // console.log($imgId);

                        posX1 = evt1.clientX - pos1.left;
                        posY1 = evt1.clientY - pos1.top;

                        drag_flg = true;
                    }
                });

                $(document).on('mouseup', '.img-style', function (evt2) {
                    if (drag_flg == true) {
                        drag_flg = false;
                    }
                });

                $(document).mousemove(function (evt3) {
                    // Prevent the default drag event
                    evt3.preventDefault();

                    if (drag_flg == true) {
                        $imgId.css("left", (evt3.clientX - posX1));
                        $imgId.css("top", (evt3.clientY - posY1));
                    }
                });
            };
            move();


        };
        imgLoader();


    });
})(window, jQuery);