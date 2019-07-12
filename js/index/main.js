(function (window, $) {
    // $(function () {
    //     // Window width and height
    //     const w = $(window).width();
    //     const h = $(window).height();


    // });


    // When loading is finished
    $(window).on('load', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();

        // Set random numbers to the status-twitter when loading has done
        const statusNum = function () {
            var t = [0, 0];
            var f = [0, 0, 0];
            var l = [0, 0];
            const $firstT = $('#first-t');
            const $secondT = $('#second-t');
            const $firstF = $('#first-f');
            const $secondF = $('#second-f');
            const $thirdF = $('#third-f');
            const $firstL = $('#first-l');
            const $secondL = $('#second-l');
            const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            const $elements = $('.status-num');
            const randomize = function () {
                return Math.floor(Math.random() * array.length);
            };
            const isFinished = function () {
                return t[0] && t[1] && f[0] && f[1] && f[2] && l[0] && l[1];
            }
            let count = 0;
            const countup = function () {
                return count++;
            }


            const id = setInterval(function () {
                const label = [array[randomize()], array[randomize()]];
                const label2 = [array[randomize()], array[randomize()], array[randomize()]];
                countup();
                if (count > 30) {
                    // Tweets
                    if (label2[0] == 2) {
                        $firstT.html('2');
                        t[0] = 1;
                        if (label2[1] == 0) {
                            if (label[2] == 8 || randomize()) {
                                $secondT.html('8');
                                t[1] = 1;
                            }
                        }
                    } else if (t[0] != 1) {
                        $firstT.html(randomize());
                    }
                    if (t[1] != 1) {
                        $secondT.html(randomize());
                    }

                    // Followers
                    if (label2[0] == 5) {
                        $firstF.html('5,');
                        f[0] = 1;
                        if (label2[1] == 4) {
                            $secondF.html('4');
                            f[1] = 1;
                            if (label2[2] == 1 || randomize()) {
                                $thirdF.html('1');
                                f[2] = 1;
                            }
                        }
                    } else if (f[0] != 1) {
                        $firstF.html(randomize());
                    }
                    if (f[1] != 1) {
                        $secondF.html(randomize());
                    }
                    if (f[2] != 1) {
                        $thirdF.html(randomize());
                    }

                    //Likes
                    if (label2[0] == 3) {
                        $firstL.html('3')
                        l[0] = 1;
                        if (label2[1] == 0) {
                            if (label2[2] == 3 || randomize()) {
                                $secondL.html('3');
                                l[1] = 1;
                            }
                        }
                    } else if (l[0] != 1) {
                        $firstL.html(randomize());
                    }
                    if (l[1] != 1) {
                        $secondL.html(randomize());
                    }

                    // Get out of the loop
                    if (isFinished()) {
                        clearInterval(id);
                    }
                } else {
                    // For the visual adjustment
                    for (i = 0; i < $elements.length; i++) {
                        if (i == 1) {
                            $firstF.html(randomize() + ',');
                            $secondF.html(randomize());
                            $thirdF.html(randomize());
                        } else {
                            $firstT.html(randomize());
                            $secondT.html(randomize());

                            $firstL.html(randomize());
                            $secondL.html(randomize());
                        }
                    }
                }
                // console.log(t);
                // console.log(f);
                // console.log(l);
            }, 10);
        };
        setTimeout(function () {
            statusNum();
        }, 1700); // Change the delay time when changing the loading time


    });

    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


        // Prefix for the position of footer
        const footer = function () {
            const $footer = $('footer');
            const $header = $('header');
            const setFooterBottom = h - $footer.height();
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

        const twitter = function () {
            // Fix the vertical margin to be the same to the horizontal margin
            const $content = $('.content');
            const $twitter = $('.twitter');
            const $contentTwitter = $('.content-twitter');
            const marginTwitter = (parseInt($content.css('width')) - parseInt($twitter.css('width'))) / 2.0;
            // Fix .twitter height due to the marginTwitter
            if ($twitter.height() < h) {
                const twitterHeight = h - marginTwitter;
                $twitter.css({
                    'height': twitterHeight + 'px',
                });
            }
            $twitter.css({
                'margin-top': marginTwitter + 'px',
            });

            // console.log($contentTwitter.height());

            // Prefix for the limit pos of content-twitter
            // const halfHeight = h / 2.0;
            // const halfContentTwitter = parseInt($contentTwitter.css('height')) / 2.0;
            // let contentTwitterTop = halfHeight - halfContentTwitter - marginTwitter;
            // if (contentTwitterTop < marginTwitter * 2.0) {
            //     contentTwitterTop = marginTwitter * 2.0;
            //     $contentTwitter.css({
            //         // 'position': 'absolute',
            //         // 'top': contentTwitterTop + 'px'
            //     });
            // } else {
            //     $contentTwitter.css({
            //         // 'position': 'static',
            //     });
            // }
        };
        twitter();


        // circlized + gradation
        circlized(w);


    });


})(window, jQuery);