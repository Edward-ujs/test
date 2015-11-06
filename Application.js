/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */
    extend: qx.application.Standalone,
   

    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        __portal: null,

        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         *
         * @lint ignoreDeprecated(alert)
         */
        main: function () {
            // Call super class
            this.base(arguments);
            this.__initializeServerLogging();
            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug")) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

        },

        __initializeServerLogging: function () {
            
        },

        _initializePortal: function () {
            
        },

        _initializeViewRenderer: function () {
           
        },

        _createContext: function () {
        
        },

        _createRenderer: function () {
            
        },

        _startPortal: function () {
          
        },

        _preloadUiLabels: function (successCallback, errorCallback) {

        },

        __initializeRouting: function () {
           
        },

        __registerServices: function () {
            this.registerServices();
            if (!!qx.core.Environment.get("use.api.for.dummy.data")) {
                // register services which provide API data if API is enabled
               
            }
            else {
                // register services which provide dummy data if API is disabled
                
            }
        }
    }
});
