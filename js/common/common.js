(function (window, $) {
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

        // add line-through to .webservice-menu. Just for the limited time
        const lineThrough = function () {
            const $webService = $('.webservice-menu');
            $webService.css({
                'text-decoration': 'line-through',
            });
        }
        lineThrough();

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


        // Add class .active-current-page to a accurate link
        const activeCurrentPage = function () {
            const getFileName = function () {
                const fileName = window.location.href.split('/').pop();
                const pageNameHtml = fileName.replace('#', '');
                const pageName = pageNameHtml.split('.')[0];
                return pageName;
            };

            const whichName = window.location.href.split('/')[3];
            let join = whichName + '-menu';
            if (getFileName() == 'index' || getFileName() == '') join = 'twitter' + '-menu';
            const $activeMenu = $('.' + join);

            $activeMenu.addClass('active-current-page');
        };
        activeCurrentPage();


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
            const $content = $('.content');
            const $contentBlock = $('.content-block');
            const $contentCommon = $('.content-common');
            const $subMenu = $('.sub-menu');

            const bottomOffsetHeader = $header.outerHeight(true);
            const contentHeight = $('.content').outerHeight(true);

            const marginTop = ($content.width() - $contentBlock.outerWidth()) / 2.0;
            const contentBlockHeight = $contentBlock.outerHeight(true);
            const contentBlockHeightFull = h - marginTop;
            const contentBlockHeightBottomOffset = marginTop + contentBlockHeight;

            // Set a specific margin to the top of .content-block
            $contentBlock.css({
                'margin-top': marginTop + 'px',
            });

            // Set the pos of .sub-menu
            $subMenu.css({
                'top': marginTop + 5.5 + 'px',
                'right': marginTop + 5.5 + 'px',
            });


            // For 45, its the sum of padding-top and padding-bottom of .menu-li-common
            if (bottomOffsetHeader + 45 > h) {
                if (bottomOffsetHeader + 45 > contentBlockHeightBottomOffset) {
                    $menu.css({
                        'height': bottomOffsetHeader + 45 + 'px',
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                    });
                    $footer.css({
                        'top': bottomOffsetHeader + 45 - $footer.height() + 'px',
                    });
                    if (contentBlockHeightBottomOffset > h) {
                        // For 1000, its the borderline-width of smart-phone and PC layout
                        if (w < 1000) {
                            $content.css({
                                // 'height': bottomOffsetHeader + 45 + 'px',
                                'position': 'relative',
                            });
                            if (contentBlockHeight <= $contentCommon.outerHeight(true)) {
                                $contentBlock.css({
                                    'height': $contentCommon.outerHeight(true) + 'px',
                                });
                            } else {
                                $contentBlock.css({
                                    'height': contentBlockHeightFull + 'px',
                                });
                            }
                        } else {
                            $content.css({
                                // 'height': bottomOffsetHeader + 45 + 'px',
                                'position': 'relative',
                            });
                            $contentBlock.css({
                                'height': bottomOffsetHeader + 45 - marginTop + 'px',
                            });
                        }
                    } else {
                        $content.css({
                            'position': 'fixed',
                        });
                        $contentBlock.css({
                            'height': contentBlockHeightFull + 'px',
                        });
                    }
                } else {
                    $menu.css({
                        'height': contentHeight + 'px',
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                    });
                    $footer.css({
                        'top': contentHeight - $footer.height() + 'px',
                    });
                }
            } else {
                $menu.css({
                    'position': 'fixed',
                    // Due to the height: 100vh; contains in .menu.column, no need to set height specifically
                    // 'height': h + 'px',
                });
                $footer.css({
                    'position': 'absolute',
                    'top': h - $footer.height() + 'px',
                });
                if (contentBlockHeightBottomOffset <= h) {
                    $content.css({
                        'position': 'relative',
                    });
                    $contentBlock.css({
                        'height': contentBlockHeightFull + 'px',
                    });
                }
            }


        };
        prefixForMenuContent();


        // execute circlized() when there is .circlized class
        if ($('div').hasClass('circlized')) circlized(w);


    });


    // Toggle class active-menu-trigger
    $('.sub-menu').on('click', function () {
        $('#target-menu').toggleClass('active-humberger');
        $('.menu-trigger').toggleClass('active-menu-trigger');
    });



})(window, jQuery);