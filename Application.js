/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "com.eh.salestoolmaintenance"
 *
 * @asset(com/eh/assets/icons/*)
 * @asset(com/eh/assets/fonts/*)
 * @use(com.eh.salestoolmaintenance.ui.view.HomeView)
 * @use(com.eh.salestoolmaintenance.ui.view.application.ApplicationViewBuilder)
 * @use(com.eh.salestoolmaintenance.ui.view.migration.MigrationView)
 * @use(com.eh.salestoolmaintenance.ui.view.productprofile.ProductProfileViewBuilder)
 * @use(com.eh.salestoolmaintenance.ui.view.keydrivers.KeyDriversViewBuilder)
 * @use(com.eh.salestoolmaintenance.ui.view.additionalInformation.AdditionalInformationViewBuilder)
 * @use(com.eh.salestoolmaintenance.ui.view.LoginView)
 */
qx.Class.define("com.eh.salestoolmaintenance.Application", {
    extend: qx.application.Standalone,
    include: [com.eh.salestool.common.communication.registration.MRegisterServices],

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

            // manage to fix the issue svg image is nat managed by qooxdoo it takes svg as normal file other than image!!
            qx.$$resources["com/eh/assets/icons/loading.svg"] = [32, 32, "qx", "com.eh.assets"];
            /*
             -------------------------------------------------------------------------
             Below is your actual application code...
             -------------------------------------------------------------------------
             */

            this._initializePortal();
            this._initializeViewRenderer();
            this.__registerServices();

            // maintenance tool is only available in english, so we set english as static language
            // instead of determining the language based on the browser language
            com.eh.salestool.common.business.language.TranslationManager.switchLanguage("en", function () {
                this.info("Preloading ui label translations...");
                this._preloadUiLabels(function () {
                    this._startPortal();
                    this.__initializeRouting();
                }.bind(this), function () {
                    this.error("Error while preloading UI wordings!");
                }.bind(this));
            }.bind(this), function () {
                qx.log.Logger.error(this, "Error determining language!");
                // TODO: error handling
            }.bind(this));

        },

        __initializeServerLogging: function () {
            if (!!qx.core.Environment.get("sendErrorsToServer")) {
                com.eh.salestool.common.business.util.ServerLoggingUtil.initialize();
                mm.core.service.Registry.register(com.eh.salestool.common.communication.interfaces.IUploadLogService, com.eh.salestool.common.communication.rest.RESTUploadLogService, true);
            }
        },

        _initializePortal: function () {
            if (!this.__portal) {
                var context = this._createContext();
                var renderer = this._createRenderer();
                this.__portal = new com.eh.salestoolmaintenance.Portal(context, renderer, null);
            }
        },

        _initializeViewRenderer: function () {
            if (this.__portal) {
                this.__portal.registerViewRenderer(new com.eh.salestoolmaintenance.ui.renderer.HomeRenderer());
                this.__portal.registerViewRenderer(new com.eh.salestoolmaintenance.ui.renderer.DefaultRenderer());
            }
        },

        _createContext: function () {
            return com.eh.salestoolmaintenance.Context.getInstance();
        },

        _createRenderer: function () {
            return new com.eh.salestoolmaintenance.ui.renderer.PortalRenderer();
        },

        _startPortal: function () {
            if (this.__portal) {
                this.__portal.startPortal(this.getRoot());
            }
        },

        _preloadUiLabels: function (successCallback, errorCallback) {
            com.eh.salestool.common.business.language.TranslationManager.loadTranslationsByModule(qx.core.Environment.get("applicator_wording_module_id"), null, successCallback, errorCallback);
        },

        __initializeRouting: function () {
            var qxRouter = new mm.ui.views.view.AuthenticatedRouting();
            var context = this.__portal.getContext();
            context.setRouting(qxRouter);

            var portalRouting = new com.eh.salestoolmaintenance.business.routing.PortalRouting(context, this.__portal, qxRouter);
            portalRouting.initializeNamespaces([com.eh.salestoolmaintenance.ui.view]);
            portalRouting.startFromUrl();
            portalRouting.dispose();
        },

        __registerServices: function () {
            this.registerServices();
            if (!!qx.core.Environment.get("use.api.for.dummy.data")) {
                // register services which provide API data if API is enabled
                mm.core.service.Registry.register(com.eh.salestool.common.business.popupservice.IBlockingNotificationPopupService, com.eh.salestoolmaintenance.business.popupservice.BlockingNotificationPopupService, true);
                mm.core.service.Registry.register(com.eh.salestool.common.business.popupservice.ISaveErrorNotificationPopupService, com.eh.salestoolmaintenance.business.popupservice.SaveErrorNotificationPopupService, true);
                mm.core.service.Registry.register(com.eh.salestool.common.business.searchservice.ISearchService, com.eh.salestoolmaintenance.business.searchservice.SearchService, false);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IUpdateNavigationOrderService, com.eh.salestoolmaintenance.communication.rest.RESTUpdateNavigationOrderService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IUpdateNavigationService, com.eh.salestoolmaintenance.communication.rest.RESTUpdateNavigationService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IManageMigrationsService, com.eh.salestoolmaintenance.communication.rest.RESTManageMigrationsService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.ITextContentService, com.eh.salestoolmaintenance.communication.rest.RESTTextContentService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.business.cache.ICachedInformationTypeService, com.eh.salestoolmaintenance.business.cache.CachedInformationTypeService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.business.cache.ICachedMeasureTasksService, com.eh.salestoolmaintenance.business.cache.CachedMeasureTasksService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IUpdateTextContentService, com.eh.salestoolmaintenance.communication.rest.RESTUpdateTextContentService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IUpdateAssignmentService, com.eh.salestoolmaintenance.communication.rest.RESTUpdateAssignmentService, true);
                mm.core.service.Registry.register(com.eh.salestool.common.business.cache.ICachedProductService, com.eh.salestool.common.business.cache.CachedProductService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IUpdateFileService, com.eh.salestoolmaintenance.communication.rest.RESTUpdateFileService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IManageAdditionalInformationService, com.eh.salestoolmaintenance.communication.rest.RESTManageAdditionalInformationService, true);
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IManageCertificatesService, com.eh.salestoolmaintenance.communication.rest.RESTManageCertificatesService, true);
            }
            else {
                // register services which provide dummy data if API is disabled
                mm.core.service.Registry.register(com.eh.salestoolmaintenance.communication.interfaces.IManageMigrationsService, com.eh.salestoolmaintenance.communication.dummy.DummyManageMigrationsService, true);
            }
        }
    }
});
