(function (window, $) {
    const hogeEve = () => {

        const zoom = {
            'size': {
                'width': 0,
                'height': 0
            },
            'pos': {
                'left': 0,
                'top': 0
            },
            'relPos': {
                'left': 0,
                'top': 0
            }
        }


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {});
        };
        init();


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
            $(document).mousemove(function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                // $('#zoom').css({
                //     'left': clientX - $('#plain').offset().left + 'px',
                //     'top': clientY - $('#plain').offset().top + 'px',
                // });
            });


            // Implement zoom-in and zoom-out
            const setZoom = () => {
                // var i = parseInt(transformValue($('#zoom').css('transform')).scaleX);
                var i = 1;
                xLast = 0; // last x location on the screen
                yLast = 0; // last y location on the screen
                xImage = 0; // last x location on the image
                yImage = 0; // last y location on the image
                $(document).on('mousewheel', function (e) {
                    // find current location on screen 
                    xScreen = e.clientX - $('#plain').offset().left;
                    yScreen = e.clientY - $('#plain').offset().top;

                    // find current location on the image at the current scale
                    xImage = xImage + ((xScreen - xLast) / i);
                    yImage = yImage + ((yScreen - yLast) / i);
                    console.log('xImage', xImage, 'yImage', yImage);


                    var delta = e.deltaY;
                    if (delta < 0) {
                        if (i > 2) {
                            i = 2;
                            i -= 0.09;
                        } else if (i > 0.9) {
                            i -= 0.09;
                        } else if (i > 0.8) {
                            i -= 0.08;
                        } else if (i > 0.7) {
                            i -= 0.07;
                        } else if (i > 0.6) {
                            i -= 0.06;
                        } else if (i > 0.5) {
                            i -= 0.05;
                        } else if (i > 0.4) {
                            i -= 0.04;
                        } else if (i > 0.3) {
                            i -= 0.03;
                        } else if (i > 0.2) {
                            i -= 0.02;
                        } else if (i >= 0.1) {
                            i -= 0.01;
                        } else {
                            i = 0.09;
                        }
                    } else {
                        if (i > 2) {
                            i = 2.09;
                        } else if (i > 0.9) {
                            i += 0.09;
                        } else if (i > 0.8) {
                            i += 0.08;
                        } else if (i > 0.7) {
                            i += 0.07;
                        } else if (i > 0.6) {
                            i += 0.06;
                        } else if (i > 0.5) {
                            i += 0.05;
                        } else if (i > 0.4) {
                            i += 0.04;
                        } else if (i > 0.3) {
                            i += 0.03;
                        } else if (i > 0.2) {
                            i += 0.02;
                        } else if (i > 0.1) {
                            i += 0.01;
                        } else {
                            i = 0.1;
                            i += 0.01;
                        }
                    }

                    // determine the location on the screen at the new scale
                    xNew = (xScreen - xImage) / i;
                    yNew = (yScreen - yImage) / i;
                    console.log('xNew', xNew, 'yNew', yNew);


                    // save the current screen location
                    xLast = xScreen;
                    yLast = yScreen;

                    console.log('i', i);
                    mouseWheelVal = 1 / i;
                    $('#zoom').css({
                        'transform': 'scale(' + i + ')' + 'translate(' + xNew + 'px, ' + yNew + 'px' + ')',
                        'transform-origin': xImage + 'px ' + yImage + 'px',
                    });
                });
            };
            setZoom();
        };
        main();


    };
    hogeEve();
})(window, jQuery);