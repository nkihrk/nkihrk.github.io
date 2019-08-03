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


    // Insert a JSON data to #post
    insertPost = function (json) {
        for (var i in json) {
            let column = '<div class="column-content-post">' +
                '<div class="align-items flex-space-between flex-box header-column-content-post">' +
                '<h2 class="fix-name-column regular agency-fb" style="color: rgba(255, 255, 255, 0.5); padding-top: 20px; padding-bottom:15px;">' + json[i].name + '</h2>';
            // If linkName is filled in, then return 0, otherwise return style="display: none"
            const isVisible = json[i].content.linkName ? 0 : 'style="display: none"';
            column += '<a href="' + json[i].url.link + '" target = "_blank" class = "hover-shadow-single"' + isVisible + '>' + json[i].content.linkName + '</a>' +
                '</div>';
            for (let j = 0; j < json[i].url.image.length; j++) {
                column += '<img src="' + json[i].url.image[j] + '" alt="" style="width: 100%;">';
            }
            column += '<div class="center-margin-auto description-column-content-post" style="width: 90%;">' +
                '<div class="date-column-content-post">' + json[i].content.date + '</div>' +
                '<div class="justify-sentence text-column-content-post">' +
                '<input id="leer' + i + '" type="checkbox">' +
                '<label for="leer' + i + '"></label>' +
                '<div class="expand">' +
                '<span class="detail-text-column-content-post">' +
                json[i].content.text +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="hash-tag-group regular agency-fb">';
            for (let k = 0; k < json[i].tag.length; k++) {
                column += '<span class="hash-tag">' + json[i].tag[k] + '</span>';
            }
            column += '</div>' +
                '</div>' +
                '</div>';

            $('#post').append(column);
        }
    };


})(window, jQuery);