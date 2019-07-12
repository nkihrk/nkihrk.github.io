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
        const loadingLast = function () {
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


        // Prefix for .content
        const prefixForContent = function () {
            const $menu = $('.menu');
            const $content = $('.content');
            const ratioMenu = menuParam.ratioMenu;
            const ratioContent = 100 - ratioMenu;
            const minWindowWidth = menuParam.minWidth * 100 / ratioMenu;
            const maxWindowWidth = menuParam.maxWidth * 100 / ratioMenu;
            console.log(minWindowWidth);


            if (w < minWindowWidth) {
                $menu.css({
                    'width': menuParam.minWidth,
                    'height': h + 'px',
                });
                $content.css({
                    'width': w - menuParam.minWidth,
                    'margin-left': menuParam.minWidth,
                });
                console.log("a" + $menu.height());
            } else if (w > minWindowWidth && w < maxWindowWidth) {
                $menu.css({
                    'width': ratioMenu + '%',
                    'height': h + 'px',
                });
                $content.css({
                    'width': ratioContent + '%',
                    'margin-left': ratioMenu + '%',
                });
                console.log("b" + $menu.height());
            } else if (w > maxWindowWidth) {
                $menu.css({
                    'width': menuParam.maxWidth,
                    'height': h + 'px',
                });
                $content.css({
                    'width': w - menuParam.maxWidth,
                    'margin-left': menuParam.maxWidth,
                });
                console.log("c" + $menu.height());
            }
        };
        prefixForContent();


        // Prefix for .menu
        const prefixForMenu = function () {
            // Insert a window height to .menu
            const $menu = $('.menu');
            $($menu).css('height', h + 'px');

            // Change a font-size according to the width of .menu
            const $largeHead = $('.large');
            const $mediumHead = $('.medium');
            const menuWidth = parseInt($menu.css('width'));
            // 0.244 and 0.13 are magic numbers
            const largeFont = menuWidth * 0.244;
            const mediumFont = menuWidth * 0.13;
            $largeHead.css('font-size', largeFont + 'px');
            $($mediumHead).css('font-size', mediumFont + 'px');
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