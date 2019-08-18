(function (window, $) {
    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


    });


    $(function () {
        // Insert a JSON data to post-columns
        $.getJSON("/js/common/json/webservice.json", function (webservice_list) {
            const webservice = webservice_list;
            insertPost(webservice);
        });
    });


})(window, jQuery);