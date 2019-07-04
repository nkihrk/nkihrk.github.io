// Get a window height and apply to the class container
$(document).ready(function () {
    hsize = $(window).height();
    $('#container').css('min-height', hsize + 'px');
});

$(window).resize(function () {
    hsize = $(window).height();
    $('#container').css('min-height', hsize + 'px');
});

// Set a appropriate height to the class content-box
$(function () {
    h = $(window).height();
    contentBox = document.getElementsByClassName('content-box');
    offset = $(contentBox).offset().top;
    targetHeight = h - offset;
    $(contentBox).css('min-height', targetHeight + 'px');
});