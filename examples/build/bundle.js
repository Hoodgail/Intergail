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
        context.closePath();
        context.clip();
    }
    renderStroke(context) {
        let line = context.lineWidth;
        context.lineWidth = this.stylesheet.strokeSize;
        context.stroke();
        context.lineWidth = line;
    }
    render(context) {
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class InterRenderer {
    calls = 0;
    _context = null;
    canvas = document.createElement("canvas");
    get context() {
        if (this._context !== null)
            return this._context;
        this._context = this.canvas.getContext("2d");
        return this._context;
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
            children.render(this.context);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JTlRFUi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckNvbGxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlckVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9JbnRlclN0eWxlc2hlZXQudHMiLCJ3ZWJwYWNrOi8vSU5URVIvLi9zcmMvY29yZS9TY2VuZS50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9jb3JlL2VsZW1lbnRzL0ludGVySW1hZ2VFbGVtZW50LnRzIiwid2VicGFjazovL0lOVEVSLy4vc3JjL21hdGgvVmVjdG9yMi50cyIsIndlYnBhY2s6Ly9JTlRFUi8uL3NyYy9yZW5kZXJlci9JbnRlclJlbmRlcmVyLnRzIiwid2VicGFjazovL0lOVEVSL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0lOVEVSLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDUEY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsOENBQWlCO0FBQzNDLDBCQUEwQixtQkFBTyxDQUFDLHdEQUFtQjtBQUNyRCwwQkFBMEIsbUJBQU8sQ0FBQyx3REFBbUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsMEJBQTBCLFdBQVc7QUFDckMsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxXQUFXO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDdElGO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHFCQUFxQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQ3RCRjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx1QkFBdUIsbUJBQU8sQ0FBQyxrREFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUNORjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx1QkFBdUIsbUJBQU8sQ0FBQyxtREFBaUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUM5QkY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixlQUFlOzs7Ozs7Ozs7OztBQ3hPRjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7OztVQ3JDZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHFCQUFxQixHQUFHLHlCQUF5QixHQUFHLGFBQWEsR0FBRyx1QkFBdUIsR0FBRyxvQkFBb0IsR0FBRyxlQUFlO0FBQ3BJLGdCQUFnQixtQkFBTyxDQUFDLDZDQUFnQjtBQUN4QywyQ0FBMEMsQ0FBQyxxQ0FBcUMsMEJBQTBCLEVBQUUsRUFBRSxFQUFDO0FBQy9HLHFCQUFxQixtQkFBTyxDQUFDLHVEQUFxQjtBQUNsRCxnREFBK0MsQ0FBQyxxQ0FBcUMsK0JBQStCLEVBQUUsRUFBRSxFQUFDO0FBQ3pILHdCQUF3QixtQkFBTyxDQUFDLDZEQUF3QjtBQUN4RCxtREFBa0QsQ0FBQyxxQ0FBcUMsa0NBQWtDLEVBQUUsRUFBRSxFQUFDO0FBQy9ILGNBQWMsbUJBQU8sQ0FBQyx5Q0FBYztBQUNwQyx5Q0FBd0MsQ0FBQyxxQ0FBcUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFDO0FBQzNHLDBCQUEwQixtQkFBTyxDQUFDLG1GQUFtQztBQUNyRSxxREFBb0QsQ0FBQyxxQ0FBcUMsb0NBQW9DLEVBQUUsRUFBRSxFQUFDO0FBQ25JLHNCQUFzQixtQkFBTyxDQUFDLGlFQUEwQjtBQUN4RCxpREFBZ0QsQ0FBQyxxQ0FBcUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIklOVEVSXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIklOVEVSXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgSW50ZXJDb2xsZWN0aW9uIGV4dGVuZHMgQXJyYXkge1xyXG4gICAgaXRlbShpbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2luZGV4XSB8fCBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyQ29sbGVjdGlvbjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL21hdGgvVmVjdG9yMlwiKTtcclxuY29uc3QgSW50ZXJTdHlsZXNoZWV0XzEgPSByZXF1aXJlKFwiLi9JbnRlclN0eWxlc2hlZXRcIik7XHJcbmNvbnN0IEludGVyQ29sbGVjdGlvbl8xID0gcmVxdWlyZShcIi4vSW50ZXJDb2xsZWN0aW9uXCIpO1xyXG4vKiogUmVwcmVzZW50cyBhbGwgZWxlbWVudHMgKi9cclxuY2xhc3MgSW50ZXJFbGVtZW50IHtcclxuICAgIHBhcmVudCA9IG51bGw7XHJcbiAgICAvKiogZWxlbWVudCdzIHBvc2l0aW9uIHdpdGhpbiBpdHMgcGFyZW50IG9yIHNjcmVlbiAqL1xyXG4gICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLmRlZmF1bHQoMCwgMCk7XHJcbiAgICBsb2NhbFBvc2l0aW9uID0gbmV3IFZlY3RvcjJfMS5kZWZhdWx0KCk7XHJcbiAgICAvKiogZWxlbWVudCdzIHdpZHRoIGFuZCBoZWlnaHQgKi9cclxuICAgIHNpemUgPSBuZXcgVmVjdG9yMl8xLmRlZmF1bHQoMCwgMCk7XHJcbiAgICBzdHlsZXNoZWV0ID0gbmV3IEludGVyU3R5bGVzaGVldF8xLmRlZmF1bHQoKTtcclxuICAgIGNoaWxkcmVuID0gbmV3IEludGVyQ29sbGVjdGlvbl8xLmRlZmF1bHQoKTtcclxuICAgIGdldCBzdHlsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0O1xyXG4gICAgfVxyXG4gICAgc2V0IHN0eWxlKGRhdGEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlc2hlZXQsIEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlc2hlZXQsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2V0IG5leHRDaGlsZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmNoaWxkcmVuLml0ZW0odGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0IHByZXZpb3VzQ2hpbGQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gbnVsbCA6IHRoaXMucGFyZW50LmNoaWxkcmVuLml0ZW0oaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXBwZW5kKC4uLmNoaWxkKSB7XHJcbiAgICAgICAgY2hpbGQuZm9yRWFjaChjaGlsZHJlbiA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZHJlbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpbnRlcnNlY3RzKGVsZW1lbnQsIHR5cGUgPSBcInNxdWFyZVwiKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICBjb25zdCBlbGVtZW50RGF0YSA9IGVsZW1lbnQuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNxdWFyZVwiOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnREYXRhLnBvc2l0aW9uLnggPCBkYXRhLnBvc2l0aW9uLnggKyB0aGlzLnNpemUueCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnggKyBlbGVtZW50LnNpemUueCA+IGRhdGEucG9zaXRpb24ueCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnkgPCBkYXRhLnBvc2l0aW9uLnkgKyB0aGlzLnNpemUueSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnBvc2l0aW9uLnkgKyBlbGVtZW50LnNpemUueSA+IGRhdGEucG9zaXRpb24ueTtcclxuICAgICAgICAgICAgLy8gd2lsbCBiZSB3b3JrZWQgb24gb25jZSByYWRpdXMgc3R5bGUgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgIGNhc2UgXCJyYWRpdXNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBiZWdpbihjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIH1cclxuICAgIGVuZChjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlZFN0eWxlRGF0YSgpIHtcclxuICAgICAgICBjb25zdCBwYyA9IHRoaXMucHJldmlvdXNDaGlsZDtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMubG9jYWxQb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnNpemUuY2xvbmUoKTtcclxuICAgICAgICBwb3NpdGlvbi54IC09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5MZWZ0ID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5SaWdodFxyXG4gICAgICAgICAgICA/IDAgOiB0aGlzLnN0eWxlc2hlZXQubWFyZ2luUmlnaHQ7XHJcbiAgICAgICAgcG9zaXRpb24ueCArPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICBwb3NpdGlvbi55ICs9IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgcG9zaXRpb24ueSAtPSB0aGlzLnN0eWxlc2hlZXQubWFyZ2luVG9wID09IHRoaXMuc3R5bGVzaGVldC5tYXJnaW5Cb3R0b21cclxuICAgICAgICAgICAgPyAwIDogdGhpcy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwgJiYgcGMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnBhcmVudC5zdHlsZXNoZWV0LmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJmbGV4XCI6XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc2l6ZS54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gcGMuc3R5bGVzaGVldC5tYXJnaW5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ICs9IHBjLnN0eWxlc2hlZXQubWFyZ2luTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJibG9ja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc2l6ZS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gcGMuc3R5bGVzaGVldC5tYXJnaW5Ub3A7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSAtPSBwYy5zdHlsZXNoZWV0Lm1hcmdpbkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBwb3NpdGlvbiwgc2l6ZSB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyUm91bmQoY29udGV4dCwgeyBwb3NpdGlvbiB9KSB7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBwb3NpdGlvbjtcclxuICAgICAgICBjb25zdCB7IHJhZGl1cyB9ID0gdGhpcy5zdHlsZXNoZWV0O1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5zaXplLng7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5zaXplLnk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5jbGlwKCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXJTdHJva2UoY29udGV4dCkge1xyXG4gICAgICAgIGxldCBsaW5lID0gY29udGV4dC5saW5lV2lkdGg7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB0aGlzLnN0eWxlc2hlZXQuc3Ryb2tlU2l6ZTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gbGluZTtcclxuICAgIH1cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5iZWdpbihjb250ZXh0KTtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IHRoaXMuY29tcHV0ZWRTdHlsZURhdGEoKTtcclxuICAgICAgICBjb25zdCB7IHBvc2l0aW9uIH0gPSBzdHlsZTtcclxuICAgICAgICBpZiAodGhpcy5zdHlsZXNoZWV0LnJhZGl1cyAhPT0gMClcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJSb3VuZChjb250ZXh0LCBzdHlsZSk7XHJcbiAgICAgICAgY29udGV4dC5yZWN0KHBvc2l0aW9uID8gcG9zaXRpb24ueCA6IHRoaXMubG9jYWxQb3NpdGlvbi54LCBwb3NpdGlvbiA/IHBvc2l0aW9uLnkgOiB0aGlzLmxvY2FsUG9zaXRpb24ueSwgdGhpcy5zaXplLngsIHRoaXMuc2l6ZS55KTtcclxuICAgICAgICB0aGlzLmRyYXcoY29udGV4dCwgc3R5bGUpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLnN0eWxlc2hlZXQuc3Ryb2tlQ29sb3I7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVzaGVldC5zdHJva2UgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdHJva2UoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5lbmQoY29udGV4dCk7XHJcbiAgICB9XHJcbiAgICBkcmF3KGNvbnRleHQsIHN0eWxlKSB7IH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlckVsZW1lbnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIEludGVyU3R5bGVzaGVldCB7XHJcbiAgICBzdHJva2UgPSBmYWxzZTtcclxuICAgIHN0cm9rZVNpemUgPSAyO1xyXG4gICAgc3Ryb2tlQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICByYWRpdXMgPSAwO1xyXG4gICAgbWFyZ2luUmlnaHQgPSAwO1xyXG4gICAgbWFyZ2luVG9wID0gMDtcclxuICAgIG1hcmdpbkxlZnQgPSAwO1xyXG4gICAgbWFyZ2luQm90dG9tID0gMDtcclxuICAgIF9tYXJnaW4gPSAwO1xyXG4gICAgZ2V0IG1hcmdpbigpIHsgcmV0dXJuIHRoaXMuX21hcmdpbjsgfVxyXG4gICAgc2V0IG1hcmdpbihkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5SaWdodCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5Ub3AgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubWFyZ2luTGVmdCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5Cb3R0b20gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuX21hcmdpbiA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICBkaXNwbGF5ID0gXCJmbGV4XCI7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJTdHlsZXNoZWV0O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBJbnRlckVsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL0ludGVyRWxlbWVudFwiKTtcclxuY2xhc3MgU2NlbmUgZXh0ZW5kcyBJbnRlckVsZW1lbnRfMS5kZWZhdWx0IHtcclxuICAgIHN0YXRpYyBpc1NjZW5lID0gdHJ1ZTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBTY2VuZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgSW50ZXJFbGVtZW50XzEgPSByZXF1aXJlKFwiLi4vSW50ZXJFbGVtZW50XCIpO1xyXG5jbGFzcyBJbnRlckltYWdlRWxlbWVudCBleHRlbmRzIEludGVyRWxlbWVudF8xLmRlZmF1bHQge1xyXG4gICAgX3NyYyA9IFwiXCI7XHJcbiAgICBpbWFnZSA9IG5ldyBJbWFnZSh0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgbG9hZGVkID0gZmFsc2U7XHJcbiAgICBnZXQgc3JjKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcmM7XHJcbiAgICB9XHJcbiAgICBzZXQgc3JjKHVybCkge1xyXG4gICAgICAgIHRoaXMuX3NyYyA9IHVybDtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgfVxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkKTtcclxuICAgICAgICB0aGlzLmltYWdlLnNyYyA9IHRoaXMuc3JjO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjb250ZXh0LCBzdHlsZSkge1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHN0eWxlLnBvc2l0aW9uLngsIHN0eWxlLnBvc2l0aW9uLnksIHRoaXMuc2l6ZS54LCB0aGlzLnNpemUueSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJJbWFnZUVsZW1lbnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcclxuY2xhc3MgVmVjdG9yMiB7XHJcbiAgICB4O1xyXG4gICAgeTtcclxuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuICAgIHNldCh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0U2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIHRoaXMueCA9IHNjYWxhcjtcclxuICAgICAgICB0aGlzLnkgPSBzY2FsYXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRYKHgpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0WSh5KSB7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldENvbXBvbmVudChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignaW5kZXggaXMgb3V0IG9mIHJhbmdlOiAnICsgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGdldENvbXBvbmVudChpbmRleCkge1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy54O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLnk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignaW5kZXggaXMgb3V0IG9mIHJhbmdlOiAnICsgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBjb3B5KHYpIHtcclxuICAgICAgICB0aGlzLnggPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ID0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkKHYsIHcpIHtcclxuICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVmVjdG9yMjogLmFkZCgpIG5vdyBvbmx5IGFjY2VwdHMgb25lIGFyZ3VtZW50LiBVc2UgLmFkZFZlY3RvcnMoIGEsIGIgKSBpbnN0ZWFkLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRWZWN0b3JzKHYsIHcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsYXIocykge1xyXG4gICAgICAgIHRoaXMueCArPSBzO1xyXG4gICAgICAgIHRoaXMueSArPSBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkVmVjdG9ycyhhLCBiKSB7XHJcbiAgICAgICAgdGhpcy54ID0gYS54ICsgYi54O1xyXG4gICAgICAgIHRoaXMueSA9IGEueSArIGIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFZlY3Rvcih2LCBzKSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHYueCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IHYueSAqIHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIodiwgdykge1xyXG4gICAgICAgIGlmICh3ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdWZWN0b3IyOiAuc3ViKCkgbm93IG9ubHkgYWNjZXB0cyBvbmUgYXJndW1lbnQuIFVzZSAuc3ViVmVjdG9ycyggYSwgYiApIGluc3RlYWQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YlZlY3RvcnModiwgdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueCAtPSB2Lng7XHJcbiAgICAgICAgdGhpcy55IC09IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YlNjYWxhcihzKSB7XHJcbiAgICAgICAgdGhpcy54IC09IHM7XHJcbiAgICAgICAgdGhpcy55IC09IHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJWZWN0b3JzKGEsIGIpIHtcclxuICAgICAgICB0aGlzLnggPSBhLnggLSBiLng7XHJcbiAgICAgICAgdGhpcy55ID0gYS55IC0gYi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsdGlwbHkodikge1xyXG4gICAgICAgIHRoaXMueCAqPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICo9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bHRpcGx5U2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIHRoaXMueCAqPSBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy55ICo9IHNjYWxhcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdmlkZSh2KSB7XHJcbiAgICAgICAgdGhpcy54IC89IHYueDtcclxuICAgICAgICB0aGlzLnkgLz0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2aWRlU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKDEgLyBzY2FsYXIpO1xyXG4gICAgfVxyXG4gICAgbWluKHYpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLm1pbih0aGlzLngsIHYueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5taW4odGhpcy55LCB2LnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbWF4KHYpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLm1heCh0aGlzLngsIHYueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5tYXgodGhpcy55LCB2LnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY2xhbXAobWluLCBtYXgpIHtcclxuICAgICAgICAvLyBhc3N1bWVzIG1pbiA8IG1heCwgY29tcG9uZW50d2lzZVxyXG4gICAgICAgIHRoaXMueCA9IE1hdGgubWF4KG1pbi54LCBNYXRoLm1pbihtYXgueCwgdGhpcy54KSk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5tYXgobWluLnksIE1hdGgubWluKG1heC55LCB0aGlzLnkpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNsYW1wU2NhbGFyKG1pblZhbCwgbWF4VmFsKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5tYXgobWluVmFsLCBNYXRoLm1pbihtYXhWYWwsIHRoaXMueCkpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgubWF4KG1pblZhbCwgTWF0aC5taW4obWF4VmFsLCB0aGlzLnkpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoKG1pbiwgbWF4KSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGVTY2FsYXIobGVuZ3RoIHx8IDEpLm11bHRpcGx5U2NhbGFyKE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCBsZW5ndGgpKSk7XHJcbiAgICB9XHJcbiAgICBmbG9vcigpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcih0aGlzLnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY2VpbCgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmNlaWwodGhpcy54KTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLmNlaWwodGhpcy55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdW5kKCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucm91bmQodGhpcy54KTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnJvdW5kKHRoaXMueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3VuZFRvWmVybygpIHtcclxuICAgICAgICB0aGlzLnggPSAodGhpcy54IDwgMCkgPyBNYXRoLmNlaWwodGhpcy54KSA6IE1hdGguZmxvb3IodGhpcy54KTtcclxuICAgICAgICB0aGlzLnkgPSAodGhpcy55IDwgMCkgPyBNYXRoLmNlaWwodGhpcy55KSA6IE1hdGguZmxvb3IodGhpcy55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZ2F0ZSgpIHtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkb3Qodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbiAgICB9XHJcbiAgICBjcm9zcyh2KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueDtcclxuICAgIH1cclxuICAgIGxlbmd0aFNxKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9XHJcbiAgICBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgbWFuaGF0dGFuTGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLngpICsgTWF0aC5hYnModGhpcy55KTtcclxuICAgIH1cclxuICAgIG5vcm1hbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGVTY2FsYXIodGhpcy5sZW5ndGgoKSB8fCAxKTtcclxuICAgIH1cclxuICAgIGFuZ2xlKCkge1xyXG4gICAgICAgIC8vIGNvbXB1dGVzIHRoZSBhbmdsZSBpbiByYWRpYW5zIHdpdGggcmVzcGVjdCB0byB0aGUgcG9zaXRpdmUgeC1heGlzXHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKC10aGlzLnksIC10aGlzLngpICsgTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICB9XHJcbiAgICBkaXN0YW5jZVRvKHYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQodikpO1xyXG4gICAgfVxyXG4gICAgZGlzdGFuY2VUb1NxdWFyZWQodikge1xyXG4gICAgICAgIGNvbnN0IGR4ID0gdGhpcy54IC0gdi54LCBkeSA9IHRoaXMueSAtIHYueTtcclxuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XHJcbiAgICB9XHJcbiAgICBtYW5oYXR0YW5EaXN0YW5jZVRvKHYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy54IC0gdi54KSArIE1hdGguYWJzKHRoaXMueSAtIHYueSk7XHJcbiAgICB9XHJcbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKCkubXVsdGlwbHlTY2FsYXIobGVuZ3RoKTtcclxuICAgIH1cclxuICAgIGxlcnAodiwgYWxwaGEpIHtcclxuICAgICAgICB0aGlzLnggKz0gKHYueCAtIHRoaXMueCkgKiBhbHBoYTtcclxuICAgICAgICB0aGlzLnkgKz0gKHYueSAtIHRoaXMueSkgKiBhbHBoYTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBWZWN0b3JzKHYxLCB2MiwgYWxwaGEpIHtcclxuICAgICAgICB0aGlzLnggPSB2MS54ICsgKHYyLnggLSB2MS54KSAqIGFscGhhO1xyXG4gICAgICAgIHRoaXMueSA9IHYxLnkgKyAodjIueSAtIHYxLnkpICogYWxwaGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlcXVhbHModikge1xyXG4gICAgICAgIHJldHVybiAoKHYueCA9PT0gdGhpcy54KSAmJiAodi55ID09PSB0aGlzLnkpKTtcclxuICAgIH1cclxuICAgIGZyb21BcnJheShhcnJheSwgb2Zmc2V0ID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IGFycmF5W29mZnNldF07XHJcbiAgICAgICAgdGhpcy55ID0gYXJyYXlbb2Zmc2V0ICsgMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KGFycmF5ID0gW10sIG9mZnNldCA9IDApIHtcclxuICAgICAgICBhcnJheVtvZmZzZXRdID0gdGhpcy54O1xyXG4gICAgICAgIGFycmF5W29mZnNldCArIDFdID0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuICAgIHJhbmRvbSgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yMjtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgSW50ZXJSZW5kZXJlciB7XHJcbiAgICBjYWxscyA9IDA7XHJcbiAgICBfY29udGV4dCA9IG51bGw7XHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgZ2V0IGNvbnRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQgIT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xyXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0U2l6ZSh3LCBoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3ICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGggKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW4sIHBhcmVudCkge1xyXG4gICAgICAgIGNoaWxkcmVuLmxvY2FsUG9zaXRpb24uY29weShjaGlsZHJlbi5wb3NpdGlvbi5jbG9uZSgpLmFkZChwYXJlbnQubG9jYWxQb3NpdGlvbikpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxscyArPSAxO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5yZW5kZXIodGhpcy5jb250ZXh0KTtcclxuICAgICAgICAgICAgY2hpbGRyZW4uY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMucmVuZGVyQ2hpbGRyZW4oY2hpbGQsIGNoaWxkcmVuKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyKHNjZW5lKSB7XHJcbiAgICAgICAgdGhpcy5jYWxscyA9IDA7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHNjZW5lLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnJlbmRlckNoaWxkcmVuKGNoaWxkLCBzY2VuZSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyUmVuZGVyZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkludGVyUmVuZGVyZXIgPSBleHBvcnRzLkludGVySW1hZ2VFbGVtZW50ID0gZXhwb3J0cy5TY2VuZSA9IGV4cG9ydHMuSW50ZXJTdHlsZXNoZWV0ID0gZXhwb3J0cy5JbnRlckVsZW1lbnQgPSBleHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9tYXRoL1ZlY3RvcjJcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlZlY3RvcjJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFZlY3RvcjJfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgSW50ZXJFbGVtZW50XzEgPSByZXF1aXJlKFwiLi9jb3JlL0ludGVyRWxlbWVudFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJFbGVtZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBJbnRlckVsZW1lbnRfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgSW50ZXJTdHlsZXNoZWV0XzEgPSByZXF1aXJlKFwiLi9jb3JlL0ludGVyU3R5bGVzaGVldFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJTdHlsZXNoZWV0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBJbnRlclN0eWxlc2hlZXRfMS5kZWZhdWx0OyB9IH0pO1xyXG52YXIgU2NlbmVfMSA9IHJlcXVpcmUoXCIuL2NvcmUvU2NlbmVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlNjZW5lXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBTY2VuZV8xLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBJbnRlckltYWdlRWxlbWVudF8xID0gcmVxdWlyZShcIi4vY29yZS9lbGVtZW50cy9JbnRlckltYWdlRWxlbWVudFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSW50ZXJJbWFnZUVsZW1lbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVySW1hZ2VFbGVtZW50XzEuZGVmYXVsdDsgfSB9KTtcclxudmFyIEludGVyUmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyL0ludGVyUmVuZGVyZXJcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkludGVyUmVuZGVyZXJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEludGVyUmVuZGVyZXJfMS5kZWZhdWx0OyB9IH0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9