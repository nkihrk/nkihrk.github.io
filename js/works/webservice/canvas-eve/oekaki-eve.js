CANVASEVE.Oekaki = function (container) {
    var size = container.clientWidth;
    var wheelRadius = size / 2;
    var wheelThickness = size / 2 * 0.15;
    var wheelInnerRadius = wheelRadius - wheelThickness;
    var triangleRadius = (wheelRadius - wheelThickness) * 0.9;

    var originX = $(container).offset().left;
    var originY = $(container).offset().top;
    var centerX = originX + size / 2;
    var centerY = originY + size / 2;

    this.container = container;
    this.size = size;
    this.wheelRadius = wheelRadius;
    this.wheelInnerRadius = wheelInnerRadius;
    this.wheelThickness = wheelThickness;
    this.triangleRadius = triangleRadius;

    this.centerX = centerX;
    this.centerY = centerY;

    this.hue = this.options.hue;
    this.rgb = this.options.rgb;

    this.triangleCirclePosX = Math.cos(Math.PI * 2 / 3) * triangleRadius + size / 2;
    this.triangleCirclePosY = Math.sin(Math.PI * 2 / 3) * triangleRadius + size / 2;

    this.newCanvasX = null; // lazy load
    this.newCanvasY = null; // lazy load
    this.$newCanvasId = null; // lazy load

    this.flgs = {
        newcanvas: {
            newcanvas_flg: false,
            create_canvas_avail_flg: false,
        }
    };

    this._createWheelCircle();

    this._createTriangle();
    this._createTriangleCircle();
};


CANVASEVE.Oekaki.prototype = {
    constructor: CANVASEVE.Oekaki,

    options: {
        hue: 0,
        rgb: [0, 0, 0],
        theta: 0,
    },


    load: function () {
        this.drawWheel();
        this.drawTriangle();
        this.setFlgs();
        this.resetFlgs();
        this.handleEvents();
        this._getTriangleColor();
    },


    setFlgs: function () {
        var self = this;


        $(document).on(EVENTNAME_TOUCHSTART, '#color-oekaki', function () {
            var isWheelArea = self._isWheelArea();
            if (isWheelArea) {
                glFlgs.oekaki.move_wheelcircle_flg = true;
                console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
            }

            var isTriangleArea = self._isTriangleArea();
            if (isTriangleArea) {
                glFlgs.oekaki.move_trianglecircle_flg = true;
                console.log('glFlgs.oekaki.move_trianglecircle_flg is ', glFlgs.oekaki.move_trianglecircle_flg);
            }
        });


        $(document).on(EVENTNAME_TOUCHSTART, '#color-wheel-circle', function () {
            glFlgs.oekaki.move_wheelcircle_flg = true;
            console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
        });
        $(document).on(EVENTNAME_TOUCHSTART, '#color-triangle-circle', function () {
            glFlgs.oekaki.move_trianglecircle_flg = true;
            console.log('glFlgs.oekaki.move_trianglecircle_flg is ', glFlgs.oekaki.move_trianglecircle_flg);
        });


        $(document).on(EVENTNAME_TOUCHSTART, '#reset-res', function () {
            console.log('self.flgs.newcanvas.newcanvas_flg is ', self.flgs.newcanvas.newcanvas_flg);
            if (self.flgs.newcanvas.newcanvas_flg == true) {
                self.flgs.newcanvas.create_canvas_avail_flg = true;
                self.newCanvasX = clientX;
                self.newCanvasY = clientY;

                self._createCanvasWrapper();
                console.log('self.flgs.newcanvas.create_canvas_avail_flg is ', self.flgs.newcanvas.create_canvas_avail_flg);
            }
        });
    },


    //


    resetFlgs: function () {
        var self = this;


        $(document).on(EVENTNAME_TOUCHEND, function () {
            if (glFlgs.oekaki.move_wheelcircle_flg == true) {
                glFlgs.oekaki.move_wheelcircle_flg = false;
                console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
            }
            if (glFlgs.oekaki.move_trianglecircle_flg == true) {
                glFlgs.oekaki.move_trianglecircle_flg = false;
                console.log('glFlgs.oekaki.move_trianglecircle_flg is ', glFlgs.oekaki.move_trianglecircle_flg);
            }


            if (self.flgs.newcanvas.create_canvas_avail_flg == true) {
                self.flgs.newcanvas.create_canvas_avail_flg = false;
                console.log('self.flgs.newcanvas.create_canvas_avail_flg is ', self.flgs.newcanvas.create_canvas_avail_flg);
            }
        });
    },


    //


    handleEvents: function () {
        var self = this;


        $(document).on(EVENTNAME_TOUCHSTART, '#color-oekaki', function () {
            self._colorWheelArea();
            self._colorTriangleArea();
        });


        $(document).on(EVENTNAME_TOUCHSTART, '#newcanvas-oekaki, #pen-oekaki, #eraser-oekaki, #spuit-oekaki, #filldrip-oekaki', function (e) {
            self._toggleTool($(this), e);
        });


        $(document).on(EVENTNAME_TOUCHMOVE, function () {
            var originX = $(self.container).offset().left,
                originY = $(self.container).offset().top,
                centerX = originX + self.size / 2,
                centerY = originY + self.size / 2;
            self.centerX = centerX;
            self.centerY = centerY;


            if (glFlgs.oekaki.move_wheelcircle_flg == true) {
                self._updateWheelCircle();
            }
            if (glFlgs.oekaki.move_trianglecircle_flg == true) {
                self._updateTriangleCircle();
            }


            if (self.flgs.newcanvas.create_canvas_avail_flg == true) {
                self._updateCanvasVal();
            }
        });
    },


    //
    // Color Wheel
    //


    drawWheel: function () {
        const resolution = 1,
            outerRadius = 100,
            innerRadius = outerRadius - this.wheelThickness / this.wheelRadius * 100;

        var root = document.getElementById('color-wheel');

        this._generateConicGradiant(outerRadius, resolution, root);
        this._generateOverlay(outerRadius, innerRadius, root);
    },
    _generateOverlay: function (outerRadius, innerRadius, target) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        circle.setAttribute('cx', outerRadius);
        circle.setAttribute('cy', outerRadius);
        circle.setAttribute('r', innerRadius);
        circle.setAttribute('fill', '#262533');

        target.appendChild(circle);
    },
    _generateConicGradiant: function (radius, resolution, target) {
        for (var i = 0; i < 360 * resolution; i++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute(
                "d",
                this._describeArc(
                    radius,
                    radius,
                    radius,
                    i / resolution,
                    (i + 2) / resolution
                )
            );
            path.setAttribute('fill', 'hsl(' + (i / resolution) + ', 100%, 50%)');

            target.appendChild(path);
        }
    },
    _describeArc: function (x, y, radius, startAngle, endAngle) {
        const start = this._polar2Cartesian(x, y, radius, endAngle),
            end = this._polar2Cartesian(x, y, radius, startAngle);

        const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        const d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
            'L', x, y,
            'L', start.x, start.y
        ].join(' ');

        return d;
    },
    _polar2Cartesian: function (centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    },


    //


    _createWheelCircle: function () {
        var wheelCircle = document.createElement('div'),
            r = this.wheelInnerRadius + this.wheelThickness / 2,
            theta = this.options.theta,
            left = r * Math.cos(theta + 3 / 2 * Math.PI) + this.size / 2,
            top = r * Math.sin(theta + 3 / 2 * Math.PI) + this.size / 2;

        wheelCircle.id = 'color-wheel-circle';
        wheelCircle.style.left = left + 'px';
        wheelCircle.style.top = top + 'px';

        this.wheelCircle = wheelCircle;
        this.container.appendChild(wheelCircle);
    },


    //


    _colorWheelArea: function () {
        var isWheelArea = this._isWheelArea();
        if (isWheelArea) {
            this._updateWheelCircle();
        }
    },


    //


    _isWheelArea: function () {
        var centerX = this.centerX,
            centerY = this.centerY,
            minR = this.wheelInnerRadius,
            maxR = this.wheelRadius,
            mouseR = this.getDistance(centerX, centerY, clientX, clientY);

        if (mouseR > minR && maxR > mouseR) {
            return true;
        } else {
            return false;
        }
    },


    //


    _updateWheelCircle: function () {
        var pointer = this.wheelCircle,
            r = this.wheelInnerRadius + this.wheelThickness / 2,
            theta = this._calculateTheta(),
            left = r * Math.cos(theta) + this.size / 2,
            top = r * Math.sin(theta) + this.size / 2;
        pointer.style.left = left + 'px';
        pointer.style.top = top + 'px';

        var hue = this._calculateHue();
        this.hue = hue;
        this._updateTriangle();
    },


    //


    _calculateTheta: function () {
        var centerX = this.centerX,
            centerY = this.centerY;

        var rad = Math.atan2(clientY - centerY, clientX - centerX) / Math.PI * 180 +
            (Math.atan2(clientY - centerY, clientX - centerX) > 0 ? 0 : 360);

        return rad / 180 * Math.PI;
    },


    //


    _calculateHue: function () {
        var centerX = this.centerX,
            centerY = this.centerY;

        var deg = Math.atan2(clientY - centerY, clientX - centerX) / Math.PI * 180 + 90 +
            (Math.atan2(clientY - centerY, clientX - centerX) / Math.PI * 180 + 90 > 0 ? 0 : 360);

        return deg;
    },


    //
    // Color Triangle
    //


    drawTriangle: function () {
        var ctx = this.triangleCtx;

        var leftTopX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius,
            leftTopY = Math.sin(Math.PI * 2 / 3) * this.triangleRadius;

        ctx.clearRect(0, 0, this.size, this.size);
        ctx.save();
        ctx.translate(this.wheelRadius, this.wheelRadius);

        ctx.beginPath();
        ctx.moveTo(leftTopX, leftTopY);
        ctx.lineTo(this.triangleRadius, 0);
        ctx.lineTo(leftTopX, -leftTopY);
        ctx.closePath();
        ctx.stroke();
        ctx.clip();
        ctx.fillRect(-this.wheelRadius, -this.wheelRadius, this.size, this.size);

        var grad0 = ctx.createLinearGradient(this.triangleRadius, 0, leftTopX, 0);
        var hsla = 'hsla(' + Math.round(this.hue) + ', 100%, 50%, ';
        grad0.addColorStop(0, hsla + '1)');
        grad0.addColorStop(1, hsla + '0)');
        ctx.fillStyle = grad0;
        ctx.fillRect(-this.wheelRadius, -this.wheelRadius, this.size, this.size);

        var grad1 = ctx.createLinearGradient(leftTopX, -leftTopY, (leftTopX + this.triangleRadius) / 2, leftTopY / 2);
        grad1.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
        grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grad1;
        ctx.fillRect(-this.wheelRadius, -this.wheelRadius, this.size, this.size);

        ctx.restore();
    },


    //


    _updateTriangle: function () {
        this.drawTriangle();
        this._setRgb('#test-oekaki');
    },


    //


    _createTriangle: function () {
        var c = document.createElement('canvas');
        c.id = 'color-triangle';
        c.width = c.height = this.size;
        var triangleCtx = c.getContext('2d');

        this.triangleCtx = triangleCtx;
        this.container.appendChild(c);
    },


    //


    _createTriangleCircle: function () {
        var triangleCircle = document.createElement('div');
        triangleCircle.id = 'color-triangle-circle';
        triangleCircle.style.left = this.triangleCirclePosX + 'px';
        triangleCircle.style.top = this.triangleCirclePosY + 'px';

        this.triangleCircle = triangleCircle;
        this.container.appendChild(triangleCircle);
    },


    //


    _colorTriangleArea: function () {
        var isTriangleArea = this._isTriangleArea();
        if (isTriangleArea) {
            this._updateTriangleCircle();
        }
    },


    //


    _isTriangleArea: function () {
        var centerX = this.centerX,
            centerY = this.centerY,
            mouseX = clientX - centerX,
            mouseY = clientY - centerY,
            minX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius,
            maxX = this.triangleRadius,
            maxY = (-mouseX + maxX) / Math.sqrt(3);

        if (mouseX > minX && maxX > mouseX) {
            if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },


    //


    _updateTriangleCircle: function () {
        var centerX = this.centerX,
            centerY = this.centerY,
            mouseX = clientX - centerX,
            mouseY = clientY - centerY,
            minX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius,
            maxX = this.triangleRadius,
            minY = (mouseX - maxX) / Math.sqrt(3),
            maxY = (-mouseX + maxX) / Math.sqrt(3);
        minY = mouseX <= minX ? -Math.sin(Math.PI * 2 / 3) * this.triangleRadius : minY;
        maxY = mouseX <= minX ? Math.sin(Math.PI * 2 / 3) * this.triangleRadius : maxY;

        var pointer = this.triangleCircle,
            $container = $(this.container),
            parentNodeX = $container.offset().left,
            parentNodeY = $container.offset().top,
            left = clientX - parentNodeX,
            top = clientY - parentNodeY;

        if (minX < mouseX && mouseX < maxX) {
            pointer.style.left = left + 'px';
            if (mouseY >= maxY) {
                pointer.style.top = maxY + this.size / 2 + 'px';
            } else if (minY >= mouseY) {
                pointer.style.top = minY + this.size / 2 + 'px';
            } else {
                pointer.style.top = top + 'px';
            }
        } else if (mouseX <= minX) {
            pointer.style.left = minX + this.size / 2 + 'px';
            if (maxY <= mouseY) {
                pointer.style.top = maxY + this.size / 2 + 'px';
            } else if (mouseY <= minY) {
                pointer.style.top = minY + this.size / 2 + 'px';
            } else {
                pointer.style.top = top + 'px';
            }
        } else if (maxX <= mouseX) {
            pointer.style.left = maxX + this.size / 2 + 'px';
            pointer.style.top = this.size / 2 + 'px';
        }

        this.triangleCirclePosX = pointer.style.left.replace('px', '');
        this.triangleCirclePosY = pointer.style.top.replace('px', '');
        this._setRgb('#test-oekaki');
    },


    //


    _setRgb: function (target) {
        var rgb = this._getTriangleColor(),
            r = rgb[0],
            g = rgb[1],
            b = rgb[2];

        this.rgb = [r, g, b];
        $(target).css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
    },


    //


    _getRgba: function (x, y) {
        var ctx = this.triangleCtx;
        var imagedata = ctx.getImageData(x, y, 1, 1),
            r = imagedata.data[0],
            g = imagedata.data[1],
            b = imagedata.data[2],
            a = imagedata.data[3];

        return [r, g, b, a];
    },


    //


    _getTriangleColor: function () {
        var x = this.triangleCirclePosX - this.size / 2,
            y = this.triangleCirclePosY - this.size / 2;
        var leftTopX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius,
            leftTopY = Math.sin(Math.PI * 2 / 3) * this.triangleRadius;
        var a = -Math.tan(Math.PI / 6) * x - y - leftTopY + Math.tan(Math.PI / 6) * leftTopX;
        var d = Math.abs(a) * Math.sin(Math.PI / 3);
        var l = this.triangleRadius * 3 / 2;

        var b = this.hsl2rgb(this.hue / 360, 1.0, 0.5);
        var s = [255, 255, 255];

        var co = [],
            tmp;
        for (let i = 0; i < 3; i++) {
            tmp = s[i] * (l - d) / l + b[i] * (l - (this.triangleRadius - x)) / l;
            tmp = Math.abs(Math.round(tmp));
            co.push(tmp);
        }

        return co;
    },


    ////


    getDistance: function (x1, y1, x2, y2) {
        var xs = x2 - x1,
            ys = y2 - y1;
        xs *= xs;
        ys *= ys;

        return Math.sqrt(xs + ys);
    },


    //


    hsl2rgb: function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.min(Math.floor(r * 256), 255), Math.min(Math.floor(g * 256), 255), Math.min(Math.floor(b * 256), 255)];
    },


    //


    rgb2hsl: function () {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            var d = (max - min);
            s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d + 0) * 60;
                    break;
                case g:
                    h = ((b - r) / d + 2) * 60;
                    break;
                case b:
                    h = ((r - g) / d + 4) * 60;
                    break;
            }
        }

        return [h, s, l];
    },


    //
    // Toggle Buttons
    //


    _toggleTool: function ($container, e) {
        if (e.button != 1) {
            e.stopPropagation();
            $container.toggleClass('active');


            if (this.$toggleButton != null && this.$toggleButton.hasClass('active')) {
                this.$toggleButton.removeClass('active');
            }
            if ($container.hasClass('active')) {
                this.$toggleButton = $container;
            }


            if ($container.hasClass('active') && $container.attr('id') == 'newcanvas-oekaki') {
                this.flgs.newcanvas.newcanvas_flg = true;
                console.log('this.flgs.newcanvas.newcanvas_flg is ', this.flgs.newcanvas.newcanvas_flg);
            } else {
                this.flgs.newcanvas.newcanvas_flg = false;
                console.log('this.flgs.newcanvas.newcanvas_flg is ', this.flgs.newcanvas.newcanvas_flg);
            }
        }
    },


    //
    // Canvas
    //


    _createCanvasWrapper: function () {
        var startX = this.newCanvasX,
            startY = this.newCanvasY;

        newFile.id += 1;
        HIGHEST_Z_INDEX += 1;

        const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
        const assertFile = '<div id ="' + newFile.id + '" class="file-wrap selected-dot" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main is-flipped"></div></div>';
        $('#add-files').append(assertFile);

        const fileId = '#' + newFile.id;
        const $fileId = $(fileId);

        $fileId.css({
            'left': startX * mouseWheelVal + 'px',
            'top': startY * mouseWheelVal + 'px',
            'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
            'z-index': HIGHEST_Z_INDEX,
        });

        this.$newCanvasId = $fileId;
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');

    },


    //


    _updateCanvasVal: function () {
        var $canvas = this.$newCanvasId,
            startX = this.newCanvasX,
            startY = this.newCanvasY,
            endX = clientX,
            endY = clientY;

        var resultX = Math.abs(endX - startX),
            resultY = Math.abs(endY - startY);

        $canvas.css({
            'width': resultX * mouseWheelVal + 'px',
            'height': resultY * mouseWheelVal + 'px'
        });
    },
};


const oekakiContainer = document.getElementById('color-oekaki');
const oekaki = new CANVASEVE.Oekaki(oekakiContainer);
oekaki.load();