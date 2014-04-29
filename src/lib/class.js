"use strict";

lib["class"] = {

	extend: function (Class, SuperClass) {
		Class.prototype = Object.create(SuperClass.prototype);
		Class.prototype.constructor = Class;
		Class.super_ = SuperClass;
		return Class;
	}

};

lib.class_ = lib["class"];
