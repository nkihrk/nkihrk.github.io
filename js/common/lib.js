(function (window, $) {
    // circlized + gradation. W should be the current window height
    circlized = function (w) {
        const $wrapper = $('.wrapper-gradation-circlized');
        const $image = $('.gradation');
        const width = circlizedParam.width;
        const minWidth = circlizedParam.minWidth;
        const maxWidth = circlizedParam.maxWidth;
        const thickness = circlizedParam.thickness;

        const minWrapperWidth = minWidth + thickness;
        const minImageTop = (minWrapperWidth - minWidth) / 2.0;

        const wrapperWidth = width + thickness;
        const imageTop = (wrapperWidth - width) / 2.0;
        let relWidth = w * width / 1920.0;
        let relWrapperWidth = w * wrapperWidth / 1920.0;
        let relImageTop = w * imageTop / 1920.0;

        const maxWrapperWidth = maxWidth + thickness;
        const maxImageTop = (maxWrapperWidth - maxWidth) / 2.0;

        if (relWidth > maxWidth) {
            relWidth = maxWidth;
            relWrapperWidth = maxWrapperWidth;
            relImageTop = maxImageTop;
        }
        if (minWidth > relWidth) {
            relWidth = minWidth;
            relWrapperWidth = minWrapperWidth;
            relImageTop = minImageTop;
        }
        

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