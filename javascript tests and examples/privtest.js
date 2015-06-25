var Module = (function () {

  var text='seren';
  var privateArray = [];

  var publicMethod = function (somethingOfInterest) {
    privateArray.push(somethingOfInterest);
  };

  var debug = function() { return this; };
  return {
    publicMethod: publicMethod,
    debug: debug
  };

})();
