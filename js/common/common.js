;
(function (window, $) {
    //Variable
    let windowHeight = $(window).height();

    $(function () {
        // Loading Gif. Use promise to express rich loading page.
        let loading = {
            func: function () {
                $('#container').css('display', 'none');
                $('#loader-bg, #loader').height(windowHeight).css('display', 'block');
            },
        }
        loading.func();


        // Insert a window height to .menu and .content
        let common = {
            func: function () {
                $(this.menu).css('height', windowHeight + 'px');
                $(this.content).css('height', windowHeight + 'px');
            },
            menu: document.getElementsByClassName('menu'),
            content: document.getElementsByClassName('content')
        };
        common.func();


        // Insert copyright into footer
        let year = new Date().getFullYear();
        let copyright = {
            func: function () {
                this.id.appendChild(this.text);
            },
            id: document.getElementById('copyright'),
            text: document.createTextNode(year + ' © NkiHrk'),
        };
        copyright.func();


        // Circlized + Gradation
        let circlized = {
            func: function () {            
                let wrapperWidth = this.width + this.thickness;
                let imageTop = wrapperWidth / 2.0 - this.width / 2.0;

                $(this.wrapper).css({
                    'width': wrapperWidth + 'px',
                    'height': wrapperWidth + 'px'
                });
                $(this.image).css({
                    'width': this.width + 'px',
                    'top': imageTop + 'px',
                    'left': imageTop + 'px'
                });
            },
            wrapper: document.getElementsByClassName('wrapper-gradation-circlized circlized'),
            image: document.getElementsByClassName('gradation circlized'),
            width: $.circlized.width,
            thickness: $.circlized.thickness,
        };
        circlized.func();


    });

    $(window).on('load', function () {
        $('#loader-bg').delay(900).fadeOut(800);
        $('#loading').delay(600).fadeOut(300);
        $('#container').css('display', 'block');
    });
})(window, jQuery);