'use strict';

lib.date = {

    isLeapYear: function (year) {
        if (!arguments.length) {
            year = new Date;
        }
        if (year instanceof Date) {
            year = year.getFullYear();
        }
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    },

    getMonthLength: new function () {
        var lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return function (monthIndex, year) {
            if (!arguments.length) {
                monthIndex = new Date;
            }
            if (monthIndex instanceof Date) {
                year = monthIndex.getFullYear();
                monthIndex = monthIndex.getMonth();
            }
            if (1 == monthIndex && this.isLeapYear(year)) {
                return 29;
            }
            return lengths[monthIndex];
        };
    }

};
