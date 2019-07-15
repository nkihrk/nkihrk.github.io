(function (window, $) {


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
            };
            let count = 0;
            const countup = function () {
                return count++;
            };


            const id = setInterval(function () {
                const label = [array[randomize()], array[randomize()]];
                const label2 = [array[randomize()], array[randomize()], array[randomize()]];
                countup();
                if (count > 30) {
                    // Tweets
                    if (label2[0] == twitterParam.tweets[0]) {
                        $firstT.html(twitterParam.tweets[0]);
                        t[0] = 1;
                        if (label2[1] == 0) {
                            if (label[2] == twitterParam.tweets[1] || randomize()) {
                                $secondT.html(twitterParam.tweets[1]);
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
                    if (label2[0] == twitterParam.followers[0]) {
                        $firstF.html(twitterParam.followers[0] + ',');
                        f[0] = 1;
                        if (label2[1] == twitterParam.followers[1]) {
                            $secondF.html(twitterParam.followers[1]);
                            f[1] = 1;
                            if (label2[2] == twitterParam.followers[2] || randomize()) {
                                $thirdF.html(twitterParam.followers[2]);
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
                    if (label2[0] == twitterParam.likes[0]) {
                        $firstL.html(twitterParam.likes[0]);
                        l[0] = 1;
                        if (label2[1] == 0) {
                            if (label2[2] == twitterParam.likes[1] || randomize()) {
                                $secondL.html(twitterParam.likes[1]);
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


        // circlized + gradation
        circlized(w);


    });


})(window, jQuery);