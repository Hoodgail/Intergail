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
    renderRound(context, { position }) {
        const { x, y } = position;
        const { radius } = this.stylesheet;
        const width = this.size.x;
        const height = this.size.y;
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
        const { position } = style;
        if (this.stylesheet.radius !== 0)
            this.renderRound(context, style);
        context.rect(position ? position.x : this.localPosition.x, position ? position.y : this.localPosition.y, this.size.x, this.size.y);
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
    renderChildren(children, parent) {
        children.localPosition.copy(children.position.clone().add(parent.localPosition));
        if (this.context !== null) {
            this.calls += 1;
            children.render(this.context, this.mouse);
            children.children.forEach((child) => this.renderChildren(child, children));
        }
    }
    render(scene) {
        this.calls = 0;
        this.clear();
        scene.children.forEach((child) => this.renderChildren(child, scene));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JTlRFUi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckNvbGxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlclN0eWxlc2hlZXQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9TY2VuZS50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9jb3JlL2VsZW1lbnRzL0ludGVySW1hZ2VFbGVtZW50LnRzIiwid2VicGFjazovL0lOVEVSLy4vc3JjL21hdGgvVmVjdG9yMi50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9yZW5kZXJlci9JbnRlclJlbmRlcmVyLnRzIiwid2VicGFjazovL0lOVEVSL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0lOVEVSLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDUEY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsOENBQWlCO0FBQzNDLDBCQUEwQixtQkFBTyxDQUFDLHdEQUFtQjtBQUNyRCwwQkFBMEIsbUJBQU8sQ0FBQyx3REFBbUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBLDBCQUEwQixXQUFXO0FBQ3JDLGVBQWUsT0FBTztBQUN0QixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQ3hJRjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUN0QkY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsdUJBQXVCLG1CQUFPLENBQUMsa0RBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDTkY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsdUJBQXVCLG1CQUFPLENBQUMsbURBQWlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDOUJGO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsZUFBZTs7Ozs7Ozs7Ozs7QUN4T0Y7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsOENBQWlCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7O1VDL0NmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QscUJBQXFCLEdBQUcseUJBQXlCLEdBQUcsYUFBYSxHQUFHLHVCQUF1QixHQUFHLG9CQUFvQixHQUFHLGVBQWU7QUFDcEksZ0JBQWdCLG1CQUFPLENBQUMsNkNBQWdCO0FBQ3hDLDJDQUEwQyxDQUFDLHFDQUFxQywwQkFBMEIsRUFBRSxFQUFFLEVBQUM7QUFDL0cscUJBQXFCLG1CQUFPLENBQUMsdURBQXFCO0FBQ2xELGdEQUErQyxDQUFDLHFDQUFxQywrQkFBK0IsRUFBRSxFQUFFLEVBQUM7QUFDekgsd0JBQXdCLG1CQUFPLENBQUMsNkRBQXdCO0FBQ3hELG1EQUFrRCxDQUFDLHFDQUFxQyxrQ0FBa0MsRUFBRSxFQUFFLEVBQUM7QUFDL0gsY0FBYyxtQkFBTyxDQUFDLHlDQUFjO0FBQ3BDLHlDQUF3QyxDQUFDLHFDQUFxQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUM7QUFDM0csMEJBQTBCLG1CQUFPLENBQUMsbUZBQW1DO0FBQ3JFLHFEQUFvRCxDQUFDLHFDQUFxQyxvQ0FBb0MsRUFBRSxFQUFFLEVBQUM7QUFDbkksc0JBQXNCLG1CQUFPLENBQUMsaUVBQTBCO0FBQ3hELGlEQUFnRCxDQUFDLHFDQUFxQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiSU5URVJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiSU5URVJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBJbnRlckNvbGxlY3Rpb24gZXh0ZW5kcyBBcnJheSB7XHJcbiAgICBpdGVtKGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJDb2xsZWN0aW9uO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vbWF0aC9WZWN0b3IyXCIpO1xyXG5jb25zdCBJbnRlclN0eWxlc2hlZXRfMSA9IHJlcXVpcmUoXCIuL0ludGVyU3R5bGVzaGVldFwiKTtcclxuY29uc3QgSW50ZXJDb2xsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi9JbnRlckNvbGxlY3Rpb25cIik7XHJcbi8qKiBSZXByZXNlbnRzIGFsbCBlbGVtZW50cyAqL1xyXG5jbGFzcyBJbnRlckVsZW1lbnQge1xyXG4gICAgcGFyZW50ID0gbnVsbDtcclxuICAgIC8qKiBlbGVtZW50J3MgcG9zaXRpb24gd2l0aGluIGl0cyBwYXJlbnQgb3Igc2NyZWVuICovXHJcbiAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyXzEuZGVmYXVsdCgwLCAwKTtcclxuICAgIGxvY2FsUG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLmRlZmF1bHQoKTtcclxuICAgIC8qKiBlbGVtZW50J3Mgd2lkdGggYW5kIGhlaWdodCAqL1xyXG4gICAgc2l6ZSA9IG5ldyBWZWN0b3IyXzEuZGVmYXVsdCgwLCAwKTtcclxuICAgIHN0eWxlc2hlZXQgPSBuZXcgSW50ZXJTdHlsZXNoZWV0XzEuZGVmYXVsdCgpO1xyXG4gICAgY2hpbGRyZW4gPSBuZXcgSW50ZXJDb2xsZWN0aW9uXzEuZGVmYXVsdCgpO1xyXG4gICAgaG92ZXIgPSBmYWxzZTtcclxuICAgIGNsaWNrZWQgPSBmYWxzZTtcclxuICAgIGdldCBzdHlsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0O1xyXG4gICAgfVxyXG4gICAgc2V0IHN0eWxlKGRhdGEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlc2hlZXQsIEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlc2hlZXQsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2V0IG5leHRDaGlsZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmNoaWxkcmVuLml0ZW0odGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0IHByZXZpb3VzQ2hpbGQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gbnVsbCA6IHRoaXMucGFyZW50LmNoaWxkcmVuLml0ZW0oaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXBwZW5kKC4uLmNoaWxkKSB7XHJcbiAgICAgICAgY2hpbGQuZm9yRWFjaChjaGlsZHJlbiA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZHJlbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpbnRlcnNlY3RzKGVsZW1lbnQsIHR5cGUgPSBcInNxdWFyZVwiKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICBjb25zdCBlbGVtZW50RGF0YSA9IGVsZW1lbnQuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNxdWFyZVwiOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnREYXRhLnBvc2l0aW9uLnggPCBkYXRhLnBvc2l0aW9uLnggKyB0aGlzLnNpemUueCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnggKyBlbGVtZW50LnNpemUueCA+IGRhdGEucG9zaXRpb24ueCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnkgPCBkYXRhLnBvc2l0aW9uLnkgKyB0aGlzLnNpemUueSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnkgKyBlbGVtZW50LnNpemUueSA+IGRhdGEucG9zaXRpb24ueTtcclxuICAgICAgICAgICAgLy8gd2lsbCBiZSB3b3JrZWQgb24gb25jZSByYWRpdXMgc3R5bGUgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpdXNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBiZWdpbihjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIH1cclxuICAgIGVuZChjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlZFN0eWxlRGF0YSgpIHtcclxuICAgICAgICBjb25zdCBwYyA9IHRoaXMucHJldmlvdXNDaGlsZDtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMubG9jYWxQb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnNpemUuY2xvbmUoKTtcclxuICAgICAgICBwb3NpdGlvbi54IC09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5MZWZ0ID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5SaWdodFxyXG4gICAgICAgICAgICA/IDAgOiB0aGlzLnN0eWxlc2hlZXQubWFyZ2luUmlnaHQ7XHJcbiAgICAgICAgcG9zaXRpb24ueCArPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICBwb3NpdGlvbi55ICs9IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgcG9zaXRpb24ueSAtPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luVG9wID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Cb3R0b21cclxuICAgICAgICAgICAgPyAwIDogdGhpcy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwgJiYgcGMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnBhcmVudC5zdHlsZXNoZWV0LmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJmbGV4XCI6XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc2l6ZS54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc3R5bGVzaGVldC5tYXJnaW5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ICs9IHBjLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJibG9ja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc2l6ZS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSAtPSBwYy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBwb3NpdGlvbiwgc2l6ZSB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyUm91bmQoY29udGV4dCwgeyBwb3NpdGlvbiB9KSB7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBwb3NpdGlvbjtcclxuICAgICAgICBjb25zdCB7IHJhZGl1cyB9ID0gdGhpcy5zdHlsZXNoZWV0O1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5zaXplLng7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5zaXplLnk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xpcCgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyU3Ryb2tlKGNvbnRleHQpIHtcclxuICAgICAgICBsZXQgbGluZSA9IGNvbnRleHQubGluZVdpZHRoO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gdGhpcy5zdHlsZXNoZWV0LnN0cm9rZVNpemU7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IGxpbmU7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoY29udGV4dCwgbW91c2UpIHtcclxuICAgICAgICB0aGlzLmJlZ2luKGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gdGhpcy5jb21wdXRlZFN0eWxlRGF0YSgpO1xyXG4gICAgICAgIGNvbnN0IHsgcG9zaXRpb24gfSA9IHN0eWxlO1xyXG4gICAgICAgIGlmICh0aGlzLnN0eWxlc2hlZXQucmFkaXVzICE9PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclJvdW5kKGNvbnRleHQsIHN0eWxlKTtcclxuICAgICAgICBjb250ZXh0LnJlY3QocG9zaXRpb24gPyBwb3NpdGlvbi54IDogdGhpcy5sb2NhbFBvc2l0aW9uLngsIHBvc2l0aW9uID8gcG9zaXRpb24ueSA6IHRoaXMubG9jYWxQb3NpdGlvbi55LCB0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgICAgIHRoaXMuZHJhdyhjb250ZXh0LCBzdHlsZSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuc3R5bGVzaGVldC5zdHJva2VDb2xvcjtcclxuICAgICAgICBpZiAodGhpcy5zdHlsZXNoZWV0LnN0cm9rZSA9PSB0cnVlKVxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclN0cm9rZShjb250ZXh0KTtcclxuICAgICAgICB0aGlzLmhvdmVyID0gY29udGV4dC5pc1BvaW50SW5QYXRoKG1vdXNlLngsIG1vdXNlLnkpO1xyXG4gICAgICAgIHRoaXMuZW5kKGNvbnRleHQpO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjb250ZXh0LCBzdHlsZSkgeyB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJFbGVtZW50O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBJbnRlclN0eWxlc2hlZXQge1xyXG4gICAgc3Ryb2tlID0gZmFsc2U7XHJcbiAgICBzdHJva2VTaXplID0gMjtcclxuICAgIHN0cm9rZUNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgcmFkaXVzID0gMDtcclxuICAgIG1hcmdpblJpZ2h0ID0gMDtcclxuICAgIG1hcmdpblRvcCA9IDA7XHJcbiAgICBtYXJnaW5MZWZ0ID0gMDtcclxuICAgIG1hcmdpbkJvdHRvbSA9IDA7XHJcbiAgICBfbWFyZ2luID0gMDtcclxuICAgIGdldCBtYXJnaW4oKSB7IHJldHVybiB0aGlzLl9tYXJnaW47IH1cclxuICAgIHNldCBtYXJnaW4oZGF0YSkge1xyXG4gICAgICAgIHRoaXMubWFyZ2luUmlnaHQgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubWFyZ2luVG9wID0gZGF0YTtcclxuICAgICAgICB0aGlzLm1hcmdpbkxlZnQgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubWFyZ2luQm90dG9tID0gZGF0YTtcclxuICAgICAgICB0aGlzLl9tYXJnaW4gPSBkYXRhO1xyXG4gICAgfVxyXG4gICAgZGlzcGxheSA9IFwiZmxleFwiO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyU3R5bGVzaGVldDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgSW50ZXJFbGVtZW50XzEgPSByZXF1aXJlKFwiLi9JbnRlckVsZW1lbnRcIik7XHJcbmNsYXNzIFNjZW5lIGV4dGVuZHMgSW50ZXJFbGVtZW50XzEuZGVmYXVsdCB7XHJcbiAgICBzdGF0aWMgaXNTY2VuZSA9IHRydWU7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gU2NlbmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IEludGVyRWxlbWVudF8xID0gcmVxdWlyZShcIi4uL0ludGVyRWxlbWVudFwiKTtcclxuY2xhc3MgSW50ZXJJbWFnZUVsZW1lbnQgZXh0ZW5kcyBJbnRlckVsZW1lbnRfMS5kZWZhdWx0IHtcclxuICAgIF9zcmMgPSBcIlwiO1xyXG4gICAgaW1hZ2UgPSBuZXcgSW1hZ2UodGhpcy5zaXplLngsIHRoaXMuc2l6ZS55KTtcclxuICAgIGxvYWRpbmcgPSBmYWxzZTtcclxuICAgIGxvYWRlZCA9IGZhbHNlO1xyXG4gICAgZ2V0IHNyYygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3JjO1xyXG4gICAgfVxyXG4gICAgc2V0IHNyYyh1cmwpIHtcclxuICAgICAgICB0aGlzLl9zcmMgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcclxuICAgIH1cclxuICAgIHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgbG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5zcmMgPSB0aGlzLnNyYztcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgc3R5bGUpIHtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBzdHlsZS5wb3NpdGlvbi54LCBzdHlsZS5wb3NpdGlvbi55LCB0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVySW1hZ2VFbGVtZW50O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XHJcbmNsYXNzIFZlY3RvcjIge1xyXG4gICAgeDtcclxuICAgIHk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbiAgICBzZXQoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldFNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICB0aGlzLnggPSBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy55ID0gc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0WCh4KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldFkoeSkge1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRDb21wb25lbnQoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IGlzIG91dCBvZiByYW5nZTogJyArIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRDb21wb25lbnQoaW5kZXgpIHtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMueDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy55O1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IGlzIG91dCBvZiByYW5nZTogJyArIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgY29weSh2KSB7XHJcbiAgICAgICAgdGhpcy54ID0gdi54O1xyXG4gICAgICAgIHRoaXMueSA9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZCh2LCB3KSB7XHJcbiAgICAgICAgaWYgKHcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1ZlY3RvcjI6IC5hZGQoKSBub3cgb25seSBhY2NlcHRzIG9uZSBhcmd1bWVudC4gVXNlIC5hZGRWZWN0b3JzKCBhLCBiICkgaW5zdGVhZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkVmVjdG9ycyh2LCB3KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy54ICs9IHYueDtcclxuICAgICAgICB0aGlzLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGFyKHMpIHtcclxuICAgICAgICB0aGlzLnggKz0gcztcclxuICAgICAgICB0aGlzLnkgKz0gcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFZlY3RvcnMoYSwgYikge1xyXG4gICAgICAgIHRoaXMueCA9IGEueCArIGIueDtcclxuICAgICAgICB0aGlzLnkgPSBhLnkgKyBiLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRWZWN0b3Iodiwgcykge1xyXG4gICAgICAgIHRoaXMueCArPSB2LnggKiBzO1xyXG4gICAgICAgIHRoaXMueSArPSB2LnkgKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKHYsIHcpIHtcclxuICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVmVjdG9yMjogLnN1YigpIG5vdyBvbmx5IGFjY2VwdHMgb25lIGFyZ3VtZW50LiBVc2UgLnN1YlZlY3RvcnMoIGEsIGIgKSBpbnN0ZWFkLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJWZWN0b3JzKHYsIHcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnggLT0gdi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJTY2FsYXIocykge1xyXG4gICAgICAgIHRoaXMueCAtPSBzO1xyXG4gICAgICAgIHRoaXMueSAtPSBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViVmVjdG9ycyhhLCBiKSB7XHJcbiAgICAgICAgdGhpcy54ID0gYS54IC0gYi54O1xyXG4gICAgICAgIHRoaXMueSA9IGEueSAtIGIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bHRpcGx5KHYpIHtcclxuICAgICAgICB0aGlzLnggKj0gdi54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWx0aXBseVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICB0aGlzLnggKj0gc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueSAqPSBzY2FsYXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZpZGUodikge1xyXG4gICAgICAgIHRoaXMueCAvPSB2Lng7XHJcbiAgICAgICAgdGhpcy55IC89IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdmlkZVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseVNjYWxhcigxIC8gc2NhbGFyKTtcclxuICAgIH1cclxuICAgIG1pbih2KSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5taW4odGhpcy54LCB2LngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgubWluKHRoaXMueSwgdi55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG1heCh2KSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5tYXgodGhpcy54LCB2LngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgubWF4KHRoaXMueSwgdi55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNsYW1wKG1pbiwgbWF4KSB7XHJcbiAgICAgICAgLy8gYXNzdW1lcyBtaW4gPCBtYXgsIGNvbXBvbmVudHdpc2VcclxuICAgICAgICB0aGlzLnggPSBNYXRoLm1heChtaW4ueCwgTWF0aC5taW4obWF4LngsIHRoaXMueCkpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgubWF4KG1pbi55LCBNYXRoLm1pbihtYXgueSwgdGhpcy55KSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjbGFtcFNjYWxhcihtaW5WYWwsIG1heFZhbCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgubWF4KG1pblZhbCwgTWF0aC5taW4obWF4VmFsLCB0aGlzLngpKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLm1heChtaW5WYWwsIE1hdGgubWluKG1heFZhbCwgdGhpcy55KSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChtaW4sIG1heCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKGxlbmd0aCB8fCAxKS5tdWx0aXBseVNjYWxhcihNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgbGVuZ3RoKSkpO1xyXG4gICAgfVxyXG4gICAgZmxvb3IoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcih0aGlzLngpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IodGhpcy55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNlaWwoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5jZWlsKHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5jZWlsKHRoaXMueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3VuZCgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJvdW5kKHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5yb3VuZCh0aGlzLnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm91bmRUb1plcm8oKSB7XHJcbiAgICAgICAgdGhpcy54ID0gKHRoaXMueCA8IDApID8gTWF0aC5jZWlsKHRoaXMueCkgOiBNYXRoLmZsb29yKHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gKHRoaXMueSA8IDApID8gTWF0aC5jZWlsKHRoaXMueSkgOiBNYXRoLmZsb29yKHRoaXMueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWdhdGUoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZG90KHYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG4gICAgfVxyXG4gICAgY3Jvc3Modikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XHJcbiAgICB9XHJcbiAgICBsZW5ndGhTcSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xyXG4gICAgfVxyXG4gICAgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuICAgIH1cclxuICAgIG1hbmhhdHRhbkxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy54KSArIE1hdGguYWJzKHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBub3JtYWxpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKHRoaXMubGVuZ3RoKCkgfHwgMSk7XHJcbiAgICB9XHJcbiAgICBhbmdsZSgpIHtcclxuICAgICAgICAvLyBjb21wdXRlcyB0aGUgYW5nbGUgaW4gcmFkaWFucyB3aXRoIHJlc3BlY3QgdG8gdGhlIHBvc2l0aXZlIHgtYXhpc1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMigtdGhpcy55LCAtdGhpcy54KSArIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdGFuY2VUbyh2KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRpc3RhbmNlVG9TcXVhcmVkKHYpKTtcclxuICAgIH1cclxuICAgIGRpc3RhbmNlVG9TcXVhcmVkKHYpIHtcclxuICAgICAgICBjb25zdCBkeCA9IHRoaXMueCAtIHYueCwgZHkgPSB0aGlzLnkgLSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xyXG4gICAgfVxyXG4gICAgbWFuaGF0dGFuRGlzdGFuY2VUbyh2KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMueCAtIHYueCkgKyBNYXRoLmFicyh0aGlzLnkgLSB2LnkpO1xyXG4gICAgfVxyXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKGxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICBsZXJwKHYsIGFscGhhKSB7XHJcbiAgICAgICAgdGhpcy54ICs9ICh2LnggLSB0aGlzLngpICogYWxwaGE7XHJcbiAgICAgICAgdGhpcy55ICs9ICh2LnkgLSB0aGlzLnkpICogYWxwaGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwVmVjdG9ycyh2MSwgdjIsIGFscGhhKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdjEueCArICh2Mi54IC0gdjEueCkgKiBhbHBoYTtcclxuICAgICAgICB0aGlzLnkgPSB2MS55ICsgKHYyLnkgLSB2MS55KSAqIGFscGhhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZXF1YWxzKHYpIHtcclxuICAgICAgICByZXR1cm4gKCh2LnggPT09IHRoaXMueCkgJiYgKHYueSA9PT0gdGhpcy55KSk7XHJcbiAgICB9XHJcbiAgICBmcm9tQXJyYXkoYXJyYXksIG9mZnNldCA9IDApIHtcclxuICAgICAgICB0aGlzLnggPSBhcnJheVtvZmZzZXRdO1xyXG4gICAgICAgIHRoaXMueSA9IGFycmF5W29mZnNldCArIDFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheShhcnJheSA9IFtdLCBvZmZzZXQgPSAwKSB7XHJcbiAgICAgICAgYXJyYXlbb2Zmc2V0XSA9IHRoaXMueDtcclxuICAgICAgICBhcnJheVtvZmZzZXQgKyAxXSA9IHRoaXMueTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICByYW5kb20oKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFZlY3RvcjI7XHJcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9tYXRoL1ZlY3RvcjJcIik7XHJcbmNsYXNzIEludGVyUmVuZGVyZXIge1xyXG4gICAgbW91c2UgPSBuZXcgVmVjdG9yMl8xLmRlZmF1bHQoKTtcclxuICAgIGNhbGxzID0gMDtcclxuICAgIF9jb250ZXh0ID0gbnVsbDtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICBnZXQgY29udGV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGV4dCAhPT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dDtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGV2ZW50KSA9PiB0aGlzLm1vdXNlbW92ZShldmVudCkpO1xyXG4gICAgfVxyXG4gICAgbW91c2Vtb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gaW1wb3J0YW50OiBjb3JyZWN0IG1vdXNlIHBvc2l0aW9uOlxyXG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdGhpcy5tb3VzZS5zZXQoZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCwgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wKTtcclxuICAgIH1cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRTaXplKHcsIGgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHcgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHcgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICB9XHJcbiAgICByZW5kZXJDaGlsZHJlbihjaGlsZHJlbiwgcGFyZW50KSB7XHJcbiAgICAgICAgY2hpbGRyZW4ubG9jYWxQb3NpdGlvbi5jb3B5KGNoaWxkcmVuLnBvc2l0aW9uLmNsb25lKCkuYWRkKHBhcmVudC5sb2NhbFBvc2l0aW9uKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxzICs9IDE7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnJlbmRlcih0aGlzLmNvbnRleHQsIHRoaXMubW91c2UpO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5yZW5kZXJDaGlsZHJlbihjaGlsZCwgY2hpbGRyZW4pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoc2NlbmUpIHtcclxuICAgICAgICB0aGlzLmNhbGxzID0gMDtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgc2NlbmUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMucmVuZGVyQ2hpbGRyZW4oY2hpbGQsIHNjZW5lKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJSZW5kZXJlcjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuSW50ZXJSZW5kZXJlciA9IGV4cG9ydHMuSW50ZXJJbWFnZUVsZW1lbnQgPSBleHBvcnRzLlNjZW5lID0gZXhwb3J0cy5JbnRlclN0eWxlc2hlZXQgPSBleHBvcnRzLkludGVyRWxlbWVudCA9IGV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcclxudmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL21hdGgvVmVjdG9yMlwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiVmVjdG9yMlwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gVmVjdG9yMl8xLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBJbnRlckVsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2NvcmUvSW50ZXJFbGVtZW50XCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJJbnRlckVsZW1lbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVyRWxlbWVudF8xLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBJbnRlclN0eWxlc2hlZXRfMSA9IHJlcXVpcmUoXCIuL2NvcmUvSW50ZXJTdHlsZXNoZWV0XCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJJbnRlclN0eWxlc2hlZXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVyU3R5bGVzaGVldF8xLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBTY2VuZV8xID0gcmVxdWlyZShcIi4vY29yZS9TY2VuZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU2NlbmVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFNjZW5lXzEuZGVmYXVsdDsgfSB9KTtcclxudmFyIEludGVySW1hZ2VFbGVtZW50XzEgPSByZXF1aXJlKFwiLi9jb3JlL2VsZW1lbnRzL0ludGVySW1hZ2VFbGVtZW50XCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJJbnRlckltYWdlRWxlbWVudFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gSW50ZXJJbWFnZUVsZW1lbnRfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgSW50ZXJSZW5kZXJlcl8xID0gcmVxdWlyZShcIi4vcmVuZGVyZXIvSW50ZXJSZW5kZXJlclwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJSZW5kZXJlclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gSW50ZXJSZW5kZXJlcl8xLmRlZmF1bHQ7IH0gfSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=