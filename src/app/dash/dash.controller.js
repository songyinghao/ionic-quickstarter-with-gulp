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
        { image: 'https://pbs.twimg.com/profile_images/696212819570655232/UJYdhVYj.jpg' },
        { image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg' },
        { image: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png' },
        { image: 'https://pbs.twimg.com/profile_images/692904108424982528/0PESpDwT.jpg'}
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
