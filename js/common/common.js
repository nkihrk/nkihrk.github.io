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
        const w = $(window).width();
        const h = $(window).height();

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
        const w = $(window).width();
        const h = $(window).height();


        // Prefix for .menu and .content
        const prefixForMenu = function () {
            // Insert a window height to .menu
            const $menu = $('.menu');
            $($menu).css('height', h + 'px');


            // Change a font-size according to the width of .menu
            const $largeHead = $('.large');
            // const $mediumHead = $('.medium');
            const menuWidth = parseInt($menu.css('width'));
            // 0.244 is a magic number
            const largeFont = menuWidth * 0.244;
            // const mediumFont = menuWidth * 0.11;
            $largeHead.css('font-size', largeFont + 'px');
            // $($mediumHead).css('font-size', mediumFont + 'px');
        };
        prefixForMenu();
        

        // Fix the position of .dot-line::before and fit it to the same pos of .line-border
        const dotLine = function () {
            const $dotLine = $('.dot-line');
            const $lineBorder = $('.line-border');

            // For 7, it is a magic number. I dont know why
            const lineOffset = $lineBorder.offset().left - 7.0;
            $dotLine.append('<style>.dot-line::before{ left: ' + lineOffset + 'px }</style>');
        };
        dotLine();


        // Prefix for the position of footer
        const footer = function () {
            const $footer = $('footer');
            const $header = $('header');
            const setFooterBottom = h - $footer.outerHeight();
            console.log($footer.outerHeight());
            const bottomOffsetHeader = $header.height() + $header.offset().top;
            if(bottomOffsetHeader <  setFooterBottom)
            $footer.css({
                'position': 'absolute',
                'top': setFooterBottom + 'px',
                'left': 0,
            });
            // console.log(bottomOffsetHeader);
        };
        footer();


        //?For the visual adjustment. Delete 'INTRODUCTION' when overlapping the header-twitter
        const introduction = function () {
            const $intro = $('.intro');
            const $dot = $('.dot-line-intro');

            if ($intro.offset().left < 1000) {
                $intro.css({
                    'opacity': '0',
                });
                $dot.css({
                    'opacity': '0',
                });
            } else {
                $intro.css({
                    'opacity': '1',
                });
                $dot.css({
                    'opacity': '1',
                });
            }
        };
        introduction();


    });


})(window, jQuery);