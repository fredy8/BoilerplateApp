module.exports = function autoBind(that) {
  var props = Object.getOwnPropertyNames(Object.getPrototypeOf(that));
  var methodNames = props.filter(function (prop) { return typeof that[prop] === 'function' });
  methodNames.forEach(function (methodName) {
    var fn = that[methodName];
    that[methodName] = function () {
      return fn.apply(that, arguments);
    }
  });
};
