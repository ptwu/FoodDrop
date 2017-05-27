angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('causes', {
    url: '/page5',
    templateUrl: 'templates/causes.html',
    controller: 'causesCtrl'
  })

  .state('foodDrop', {
    url: '/page6',
    templateUrl: 'templates/foodDrop.html',
    controller: 'foodDropCtrl'
  })

  .state('myDrops', {
    url: '/page7',
    templateUrl: 'templates/myDrops.html',
    controller: 'myDropsCtrl'
  })

  .state('login', {
    url: '/page8',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/page6')


});