$(function () {
    h = $(window).height();
    $('#container').css('display', 'none');
    $('#loader-bg, #loader').height(h).css('display', 'block');
});

$(window).on('load', function () {
    $('#loader-bg').delay(900).fadeOut(800);
    $('#loading').delay(600).fadeOut(300);
    $('#container').css('display', 'block');
});