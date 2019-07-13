(function (window, $) {
    // Global field

    // Reloding when resizing
    // var timer = false;
    // var prewidth = $(window).width();
    // $(window).resize(function() {
    //     if (timer !== false) {
    //         clearTimeout(timer);
    //     }
    //     timer = setTimeout(function() {
    //         var nowWidth = $(window).width();
    //         if(prewidth !== nowWidth){
    //     // ????
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
        const h = $(window).height();


        // Prefix for .content and .menu
        const prefixForContent = function () {
            const $menu = $('.menu');
            const $header = $('header');
            const $footer = $(`footer`);
            const $content = $('.content');
            const ratioMenu = menuParam.ratioMenu;
            const ratioContent = 100 - ratioMenu;
            const minWindowWidth = menuParam.minWidth * 100 / ratioMenu;
            const maxWindowWidth = menuParam.maxWidth * 100 / ratioMenu;


            if (w < 800) {
                $menu.css({
                    'display': 'none',
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
            } else if (w < minWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': menuParam.minWidth,
                    'height': h + 'px',
                });
                $content.css({
                    'width': w - menuParam.minWidth,
                    'margin-left': menuParam.minWidth,
                });
                $('.sub-menu').css('opacity', 0);
            } else if (w > minWindowWidth && w < maxWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': ratioMenu + '%',
                    'height': h + 'px',
                });
                $content.css({
                    'width': ratioContent + '%',
                    'margin-left': ratioMenu + '%',
                });
                $('.sub-menu').css('opacity', 0);
            } else if (w > maxWindowWidth) {
                $menu.css({
                    'display': 'block',
                    'width': menuParam.maxWidth,
                    'height': h + 'px',
                });
                $content.css({
                    'width': w - menuParam.maxWidth,
                    'margin-left': menuParam.maxWidth,
                });
                $('.sub-menu').css('opacity', 0);
            }
        };
        prefixForContent();


        // Prefix for content-block and synchronize the pos with .sub-menu
        const contentBlock = function () {
            const $content = $('.content');
            const $contentBlock = $('.content-block');
            // const marginTop = ($content.width() - $contentBlock.width() - 12.0) / 2.0;
            const marginTop = ($content.width() - $contentBlock.outerWidth()) / 2.0;
            console.log(marginTop);
            $contentBlock.css({
                'margin-top': marginTop + 'px',
            });
            if ($contentBlock.height() < h) {
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
            console.log(marginTop);
        };
        contentBlock();


        // Prefix for .menu
        const prefixForMenu = function () {
            // Insert a window height to .menu
            const $menu = $('.menu');
            const innerHeight = $(window).innerHeight();
            $($menu).css('height', innerHeight + 'px');
            // console.log(innerHeight);

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
            const bottomOffsetHeader = $header.outerHeight();

            $footer.css({
                'position': 'absolute',
                'top': setFooterBottom + 'px',
                'left': 0,
            });
            if (bottomOffsetHeader > setFooterBottom) {
                $footer.css({
                    'position': 'absolute',
                    'top': bottomOffsetHeader + 'px',
                    'left': 0,
                });
            }
        };
        // footer();


        // For the visual adjustment. Delete 'INTRODUCTION' when overlapping the header-twitter
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


    // Toggle class active-menu-trigger
    $('.sub-menu').on('click', function () {
        $('.menu-trigger').toggleClass('active-menu-trigger');
        if ($('.menu-trigger').hasClass('active-menu-trigger')) {
            // $('.menu.column').fadeIn();

            $('.menu.column').css({
                'position': 'absolute',
                // 'width': 650 + 'px',
            }).show().animate({
                width: '80%'
            });
            $('header').delay(100).fadeIn();
            // $('.menu.column').animate({
            //     width: '500px'
            // })
            // $('.content.column').fadeOut();
            return false;
        } else {
            // $('.menu.column').fadeOut();
            $('header').fadeOut();
            $('.menu.column').delay(100).css({
                'position': 'absolute',
                // 'width': 650 + 'px',
            }).animate({
                width: '0%'
            });
            // $('.menu.column').css({
            //     'position': 'fixed',
            //     'width': 15 + '%',
            // });
            // $('.content.column').fadeIn();
            return false;
        }
    });


})(window, jQuery);