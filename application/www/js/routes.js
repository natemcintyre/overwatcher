application.routes = angular.module('application.routes', []);

application.routes.config(function ($stateProvider, $urlRouterProvider) {
    // define the default route
    $urlRouterProvider.otherwise('/search');

    // layouts
    // layout: single pane full screen
    $stateProvider.state('singlePaneFullScreenLayout', {
        abstract: true,
        views: {
            layout: { templateUrl: 'html/layouts/singlePaneFullScreenLayout.html' }
        }
    });

    // layout: single pane with header
    $stateProvider.state('singlePaneHeaderLayout', {
        abstract: true,
        views: {
            layout: { templateUrl: 'html/layouts/singlePaneHeaderLayout.html' }
        }
    });

    // layout: left navigation full screen
    $stateProvider.state('navigationMenuFullScreenLayout', {
        abstract: true,
        views: {
            layout: { templateUrl: 'html/layouts/navigationMenuFullScreenLayout.html' }
        }
    });

    // layout: left navigation with header
    $stateProvider.state('navigationMenuHeaderLayout', {
        abstract: true,
        views: {
            layout: { templateUrl: 'html/layouts/navigationMenuHeaderLayout.html' }
        }
    });

    // screens
    // screen: home
    $stateProvider.state('home', {
        url: '/',
        parent: 'navigationMenuHeaderLayout',
        views: {
            navigationMenu: { templateUrl: 'html/menus/navigationMenu.html' },
            content: { templateUrl: 'html/screens/home.html' }
        }
    });

    // screen: search
    $stateProvider.state('search', {
        url: '/search',
        parent: 'singlePaneHeaderLayout',
        views: {
            // navigationMenu: { templateUrl: 'html/menus/navigationMenu.html' },
            content: { templateUrl: 'html/screens/search.html' }
        }
    });

    // screen: settings
    $stateProvider.state('settings', {
        url: '/settings',
        parent: 'navigationMenuHeaderLayout',
        views: {
            navigationMenu: { templateUrl: 'html/menus/navigationMenu.html' },
            content: { templateUrl: 'html/screens/settings.html' }
        }
    });

    // screen: about
    $stateProvider.state('about', {
        url: '/about',
        parent: 'navigationMenuHeaderLayout',
        views: {
            navigationMenu: { templateUrl: 'html/menus/navigationMenu.html' },
            content: { templateUrl: 'html/screens/about.html' }
        }
    });

    // screen: development
    $stateProvider.state('development', {
        url: '/development',
        parent: 'navigationMenuHeaderLayout',
        views: {
            navigationMenu: { templateUrl: 'html/menus/navigationMenu.html' },
            content: { templateUrl: 'html/screens/development.html' }
        }
    });
});