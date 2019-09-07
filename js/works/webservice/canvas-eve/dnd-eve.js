(function ($) {
    // Copy and Paste events
    const cnpEve = () => {
        const canvasEveWrap = document.getElementById("canvas-eve-wrapper");
        canvasEveWrap.addEventListener('paste', handlePasteEvent, false);

        function handlePasteEvent(e) {
            var imgFile = null;
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
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

            const $prog = $('#progress-bar');

            const PSD = require('psd');

            const readAndPreview = function (file) {
                if (/\.(jpe?g|png|gif|svg|psd)$/i.test(file.name)) {
                    const fileReader = function (file) {
                        return new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.onloadstart = function (e) {
                                $prog.addClass('loading');
                            };
                            reader.onprogress = function (e) {
                                if (e.lengthComputable) {
                                    var percentLoaded = Math.round((e.loaded / e.total) * 100);
                                    if (percentLoaded < 100) {
                                        $prog.css('width', percentLoaded + '%');
                                    }
                                }
                            };
                            reader.onload = function (e) {
                                $prog.css('width', 100 + '%');
                                setTimeout(function () {
                                    $prog.removeClass('loading');
                                }, 1000);

                                const img = new Image();
                                img.style.cssText = 'width: 100%;'
                                if (/\.(psd)$/i.test(file.name)) {
                                    var psd = new PSD(new Uint8Array(e.target.result));
                                    psd.parse();
                                    img.src = psd.image.toBase64();
                                } else {
                                    img.src = e.target.result;
                                }

                                return resolve(img);
                            };
                            reader.onerror = reject;
                            if (/\.(psd)$/i.test(file.name)) {
                                return reader.readAsArrayBuffer(file);
                            } else {
                                return reader.readAsDataURL(file);
                            }
                        });
                    };

                    fileReader(file).then(function (img) {
                        newFile.id += 1;
                        HIGHEST_Z_INDEX += 1;


                        const canvas = '<canvas></canvas>';
                        const funcTags = '<div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
                        const assertFile = '<div id ="' + newFile.id + '" class="file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="is-flipped">' + canvas + '</div></div>';
                        $('#add-files').append(assertFile);


                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        const imgRatio = imgHeight / imgWidth;


                        const fileId = '#' + newFile.id;
                        const $fileId = $(fileId);


                        $(fileId + ' canvas').attr('width', 598);
                        $(fileId + ' canvas').attr('height', 598 * imgRatio);
                        $(fileId + ' canvas')[0].getContext('2d').drawImage(img, 0, 0, 598, 598 * imgRatio);


                        $fileId.css({
                            'left': left * mouseWheelVal - 600 / 2 + 'px',
                            'top': top * mouseWheelVal - 600 * imgRatio / 2 + 'px',
                            'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                            'z-index': HIGHEST_Z_INDEX,
                        });



                        // For colpick-eve.js
                        if ($('#toggle-colpick').length > 0) {
                            if (!$('#toggle-colpick').hasClass('active')) {
                                $fileId.addClass('grab-pointer');
                            }
                        } else {
                            $fileId.addClass('grab-pointer');
                        }


                        $('#' + newFile.id + ' .is-flipped').prepend(img);


                    });
                } else {
                    return;
                }
            }
            readAndPreview(imgFile);
        }


    };
    cnpEve();


    // Drag and Drop events
    const dndEve = () => {
        // The canvas-eve-wrapper area to paste
        const canvasEveWrap = document.getElementById("canvas-eve-wrapper");
        canvasEveWrap.addEventListener('dragover', handleDragEvent, false);
        canvasEveWrap.addEventListener('drop', handleDropEvent, false);

        function handleDragEvent(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            // Not clear why this will help. Should have to reset pointer-events, but still works fine
            $('iframe').css('pointer-events', 'none');
        }

        function handleDropEvent(e) {
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

            const $prog = $('#progress-bar');

            const PSD = require('psd');

            const files = e.dataTransfer.files;
            const readAndPreview = function (file) {
                if (/\.(jpe?g|png|gif|svg|psd)$/i.test(file.name)) {
                    const fileReader = function (file) {
                        return new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.onloadstart = function (e) {
                                $prog.addClass('loading');
                            };
                            reader.onprogress = function (e) {
                                if (e.lengthComputable) {
                                    var percentLoaded = Math.round((e.loaded / e.total) * 100);
                                    if (percentLoaded < 100) {
                                        $prog.css('width', percentLoaded + '%');
                                    }
                                }
                            };
                            reader.onload = function (e) {
                                $prog.css('width', 100 + '%');
                                setTimeout(function () {
                                    $prog.removeClass('loading');
                                }, 1000);

                                const img = new Image();
                                img.style.cssText = 'width: 100%;'
                                if (/\.(psd)$/i.test(file.name)) {
                                    var psd = new PSD(new Uint8Array(e.target.result));
                                    psd.parse();
                                    img.src = psd.image.toBase64();
                                } else {
                                    img.src = e.target.result;
                                }

                                return resolve(img);
                            };
                            reader.onerror = reject;
                            if (/\.(psd)$/i.test(file.name)) {
                                return reader.readAsArrayBuffer(file);
                            } else {
                                return reader.readAsDataURL(file);
                            }
                        });
                    };

                    fileReader(file).then(function (img) {
                        newFile.id += 1;
                        HIGHEST_Z_INDEX += 1;

                        // Currently not supporting video
                        // const videoTag = '<video controls playsinline preload="metadata" style="width: 100%;">' +
                        //     '<source src="' + dataUrl + '" type="video/webm">' +
                        //     '<source src="' + dataUrl + '" type="video/mp4">' +
                        //     '</video>';
                        // const resTag = /\.(jpe?g|png|gif|svg)$/i.test(file.name) ? imgTag : videoTag;
                        const canvas = '<canvas></canvas>';
                        const funcTags = '<div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
                        const assertFile = '<div id ="' + newFile.id + '" class="file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="is-flipped">' + canvas + '</div></div>';
                        $('#add-files').append(assertFile);


                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        const imgRatio = imgHeight / imgWidth;


                        const fileId = '#' + newFile.id;
                        const $fileId = $(fileId);


                        $(fileId + ' canvas').attr('width', 598);
                        $(fileId + ' canvas').attr('height', 598 * imgRatio);
                        $(fileId + ' canvas')[0].getContext('2d').drawImage(img, 0, 0, 598, 598 * imgRatio);


                        $fileId.css({
                            'left': left * mouseWheelVal - 600 / 2 + 'px',
                            'top': top * mouseWheelVal - 600 * imgRatio / 2 + 'px',
                            'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                            'z-index': HIGHEST_Z_INDEX,
                        });



                        // For colpick-eve.js
                        if ($('#toggle-colpick').length > 0) {
                            if (!$('#toggle-colpick').hasClass('active')) {
                                $fileId.addClass('grab-pointer');
                            }
                        } else {
                            $fileId.addClass('grab-pointer');
                        }


                        $('#' + newFile.id + ' .is-flipped').prepend(img);


                    });
                } else {
                    return;
                }
            };
            if (files.length > 0) {
                [].forEach.call(files, readAndPreview);
            } else {
                return;
            }
        }


    };
    dndEve();
})(jQuery);