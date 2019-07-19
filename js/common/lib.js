(function (window, $) {
    // circlized + gradation. W should be the current window height
    circlized = function (w) {
        const rel = function (x) {
            return w * x / 1920.0;
        };
        const param = function (width, thickness) {
            this.width = width;
            this.thickness = thickness;
            this.wrapperWidth = this.width + this.thickness;
            this.imageTop = (this.wrapperWidth - this.width) / 2.0;

            this.relWidth = rel(this.width);
            this.relWrapperWidth = rel(this.wrapperWidth);
            this.relImageTop = rel(this.imageTop);
        }
        const $wrapper = $('.wrapper-gradation-circlized');
        const $image = $('.gradation');

        // For PC
        const width = circlizedParam.width;
        const thickness = circlizedParam.thickness;
        const pc = new param(width, thickness);

        // For smart phone
        const sWidth = circlizedParam.sWidth;
        const sThickness = circlizedParam.sThickness;
        const phone = new param(sWidth, sThickness);

        // For limitation(max and min)
        const minWidth = circlizedParam.minWidth;
        const min = new param(minWidth, thickness);

        const maxWidth = circlizedParam.maxWidth;
        const max = new param(maxWidth, thickness);


        if (!!minWidth && !!maxWidth) {
            if (pc.relWidth >= max.width) {
                pc.relWidth = max.width;
                pc.relWrapperWidth = max.wrapperWidth;
                pc.relImageTop = max.imageTop;
            }
            if (min.width >= pc.relWidth) {
                pc.relWidth = min.width;
                pc.relWrapperWidth = min.wrapperWidth;
                pc.relImageTop = min.imageTop;
            }
        }

        if ($(window).width() >= commonParam.maxWidthForPhone) {
            $wrapper.css({
                'width': pc.relWrapperWidth + 'px',
                'height': pc.relWrapperWidth + 'px'
            });
            $image.css({
                'width': pc.relWidth + 'px',
                'top': pc.relImageTop + 'px',
                'left': pc.relImageTop + 'px'
            });
        } else {
            $wrapper.css({
                'width': phone.wrapperWidth + 'px',
                'height': phone.wrapperWidth + 'px'
            });
            $image.css({
                'width': phone.width + 'px',
                'top': phone.imageTop + 'px',
                'left': phone.imageTop + 'px'
            });
        }

    };
})(window, jQuery);