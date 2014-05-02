'use strict';

lib.date = new function () {

    var date = this,
        lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function isLeapYear(year) {
        if (!arguments.length) {
            year = new Date;
        }
        if (year instanceof Date) {
            year = year.getFullYear();
        }
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }

    date.isLeapYear = isLeapYear;

    date.getMonthLength = function (monthIndex, year) {
        if (!arguments.length) {
            monthIndex = new Date;
        }
        if (monthIndex instanceof Date) {
            year = monthIndex.getFullYear();
            monthIndex = monthIndex.getMonth();
        }
        if (1 == monthIndex && isLeapYear(year)) {
            return 29;
        }
        return lengths[monthIndex];
    };

};
