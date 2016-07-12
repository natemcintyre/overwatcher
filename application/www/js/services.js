application.services = angular.module('application.services', []);

// ApplicationService
application.services.service('ApplicationService', function () {
    return {
        /**
         * Sets the background color for the application header bar.
         * @param {String} newColor     New color (hex or color string) for the application header bar.
         */
        setHeaderBackgroundColor: function setHeaderBackgroundColor (newColor) {
            $('ion-header-bar#application-header').css('background', newColor);
        },

        /**
         * Setst he foreground color (text, button, etc) for the application header bar.
         * @param {String} newColor     New color (hex or color string) for the application header bar.
         */
        setHeaderForegroundColor: function setHeaderTextColor (newColor) {
            $('h1#application-header-title').css('color', newColor);
            $('ion-header-bar#application-header button').css('color', newColor);
        },

        /**
         * Changes the application header title.
         * @param {String} headerTitle      New title for the application header.
         */
        setHeaderTitle: function setHeaderTitle (headerTitle) {
            $('h1#application-header-title').html(headerTitle);
        }, 

        /**
         * Changes the application navigation menu title.
         * @param {String} menuTitle        New title for the application menu.
         */
        setMenuTitle: function setMenuTitle (menuTitle) {
            $('h1#navigation-menu-title').html(menuTitle);
        },

        /**
         * Returns device information for the current system.
         * NOTE: This is only available on physical devices and is not supported by browser.
         * @return {Object}     Device information object. 
         */
        getDeviceInformation: function getDeviceInformation () {
            return ionic.Platform.device();
        },

        /**
         * Returns a string name of the current system platform (ex: 'android').
         * @return {String}     Name of the current platform.
         */
        getPlatform: function getPlatform () {
            return ionic.Platform.platform();
        },

        /**
         * Returns true/false depending on if the current system platform is a browser.
         * @return {Boolean}
         */
        isBrowser: function isBrowser () {
            return ionic.Platform.isWebView();
        },

        /**
         * Returns true/false depending of if the current system platform is Android.
         * @return {Boolean} 
         */
        isAndroid: function isAndroid () {
            return ionic.Platform.isAndroid();
        },

        /**
         * Returns true/false depending on if the current system platform is iOS.
         * @return {Boolean} 
         */
        isIOS: function isIOS () {
            return ionic.Platform.isIOS();
        },

        /**
         * Returns true/false depending on if the current system platform is Windows Phone.
         * @return {Boolean}
         */
        isWindowsPhone: function isWindowsPhone () {
            return ionic.Platform.isWindowsPhone();
        }
    };
});

// NetworkService
application.services.service('NetworkService', function ($cordovaNetwork) {
    return {
        /**
         * Determines whether or not the device currently has access to a network connection.
         * @return {Boolean}
         */
        isOnline: function () {
            return $cordovaNetwork.isOnline();
        },

        /**
         * Determines whether or not the device currently does not have access to a network connection.
         * @return {Boolean}
         */
        isOffline: function () {
            return $cordovaNetwork.isOffline();
        }
    };
});

// DatabaseService
application.services.service('DatabaseService', function ($cordovaSQLite, ApplicationService, LogService) {
    var currentDatabase = null;
    var currentDatabaseName = null;

    /**
     * Helper function to test for whether or not the DatabaseService is supported for the current platform.
     * NOTE: Currently only Android and iOS are supported.
     * @return {Boolean}
     */
    function isDatabaseServiceSupported () {
        return ApplicationService.isAndroid() || ApplicationService.isIOS();
    }

    return {
        /**
         * Establishes a connection to the database name specified.
         * @param  {String} databaseName        Database to connect to.
         * @return {Object}                     Handle to the database.
         */
        openDatabase: function openDatabase (databaseName) {
            const logTag = arguments.callee.name;

            // only execute if the current platform is supported
            if (isDatabaseServiceSupported()) {
                currentDatabaseName = databaseName + '.sqlite3';

                LogService.info(logTag, 'Attempting to open a connection to database: ' + currentDatabaseName);
                currentDatabase = $cordovaSQLite.openDB({ name: currentDatabaseName, location: 'default' }, function () {
                    LogService.info(logTag, 'Successfully opened a connection to database: ' + currentDatabaseName);
                }, function (error) {
                    LogService.error(logTag, 'Unable to open a connection to the database (' + currentDatabaseName + '): ' + error.message);
                });
            } else {
                LogService.error(logTag, 'DatabaseService is not supported on the current platform: ' + ApplicationService.getPlatform());
            }
        },

        /**
         * Closes the connection to the database.
         * @return {Void}
         */
        closeDatabase: function closeDatabase () {
            const logTag = arguments.callee.name;

            // only execute if the current platform is supported
            if (isDatabaseServiceSupported()) {
                LogService.info(logTag, 'Attempting to close connection to database: ' + currentDatabaseName);
                currentDatabase.close(function () {
                    LogService.info(logTag, 'Successfully closed connection to database: ' + currentDatabaseName);
                }, function (error) {
                    LogService.error(logTag, 'Error occurred attempting to close database: ' + currentDatabaseName);
                });
            } else {
                LogService.error(logTag, 'DatabaseService is not supported on the current platform: ' + ApplicationService.getPlatform());
            }
        }, 

        executeQuery: function executeQuery (query, arguments) {
        }
    };
});

// LogService
application.services.service('LogService', function () {
    // iso8601 compliant date format for our logging
    const LOG_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

    // use an enum for handling different log levels
    LogLevel = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        ERROR: 'ERROR'
    }

    /**
     * Writes a log message with the specified level, tag, and message string.
     * @param  {String} logLevel        Level of this log message. See LogLevel object.
     * @param  {String} logTag          Tag for this log message. Often the function name that the message is being sent from.
     * @param  {String} logMessage      Message to log.
     * @return {Void}            
     */
    function logMessage (logLevel, logTag, logMessage) {
        var logString = '[' + moment().format(LOG_DATE_FORMAT) + '][' + logLevel + '][' + logTag + '] ' + logMessage;
        console.log(logString);
    };

    return {
        /**
         * Writes a DEBUG log message.
         * @param  {String} debugTag        Tag for this log message. Often the function name that the message is being sent from.
         * @param  {String} debugMessage    Message to log.
         * @return {Void}
         */
        debug: function debug (debugTag, debugMessage) {
            logMessage(LogLevel.DEBUG, debugTag, debugMessage);
        },

        /**
         * Writes an INFO log message.
         * @param  {String} infoTag         Tag for this log message. Often the function name that the message is being sent from.
         * @param  {String} infoMessage     Message to log.
         * @return {Void}             
         */
        info: function info (infoTag, infoMessage) {
            logMessage(LogLevel.INFO, infoTag, infoMessage);
        },

        /**
         * Writes an ERROR log message.
         * @param  {String} errorTag        Tag for this log message. Often the function name that the message is being sent from.
         * @param  {String} errorMessage    Message to log.
         * @return {Void}              
         */
        error: function error (errorTag, errorMessage) {
            logMessage(LogLevel.ERROR, errorTag, errorMessage);
        }
    };
});

// OverwatchAPI
application.services.service('OverwatchAPI', function ($http, LogService) {
    const baseUrl = "https://api.lootbox.eu";

    return {
        getProfile: function getProfile (region, platform, playerIdentifier, successCallback, errorCallback) {
            const logTag = arguments.callee.name;

            // build our request url
            var requestUrl = baseUrl + "/" + platform + "/" + region + "/" + playerIdentifier + "/profile";

            LogService.info(logTag, "Submitting request: " + requestUrl);

            // submit the request and bind our callbacks
            $http({
                method: "GET",
                url: requestUrl,
                timeout: 10000,
                headers: {
                    'Content-Type': "application/json"
                }
            }).then(successCallback, errorCallback);
        }
    };
});

// LocationService
application.services.service('LocationService', function ($cordovaGeolocation) {
    // define our location services options
    const positionOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };

    return {
        /**
         * Attempts to get a geolocation based on the position options defined for the LocationService.
         * @param  {Function(Object)} successCallback    Success function to handle successful cases when fetching a geolocation.
         * @param  {Function(Object)} errorCallback      Error function to handle error cases when fetching a geolocation.
         * @return {Void}
         */
        getGeolocation: function getGeolocation (successCallback, errorCallback) {
            $cordovaGeolocation.getCurrentPosition(positionOptions).then(successCallback, errorCallback);
        }
    };
});