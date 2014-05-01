
Function.bind || (Function.prototype.bind = new function () {

    function newApply(Constructor, args) {
        var argNames = [],
            len = args.length,
            i = 0;
        while (i < len) {
            argNames.push('arg' + i);
            i++;
        }
        argNames = argNames.join(',');
        return new Function(
            'Constructor',
            argNames,
            'return new Constructor(' + argNames + ')'
        ).apply(window, [Constructor].concat(args));
    }

    return function (boundThis) {
        var boundArgs = Array.slice(arguments, 1),
            targetFunc = this;
        function boundFunc() {
            var proto,
                args,
                len;
            function NOP() {}
            if (boundFunc._protoMagic) {
                boundFunc._protoMagic = false;
                NOP.prototype = this;
                NOP.prototype.constructor = targetFunc;
                return new NOP;
            } else {
                args = boundArgs.concat(Array.from(arguments));
                len = args.length;
            }
            if (this instanceof boundFunc) {
                boundFunc._protoMagic = true;
                switch (len) {
                    case 0:
                        proto = new targetFunc;
                        break;
                    case 1:
                        proto = new targetFunc(args[0]);
                        break;
                    case 2:
                        proto = new targetFunc(args[0], args[1]);
                        break;
                    default:
                        proto = newApply(targetFunc, args);
                }
                NOP.prototype = proto;
                boundFunc.prototype = new NOP;
                boundFunc.prototype.constructor = boundFunc;
                return new boundFunc;
            }
            switch (len) {
                case 0:
                    return targetFunc.call(boundThis);
                case 1:
                    return targetFunc.call(boundThis, args[0]);
                case 2:
                    return targetFunc.call(boundThis, args[0], args[1]);
            }
            return targetFunc.apply(boundThis, args);
        }
        if ('function' != typeof targetFunc) {
            throw new TypeError(
                'Function.prototype.bind called on non-function'
            );
        }
        boundFunc._protoMagic = false;
        return boundFunc;
    };

});
