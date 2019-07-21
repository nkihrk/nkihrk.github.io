(function (window, $) {
    // When DOM tree is constructed
    $(function () {
        // Window width and height
        const w = $(window).width();
        const h = $(window).height();


        const imgLoader = function () {
            const handleDragEvent = function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            };

            const target = document.getElementById("target");
            target.addEventListener("dragover", handleDragEvent, false);
            target.addEventListener("drop", function (e) {
                e.stopPropagation();
                e.preventDefault();

                const file = e.dataTransfer.files[0]
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.getElementById("myImage")
                    img.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }, false);
        };
        imgLoader();


        // Loading Gif. Use promise to express rich loading page.
        const loadingFirst = function () {
            $('#container').css('display', 'none');
            $('#loader-bg, #loader').height(h).css('display', 'block');
        }
        loadingFirst();


        // When loading is finished
        $(window).on('load', function () {
            // loadingLast
            const loadingLast = function () {
                $('#loader-bg').delay(900).fadeOut(800);
                $('#loading').delay(600).fadeOut(300);
                $('#container').css('display', 'block');
            }
            loadingLast();
        });


    });
})(window, jQuery);