// Loading Gif. Use promise to express rich loading page.
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

// common settings
$(function () {
    // Insert a window height to .menu and .content
    h = $(window).height();
    menu = document.getElementsByClassName('menu');
    content = document.getElementsByClassName('content');
    $(menu).css('height', h + 'px');
    $(content).css('height', h + 'px');

    // Insert a copyright-date into footer
    copyright = document.getElementById('copyright');
    date = new Date().getFullYear();
    copyright.innerHTML = date + ' &copy; NkiHrk';
});