(function ($) {
    const dndEve = () => {
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

            var clientX = e.clientX - $('#plain').offset().left;
            var clientY = e.clientY - $('#plain').offset().top;

            const files = e.dataTransfer.files;
            const readAndPreview = function (file) {
                if (/\.(jpe?g|png|gif|webm|mp4)$/i.test(file.name)) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        newFile.prevId = newFile.id;
                        newFile.id += 1;
                        // console.log('newFile.id : ' + newFile.id + ', newFile.flg  : ' + newFile.flg);
                        const imgTag = '<img src="' + e.target.result + '" style="width: 100%;">';
                        const videoTag = '<video controls playsinline preload="metadata" style="width: 100%;">' +
                            '<source src="' + e.target.result + '" type="video/webm">' +
                            '<source src="' + e.target.result + '" type="video/mp4">' +
                            '</video>';
                        const resTag = /\.(jpe?g|png|gif)$/i.test(file.name) ? imgTag : videoTag;
                        const funcTags = '<div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>'
                        const assertFile = '<div id ="' + newFile.id + '" class="grab-pointer file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="is-flipped">' + resTag + '</div></div>';
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
    dndEve();
})(jQuery);