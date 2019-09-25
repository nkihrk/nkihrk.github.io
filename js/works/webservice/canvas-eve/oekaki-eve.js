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

    this._createWheelCircle();

    this._createTriangle();
    this._createTriangleCircle();
};


CANVASEVE.Oekaki.prototype = {
    constructor: CANVASEVE.Oekaki,

    options: {},


    load: function () {
        this.drawWheel();
        this.drawTriangle();
        this.setFlgs();
        this.resetFlgs();
        this.handleEvents();
    },


    setFlgs: function () {
        var self = this;

        $(document).on(EVENTNAME_TOUCHSTART, '#color-oekaki', function () {
            var centerX = self.centerX;
            var centerY = self.centerY;
            var minR = self.wheelInnerRadius;
            var maxR = self.wheelRadius;
            var mouseR = self.getDistance(centerX, centerY, clientX, clientY);

            if (mouseR > minR && maxR > mouseR) {
                glFlgs.oekaki.move_wheelcircle_flg = true;
                console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
            }


            var mouseX = clientX - centerX;
            var mouseY = clientY - centerY;
            var minX = Math.cos(Math.PI * 2 / 3) * self.triangleRadius;
            var maxX = self.triangleRadius;
            var maxY = (-mouseX + maxX) / Math.sqrt(3);

            if (mouseX > minX && maxX > mouseX) {
                if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) {
                    glFlgs.oekaki.move_trianglecircle_flg = true;
                    console.log('glFlgs.oekaki.move_trianglecircle_flg is ', glFlgs.oekaki.move_trianglecircle_flg);
                }
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
    },


    //


    resetFlgs: function () {
        $(document).on(EVENTNAME_TOUCHEND, function () {
            if (glFlgs.oekaki.move_wheelcircle_flg == true) {
                glFlgs.oekaki.move_wheelcircle_flg = false;
                console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
            }
            if (glFlgs.oekaki.move_trianglecircle_flg == true) {
                glFlgs.oekaki.move_trianglecircle_flg = false;
                console.log('glFlgs.oekaki.move_trianglecircle_flg is ', glFlgs.oekaki.move_trianglecircle_flg);
            }
        });
    },


    //


    handleEvents: function () {
        var self = this;

        $(document).on(EVENTNAME_TOUCHSTART, '#color-oekaki', function () {
            self._colorWheelArea(self);
            self._colorTriangleArea(self);
        });

        $(document).on(EVENTNAME_TOUCHMOVE, function () {
            var originX = $(self.container).offset().left;
            var originY = $(self.container).offset().top;
            var centerX = originX + self.size / 2;
            var centerY = originY + self.size / 2;
            self.centerX = centerX;
            self.centerY = centerY;


            if (glFlgs.oekaki.move_wheelcircle_flg == true) {
                self._updateWheelCircle();
            }
            if (glFlgs.oekaki.move_trianglecircle_flg == true) {
                self._updateTriangleCircle();
            }
        });
    },


    //
    // Color Wheel
    //


    drawWheel: function () {
        const resolution = 1;
        const outerRadius = 100;
        const innerRadius = outerRadius - this.wheelThickness / this.wheelRadius * 100;

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
        const start = this._polar2Cartesian(x, y, radius, endAngle);
        const end = this._polar2Cartesian(x, y, radius, startAngle);

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
        var wheelCircle = document.createElement('div');
        var r = this.wheelInnerRadius + this.wheelThickness / 2;
        var theta = 0;
        var left = r * Math.cos(theta + 3 / 2 * Math.PI) + this.size / 2;
        var top = r * Math.sin(theta + 3 / 2 * Math.PI) + this.size / 2;

        wheelCircle.id = 'color-wheel-circle';
        wheelCircle.style.left = left + 'px';
        wheelCircle.style.top = top + 'px';

        this.wheelCircle = wheelCircle;

        this.container.appendChild(wheelCircle);
    },


    //


    _colorWheelArea: function (self) {
        var centerX = self.centerX;
        var centerY = self.centerY;
        var minR = self.wheelInnerRadius;
        var maxR = self.wheelRadius;
        var mouseR = self.getDistance(centerX, centerY, clientX, clientY);

        if (mouseR > minR && maxR > mouseR) {
            self._updateWheelCircle();
        }
    },


    //


    _updateWheelCircle: function () {
        var pointer = this.wheelCircle;
        var r = this.wheelInnerRadius + this.wheelThickness / 2;
        var theta = this._calcurateTheta();
        var left = r * Math.cos(theta) + this.size / 2;
        var top = r * Math.sin(theta) + this.size / 2;

        pointer.style.left = left + 'px';
        pointer.style.top = top + 'px';
    },


    //


    _calcurateTheta: function () {
        var centerX = this.centerX;
        var centerY = this.centerY;
        var theta = calcRadians(clientX - centerX, clientY - centerY);

        return theta;
    },


    //
    // Color Triangle
    //


    drawTriangle: function () {
        var ctx = this.triangleCtx;

        var leftTopX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius;
        var leftTopY = Math.sin(Math.PI * 2 / 3) * this.triangleRadius;

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
        ctx.fillStyle = '#000';
        ctx.fillRect(-this.wheelRadius, -this.wheelRadius, this.size, this.size);

        var grad0 = ctx.createLinearGradient(this.triangleRadius, 0, leftTopX, 0);
        var hsla = 'hsla(' + Math.round(0 * (180 / Math.PI)) + ', 100%, 50%, ';
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

        this.triangleCircle = triangleCircle;

        this.container.appendChild(triangleCircle);
    },


    //


    _colorTriangleArea: function (self) {
        var centerX = self.centerX;
        var centerY = self.centerY;
        var mouseX = clientX - centerX;
        var mouseY = clientY - centerY;
        var minX = Math.cos(Math.PI * 2 / 3) * self.triangleRadius;
        var maxX = self.triangleRadius;
        var maxY = (-mouseX + maxX) / Math.sqrt(3);

        self._updateTriangleCircle();

        if (mouseX > minX && maxX > mouseX) {
            if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) {

            }
        }
    },


    //


    _updateTriangleCircle: function () {
        var centerX = this.centerX;
        var centerY = this.centerY;
        var mouseX = clientX - centerX;
        var mouseY = clientY - centerY;
        var minX = Math.cos(Math.PI * 2 / 3) * this.triangleRadius;
        var maxX = this.triangleRadius;
        var minY = (mouseX - maxX) / Math.sqrt(3);
        var maxY = (-mouseX + maxX) / Math.sqrt(3);

        console.log('minY', minY, 'maxY', maxY, 'mouseY', mouseY);


        var pointer = this.triangleCircle;
        var $container = $(this.container);
        var parentNodeX = $container.offset().left;
        var parentNodeY = $container.offset().top;
        var left = clientX - parentNodeX;
        var top = clientY - parentNodeY;

        if (mouseX > minX && maxX > mouseX) {
            pointer.style.left = left + 'px';
            if (mouseY >= maxY) {
                pointer.style.top = maxY + centerY + 'px';
            } else if (minY >= mouseY) {
                pointer.style.top = minY + centerY + 'px';
            } else {
                pointer.style.top = top + 'px';
            }
        }
    },


    ////


    getDistance: function (x1, y1, x2, y2) {
        var xs = x2 - x1,
            ys = y2 - y1;
        xs *= xs;
        ys *= ys;

        return Math.sqrt(xs + ys);
    }


};


const oekakiContainer = document.getElementById('color-oekaki');
const oekaki = new CANVASEVE.Oekaki(oekakiContainer);
oekaki.load();