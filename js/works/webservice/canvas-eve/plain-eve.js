(function (window, $) {
    const plainEve = () => {

        const plain = {
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

        // For the zoom function
        var prevMousePosX, prevMousePosY;


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                var $plain = $('#plain');

                plain.size.width = $plain.outerWidth();
                plain.size.height = $plain.outerHeight();

                plain.pos.left = $plain.offset().left;
                plain.pos.top = $plain.offset().top;
                // Image-space mouse coordinates
                plain.relPos.left = e.clientX - plain.pos.left;
                plain.relPos.top = e.clientY - plain.pos.top;
                if (e.button == 1) {
                    glFlgs.mousewheel_avail_flg = true;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
                // if (supportTouch == true) {
                //     glFlgs.mousewheel_avail_flg = true;
                //     console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                // }
            });
        };
        init();


        // Update variables everytime a mousemove event is called on wherever
        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // prevMousePosX = clientX - $('#plain').offset().left;
                // prevMousePosY = clientY - $('#plain').offset().top;
            });
        };
        Update();


        // Configuring flags
        const configFlgs = () => {
            // Activate flags
            const activate = () => {
                $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                    // if (e.button == 1) {
                    //     glFlgs.mousewheel_avail_flg = true;
                    //     console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                    // }
                });
            };
            activate();

            // Reset flags
            $(document).on(EVENTNAME_TOUCHEND, function (e) {
                if (glFlgs.mousewheel_avail_flg == true) {
                    glFlgs.mousewheel_avail_flg = false;
                    console.log('glFlgs.mousewheel_avail_flg', glFlgs.mousewheel_avail_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            // Move the canvas
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (glFlgs.mousewheel_avail_flg == true) {
                    let resPosLeft = e.clientX - plain.relPos.left;
                    let resPosTop = e.clientY - plain.relPos.top;
                    $('#plain').css({
                        'left': resPosLeft + 'px',
                        'top': resPosTop + 'px'
                    });
                }
            });


            // Implement zoom-in and zoom-out
            const setZoom = () => {
                var i = parseInt(transformValue($('#plain').css('transform')).scaleX);
                const mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
                $(document).on(mousewheelevent, function (e) {
                    var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
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
                        console.log('i', i);
                        mouseWheelVal = 1 / i;
                        $('#plain').css({
                            'transform': 'scale(' + i + ')',
                        });
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
                        console.log('i', i);
                        mouseWheelVal = 1 / i;
                        $('#plain').css({
                            'transform': 'scale(' + i + ')',
                        });
                    }

                    // var diffPosX = (clientX - $('#plain').offset().left) - ((clientX - $('#plain').offset().left) / mouseWheelVal);
                    // var diffPosY = (clientY - $('#plain').offset().top) - ((clientY - $('#plain').offset().top) / mouseWheelVal);
                    // console.log('diffPosX', diffPosX, 'diffPosY', diffPosY);

                    // var plainPosX = diffPosX + $('#plain').offset().left;
                    // var plainPosY = diffPosY + $('#plain').offset().top;

                    // $('#plain').css({
                    //     'top': plainPosY + 'px',
                    //     'left': plainPosX + 'px',
                    // });
                });
            };
            setZoom();
        };
        main();


    };
    plainEve();
})(window, jQuery);