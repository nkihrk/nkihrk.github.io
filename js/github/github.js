(function (window, $) {
    // When loading is finished
    $(window).on('load', function () {
        const progressBar = function () {
            // html5
            const $html5Bar = $('.html5-progress-bar');
            const $html5Num = $('#html5-progress-target');
            // css3
            const $css3Bar = $('.css3-progress-bar');
            const $css3Num = $('#css3-progress-target');
            // javascript
            const $javascriptBar = $('.javascript-progress-bar');
            const $javascriptNum = $('#javascript-progress-target');
            // ruby
            const $rubyBar = $('.ruby-progress-bar');
            const $rubyNum = $('#ruby-progress-target');
            // ruby
            const $cBar = $('.c-progress-bar');
            const $cNum = $('#c-progress-target');
            // ruby
            const $csharpBar = $('.csharp-progress-bar');
            const $csharpNum = $('#csharp-progress-target');

            const iterate = function (langNum, maxCount) {
                let count = 0;
                const id = setInterval(function () {
                    count++;
                    langNum.html(count + '%');

                    if (count >= maxCount) clearInterval(id);
                }, 0.18);
            };

            // Show progress num with counting animation
            iterate($html5Num, progressParam.html5);
            iterate($css3Num, progressParam.css3);
            iterate($javascriptNum, progressParam.javascript);
            iterate($rubyNum, progressParam.ruby);
            iterate($cNum, progressParam.c);
            iterate($csharpNum, progressParam.csharp);

            // Activate progress bar
            $html5Bar.addClass('is-active');
            $css3Bar.addClass('is-active');
            $javascriptBar.addClass('is-active');
            $rubyBar.addClass('is-active');
            $cBar.addClass('is-active');
            $csharpBar.addClass('is-active');
        };
        setTimeout(function () {
            progressBar();
        }, 1700);


    });


})(window, jQuery);