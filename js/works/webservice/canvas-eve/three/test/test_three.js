(function (window, $) {
    const testThreeJS = () => {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize($('#glsl').width(), parseInt($('#glsl').width() * window.innerHeight / window.innerWidth));

        $('#glsl').find('.is-flipped').append(renderer.domElement);


    };
    testThreeJS();
})(window, jQuery);