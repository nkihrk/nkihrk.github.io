(function ($) {
    // Copy and Paste events
    const cnpEve = () => {
        const canvasEve = document.getElementById("canvas-eve");
        canvasEve.addEventListener('paste', function (e) {
            var imgFile = null;
            var items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                    imgFile = items[i].getAsFile();
                    break;
                }
            }
            if (imgFile == null) {
                return;
            }

            // Init the values before executing the readAndPreview()
            const left = clientFromZoomX;
            const top = clientFromZoomY;

            const readAndPreview = function () {
                const reader = new FileReader();
                reader.onload = function (e) {
                    newFile.prevId = newFile.id;
                    newFile.id += 1;
                    // console.log('newFile.id : ' + newFile.id + ', newFile.flg  : ' + newFile.flg);
                    const imgTag = '<img src="' + e.target.result + '" style="width: 100%;">';
                    const funcTags = '<div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>'
                    const assertFile = '<div id ="' + newFile.id + '" class="grab-pointer file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="is-flipped">' + imgTag + '</div></div>';
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
                            console.log('clientX : ' + clientX + ', clientY : ' + clientY + ', fileWidth : ' + fileIdWidth + ', fileHeight : ' + fileIdHeight);

                            HIGHEST_Z_INDEX += 1;
                            if (newFile.flg == 0) {
                                $fileId.css({
                                    'left': left * mouseWheelVal - fileIdWidth / 2 + 'px',
                                    'top': top * mouseWheelVal - fileIdHeight / 2 + 'px',
                                    'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                                    // 'transform-origin': xImage + 'px ' + yImage + 'px',
                                    'z-index': HIGHEST_Z_INDEX,
                                });
                                newFile.flg = 1;
                            }
                        }
                    }
                };
                reader.readAsDataURL(imgFile);
            }
            readAndPreview();
        }, false);
    };
    cnpEve();


    // Drag and Drop events
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
        canvasEve.addEventListener('dragover', handleDragEvent, false);
        canvasEve.addEventListener('drop', function (e) {

            e.stopPropagation();
            e.preventDefault();

            // Init the values before executing the readAndPreview()
            let x, y;
            if (e.changedTouches) {
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
            const left = x - $('#zoom').offset().left;
            const top = y - $('#zoom').offset().top;

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
                                        'left': left * mouseWheelVal - fileIdWidth / 2 + 'px',
                                        'top': top * mouseWheelVal - fileIdHeight / 2 + 'px',
                                        'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                                        // 'transform-origin': xImage + 'px ' + yImage + 'px',
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