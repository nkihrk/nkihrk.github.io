(function (window, $) {
    const colpickEve = () => {
        // Flags
        const flgs = {
            'wheeling_flg': false,
            'move_circle_flg': false,
        };

        // Convert RGB to HEX
        const rgb2hex = function (rgb) {
            return '#' + rgb.map(function (value) {
                return ('0' + value.toString(16)).slice(-2);
            }).join('');
        };

        // Convert HEX to RGB
        const hex2rgb = function (hex) {
            if (hex.slice(0, 1) == "#") hex = hex.slice(1);
            if (hex.length == 3) hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);

            return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (str) {
                return parseInt(str, 16);
            });
        };

        // https://webllica.com/copy-text-to-clipboard/
        // Copy text to clipboard
        const copyTextToClipboard = function (textVal) {
            var copyFrom = document.createElement("textarea");

            copyFrom.textContent = textVal;

            var bodyElm = document.getElementsByTagName("body")[0];
            bodyElm.appendChild(copyFrom);

            copyFrom.select();
            var retVal = document.execCommand('copy');
            bodyElm.removeChild(copyFrom);
            return retVal;
        };

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

                if ($('#toggle-colpick').hasClass('active')) {
                    clearTimeout(wheeling);
                    wheeling = setTimeout(function () {
                        console.log('stop wheeling!');
                        flgs.wheeling_flg = false;
                        wheeling = undefined;

                        // reset wheeldelta
                        wheeldelta.x = 0;
                        wheeldelta.y = 0;
                    }, 100);
                }

                wheeldelta.x += e.deltaFactor * e.deltaX;
                wheeldelta.y += e.deltaFactor * e.deltaY;
                console.log(wheeldelta);
            });
        };


        var circleRelPosX;
        var $barTop = null;


        ///


        // Initialize values
        const init = () => {
            // Initialize a value
            $('#input-colpick').val('#32303f');
            $('#r-colpick input').val(50);
            $('#g-colpick input').val(48);
            $('#b-colpick input').val(63);


            $(document).on(EVENTNAME_TOUCHSTART, '#red-cir-colpick, #green-cir-colpick, #blue-cir-colpick', function () {
                circleRelPosX = clientX - $(this).offset().left;
                circleRelPosY = clientY - $(this).offset().top;
                $barTop = $(this);
                flgs.move_circle_flg = true;
            });
        };
        init();


        // Reset a selected area
        const reset = function () {
            $(document).on(EVENTNAME_TOUCHEND, function () {
                if (flgs.move_circle_flg == true) {
                    flgs.move_circle_flg = false;
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
            $(document).on(EVENTNAME_TOUCHSTART, '#copy-colpick', function () {
                var hex = $("#input-colpick").val();
                if (hex.match(/#/)) {
                    hex = hex.slice(1);
                }
                copyTextToClipboard(hex);
            });


            // Toggle colpick
            $('#toggle-colpick').on(EVENTNAME_TOUCHSTART, function () {
                $('#toggle-colpick').toggleClass('active');

                if ($('#toggle-colpick').hasClass('active')) {
                    $('div').removeClass('grab-pointer');
                    $('#canvas-eve').addClass('spuit-pointer');
                } else {
                    $('div').removeClass('spuit-pointer');
                    $('.file-wrap').addClass('grab-pointer');
                }
            });


            $(document).on('change', '#code-colpick input', function () {
                var hex = $(this).val();
                if (!$(this).val().match(/#/)) {
                    hex = '#' + $(this).val();
                    $("#input-colpick").val(hex);
                }
                var r = hex2rgb(hex)[0];
                var g = hex2rgb(hex)[1];
                var b = hex2rgb(hex)[2];


                // Update rgb values
                $('#r-colpick input').val(r);
                $('#g-colpick input').val(g);
                $('#b-colpick input').val(b);


                // Update a color palette
                $('#color-colpick').css('background-color', hex);


                // Update bar-related values
                var rBar = r / 255 * 100;
                var gBar = g / 255 * 100;
                var bBar = b / 255 * 100;

                $('#r-colpick .colbar-colpick').css('width', rBar + '%');
                $('#g-colpick .colbar-colpick').css('width', gBar + '%');
                $('#b-colpick .colbar-colpick').css('width', bBar + '%');

                $('#red-cir-colpick').css('left', rBar + '%');
                $('#green-cir-colpick').css('left', gBar + '%');
                $('#blue-cir-colpick').css('left', bBar + '%');
            });


            // Events for #rgb-colpick input
            $(document).on('change', '#rgb-colpick input', function () {
                // Update rgb values, convert it to hex and apply to a color code input
                var r = parseInt($('#r-colpick input').val());
                var g = parseInt($('#g-colpick input').val());
                var b = parseInt($('#b-colpick input').val());
                var hex = rgb2hex([r, g, b]);
                $("#input-colpick").val(hex);
                $('#color-colpick').css('background-color', hex);


                // Update bar-related values
                var rBar = r / 255 * 100;
                var gBar = g / 255 * 100;
                var bBar = b / 255 * 100;

                $('#r-colpick .colbar-colpick').css('width', rBar + '%');
                $('#g-colpick .colbar-colpick').css('width', gBar + '%');
                $('#b-colpick .colbar-colpick').css('width', bBar + '%');

                $('#red-cir-colpick').css('left', rBar + '%');
                $('#green-cir-colpick').css('left', gBar + '%');
                $('#blue-cir-colpick').css('left', bBar + '%');
            });


            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                if (flgs.move_circle_flg == true) {
                    // Syncing rgb values with sliders
                    var x = clientX - circleRelPosX - $('.bar-colpick').offset().left;
                    x = x >= -$barTop.width() / 2 ? (x >= $('.bar-colpick').width() - $barTop.width() / 2 ? $('.bar-colpick').width() - $barTop.width() / 2 : x) : -$barTop.width() / 2;
                    var posLeft = x + $barTop.width() / 2;
                    var colorCode = parseInt(posLeft / $('.bar-colpick').width() * 255);
                    $barTop.css('left', posLeft / $('.bar-colpick').width() * 100 + '%');
                    $barTop.parents('.bar-colpick').find('.colbar-colpick').css('width', posLeft / $('.bar-colpick').width() * 100 + '%');
                    $barTop.parent().parent().find('input').val(colorCode);


                    // Update rgb values, convert it to hex and apply to a color code input
                    var r = parseInt($('#r-colpick input').val());
                    var g = parseInt($('#g-colpick input').val());
                    var b = parseInt($('#b-colpick input').val());
                    var hex = rgb2hex([r, g, b]);
                    $("#input-colpick").val(hex);
                    $('#color-colpick').css('background-color', hex);
                }
            });


            $(document).on(EVENTNAME_TOUCHSTART, '.file-wrap', function (e) {
                if ($('#toggle-colpick').hasClass('active')) {
                    if ($(this).find('canvas').length) {
                        if (e.button != 1) {
                            var context = $(this).find('canvas')[0].getContext('2d');
                            var relPosX = clientX - $(this).offset().left;
                            var relPosY = clientY - $(this).offset().top;
                            var imagedata = context.getImageData(relPosX * mouseWheelVal, relPosY * mouseWheelVal, 1, 1);
                            if ($(this).has('.flipped').length > 0) {
                                imagedata = context.getImageData($(this).find('img').width() - relPosX * mouseWheelVal, relPosY * mouseWheelVal, 1, 1);
                            }
                            var r = imagedata.data[0];
                            var g = imagedata.data[1];
                            var b = imagedata.data[2];
                            var a = imagedata.data[3];

                            var rBar = r / 255 * 100;
                            var gBar = g / 255 * 100;
                            var bBar = b / 255 * 100;

                            var hex = rgb2hex([r, g, b]);


                            $("#input-colpick").val(hex);


                            // Update a color palette
                            $('#color-colpick').css('background-color', hex);


                            $('#r-colpick .colbar-colpick').css('width', rBar + '%');
                            $('#g-colpick .colbar-colpick').css('width', gBar + '%');
                            $('#b-colpick .colbar-colpick').css('width', bBar + '%');


                            $('#red-cir-colpick').css('left', rBar + '%');
                            $('#green-cir-colpick').css('left', gBar + '%');
                            $('#blue-cir-colpick').css('left', bBar + '%');


                            // Update rgb values
                            $('#r-colpick input').val(r);
                            $('#g-colpick input').val(g);
                            $('#b-colpick input').val(b);
                        }
                    }
                }
            });
        };
        main();


    };
    colpickEve();
})(window, jQuery);