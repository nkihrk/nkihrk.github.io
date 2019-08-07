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


                    if (dropImage.flag == 0) {
                        reader.onload = function (e) {

                            dropImage.id += 1;
                            dropImage.flag = 0;
                            // let assertImg = '<img id ="' + dropImage.id + '" style="' + imgStyle + '">';
                            let assertImg = '<div id="test_box" style="position: absolute; width: 30%;"><img id ="' + dropImage.id + '" style="width: 100%;"></div>';
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
                    }


                    // Get mouse pos in real-time
                    $(window).mousemove(function (e) {
                        let mouseClientX = e.clientX;
                        let mouseClientY = e.clientY;
                        const imgId = '#' + dropImage.id;
                        // const $img = $(imgId);
                        const $img = $('#test_box');
                        // const imgWidth = $(imgId).width();
                        // const imgHeight = $(imgId).height();
                        const imgWidth = $img.width();
                        const imgHeight = $img.height();


                        if (dropImage.flag == 0) {
                            // console.log('done mousemove');
                            $img.css({
                                'top': mouseClientY - imgHeight / 2 + 'px',
                                'left': mouseClientX - imgWidth / 2 + 'px'
                            });
                            // $img.wrap('<div id="test_box" style="position: absolute; width: 30%;"></div>');
                            dropImage.flag = 1;
                        }
                    });


                }, false);
            };
            dragAndPaste();


            const move = function () {
                console.log('move()');

                //ドラッグフラグ
                var drag_flg = false;
                //マウスダウンの位置
                var pos1;
                var pos2;
                //要素位置の修正値
                var posX1;
                var posY1;

                //要素内でマウスボタンが押された場合
                $(document).on('mousedown', '#test_box', function (evt1) {
                    console.log('move()');

                    //ドラッグ判定（ドラッグしてない場合）
                    if (drag_flg == false) {

                        //要素の位置取得
                        pos1 = $("#test_box").position();
                        //要素位置を取得して修正値を計算
                        posX1 = evt1.clientX - pos1.left;
                        posY1 = evt1.clientY - pos1.top;

                        //ドラッグ中にする
                        drag_flg = true;

                        //ドラッグ中の場合
                    } else if (drag_flg == true) {

                        //要素のドラッグを解除
                        drag_flg = false;
                    }
                });

                //ドキュメント上でマウスポインタが動いた場合
                $(document).mousemove(function (evt2) {
                    //ドラッグ中の場合
                    if (drag_flg == true) {
                        //要素位置をCSSで設定
                        $("#test_box").css("left", (evt2.clientX - posX1));
                        $("#test_box").css("top", (evt2.clientY - posY1));
                    }
                });
            };
            move();


        };
        imgLoader();


    });
})(window, jQuery);