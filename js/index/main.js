;
(function (window, $) {
    //Variable
    let windowHeight = $(window).height();

    $(window).on('load resize', function () {
        let h = $(window).height();
        // Common settings
        let common = {
            func: function () {
                // Fix the vertical margin to be same to the horizotal margin
                let marginTwitter = (parseInt($(this.content).css('width')) - parseInt($(this.twitter).css('width'))) / 2.0;
                $(this.twitter).css('margin-top', marginTwitter + 'px');

                // Centering the content-twitter
                let halfHeight = h / 2.0;
                let halfContentTwitter = parseInt($(this.contentTwitter).css('height')) / 2.0;
                let centerPosTwitter = halfHeight - halfContentTwitter;
                $(this.contentTwitter).css('top', centerPosTwitter + 'px');
            },
            content: document.getElementsByClassName('content'),
            twitter: document.getElementsByClassName('twitter'),
            contentTwitter: document.getElementsByClassName('content-twitter'),
        };
        common.func();
    });
})(window, jQuery);