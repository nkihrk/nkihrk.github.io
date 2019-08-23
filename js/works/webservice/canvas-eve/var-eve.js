/////
///// The template code for each -eve.js
/////
// (function (window, $) {
//     const hogeEve = () => {
//         // Flags
//         const flgs = {
//             'hoge_flg': false,
//         };


//         ///


//         // Initialize values
//         const init = () => {};
//         init();


//         // Configuring flags
//         const configFlgs = () => {
//             // Activate flags
//             const activate = () => {
//                 $(document).on('mousedown', function (e) {
//                     if (e.button == 1) {
//                         flgs.hoge_flg = true;
//                         console.log('flgs.hoge_flg', flgs.hoge_flg);
//                     }
//                 })
//             };
//             activate();

//             // Reset flags
//             $(document).on('mouseup', function (e) {
//                 if (flgs.hoge_flg == true) {
//                     flgs.hoge_flg = false;
//                     console.log('flgs.hoge_flg', flgs.hoge_flg);
//                 }
//             });
//         };
//         configFlgs();


//         // Execute if flags are true
//         const main = () => {
//             $(document).mousemove(function (e) {
//                 // Prevent from the default drag events
//                 e.preventDefault();

//                 if (flgs.hoge_flg == true) {

//                 }
//             });
//         };
//         main();


//     };
//     hogeEve();
// })(window, jQuery);


///


// Variables
var newFile = {
    'id': 0,
    'prevId': 0,
    // To identify whether being dropped or not
    'flg': 0,
};

// Global flags
const glFlgs = {
    'mousewheel_avail_flg': false,
};

// A max length of the HIGHEST_Z_INDEX is 2147483647
var HIGHEST_Z_INDEX = 1;

// API_KEY
var config = {
    'youtube': {
        API_KEY: null,
    },
    'twitter': {
        MY_KEY: null,
        SECRET_KEY: null,
        KEY_2: null
    }
};


///


// Functions
// Get transform values of a specific selector
const transformValue = function (e) {
    let values = e.split('(')[1];
    values = values.split(')')[0];
    values = values.split(', ');
    const matrix = {
        'scaleX': values[0],
        'rotateP': values[1],
        'rotateM': values[2],
        'scaleY': values[3],
        'transformX': values[4],
        'transformY': values[5],
    };
    return matrix;
};

// Get a target`s specific transform-rotate value, and return the value as radian. The value will be in between 0 and 2PI
const getRotationRad = function (obj) {
    var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform") ||
        obj.css("-ms-transform") ||
        obj.css("-o-transform") ||
        obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
        var angle = 0;
    }
    return (angle < 0) ? (angle + 360) / 180 * Math.PI : angle / 180 * Math.PI;
}

// Calcurate radians. The value will be in between 0 and 2PI
const calcRadians = function (x, y) {
    var rad = Math.atan2(y, x) / Math.PI * 180 + (Math.atan2(y, x) > 0 ? 0 : 360);
    // console.log('The radian value : ' + rad);

    return rad / 180 * Math.PI;
};

const debugCircle = function (name, col, posX, posY) {
    $('#canvas-eve').append('<div id="' + name + '"></div>')
    $('#' + name).css({
        // For -1, it is a prefix due to a border-width and -height(1px each)
        'top': posY - 1 + 'px',
        'left': posX - 1 + 'px',
        'width': 14 + 'px',
        'height': 14 + 'px',
        'background': col,
        'border-radius': 50 + '%',
        'position': 'absolute',
        'z-index': 999,
        'transform': 'translateX(-50%) translateY(-50%)',
        'opacity': 0.8,
    });
};

// For the iframe pointer problem
const iframePointerNone = function () {
    $('iframe').css('pointer-events', 'none');
};
const iframePointerReset = function () {
    $('iframe').css('pointer-events', '');
};

// Just for separation
const sep = () => console.log('-------------------------------------');


///


// Implement touch events for smart-phone
// To check whether we can use the touch event or not
var supportTouch = 'ontouchend' in document;

var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

var IS_TRANSITION = supportTouch ? '' : 'width .1s, height .1s, top .1s, left .1s';
$('.file-wrap').css('transition', IS_TRANSITION);

const preventDefault = (e) => {
    e.preventDefault();
};
window.addEventListener('touchmove', preventDefault, {
    passive: false
});
window.removeEventListener('touchmove', preventDefault, {
    passive: false
});