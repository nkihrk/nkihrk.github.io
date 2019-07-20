(function (window, $) {
    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


        // circlized + gradation
        circlized(w);


    });
})(window, jQuery);