(function (window, $) {
    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


    });


    $(function () {
        // Insert a JSON data to post-columns
        $.getJSON("/js/common/json/code.json", function (code_list) {
            const shader = code_list.shader;
            insertPost(shader);
        });
    });


})(window, jQuery);