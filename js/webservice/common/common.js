(function (window, $) {
    // When DOM tree is constructed
    $(function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();

        // Loading animation
        const loadingFirst = function () {
            $('#loader-bg, #loader').height(h).css('display', 'block');
        }
        loadingFirst();
    });


    // When loading is finished
    $(window).on('load', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();

        // loadingLast
        const loadingLast = function () {
            $('#loader-bg').delay(900).fadeOut(800, function () {
                $(this).remove();
            });
            $('#loading').delay(600).fadeOut(300, function () {
                $(this).remove();
            });
        }
        loadingLast();
    });


})(window, jQuery);