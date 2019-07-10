(function (window, $) {
    $(function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


    });


    // When loading is finished
    $(window).on('load', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


    });

    // When loading is finished and is resized
    $(window).on('load resize', function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


        // Set random numbers to the status-twitter when loading has done
        const statusNum = function () {
            var t = [0, 0];
            var f = [0, 0, 0];
            var l = [0, 0];
            let firstT = $('#first-t');
            let secondT = $('#second-t');
            let firstF = $('#first-f');
            let secondF = $('#second-f');
            let thirdF = $('#third-f');
            let firstL = $('#first-l');
            let secondL = $('#second-l');
            let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let elements = $('.status-num');
            let randomize = function () {
                return Math.floor(Math.random() * array.length);
            };
            var isFinished = function () {
                return t[0] && t[1] && f[0] && f[1] && f[2] && l[0] && l[1];
            }
            let count = 0;
            let countup = function () {
                return count++;
            }


            const id = setInterval(function () {
                const label = [array[randomize()], array[randomize()]];
                const label2 = [array[randomize()], array[randomize()], array[randomize()]];
                countup();
                if (count > 30) {
                    for (i = 0; i < elements.length; i++) {
                        if (i == 1) {
                            if (label2[0] == 5) {
                                $(firstF).html('5,');
                                f[0] = 1;
                            } else if (f[0] != 1) {
                                $(firstF).html(randomize());
                            }

                            if (label2[1] == 4) {
                                $(secondF).html('4');
                                f[1] = 1;
                            } else if (f[1] != 1) {
                                $(secondF).html(randomize());
                            }

                            if (label2[2] == 0) {
                                $(thirdF).html('0');
                                f[2] = 1;
                            } else if (f[2] != 1) {
                                $(thirdF).html(randomize());
                            }
                        } else if (i == 0) {
                            if (label[0] == 2) {
                                $(firstT).html('2');
                                t[0] = 1;
                            } else if (t[0] != 1) {
                                $(firstT).html(randomize());
                            }

                            if (label[1] == 8) {
                                $(secondT).html('8');
                                t[1] = 1;
                            } else if (t[1] != 1) {
                                $(secondT).html(randomize());
                            }
                        } else {
                            if (label[0] == 3) {
                                $(firstL).html('3')
                                l[0] = 1;
                            } else if (l[0] != 1) {
                                $(firstL).html(randomize());
                            }

                            if (label[1] == 3) {
                                $(secondL).html('3');
                                l[1] = 1;
                            } else if (l[1] != 1) {
                                $(secondL).html(randomize());
                            }
                        }
                    }
                    if (isFinished()) {
                        clearInterval(id);
                    }
                } else {
                    for (i = 0; i < elements.length; i++) {
                        if (i == 1) {
                            $(firstF).html(randomize() + ',');
                            $(secondF).html(randomize());
                            $(thirdF).html(randomize());
                        } else {
                            $(firstT).html(randomize());
                            $(secondT).html(randomize());

                            $(firstL).html(randomize());
                            $(secondL).html(randomize());
                        }
                    }
                }

                console.log(t);
                console.log(f);
                console.log(l);
            }, 10);
        };
        setTimeout(function () {
            statusNum();
        }, 1700); // Change the delay time when changing the loading time


        const twitter = function () {
            // Fix the vertical margin to be same to the horizontal margin
            let content = $('.content');
            let twitter = $('.twitter');
            let contentTwitter = $('.content-twitter');
            let marginTwitter = (parseInt($(content).css('width')) - parseInt($(twitter).css('width'))) / 2.0;
            // Fix .twitter height due to the marginTwitter
            let twitterHeight = h - marginTwitter;
            $(twitter).css({
                'height': twitterHeight + 'px',
                'margin-top': marginTwitter + 'px'
            });

            // Prefix for the limit pos of content-twitter
            let halfHeight = h / 2.0;
            let halfContentTwitter = parseInt($(contentTwitter).css('height')) / 2.0;
            let contentTwitterTop = halfHeight - halfContentTwitter - marginTwitter;
            if (contentTwitterTop < marginTwitter * 2.0) {
                contentTwitterTop = marginTwitter * 2.0;
                $(contentTwitter).css({
                    'position': 'absolute',
                    'top': contentTwitterTop + 'px',
                });
            } else {
                $(contentTwitter).css({
                    'position': 'static',
                });
            }
        };
        twitter();


        // circlized + gradation
        circlized(w);


    });


})(window, jQuery);