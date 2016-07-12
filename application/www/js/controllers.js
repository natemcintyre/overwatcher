application.controllers = angular.module('application.controllers', []);

// controller: ApplicationController
application.controllers.controller('ApplicationController', function ($scope, ApplicationService) {
});

// controller: NavigationMenuController
application.controllers.controller('NavigationMenuController', function ($scope, ApplicationService) {
    ApplicationService.setMenuTitle('Menu');

    $scope.menuItems = [
        {
            targetState: 'home',
            title: 'Overview',
            icon: 'ion-grid'
        },
        {
            targetState: 'search',
            title: 'Search',
            icon: 'ion-search'
        },
        {
            targetState: 'settings',
            title: 'Settings',
            icon: 'ion-settings'
        },
        {
            targetState: 'about',
            title: 'About',
            icon: 'ion-help-circled'
        },
        // {
        //     targetState: 'development',
        //     title: 'Development',
        //     icon: 'ion-gear-b'
        // }
    ];
});

// controller: HomeScreenController
application.controllers.controller('HomeScreenController', function ($scope, ApplicationService) {
    ApplicationService.setHeaderTitle('Overview');
});

// controller: SearchScreenController
application.controllers.controller('SearchScreenController', function ($scope, OverwatchAPI, ApplicationService, LogService) {
    ApplicationService.setHeaderTitle('Overwatcher');

    $scope.search = {
        region: 'na',
        platform: 'pc',
        toggleButtonLabel: 'Hide Search Form',
        toggleButtonIcon: 'ion-chevron-up',
        isHidden: false
    }

    $scope.player = {};
    $scope.player.quickmatch = {};
    $scope.player.competitive = {};

    $scope.searchButtonTapHandler = function searchButtonTapHandler () {
        const logTag = arguments.callee.name;

        // display our spinner
        hideSearchForm();
        $('div#search-error-container').hide();
        $('div#search-results-container').hide();
        $('div#search-spinner-container').show();

        var searchRegion = $scope.search.region;
        var searchPlatform = $scope.search.platform;
        var searchPlayerIdentifier = $scope.search.player;

        LogService.info(logTag, 'Performing search...');
        LogService.info(logTag, 'searchRegion: ' + searchRegion);
        LogService.info(logTag, 'searchPlatform: ' + searchPlatform);
        LogService.info(logTag, 'searchPlayerIdentifier: ' + searchPlayerIdentifier);

        // set our search date time
        $scope.player.searchDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');

        OverwatchAPI.getProfile(searchRegion, searchPlatform, searchPlayerIdentifier, function successCallback (response) {
            var responseStatusCode = response.status;
            var responseData = response.data.data;

            // pull out all our pertinent statistics
            // stats: general
            $scope.player.username = responseData.username;
            $scope.player.level = responseData.level;
            $scope.player.avatarImage = responseData.avatar;
            $scope.player.rank = responseData.competitive.rank;
            $scope.player.rankImage = responseData.competitive.rank_img;

            // stats: quick match
            $scope.player.quickmatch.wins = responseData.games.quick.wins;
            $scope.player.quickmatch.lost = responseData.games.quick.lost;
            $scope.player.quickmatch.gamesPlayed = responseData.games.quick.played;
            $scope.player.quickmatch.hoursPlayed = responseData.playtime.quick.replace(/\D/g,'');
            $scope.player.quickmatch.winPercentage = Math.floor(($scope.player.quickmatch.wins / $scope.player.quickmatch.gamesPlayed) * 100);

            // stats: competitive
            $scope.player.competitive.wins = responseData.games.competitive.wins;
            $scope.player.competitive.lost = responseData.games.competitive.lost;
            $scope.player.competitive.gamesPlayed = responseData.games.competitive.played;
            $scope.player.competitive.hoursPlayed = responseData.playtime.competitive.replace(/\D/g,'');
            $scope.player.competitive.winPercentage = Math.floor(($scope.player.competitive.wins / $scope.player.competitive.gamesPlayed) * 100);

            // fade the view in and hide the spinner
            $('div#search-spinner-container').hide();
            $('div#search-results-container').fadeIn();
        }, function errorCallback (response) {
            $('div#search-spinner-container').hide();
            $('div#search-error-container').fadeIn();
        });
    }

    $scope.toggleSearchButtonTapHandler = function toggleSearchButtonTapHandler () {
        const logTag = arguments.callee.name;

        // determine whether we need to hide or show the search form
        if (!$scope.search.isHidden) {
            hideSearchForm();
        } else {
            showSearchForm();
        }
    }

    function hideSearchForm () {
        $scope.search.isHidden = true;
        $scope.search.toggleButtonLabel = 'Show Search Form';
        $scope.search.toggleButtonIcon = 'ion-chevron-down';
        $('div#search-form-container').slideUp();
    }

    function showSearchForm () {
        $scope.search.isHidden = false;
        $scope.search.toggleButtonLabel = 'Hide Search Form';
        $scope.search.toggleButtonIcon = 'ion-chevron-up';
        $('div#search-form-container').slideDown();
    }
});

// controller: SettingsScreenController
application.controllers.controller('SettingsScreenController', function ($scope, ApplicationService) {
    ApplicationService.setHeaderTitle('Settings');
});

// controller: AboutScreenController
application.controllers.controller('AboutScreenController', function ($scope, ApplicationService) {
    ApplicationService.setHeaderTitle('About Overwatcher');
});

// controller: DevelopmentScreenController
application.controllers.controller('DevelopmentScreenController', function ($scope, ApplicationService, LogService, NetworkService, LocationService, DatabaseService) {
    ApplicationService.setHeaderTitle('Development');

    /**
     * Tap handler for the Development button.
     * @return {Void} 
     */
    $scope.developmentButtonTapHandler = function developmentButtonTapHandler () {
        const logTag = arguments.callee.name;
    
        LogService.debug(logTag, 'BEGIN');
        
        // DEVELOPMENT BUTTON - TEST CODE BELOW



        // DEVELOPMENT BUTTON - TEST CODE ABOVE
        
        LogService.debug(logTag, 'END');
    };
});