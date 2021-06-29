(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["INTER"] = factory();
	else
		root["INTER"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/InterCollection.ts":
/*!*************************************!*\
  !*** ./src/core/InterCollection.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class InterCollection extends Array {
    item(index) {
        return this[index] || null;
    }
}
exports.default = InterCollection;


/***/ }),

/***/ "./src/core/InterElement.ts":
/*!**********************************!*\
  !*** ./src/core/InterElement.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2_1 = __webpack_require__(/*! ../math/Vector2 */ "./src/math/Vector2.ts");
const InterStylesheet_1 = __webpack_require__(/*! ./InterStylesheet */ "./src/core/InterStylesheet.ts");
const InterCollection_1 = __webpack_require__(/*! ./InterCollection */ "./src/core/InterCollection.ts");
/** Represents all elements */
class InterElement {
    parent = null;
    /** element's position within its parent or screen */
    position = new Vector2_1.default(0, 0);
    localPosition = new Vector2_1.default();
    /** element's width and height */
    size = new Vector2_1.default(0, 0);
    stylesheet = new InterStylesheet_1.default();
    children = new InterCollection_1.default();
    hover = false;
    clicked = false;
    get style() {
        return this.stylesheet;
    }
    set style(data) {
        if (typeof data == "string")
            Object.assign(this.stylesheet, JSON.parse(data));
        else
            Object.assign(this.stylesheet, data);
    }
    get nextChild() {
        if (this.parent !== null) {
            return this.parent.children.item(this.parent.children.indexOf(this) + 1);
        }
        else {
            return null;
        }
    }
    get previousChild() {
        if (this.parent !== null) {
            let index = this.parent.children.indexOf(this) - 1;
            return index < 0 ? null : this.parent.children.item(index);
        }
        else {
            return null;
        }
    }
    append(...child) {
        child.forEach(children => {
            children.parent = this;
            this.children.push(children);
        });
    }
    intersects(element, type = "square") {
        const data = this.computedStyleData();
        const elementData = element.computedStyleData();
        switch (type) {
            case "square":
            default:
                return elementData.position.x < data.position.x + this.size.x &&
                    elementData.position.x + element.size.x > data.position.x &&
                    elementData.position.y < data.position.y + this.size.y &&
                    elementData.position.y + element.size.y > data.position.y;
            // will be worked on once radius style is added.
            case "radius":
                return false;
        }
    }
    begin(context) {
        context.save();
        context.beginPath();
        if (this.parent !== null)
            this.localPosition.copy(this.position.clone().add(this.parent.localPosition));
        else
            this.localPosition.copy(this.position);
    }
    end(context) {
        context.restore();
    }
    computedStyleData() {
        const pc = this.previousChild;
        const position = this.localPosition.clone();
        const size = this.size.clone();
        position.x -= this.stylesheet.marginLeft == this.stylesheet.marginRight
            ? 0 : this.stylesheet.marginRight;
        position.x += this.stylesheet.marginLeft;
        position.y += this.stylesheet.marginTop;
        position.y -= this.stylesheet.marginTop == this.stylesheet.marginBottom
            ? 0 : this.stylesheet.marginBottom;
        if (this.stylesheet.stroke == true) {
            position.x += this.stylesheet.strokeSize;
            position.y += this.stylesheet.strokeSize;
        }
        switch (this.stylesheet.display) {
            case "flex":
            default:
                if (this.children.length !== 0) {
                    this.children.forEach(child => {
                        const data = child.computedStyleData();
                        size.x += child.stylesheet.marginRight;
                        size.x += child.stylesheet.marginLeft;
                        size.add(data.size);
                    });
                    let child = this.children.reduce(function (prev, current) {
                        return (prev.size.y > current.size.y) ? prev : current;
                    });
                    let ch = child.computedStyleData();
                    size.y = ch.size.y;
                    size.y += child.stylesheet.marginBottom;
                    size.y += child.stylesheet.marginTop;
                }
                break;
        }
        if (this.parent !== null && pc !== null) {
            switch (this.parent.stylesheet.display) {
                case "flex":
                default:
                    position.x += pc.size.x;
                    position.x += pc.stylesheet.marginRight;
                    position.x += pc.stylesheet.marginLeft;
                    break;
                case "block":
                    position.y -= pc.size.y;
                    position.y -= pc.stylesheet.marginTop;
                    position.y -= pc.stylesheet.marginBottom;
                    break;
            }
        }
        return { position, size };
    }
    renderRound(context, { position, size }) {
        const { x, y } = position;
        const { radius } = this.stylesheet;
        const width = size.x;
        const height = size.y;
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.clip();
    }
    renderStroke(context) {
        let line = context.lineWidth;
        context.lineWidth = this.stylesheet.strokeSize;
        context.stroke();
        context.lineWidth = line;
    }
    render(context, mouse) {
        this.begin(context);
        const style = this.computedStyleData();
        const { position, size } = style;
        if (this.stylesheet.radius !== 0)
            this.renderRound(context, style);
        context.rect(position ? position.x : this.localPosition.x, position ? position.y : this.localPosition.y, size.x, size.y);
        this.draw(context, style);
        context.strokeStyle = this.stylesheet.strokeColor;
        if (this.stylesheet.stroke == true)
            this.renderStroke(context);
        this.hover = context.isPointInPath(mouse.x, mouse.y);
        this.end(context);
    }
    draw(context, style) { }
}
exports.default = InterElement;


/***/ }),

/***/ "./src/core/InterStylesheet.ts":
/*!*************************************!*\
  !*** ./src/core/InterStylesheet.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class InterStylesheet {
    stroke = false;
    strokeSize = 2;
    strokeColor = "black";
    radius = 0;
    marginRight = 0;
    marginTop = 0;
    marginLeft = 0;
    marginBottom = 0;
    _margin = 0;
    get margin() { return this._margin; }
    set margin(data) {
        this.marginRight = data;
        this.marginTop = data;
        this.marginLeft = data;
        this.marginBottom = data;
        this._margin = data;
    }
    display = "flex";
}
exports.default = InterStylesheet;


/***/ }),

/***/ "./src/core/Scene.ts":
/*!***************************!*\
  !*** ./src/core/Scene.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const InterElement_1 = __webpack_require__(/*! ./InterElement */ "./src/core/InterElement.ts");
class Scene extends InterElement_1.default {
    static isScene = true;
}
exports.default = Scene;


/***/ }),

/***/ "./src/core/elements/InterImageElement.ts":
/*!************************************************!*\
  !*** ./src/core/elements/InterImageElement.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const InterElement_1 = __webpack_require__(/*! ../InterElement */ "./src/core/InterElement.ts");
class InterImageElement extends InterElement_1.default {
    _src = "";
    image = new Image(this.size.x, this.size.y);
    loading = false;
    loaded = false;
    get src() {
        return this._src;
    }
    set src(url) {
        this._src = url;
        this.reload();
    }
    reload() {
        this.loading = true;
        this.loaded = false;
        const load = () => {
            this.loaded = true;
            this.loading = false;
            this.image.removeEventListener("load", load);
        };
        this.image.addEventListener("load", load);
        this.image.src = this.src;
    }
    draw(context, style) {
        context.drawImage(this.image, style.position.x, style.position.y, this.size.x, this.size.y);
    }
}
exports.default = InterImageElement;


/***/ }),

/***/ "./src/math/Vector2.ts":
/*!*****************************!*\
  !*** ./src/math/Vector2.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector2 = void 0;
class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        return this;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default: throw new Error('index is out of range: ' + index);
        }
        return this;
    }
    getComponent(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error('index is out of range: ' + index);
        }
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v, w) {
        if (w !== undefined) {
            console.warn('Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    }
    sub(v, w) {
        if (w !== undefined) {
            console.warn('Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    subScalar(s) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }
    clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        return this;
    }
    clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    angle() {
        // computes the angle in radians with respect to the positive x-axis
        const angle = Math.atan2(-this.y, -this.x) + Math.PI;
        return angle;
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    }
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }
    lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        return this;
    }
    equals(v) {
        return ((v.x === this.x) && (v.y === this.y));
    }
    fromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    toArray(array = [], offset = 0) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    }
    random() {
        this.x = Math.random();
        this.y = Math.random();
        return this;
    }
}
exports.default = Vector2;
exports.Vector2 = Vector2;


/***/ }),

/***/ "./src/renderer/InterRenderer.ts":
/*!***************************************!*\
  !*** ./src/renderer/InterRenderer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2_1 = __webpack_require__(/*! ../math/Vector2 */ "./src/math/Vector2.ts");
class InterRenderer {
    mouse = new Vector2_1.default();
    calls = 0;
    _context = null;
    canvas = document.createElement("canvas");
    get context() {
        if (this._context !== null)
            return this._context;
        this._context = this.canvas.getContext("2d");
        return this._context;
    }
    constructor() {
        this.canvas.addEventListener("mousemove", (event) => this.mousemove(event));
    }
    mousemove(event) {
        // important: correct mouse position:
        let rect = this.canvas.getBoundingClientRect();
        this.mouse.set(event.clientX - rect.left, event.clientY - rect.top);
    }
    clear() {
        if (this.context !== null) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    setSize(w, h) {
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w * window.devicePixelRatio;
        this.canvas.height = h * window.devicePixelRatio;
    }
    renderChildren(children) {
        if (this.context !== null) {
            this.calls += 1;
            children.render(this.context, this.mouse);
            children.children.forEach((child) => this.renderChildren(child));
        }
    }
    render(scene) {
        this.calls = 1;
        this.clear();
        this.renderChildren(scene);
    }
}
exports.default = InterRenderer;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InterRenderer = exports.InterImageElement = exports.Scene = exports.InterStylesheet = exports.InterElement = exports.Vector2 = void 0;
var Vector2_1 = __webpack_require__(/*! ./math/Vector2 */ "./src/math/Vector2.ts");
Object.defineProperty(exports, "Vector2", ({ enumerable: true, get: function () { return Vector2_1.default; } }));
var InterElement_1 = __webpack_require__(/*! ./core/InterElement */ "./src/core/InterElement.ts");
Object.defineProperty(exports, "InterElement", ({ enumerable: true, get: function () { return InterElement_1.default; } }));
var InterStylesheet_1 = __webpack_require__(/*! ./core/InterStylesheet */ "./src/core/InterStylesheet.ts");
Object.defineProperty(exports, "InterStylesheet", ({ enumerable: true, get: function () { return InterStylesheet_1.default; } }));
var Scene_1 = __webpack_require__(/*! ./core/Scene */ "./src/core/Scene.ts");
Object.defineProperty(exports, "Scene", ({ enumerable: true, get: function () { return Scene_1.default; } }));
var InterImageElement_1 = __webpack_require__(/*! ./core/elements/InterImageElement */ "./src/core/elements/InterImageElement.ts");
Object.defineProperty(exports, "InterImageElement", ({ enumerable: true, get: function () { return InterImageElement_1.default; } }));
var InterRenderer_1 = __webpack_require__(/*! ./renderer/InterRenderer */ "./src/renderer/InterRenderer.ts");
Object.defineProperty(exports, "InterRenderer", ({ enumerable: true, get: function () { return InterRenderer_1.default; } }));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JTlRFUi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckNvbGxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlclN0eWxlc2hlZXQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9TY2VuZS50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9jb3JlL2VsZW1lbnRzL0ludGVySW1hZ2VFbGVtZW50LnRzIiwid2VicGFjazovL0lOVEVSLy4vc3JjL21hdGgvVmVjdG9yMi50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9yZW5kZXJlci9JbnRlclJlbmRlcmVyLnRzIiwid2VicGFjazovL0lOVEVSL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0lOVEVSLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDUEY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsOENBQWlCO0FBQzNDLDBCQUEwQixtQkFBTyxDQUFDLHdEQUFtQjtBQUNyRCwwQkFBMEIsbUJBQU8sQ0FBQyx3REFBbUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmLGVBQWU7Ozs7Ozs7Ozs7O0FDeE9GO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELGtCQUFrQixtQkFBTyxDQUFDLDhDQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7VUM5Q2Y7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxxQkFBcUIsR0FBRyx5QkFBeUIsR0FBRyxhQUFhLEdBQUcsdUJBQXVCLEdBQUcsb0JBQW9CLEdBQUcsZUFBZTtBQUNwSSxnQkFBZ0IsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDeEMsMkNBQTBDLENBQUMscUNBQXFDLDBCQUEwQixFQUFFLEVBQUUsRUFBQztBQUMvRyxxQkFBcUIsbUJBQU8sQ0FBQyx1REFBcUI7QUFDbEQsZ0RBQStDLENBQUMscUNBQXFDLCtCQUErQixFQUFFLEVBQUUsRUFBQztBQUN6SCx3QkFBd0IsbUJBQU8sQ0FBQyw2REFBd0I7QUFDeEQsbURBQWtELENBQUMscUNBQXFDLGtDQUFrQyxFQUFFLEVBQUUsRUFBQztBQUMvSCxjQUFjLG1CQUFPLENBQUMseUNBQWM7QUFDcEMseUNBQXdDLENBQUMscUNBQXFDLHdCQUF3QixFQUFFLEVBQUUsRUFBQztBQUMzRywwQkFBMEIsbUJBQU8sQ0FBQyxtRkFBbUM7QUFDckUscURBQW9ELENBQUMscUNBQXFDLG9DQUFvQyxFQUFFLEVBQUUsRUFBQztBQUNuSSxzQkFBc0IsbUJBQU8sQ0FBQyxpRUFBMEI7QUFDeEQsaURBQWdELENBQUMscUNBQXFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJJTlRFUlwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJJTlRFUlwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIEludGVyQ29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcclxuICAgIGl0ZW0oaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tpbmRleF0gfHwgbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlckNvbGxlY3Rpb247XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9tYXRoL1ZlY3RvcjJcIik7XHJcbmNvbnN0IEludGVyU3R5bGVzaGVldF8xID0gcmVxdWlyZShcIi4vSW50ZXJTdHlsZXNoZWV0XCIpO1xyXG5jb25zdCBJbnRlckNvbGxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuL0ludGVyQ29sbGVjdGlvblwiKTtcclxuLyoqIFJlcHJlc2VudHMgYWxsIGVsZW1lbnRzICovXHJcbmNsYXNzIEludGVyRWxlbWVudCB7XHJcbiAgICBwYXJlbnQgPSBudWxsO1xyXG4gICAgLyoqIGVsZW1lbnQncyBwb3NpdGlvbiB3aXRoaW4gaXRzIHBhcmVudCBvciBzY3JlZW4gKi9cclxuICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjJfMS5kZWZhdWx0KDAsIDApO1xyXG4gICAgbG9jYWxQb3NpdGlvbiA9IG5ldyBWZWN0b3IyXzEuZGVmYXVsdCgpO1xyXG4gICAgLyoqIGVsZW1lbnQncyB3aWR0aCBhbmQgaGVpZ2h0ICovXHJcbiAgICBzaXplID0gbmV3IFZlY3RvcjJfMS5kZWZhdWx0KDAsIDApO1xyXG4gICAgc3R5bGVzaGVldCA9IG5ldyBJbnRlclN0eWxlc2hlZXRfMS5kZWZhdWx0KCk7XHJcbiAgICBjaGlsZHJlbiA9IG5ldyBJbnRlckNvbGxlY3Rpb25fMS5kZWZhdWx0KCk7XHJcbiAgICBob3ZlciA9IGZhbHNlO1xyXG4gICAgY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgZ2V0IHN0eWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXQ7XHJcbiAgICB9XHJcbiAgICBzZXQgc3R5bGUoZGF0YSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGVzaGVldCwgSlNPTi5wYXJzZShkYXRhKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGVzaGVldCwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBnZXQgbmV4dENoaWxkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaXRlbSh0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgcHJldmlvdXNDaGlsZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKSAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA8IDAgPyBudWxsIDogdGhpcy5wYXJlbnQuY2hpbGRyZW4uaXRlbShpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhcHBlbmQoLi4uY2hpbGQpIHtcclxuICAgICAgICBjaGlsZC5mb3JFYWNoKGNoaWxkcmVuID0+IHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkcmVuKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGludGVyc2VjdHMoZWxlbWVudCwgdHlwZSA9IFwic3F1YXJlXCIpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5jb21wdXRlZFN0eWxlRGF0YSgpO1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnREYXRhID0gZWxlbWVudC5jb21wdXRlZFN0eWxlRGF0YSgpO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic3F1YXJlXCI6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudERhdGEucG9zaXRpb24ueCA8IGRhdGEucG9zaXRpb24ueCArIHRoaXMuc2l6ZS54ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudERhdGEucG9zaXRpb24ueCArIGVsZW1lbnQuc2l6ZS54ID4gZGF0YS5wb3NpdGlvbi54ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudERhdGEucG9zaXRpb24ueSA8IGRhdGEucG9zaXRpb24ueSArIHRoaXMuc2l6ZS55ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudERhdGEucG9zaXRpb24ueSArIGVsZW1lbnQuc2l6ZS55ID4gZGF0YS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAvLyB3aWxsIGJlIHdvcmtlZCBvbiBvbmNlIHJhZGl1cyBzdHlsZSBpcyBhZGRlZC5cclxuICAgICAgICAgICAgY2FzZSBcInJhZGl1c1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJlZ2luKGNvbnRleHQpIHtcclxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5sb2NhbFBvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbi5jbG9uZSgpLmFkZCh0aGlzLnBhcmVudC5sb2NhbFBvc2l0aW9uKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmxvY2FsUG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIGVuZChjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlZFN0eWxlRGF0YSgpIHtcclxuICAgICAgICBjb25zdCBwYyA9IHRoaXMucHJldmlvdXNDaGlsZDtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMubG9jYWxQb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnNpemUuY2xvbmUoKTtcclxuICAgICAgICBwb3NpdGlvbi54IC09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5MZWZ0ID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5SaWdodFxyXG4gICAgICAgICAgICA/IDAgOiB0aGlzLnN0eWxlc2hlZXQubWFyZ2luUmlnaHQ7XHJcbiAgICAgICAgcG9zaXRpb24ueCArPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICBwb3NpdGlvbi55ICs9IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgcG9zaXRpb24ueSAtPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luVG9wID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Cb3R0b21cclxuICAgICAgICAgICAgPyAwIDogdGhpcy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5zdHlsZXNoZWV0LnN0cm9rZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gdGhpcy5zdHlsZXNoZWV0LnN0cm9rZVNpemU7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgKz0gdGhpcy5zdHlsZXNoZWV0LnN0cm9rZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHlsZXNoZWV0LmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsZXhcIjpcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBjaGlsZC5jb21wdXRlZFN0eWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplLnggKz0gY2hpbGQuc3R5bGVzaGVldC5tYXJnaW5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZS54ICs9IGNoaWxkLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZS5hZGQoZGF0YS5zaXplKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHByZXYuc2l6ZS55ID4gY3VycmVudC5zaXplLnkpID8gcHJldiA6IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICBzaXplLnkgPSBjaC5zaXplLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZS55ICs9IGNoaWxkLnN0eWxlc2hlZXQubWFyZ2luQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpemUueSArPSBjaGlsZC5zdHlsZXNoZWV0Lm1hcmdpblRvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwgJiYgcGMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnBhcmVudC5zdHlsZXNoZWV0LmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJmbGV4XCI6XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc2l6ZS54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc3R5bGVzaGVldC5tYXJnaW5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ICs9IHBjLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJibG9ja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc2l6ZS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSAtPSBwYy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBwb3NpdGlvbiwgc2l6ZSB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyUm91bmQoY29udGV4dCwgeyBwb3NpdGlvbiwgc2l6ZSB9KSB7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBwb3NpdGlvbjtcclxuICAgICAgICBjb25zdCB7IHJhZGl1cyB9ID0gdGhpcy5zdHlsZXNoZWV0O1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gc2l6ZS54O1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHNpemUueTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSwgeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgY29udGV4dC5jbGlwKCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXJTdHJva2UoY29udGV4dCkge1xyXG4gICAgICAgIGxldCBsaW5lID0gY29udGV4dC5saW5lV2lkdGg7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB0aGlzLnN0eWxlc2hlZXQuc3Ryb2tlU2l6ZTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gbGluZTtcclxuICAgIH1cclxuICAgIHJlbmRlcihjb250ZXh0LCBtb3VzZSkge1xyXG4gICAgICAgIHRoaXMuYmVnaW4oY29udGV4dCk7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLmNvbXB1dGVkU3R5bGVEYXRhKCk7XHJcbiAgICAgICAgY29uc3QgeyBwb3NpdGlvbiwgc2l6ZSB9ID0gc3R5bGU7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVzaGVldC5yYWRpdXMgIT09IDApXHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUm91bmQoY29udGV4dCwgc3R5bGUpO1xyXG4gICAgICAgIGNvbnRleHQucmVjdChwb3NpdGlvbiA/IHBvc2l0aW9uLnggOiB0aGlzLmxvY2FsUG9zaXRpb24ueCwgcG9zaXRpb24gPyBwb3NpdGlvbi55IDogdGhpcy5sb2NhbFBvc2l0aW9uLnksIHNpemUueCwgc2l6ZS55KTtcclxuICAgICAgICB0aGlzLmRyYXcoY29udGV4dCwgc3R5bGUpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLnN0eWxlc2hlZXQuc3Ryb2tlQ29sb3I7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVzaGVldC5zdHJva2UgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdHJva2UoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5ob3ZlciA9IGNvbnRleHQuaXNQb2ludEluUGF0aChtb3VzZS54LCBtb3VzZS55KTtcclxuICAgICAgICB0aGlzLmVuZChjb250ZXh0KTtcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgc3R5bGUpIHsgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyRWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgSW50ZXJTdHlsZXNoZWV0IHtcclxuICAgIHN0cm9rZSA9IGZhbHNlO1xyXG4gICAgc3Ryb2tlU2l6ZSA9IDI7XHJcbiAgICBzdHJva2VDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgIHJhZGl1cyA9IDA7XHJcbiAgICBtYXJnaW5SaWdodCA9IDA7XHJcbiAgICBtYXJnaW5Ub3AgPSAwO1xyXG4gICAgbWFyZ2luTGVmdCA9IDA7XHJcbiAgICBtYXJnaW5Cb3R0b20gPSAwO1xyXG4gICAgX21hcmdpbiA9IDA7XHJcbiAgICBnZXQgbWFyZ2luKCkgeyByZXR1cm4gdGhpcy5fbWFyZ2luOyB9XHJcbiAgICBzZXQgbWFyZ2luKGRhdGEpIHtcclxuICAgICAgICB0aGlzLm1hcmdpblJpZ2h0ID0gZGF0YTtcclxuICAgICAgICB0aGlzLm1hcmdpblRvcCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5MZWZ0ID0gZGF0YTtcclxuICAgICAgICB0aGlzLm1hcmdpbkJvdHRvbSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5fbWFyZ2luID0gZGF0YTtcclxuICAgIH1cclxuICAgIGRpc3BsYXkgPSBcImZsZXhcIjtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlclN0eWxlc2hlZXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IEludGVyRWxlbWVudF8xID0gcmVxdWlyZShcIi4vSW50ZXJFbGVtZW50XCIpO1xyXG5jbGFzcyBTY2VuZSBleHRlbmRzIEludGVyRWxlbWVudF8xLmRlZmF1bHQge1xyXG4gICAgc3RhdGljIGlzU2NlbmUgPSB0cnVlO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFNjZW5lO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBJbnRlckVsZW1lbnRfMSA9IHJlcXVpcmUoXCIuLi9JbnRlckVsZW1lbnRcIik7XHJcbmNsYXNzIEludGVySW1hZ2VFbGVtZW50IGV4dGVuZHMgSW50ZXJFbGVtZW50XzEuZGVmYXVsdCB7XHJcbiAgICBfc3JjID0gXCJcIjtcclxuICAgIGltYWdlID0gbmV3IEltYWdlKHRoaXMuc2l6ZS54LCB0aGlzLnNpemUueSk7XHJcbiAgICBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICBsb2FkZWQgPSBmYWxzZTtcclxuICAgIGdldCBzcmMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyYztcclxuICAgIH1cclxuICAgIHNldCBzcmModXJsKSB7XHJcbiAgICAgICAgdGhpcy5fc3JjID0gdXJsO1xyXG4gICAgICAgIHRoaXMucmVsb2FkKCk7XHJcbiAgICB9XHJcbiAgICByZWxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWQpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gdGhpcy5zcmM7XHJcbiAgICB9XHJcbiAgICBkcmF3KGNvbnRleHQsIHN0eWxlKSB7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgc3R5bGUucG9zaXRpb24ueCwgc3R5bGUucG9zaXRpb24ueSwgdGhpcy5zaXplLngsIHRoaXMuc2l6ZS55KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlckltYWdlRWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5WZWN0b3IyID0gdm9pZCAwO1xyXG5jbGFzcyBWZWN0b3IyIHtcclxuICAgIHg7XHJcbiAgICB5O1xyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgc2V0KHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueSA9IHNjYWxhcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldFgoeCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRZKHkpIHtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0Q29tcG9uZW50KGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdpbmRleCBpcyBvdXQgb2YgcmFuZ2U6ICcgKyBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0Q29tcG9uZW50KGluZGV4KSB7XHJcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiB0aGlzLng7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHRoaXMueTtcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdpbmRleCBpcyBvdXQgb2YgcmFuZ2U6ICcgKyBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuICAgIGNvcHkodikge1xyXG4gICAgICAgIHRoaXMueCA9IHYueDtcclxuICAgICAgICB0aGlzLnkgPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGQodiwgdykge1xyXG4gICAgICAgIGlmICh3ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdWZWN0b3IyOiAuYWRkKCkgbm93IG9ubHkgYWNjZXB0cyBvbmUgYXJndW1lbnQuIFVzZSAuYWRkVmVjdG9ycyggYSwgYiApIGluc3RlYWQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZFZlY3RvcnModiwgdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueCArPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICs9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxhcihzKSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHM7XHJcbiAgICAgICAgdGhpcy55ICs9IHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRWZWN0b3JzKGEsIGIpIHtcclxuICAgICAgICB0aGlzLnggPSBhLnggKyBiLng7XHJcbiAgICAgICAgdGhpcy55ID0gYS55ICsgYi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkVmVjdG9yKHYsIHMpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54ICogcztcclxuICAgICAgICB0aGlzLnkgKz0gdi55ICogcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1Yih2LCB3KSB7XHJcbiAgICAgICAgaWYgKHcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1ZlY3RvcjI6IC5zdWIoKSBub3cgb25seSBhY2NlcHRzIG9uZSBhcmd1bWVudC4gVXNlIC5zdWJWZWN0b3JzKCBhLCBiICkgaW5zdGVhZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViVmVjdG9ycyh2LCB3KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy54IC09IHYueDtcclxuICAgICAgICB0aGlzLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViU2NhbGFyKHMpIHtcclxuICAgICAgICB0aGlzLnggLT0gcztcclxuICAgICAgICB0aGlzLnkgLT0gcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YlZlY3RvcnMoYSwgYikge1xyXG4gICAgICAgIHRoaXMueCA9IGEueCAtIGIueDtcclxuICAgICAgICB0aGlzLnkgPSBhLnkgLSBiLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWx0aXBseSh2KSB7XHJcbiAgICAgICAgdGhpcy54ICo9IHYueDtcclxuICAgICAgICB0aGlzLnkgKj0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsdGlwbHlTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgdGhpcy54ICo9IHNjYWxhcjtcclxuICAgICAgICB0aGlzLnkgKj0gc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2aWRlKHYpIHtcclxuICAgICAgICB0aGlzLnggLz0gdi54O1xyXG4gICAgICAgIHRoaXMueSAvPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZpZGVTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHlTY2FsYXIoMSAvIHNjYWxhcik7XHJcbiAgICB9XHJcbiAgICBtaW4odikge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgubWluKHRoaXMueCwgdi54KTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLm1pbih0aGlzLnksIHYueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtYXgodikge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgubWF4KHRoaXMueCwgdi54KTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLm1heCh0aGlzLnksIHYueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjbGFtcChtaW4sIG1heCkge1xyXG4gICAgICAgIC8vIGFzc3VtZXMgbWluIDwgbWF4LCBjb21wb25lbnR3aXNlXHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5tYXgobWluLngsIE1hdGgubWluKG1heC54LCB0aGlzLngpKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLm1heChtaW4ueSwgTWF0aC5taW4obWF4LnksIHRoaXMueSkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY2xhbXBTY2FsYXIobWluVmFsLCBtYXhWYWwpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLm1heChtaW5WYWwsIE1hdGgubWluKG1heFZhbCwgdGhpcy54KSk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5tYXgobWluVmFsLCBNYXRoLm1pbihtYXhWYWwsIHRoaXMueSkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgobWluLCBtYXgpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcihsZW5ndGggfHwgMSkubXVsdGlwbHlTY2FsYXIoTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIGxlbmd0aCkpKTtcclxuICAgIH1cclxuICAgIGZsb29yKCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IodGhpcy54KTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKHRoaXMueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjZWlsKCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGguY2VpbCh0aGlzLngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGguY2VpbCh0aGlzLnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm91bmQoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yb3VuZCh0aGlzLngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgucm91bmQodGhpcy55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdW5kVG9aZXJvKCkge1xyXG4gICAgICAgIHRoaXMueCA9ICh0aGlzLnggPCAwKSA/IE1hdGguY2VpbCh0aGlzLngpIDogTWF0aC5mbG9vcih0aGlzLngpO1xyXG4gICAgICAgIHRoaXMueSA9ICh0aGlzLnkgPCAwKSA/IE1hdGguY2VpbCh0aGlzLnkpIDogTWF0aC5mbG9vcih0aGlzLnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnYXRlKCkge1xyXG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRvdCh2KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxuICAgIH1cclxuICAgIGNyb3NzKHYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54O1xyXG4gICAgfVxyXG4gICAgbGVuZ3RoU3EoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH1cclxuICAgIGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBtYW5oYXR0YW5MZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMueCkgKyBNYXRoLmFicyh0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgbm9ybWFsaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcih0aGlzLmxlbmd0aCgpIHx8IDEpO1xyXG4gICAgfVxyXG4gICAgYW5nbGUoKSB7XHJcbiAgICAgICAgLy8gY29tcHV0ZXMgdGhlIGFuZ2xlIGluIHJhZGlhbnMgd2l0aCByZXNwZWN0IHRvIHRoZSBwb3NpdGl2ZSB4LWF4aXNcclxuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoLXRoaXMueSwgLXRoaXMueCkgKyBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH1cclxuICAgIGRpc3RhbmNlVG8odikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU3F1YXJlZCh2KSk7XHJcbiAgICB9XHJcbiAgICBkaXN0YW5jZVRvU3F1YXJlZCh2KSB7XHJcbiAgICAgICAgY29uc3QgZHggPSB0aGlzLnggLSB2LngsIGR5ID0gdGhpcy55IC0gdi55O1xyXG4gICAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcclxuICAgIH1cclxuICAgIG1hbmhhdHRhbkRpc3RhbmNlVG8odikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLnggLSB2LngpICsgTWF0aC5hYnModGhpcy55IC0gdi55KTtcclxuICAgIH1cclxuICAgIHNldExlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgbGVycCh2LCBhbHBoYSkge1xyXG4gICAgICAgIHRoaXMueCArPSAodi54IC0gdGhpcy54KSAqIGFscGhhO1xyXG4gICAgICAgIHRoaXMueSArPSAodi55IC0gdGhpcy55KSAqIGFscGhhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycFZlY3RvcnModjEsIHYyLCBhbHBoYSkge1xyXG4gICAgICAgIHRoaXMueCA9IHYxLnggKyAodjIueCAtIHYxLngpICogYWxwaGE7XHJcbiAgICAgICAgdGhpcy55ID0gdjEueSArICh2Mi55IC0gdjEueSkgKiBhbHBoYTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVxdWFscyh2KSB7XHJcbiAgICAgICAgcmV0dXJuICgodi54ID09PSB0aGlzLngpICYmICh2LnkgPT09IHRoaXMueSkpO1xyXG4gICAgfVxyXG4gICAgZnJvbUFycmF5KGFycmF5LCBvZmZzZXQgPSAwKSB7XHJcbiAgICAgICAgdGhpcy54ID0gYXJyYXlbb2Zmc2V0XTtcclxuICAgICAgICB0aGlzLnkgPSBhcnJheVtvZmZzZXQgKyAxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHRvQXJyYXkoYXJyYXkgPSBbXSwgb2Zmc2V0ID0gMCkge1xyXG4gICAgICAgIGFycmF5W29mZnNldF0gPSB0aGlzLng7XHJcbiAgICAgICAgYXJyYXlbb2Zmc2V0ICsgMV0gPSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG4gICAgcmFuZG9tKCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3IyO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vbWF0aC9WZWN0b3IyXCIpO1xyXG5jbGFzcyBJbnRlclJlbmRlcmVyIHtcclxuICAgIG1vdXNlID0gbmV3IFZlY3RvcjJfMS5kZWZhdWx0KCk7XHJcbiAgICBjYWxscyA9IDA7XHJcbiAgICBfY29udGV4dCA9IG51bGw7XHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgZ2V0IGNvbnRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQgIT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xyXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChldmVudCkgPT4gdGhpcy5tb3VzZW1vdmUoZXZlbnQpKTtcclxuICAgIH1cclxuICAgIG1vdXNlbW92ZShldmVudCkge1xyXG4gICAgICAgIC8vIGltcG9ydGFudDogY29ycmVjdCBtb3VzZSBwb3NpdGlvbjpcclxuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIHRoaXMubW91c2Uuc2V0KGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQsIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0U2l6ZSh3LCBoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3ICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGggKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbHMgKz0gMTtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucmVuZGVyKHRoaXMuY29udGV4dCwgdGhpcy5tb3VzZSk7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnJlbmRlckNoaWxkcmVuKGNoaWxkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyKHNjZW5lKSB7XHJcbiAgICAgICAgdGhpcy5jYWxscyA9IDE7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ2hpbGRyZW4oc2NlbmUpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyUmVuZGVyZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkludGVyUmVuZGVyZXIgPSBleHBvcnRzLkludGVySW1hZ2VFbGVtZW50ID0gZXhwb3J0cy5TY2VuZSA9IGV4cG9ydHMuSW50ZXJTdHlsZXNoZWV0ID0gZXhwb3J0cy5JbnRlckVsZW1lbnQgPSBleHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9tYXRoL1ZlY3RvcjJcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlZlY3RvcjJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFZlY3RvcjJfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgSW50ZXJFbGVtZW50XzEgPSByZXF1aXJlKFwiLi9jb3JlL0ludGVyRWxlbWVudFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJFbGVtZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBJbnRlckVsZW1lbnRfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgSW50ZXJTdHlsZXNoZWV0XzEgPSByZXF1aXJlKFwiLi9jb3JlL0ludGVyU3R5bGVzaGVldFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJTdHlsZXNoZWV0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBJbnRlclN0eWxlc2hlZXRfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgU2NlbmVfMSA9IHJlcXVpcmUoXCIuL2NvcmUvU2NlbmVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlNjZW5lXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBTY2VuZV8xLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBJbnRlckltYWdlRWxlbWVudF8xID0gcmVxdWlyZShcIi4vY29yZS9lbGVtZW50cy9JbnRlckltYWdlRWxlbWVudFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJJbWFnZUVsZW1lbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVySW1hZ2VFbGVtZW50XzEuZGVmYXVsdDsgfSB9KTtcclxudmFyIEludGVyUmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyL0ludGVyUmVuZGVyZXJcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkludGVyUmVuZGVyZXJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVyUmVuZGVyZXJfMS5kZWZhdWx0OyB9IH0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9