;
(function (window, $) {
    //Variable
    let windowHeight = $(window).height();
    $(function () {
        // Common settings
        let common = {
            func: function () {
                // Fix the vertical margin to be same to horizotal margin
                let marginTwitter = (parseInt($(this.content).css('width')) - parseInt($(this.twitter).css('width'))) / 2.0;
                $(this.twitter).css('margin-top', marginTwitter + 'px');
            },
            content: document.getElementsByClassName('content'),
            twitter: document.getElementsByClassName('twitter'),
        };
        common.func();


    });
})(window, jQuery);