(function (window, $) {
    // circlized + gradation. W should be the current window height
    circlized = function (w) {
        let $wrapper = $('.wrapper-gradation-circlized');
        let $image = $('.gradation');
        let width = circlizedParam.width;
        let thickness = circlizedParam.thickness;

        let wrapperWidth = width + thickness;
        let imageTop = (wrapperWidth - width) / 2.0;

        let relWidth = w * width / 1920.0;
        let relWrapperWidth = w * wrapperWidth / 1920.0;
        let relImageTop = w * imageTop / 1920.0;

        $wrapper.css({
            'width': relWrapperWidth + 'px',
            'height': relWrapperWidth + 'px'
        });
        $image.css({
            'width': relWidth + 'px',
            'top': relImageTop + 'px',
            'left': relImageTop + 'px'
        });
    };
})(window, jQuery);