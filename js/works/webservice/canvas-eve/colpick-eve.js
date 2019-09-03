(function (window, $) {
    const hogeEve = () => {
        // Flags
        const flgs = {};

        const rgb2hex = function (rgb) {
            return '#' + rgb.map(function (value) {
                return ('0' + value.toString(16)).slice(-2);
            }).join('');
        };


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                flgs.clicked_canvas_flg = true;
            });

            document.getElementById('input-colpick').value = '#32303f';
        };
        init();

        // Reset a selected area
        const reset = function () {
            $(document).on(EVENTNAME_TOUCHSTART, 'canvas', function (e) {
                if (e.button != 1) {
                    e.stopPropagation();
                    $('div').removeClass('selected');
                }
            });
        }
        reset();


        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {});
        };
        Update();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on('mousedown', function (e) {});
            };
            activate();

            // Reset flags
            $(document).on('mouseup', function (e) {});
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {

            $('#toggle-colpick').on('mousedown', function () {
                $('#toggle-colpick').toggleClass('active');

                if ($('#toggle-colpick').hasClass('active')) {
                    html2canvas(document.getElementById('canvas-eve')).then(function (canvas) {
                        document.getElementById('preview-canvas').appendChild(canvas);
                    });
                } else {
                    $('canvas').remove();
                }
            });

            $(document).on('mousedown', 'canvas', function (e) {
                var context = $(this)[0].getContext('2d');
                var imagedata = context.getImageData(clientX, clientY, 1, 1);
                var r = imagedata.data[0];
                var g = imagedata.data[1];
                var b = imagedata.data[2];
                var a = imagedata.data[3];

                var rBar = r / 255 * 100;
                var gBar = g / 255 * 100;
                var bBar = b / 255 * 100;

                var hex = rgb2hex([r, g, b]);


                // $('#input-colpick').value = hex;
                document.getElementById("input-colpick").value = hex;


                $('#color-colpick').css({
                    'background-color': 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')',
                });


                $('#r-colpick .colbar-colpick').css({
                    'width': rBar + '%',
                });
                $('#g-colpick .colbar-colpick').css({
                    'width': gBar + '%',
                });
                $('#b-colpick .colbar-colpick').css({
                    'width': bBar + '%',
                });


                $('#red-cir-colpick').css({
                    'left': rBar + '%',
                });
                $('#green-cir-colpick').css({
                    'left': gBar + '%',
                });
                $('#blue-cir-colpick').css({
                    'left': bBar + '%',
                });


                $('#r-colpick .num-colpick').text(r);
                $('#g-colpick .num-colpick').text(g);
                $('#b-colpick .num-colpick').text(b);
                console.log('r', r, 'g', g, 'b', b, 'a', a);
                console.log('rBar', rBar, 'gBar', gBar, 'bBar', bBar);
            });
        };
        main();


    };
    hogeEve();
})(window, jQuery);