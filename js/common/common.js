(function (window, $) {
    // Global field


    // When DOM tree is constructed
    $(function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


        // Loading Gif. Use promise to express rich loading page.
        const loadingFirst = function () {
            $('#container').css('display', 'none');
            $('#loader-bg, #loader').height(h).css('display', 'block');
        }
        loadingFirst();

        // Insert copyright into footer
        const year = new Date().getFullYear();
        const copyright = function () {
            let text = document.createTextNode(year + ' © NkiHrk');
            document.getElementById('copyright').appendChild(text);
        };
        copyright();


    });

    // When loading is finished
    $(window).on('load', function () {
        // Window width and height
        let w = $(window).width();
        let h = $(window).height();

        // loadingLast
        loadingLast = function () {
            $('#loader-bg').delay(900).fadeOut(800);
            $('#loading').delay(600).fadeOut(300);
            $('#container').css('display', 'block');
        }
        loadingLast();
    });


    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        let w = $(window).width();
        let h = $(window).height();


        // Insert a window height to .menu and .content
        const fixHeight = function () {
            let menu = $('.menu');
            let content = $('.content');
            $(menu).css('height', h + 'px');
            $(content).css('height', h + 'px');

            // Change a font-size according to the width of .menu
            let largeHead = $('.large');
            let mediumHead = $('.medium');
            let menuWidth = parseInt($(menu).css('width'));
            let largeFont = menuWidth * 0.244;
            let mediumFont = menuWidth * 0.1;
            $(largeHead).css('font-size', largeFont + 'px');
            $(mediumHead).css('font-size', mediumFont + 'px');
        };
        fixHeight();


    });


})(window, jQuery);