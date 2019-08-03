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


        // Loading Gif.
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


        const scrollTop = function () {
            const $btn = $('#scroll-top');
            $btn.click(function () {
                $('body, html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        };
        if ($('#scroll-top').length) {
            scrollTop();
        }


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

            // $activeMenu.parent() = <span></span>
            $activeMenu.parent().addClass('active-current-page');

            $('.active-current-page>.menu-li-common').css('opacity', 1);
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


            // For 70, its the sum of padding-top and padding-bottom of .menu-li-common, and also footer`s margin-top value 20
            if (bottomOffsetHeader + 70 >= h) {
                $footer.css({
                    'position': 'static',
                    // 'top': bottomOffsetHeader + 50 - $footer.height() + 'px',
                });
            }
            if (bottomOffsetHeader + 70 < h) {
                $footer.css({
                    'position': 'absolute',
                    // For 21, it is a margin-top value of footer. Just for optical adjustment
                    'top': h - $footer.height() - 21 + 'px',
                });
            }


            // Set content-block height same to window height when smaller than window height.
            if (contentBlockHeight < h) {
                $contentBlock.css({
                    'height': contentBlockHeightFull + 'px',
                });
            }


            // This will configure the height of toolbar on safari
            $('#loading').css('height', window.innerHeight + 'px');

            // Prefix for menu height to exclude the height of toolbar on safari
            $('.menu-block-scrollbar-hidden').css('height', window.innerHeight + 'px');


        };
        prefixForMenuContent();


        // execute circlized() when there is .circlized class
        if ($('div').hasClass('circlized')) circlized(w);


        // Check heights of detail-text-column-content-post, and exclude input, label and .expand when less than a specific height
        const excludeExpand = function () {
            let $detailText = $('.detail-text-column-content-post');

            $detailText.each(function () {
                if ($(this).height() < 60) {
                    let text = $(this).text();
                    $(this).parent().parent().empty().text(text);
                    // console.log('less than 60px');
                    // console.log(text);
                } else {
                    // console.log('larger than 60px');
                }
                // console.log('Height of the detailText is ' + $(this).height() + 'px');
                // console.log('--------------------');
            });
        };
        excludeExpand();


    });


    // Toggle class active-menu-trigger
    $('.sub-menu').on('click', function () {
        $('#target-menu').toggleClass('active-humberger');
        $('.menu-trigger').toggleClass('active-menu-trigger');
        if ($('.menu-trigger').hasClass('active-menu-trigger')) {
            $('.content').css('position', 'fixed');
        } else {
            $('.content').css('position', 'absolute');
        }
    });



})(window, jQuery);