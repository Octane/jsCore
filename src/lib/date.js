"use strict";

lib.date = {

	_monthLengths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	isLeapYear: function (year) {
		if (!arguments.length) {
			year = new Date;
		}
		if (year instanceof Date) {
			year = year.getFullYear();
		}
		return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	},

	monthLength: function (monthIndex, year) {
		if (!arguments.length) {
			monthIndex = new Date;
		}
		if (monthIndex instanceof Date) {
			year = monthIndex.getFullYear();
			monthIndex = monthIndex.getMonth();
		}
		if (monthIndex == 1 && this.isLeapYear(year)) {
			return 29;
		}
		return this._monthLengths[monthIndex];
	}

};
