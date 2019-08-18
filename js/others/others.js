(function (window, $) {
    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


    });


    $(function () {
        // Insert a JSON data to post-columns
        $.getJSON("/js/common/json/others.json", function (others_list) {
            const others = others_list;
            insertPost(others);
        });
    });


})(window, jQuery);