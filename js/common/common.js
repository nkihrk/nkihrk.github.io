(function (window, $) {
    // Global field

    // Reloding when resizing
    // var timer = false;
    // var prewidth = $(window).width();
    // $(window).resize(function () {
    //     if (timer !== false) {
    //         clearTimeout(timer);
    //     }
    //     timer = setTimeout(function () {
    //         var nowWidth = $(window).width();
    //         if (prewidth !== nowWidth) {
    //             // ????
    //             location.reload();
    //         }
    //         prewidth = nowWidth;
    //     }, 200);
    // });


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
        // const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const h = $(window).height();
        // const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight


        // Prefix for .menu and .content
        const prefixForMenuContent = function () {
            const $menu = $('.menu');
            const $header = $('header');
            const $footer = $(`footer`);
            const $content = $('.content');
            const $menuBlock = $('.menu-block');
            const ratioMenu = menuParam.ratioMenu;
            const ratioContent = 100 - ratioMenu;
            const minWindowWidth = menuParam.minWidth * 100 / ratioMenu;
            const maxWindowWidth = menuParam.maxWidth * 100 / ratioMenu;


            // Prefix for the position of footer
            const setFooterBottom = h - $footer.outerHeight();
            const bottomOffsetHeader = $header.outerHeight();
            const innerHeight = $(window).innerHeight();
            const contentHeight = $('.content').outerHeight(true);

            if (bottomOffsetHeader > h) {
                $menu.css({
                    'height': contentHeight + 'px',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                });
                $footer.css({
                    'top': contentHeight - $footer.height() + 'px',
                });
            } else {
                $menu.css({
                    'position': 'fixed',
                    'height': h + 'px',
                });
                $footer.css({
                    'position': 'absolute',
                    'top': h - $footer.height() + 'px',
                });
            }
            


            // Configuring width
            if (w < commonParam.maxWidthForPhone) {
                $menu.css({
                    'display': 'none',
                    'height': contentHeight + 'px',
                });
                $header.css({
                    'display': 'none',
                });
                $footer.css({
                    'display': 'none',
                });
                $content.css({
                    'width': 100 + '%',
                    'margin-left': 0,
                });
                $('.sub-menu').css('opacity', 1);
            }
            if (w >= commonParam.maxWidthForPhone && w < minWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': menuParam.minWidth,
                });
                $header.css({
                    'display': 'block',
                });
                $footer.css({
                    'display': 'block',
                });
                $content.css({
                    'width': w - menuParam.minWidth,
                    'margin-left': menuParam.minWidth,
                });
                $('.sub-menu').css('opacity', 0);
            }
            if (w >= minWindowWidth && w < maxWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': ratioMenu + '%',
                });
                $header.css({
                    'display': 'block',
                });
                $footer.css({
                    'display': 'block',
                });
                $content.css({
                    'display': 'block',
                    'width': ratioContent + '%',
                    'margin-left': ratioMenu + '%',
                });
                $('.sub-menu').css('opacity', 0);
            }
            if (w >= maxWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': menuParam.maxWidth,
                });
                $header.css({
                    'display': 'block',
                });
                $footer.css({
                    'display': 'block',
                });
                $content.css({
                    'width': w - menuParam.maxWidth,
                    'margin-left': menuParam.maxWidth,
                });
                $('.sub-menu').css('opacity', 0);
            }


            // Change a font-size according to the width of .menu
            const $largeHead = $('.large');
            const $mediumHead = $('.medium');
            const menuWidth = $menu.width();
            // 0.244 and 0.13 are magic numbers
            const largeFont = menuWidth * 0.244;
            const mediumFont = menuWidth * 0.13;
            $largeHead.css('font-size', largeFont + 'px');
            $mediumHead.css('font-size', mediumFont + 'px');


        };
        prefixForMenuContent();


        // Prefix for content-block and synchronize the pos with .sub-menu
        const contentBlock = function () {
            const $content = $('.content');
            const $contentBlock = $('.content-block');
            // const marginTop = ($content.width() - $contentBlock.width() - 12.0) / 2.0;
            const marginTop = ($content.width() - $contentBlock.outerWidth()) / 2.0;
            $contentBlock.css({
                'margin-top': marginTop + 'px',
            });
            if ($contentBlock.height() <= h) {
                // const contentBlockHeight = h - (($content.width() - $contentBlock.width()) / 2.0);
                const contentBlockHeight = h - marginTop;
                $contentBlock.css({
                    'height': contentBlockHeight + 'px',
                });
            }


            // Set the pos of .sub-menu
            const $subMenu = $('.sub-menu');
            $subMenu.css({
                'top': marginTop + 5.5 + 'px',
                'right': marginTop + 5.5 + 'px',
            });
        };
        contentBlock();


        // Fix the position of .dot-line::before and fit it to the same pos of .line-border
        const dotLine = function () {
            const $dotLine = $('.dot-line');
            const $lineBorder = $('.line-border');

            // For 7, it is a magic number. I dont know why
            const lineOffset = $lineBorder.offset().left - 7.0;
            $dotLine.append('<style>.dot-line::before{ left: ' + lineOffset + 'px }</style>');
        };
        dotLine();


        // For the visual adjustment. Delete 'INTRODUCTION' when overlapping the header-twitter
        const introduction = function () {
            const $intro = $('.intro');
            const $dot = $('.dot-line-intro');

            if ($intro.offset().left <= 1000) {
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


    // Toggle class active-menu-trigger
    $('.sub-menu').on('click', function () {
        $('.menu-trigger').toggleClass('active-menu-trigger');
        if ($('.menu-trigger').hasClass('active-menu-trigger')) {
            $('.menu.column').css({
                'position': 'absolute',
                'overflow': 'hidden',
                'height': $('.content').outerHeight(true),
            }).show().animate({
                width: '70%'
            });
            $('header').delay(100).fadeIn();
            // $('.content').fadeOut();
            return false;
        } else {
            // $('.content').fadeIn();
            $('header').fadeOut();
            $('.menu.column').delay(100).css({
                'position': 'fixed',
                'overflow': '',
            }).animate({
                width: '0%'
            });
            return false;
        }
    });


})(window, jQuery);