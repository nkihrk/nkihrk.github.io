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

                    $(document).on('mousedown', '.search-button-youtube', function (e) {
                        var url;
                        var input = encodeURI($(this).parent('.content-youtube').children('input').val());
                        var isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
                        if (input && isUrl) url = input;
                        // console.log('URL', url);
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