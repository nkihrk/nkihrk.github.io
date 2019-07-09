;
(function (window, $) {
    // Window width and height
    const w = $(window).width();
    const h = $(window).height();
    
    $(window).on('load resize', function () {

        // Common settings
        const common = {
            func: function () {
                // Insert a window height to .menu and .content
                $(this.menu).css('height', w + 'px');
                $(this.content).css('height', h + 'px');

                // Change a font-size according to the width of .menu
                let menuWidth = parseInt($(this.menu).css('width'));
                let largeFont = menuWidth * 0.244;
                let mediumFont = menuWidth * 0.1;
                $(this.largeHead).css('font-size', largeFont + 'px');
                $(this.mediumHead).css('font-size', mediumFont + 'px');
            },
            menu: document.getElementsByClassName('menu'),
            content: document.getElementsByClassName('content'),
            largeHead: document.getElementsByClassName('large half-opacity bold agency-fb'),
            mediumHead: document.getElementsByClassName('medium gray made-bruno')
        };
        common.func();

        // Circlized + Gradation
        const circlized = {
            func: function () {
                let wrapperWidth = this.width + this.thickness;
                let imageTop = (wrapperWidth - this.width) / 2.0;

                let relWidth = w * this.width / 1920.0;
                let relWrapperWidth = w * wrapperWidth / 1920.0;
                let relImageTop = w * imageTop / 1920.0;

                $(this.wrapper).css({
                    'width': relWrapperWidth + 'px',
                    'height': relWrapperWidth + 'px'
                });
                $(this.image).css({
                    'width': relWidth + 'px',
                    'top': relImageTop + 'px',
                    'left': relImageTop + 'px'
                });
            },
            wrapper: document.getElementsByClassName('wrapper-gradation-circlized circlized'),
            image: document.getElementsByClassName('gradation circlized'),
            width: $.circlized.width,
            thickness: $.circlized.thickness,
        };
        circlized.func();
    });

    $(function () {
        // Loading Gif. Use promise to express rich loading page.
        const loading = {
            func: function () {
                $('#container').css('display', 'none');
                $('#loader-bg, #loader').height(h).css('display', 'block');
            },
        }
        loading.func();


        // Insert copyright into footer
        const year = new Date().getFullYear();
        const copyright = {
            func: function () {
                this.id.appendChild(this.text);
            },
            id: document.getElementById('copyright'),
            text: document.createTextNode(year + ' © NkiHrk'),
        };
        copyright.func();


    });

    $(window).on('load', function () {
        $('#loader-bg').delay(900).fadeOut(800);
        $('#loading').delay(600).fadeOut(300);
        $('#container').css('display', 'block');
    });
})(window, jQuery);