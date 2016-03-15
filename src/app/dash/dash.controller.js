// Dash controller
// Using javaScript closures, wrap Angular components in an Immediately Invoked Function Expression(IIFE).
// Why?: An IIFE removes variables from the global scope. This helps prevent variables and function declarations from living longer than expected in the global scope, which also helps avoid variable collisions.

// Why?: When your code is minified and bundled into a single file for deployment to a production server, you could have collisions of variables and many global variables. An IIFE protects you against both of these by providing variable scope for each file.

(function() {
    'use strict';

    angular
        .module('starter.dash')
        .controller('DashController', DashController);

    DashController.$inject = ['$scope'];

    function DashController($scope) {
      var cardTypes = [
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_e76cff35507b001d268ad8885182567c.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_b9b21af2a303377073fa0b4747e56cd1.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_16_736b4371ad405f0259986389e27d9afa.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_a90a91877a78a36e3fa1aae635c2f218.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_e2247394433b702fd42b817ba6b79d3f.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_f431943200ad20990b0afde81aa81ee3.jpg' },
        { image: 'http://photos.breadtrip.com/photo_2016_02_18_cf723fdb547da5b74308c3dfd2d9e89c.jpg' },
      ];

      $scope.cards = Array.prototype.slice.call(cardTypes, 0);

      $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
      };

      $scope.addCard = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
      };

      $scope.cardSwipedLeft = function(index) {
        console.log('LEFT SWIPE');
        $scope.addCard();
      };
      $scope.cardSwipedRight = function(index) {
        console.log('RIGHT SWIPE');
        $scope.addCard();
      };
    }
})();
