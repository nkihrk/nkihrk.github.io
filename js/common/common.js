(function (window, $) {
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


        // Prefix for .menu and .content
        const prefixForMenuContent = function () {
            const $menu = $('.menu.column');
            const $header = $('header');
            const $footer = $(`footer`);


            // Prefix for the position of footer
            const bottomOffsetHeader = $header.outerHeight();
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


        };
        prefixForMenuContent();


        // Prefix for content-block and synchronize the pos with .sub-menu
        const contentBlock = function () {
            const $content = $('.content');
            const $contentBlock = $('.content-block');
            const marginTop = ($content.width() - $contentBlock.outerWidth()) / 2.0;
            $contentBlock.css({
                'margin-top': marginTop + 'px',
            });
            if ($contentBlock.height() <= h) {
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


    });


    // Toggle class active-menu-trigger
    $('.sub-menu').on('click', function () {
        $('#target-menu').toggleClass('active-humberger');
        $('.menu-trigger').toggleClass('active-menu-trigger');
    });



})(window, jQuery);