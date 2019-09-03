(function (window, $) {
    const hogeEve = () => {
        // Flags
        const flgs = {
            'wheeling_flg': false,
        };

        // Convert RGB to HEX
        const rgb2hex = function (rgb) {
            return '#' + rgb.map(function (value) {
                return ('0' + value.toString(16)).slice(-2);
            }).join('');
        };


        ///


        // Initialize values
        const init = () => {
            // Initialize a value
            document.getElementById('input-colpick').value = '#32303f';

            // https: //stackoverflow.com/questions/3515446/jquery-mousewheel-detecting-when-the-wheel-stops
            // Detect if it`s wheeling or not
            const detectWheeling = () => {
                var wheeldelta = {
                    x: 0,
                    y: 0
                };
                var wheeling;
                $(document).on('mousewheel', function (e) {
                    if (!wheeling) {
                        console.log('start wheeling!');
                        flgs.wheeling_flg = true;
                    }

                    clearTimeout(wheeling);
                    wheeling = setTimeout(function () {
                        console.log('stop wheeling!');
                        flgs.wheeling_flg = false;
                        wheeling = undefined;

                        // reset wheeldelta
                        wheeldelta.x = 0;
                        wheeldelta.y = 0;
                    }, 250);

                    wheeldelta.x += e.deltaFactor * e.deltaX;
                    wheeldelta.y += e.deltaFactor * e.deltaY;
                    console.log(wheeldelta);
                });
            };
            detectWheeling();
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
                    $('#preview-canvas canvas').remove();
                }
            });


            $(document).on('mouseup', function (e) {
                if ($('#toggle-colpick').hasClass('active')) {
                    if (e.button == 1) {
                        html2canvas(document.getElementById('canvas-eve')).then(function (canvas) {
                            document.getElementById('preview-canvas').appendChild(canvas);
                        });
                    }
                }
            });

            var done = false;
            $(document).on('mousemove', function (e) {
                if ($('#toggle-colpick').hasClass('active')) {
                    if (glFlgs.mousewheel_avail_flg == true) {
                        $('#preview-canvas canvas').remove();
                    }
                }
            });


            $(document).on('mousewheel', function (e) {
                if ($('#toggle-colpick').hasClass('active')) {
                    // if (flgs.wheeling_flg == true) {
                    //     $('#preview-canvas canvas').remove();
                    // }
                } else {}
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