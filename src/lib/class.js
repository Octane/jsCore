"use strict";

lib.classExtends = function (Class, SuperClass) {
	Class.prototype = Object.create(SuperClass.prototype);
	Class.prototype.constructor = Class;
	Class.Super = SuperClass;
};
