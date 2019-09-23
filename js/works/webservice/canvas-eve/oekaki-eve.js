CANVASEVE.Oekaki = function (container) {
    var size = container.clientWidth;
    var wheelRadius = size / 2;
    var wheelThickness = size / 2 * 0.15;
    var triangleRadius = (wheelRadius - wheelThickness) * 0.9;

    this.container = container;
    this.size = size;
    this.wheelRadius = wheelRadius;
    this.wheelThickness = wheelThickness;
    this.triangleRadius = triangleRadius;

    this._createWheelCircle();

    this._createTriangle();
    this._createTriangleCircle();
};


CANVASEVE.Oekaki.prototype = {
    constructor: CANVASEVE.Oekaki,

    options: {},

    _createWheelCircle: function () {
        var wheelCircle = document.createElement('div');
        wheelCircle.id = 'color-wheel-circle';

        this.wheelCircle = wheelCircle;

        this.container.appendChild(wheelCircle);
    },


    //


    _polar2Cartesian: function (centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    },


    //


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


    //


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


    //


    _generateOverlay: function (outerRadius, innerRadius, target) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        circle.setAttribute('cx', outerRadius);
        circle.setAttribute('cy', outerRadius);
        circle.setAttribute('r', innerRadius);
        circle.setAttribute('fill', '#262533');

        target.appendChild(circle);
    },


    //


    drawWheel: function () {
        // https://stackoverflow.com/questions/18206361/svg-multiple-color-on-circle-stroke
        const resolution = 1;
        const outerRadius = 100;
        const innerRadius = outerRadius - this.wheelThickness / this.wheelRadius * 100;

        var root = document.getElementById('color-wheel');

        this._generateConicGradiant(outerRadius, resolution, root);
        this._generateOverlay(outerRadius, innerRadius, root);
    },


    //


    _createTriangleCircle: function () {
        var triangleCircle = document.createElement('div');
        triangleCircle.id = 'color-triangle-circle';

        this.triangleCircle = triangleCircle;

        this.container.appendChild(triangleCircle);
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


    drawTriangle: function () {
        // https://github.com/timjb/colortriangle/blob/master/colortriangle.js
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


    load: function () {
        this.drawWheel();
        this.drawTriangle();
    }


};

const oekakiContainer = document.getElementById('color-oekaki');
const oekaki = new CANVASEVE.Oekaki(oekakiContainer);
oekaki.load();