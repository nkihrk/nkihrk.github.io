(function (window, $) {
    // When DOM tree is constructed
    $(function () {

        // Add youtube videos to the canvas
        const youtubeEve = () => {
            // Global scope variables, flags and functions
            var flgs = {
                'is_clicked_twice_flg': false,
            };

            var tmp = {
                'clickedNum': 0,
            };

            const handlePropagation = (e) => {
                e.stopPropagation();
            };

            // For the iframe pointer problem
            const iframePointerNone = function () {
                $('iframe').css('pointer-events', 'none');
            };
            const iframePointerReset = function () {
                $('iframe').css('pointer-events', '');
            };

            const handleDragEvent = function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            };


            // Initialize variables
            const initVar = () => {};

            // Configuring flags
            const flags = () => {};

            // Functions to execute. Main program
            const functions = () => {

                const addYoutube = () => {
                    $(document).on('mousedown', '.search-button-youtube', function () {});
                    $(document).on('mousedown', '.child-search-button-youtube', function () {});
                };
                addYoutube();

                const searchBox = () => {
                    // Stop propagation
                    // $(document).on('mousedown', '.search-youtube', handlePropagation);
                    // $(document).on('mousedown', '.child-search-youtube', handlePropagation);

                    $(document).on('mousedown', '.tab-block-youtube', iframePointerNone);
                    $(document).on('mouseup', '.tab-block-youtube', iframePointerReset);
                    $(document).on('mousedown', '.child-search-youtube', iframePointerNone);
                    $(document).on('mouseup', '.child-search-youtube', iframePointerReset);

                    // Reset the value of the selected input
                    $(document).on('mousedown', '.backspace-icon', function (e) {
                        console.log('mousedown .backspace-icon is detected.');
                        $(this).parent().children('input').val('');
                    });

                    $(document).on('mousedown', '.search-button-youtube', function () {
                        var url, youtubeID;
                        var input = encodeURI($(this).parent().find('input').val());
                        var isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
                        // var isUrl = input.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=[^?]*v=\w+)(?:[^\s?]+)?$/);
                        var isYoutube = input.match(/youtube/);
                        if (input && isUrl && isYoutube) {
                            url = input;
                            youtubeID = url.split('v=')[1];
                            youtubeID = youtubeID.split('&')[0];
                            console.log('youtubeID', youtubeID);

                            newFile.prevId = newFile.id;
                            newFile.id += 1;
                            HIGHEST_Z_INDEX += 1;

                            const iframeTag = '<iframe src="https://www.youtube.com/embed/' + youtubeID + '?rel=0&showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                            const assertFile = '<div id="' + newFile.id + '" class="grab-pointer file-wrap" style="width: 700px; top: 33%; left: calc(50% - 350px); z-index:' + HIGHEST_Z_INDEX + ';">' +
                                '<div class="function-wrapper">' +
                                '<div class="resize-wrapper"></div>' +
                                '<div class="rotate-wrapper"></div>' +
                                '<div class="flip-wrapper"></div>' +
                                '<div class="trash-wrapper"></div>' +
                                '</div>' +
                                '<div class="is-flipped youtube-wrapper" style="width: 100%;">' +
                                '<div class="tab-block-youtube" style="position: relative;">' +
                                '<div class="fix-top-border">' +
                                '<div class="ellipsis tab-youtube bold agency-fb">' +
                                'The API Key is missing; the key is needed to show a name of the now-playing video properly.' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="child-search-youtube" style="position: relative;">' +
                                '<div class="child-search-box-wrapper" style="position: relative;">' +
                                '<input value="' + url + '" class="ellipsis child-search-box-youtube" placeholder="Paste a URL of any YouTube videos here." type="text" spellcheck="false" style="position: relative;">' +
                                '<div class="backspace-icon"></div>' +
                                '</div>' +
                                '<div class="hover-shadow-single child-search-button-youtube" style="position: relative;"></div>' +
                                '</div>' +
                                '<div class="content-youtube">' +
                                iframeTag +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            $('#add-files').append(assertFile);
                        } else {}
                        console.log('URL', url);
                    });


                    $(document).on('mousedown', '.child-search-button-youtube', function () {
                        var input = encodeURI($(this).parent().find('input').val());
                        var isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
                        var isYoutube = input.match(/youtube/);
                        if (input && isUrl && isYoutube) {
                            url = input;
                            youtubeID = url.split('v=')[1];
                            youtubeID = youtubeID.split('&')[0];

                            $(this).parents('.youtube-wrapper').find('iframe').attr('src', 'https://www.youtube.com/embed/' + youtubeID + '?rel=0&showinfo=0');

                        } else {}
                    });
                };
                searchBox();
            };

            // Execute functions
            const executed = () => {
                initVar();
                flags();
                functions();
            };
            executed();
        };
        youtubeEve();


    });
})(window, jQuery);