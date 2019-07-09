;
(function (window, $) {
    // Window width and height
    const w = $(window).width();
    const h = $(window).height();

    $(window).on('load resize', function () {
        // Common settings
        const common = {
            func: function () {
                // Fix the vertical margin to be same to the horizotal margin
                let marginTwitter = (parseInt($(this.content).css('width')) - parseInt($(this.twitter).css('width'))) / 2.0;
                $(this.twitter).css('margin-top', marginTwitter + 'px');

                // Centering the content-twitter
                let halfHeight = h / 2.0;
                let halfContentTwitter = parseInt($(this.contentTwitter).css('height')) / 2.0;
                let centerPosTwitter = halfHeight - halfContentTwitter - marginTwitter;
                $(this.contentTwitter).css('top', centerPosTwitter + 'px');
            },
            content: document.getElementsByClassName('content'),
            twitter: document.getElementsByClassName('twitter'),
            contentTwitter: document.getElementsByClassName('content-twitter'),
        };
        common.func();
    });

    $(window).on('load', function () {
        // Set random numbers to the status-twitter when loading has done
        const statusNum = {
            func: function () {
                let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                let count = 0;
                let countup = function () {
                    console.log(count++);
                }

                let elements = document.getElementsByClassName('status-num');

                let id = setInterval(function () {
                    let label = array[count] + '.' + array[count] + 'M';
                    for (i = 0; i < elements.length; i++) {
                        elements[i].innerHTML = label;
                    }
                    countup();
                    if (count > 10) {
                        for (i = 0; i < elements.length; i++) {
                            elements[i].innerHTML = '-.-M';
                        }
                        // count = 0;
                        clearInterval(id);
                    }
                }, 100);
            },
        }
        $(statusNum.func()).delay(1700);
    });


})(window, jQuery);