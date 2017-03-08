

function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider, AccessLevels, BASE_PATH, $httpProvider, $authProvider) {

          $authProvider.httpInterceptor = false;
          $httpProvider.interceptors.push('AuthUserInterceptor');

          $authProvider.facebook({
               clientId: '',
               url: BASE_PATH + 'auth/facebook'
          });

          $authProvider.google({
               url: BASE_PATH + 'auth/google',
               clientId: '',
          });

     // Configure Idle settings
     IdleProvider.idle(5); // in seconds
     IdleProvider.timeout(120); // in seconds

     $urlRouterProvider.otherwise("dashboard");

     $ocLazyLoadProvider.config({
          // Set to true if you want to see what and when is dynamically loaded
          debug: false
     });

     $stateProvider
     .state('anon', {
          abstract: true,
          template: '<ui-view/>',
          data: {
               access: AccessLevels.anon
          }
     })

     .state('anon.404', {
          url: "/404",
          templateUrl: "views/placeholder/404.html",
          data: { pageTitle: '404 Not Found', specialClass: 'gray-bg' }
     })
     .state('anon.500', {
          url: "/500",
          templateUrl: "views/placeholder/500.html",
          data: { pageTitle: 'Interval Server Error', specialClass: 'gray-bg' }
     })
     .state('anon.login_two_columns', {
          url: "/login",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/login_two_columns.html",
          data: { pageTitle: 'Login two columns', specialClass: 'gray-bg' }
     })
     .state('anon.register', {
          url: "/register",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/register.html",
          data: { pageTitle: 'Register', specialClass: 'gray-bg' }
     })
     .state('anon.register_confirm', {
          url: "/confirmOTP",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/register_confirm.html",
          data: { pageTitle: 'Verify Registration', specialClass: 'gray-bg' },
          params :{
               message : null
          }
     })
     .state('anon.forgot_password', {
          url: "/forgot_password",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/forgot_password.html",
          data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' }
     })
     .state('anon.forgot_password_otp', {
          url: "/forgot_confirmOTP",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/forgot_password_confirm.html",
          data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' },
          params :{
               message : null
          }
     })
     .state('anon.reset_password', {
          url: "/reset_password",
          controller : 'AuthCtrl',
          templateUrl: "views/placeholder/reset_password.html",
          data: { pageTitle: 'Reset password', specialClass: 'gray-bg' },
          params :{
               message : null
          }
     });

     $stateProvider
     .state('user', {
          abstract: true,
          template: '<ui-view/>',
          data: {
               access: AccessLevels.user
          }
     })


     .state('user.dashboards', {
          url: "/",
          templateUrl: "views/common/content.html",
          controller : 'DashboardCtrl'
     })

     .state('user.dashboards.dashboard_1', {
          url : "dashboard",
          templateUrl: "views/placeholder/dashboard_1.html",
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {

                              serie: true,
                              name: 'angular-flot',
                              files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                         },
                         {
                              name: 'angles',
                              files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
                         },
                         {
                              name: 'angular-peity',
                              files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                         }
                    ]);
               }
          }
     })
     .state('user.dashboards.customerUpdate', {
          url: "customers/update/:customerId",
          templateUrl: "views/customer/customer_create.html",
          controller: customerCreateCtrl,
          data: { pageTitle: 'Update Customer' },
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['css/plugins/iCheck/custom.css',
                              'js/plugins/iCheck/icheck.min.js']
                         }
                    ]);
               }
          }
     })
     .state('user.dashboards.customerCreate', {
          url: "customers/create",
          templateUrl: "views/customer/customer_create.html",
          controller: customerCreateCtrl,
          data: { pageTitle: 'Add a new Customer' },
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['css/plugins/iCheck/custom.css',
                              'js/plugins/iCheck/icheck.min.js']
                         }
                    ]);
               }
          }
     })
     .state('user.dashboards.customerList', {
          url:"customers/list",
          templateUrl: "views/customer/customer_list.html",
          controller: customerCtrl,
          data: { pageTitle: 'Customers' }
     })

     .state('user.dashboards.contacts', {
          url: "contacts",
          templateUrl: "views/placeholder/contacts.html",
          data: { pageTitle: 'Contacts' }
     })
     .state('user.dashboards.profile', {
          url: "profile",
          templateUrl: "views/placeholder/profile.html",
          data: { pageTitle: 'Profile' }
     })

     .state('user.dashboards.user_settings', {
          url: "user_settings",
          templateUrl: "views/userprofile/profile_wizard.html",
          controller: ProfileCtrl,
          data: { pageTitle: 'Profile Wizard form' },
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['css/plugins/steps/jquery.steps.css']
                         }
                    ]);
               }
          }
     })
     .state('user.dashboards.user_settings.profile_update_one', {
          url: "/profile_update_1",
          templateUrl: "views/userprofile/profile_update_1.html",
          data: { pageTitle: 'Profile_Update'}
     })
     .state('user.dashboards.user_settings.profile_update_two', {
          url: "/profile_update_2",
          templateUrl: "views/userprofile/profile_update_2.html",
          data: { pageTitle: 'Profile_Update'}
     })
     .state('user.dashboards.user_settings.profile_update_three', {
          url: "/profile_update_3",
          templateUrl: "views/userprofile/profile_update_3.html",
          data: { pageTitle: 'Profile_Update'}
     })
     .state('user.dashboards.user_settings.profile_update_four', {
          url: "/profile_update_4",
          templateUrl: "views/userprofile/profile_update_4.html",
          data: { pageTitle: 'Profile_Update'}
     })

     // .state('user.dashboards.customer', {
     //      abstract: true,
     //      url: "/customer",
     // })

     // .state('app', {
     //      abstract: true,
     //      url: "/app",
     //      templateUrl: "views/common/content.html",
     // })
     // .state('app.contacts', {
     //      url: "/contacts",
     //      templateUrl: "views/placeholder/contacts.html",
     //      data: { pageTitle: 'Contacts' }
     // })
     // .state('app.profile', {
     //      url: "/profile",
     //      templateUrl: "views/placeholder/profile.html",
     //      data: { pageTitle: 'Profile' }
     // })
     .state('app.profile_2', {
          url: "/profile_2",
          templateUrl: "views/placeholder/profile_2.html",
          data: { pageTitle: 'Profile_2'},
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['js/plugins/sparkline/jquery.sparkline.min.js']
                         }
                    ]);
               }
          }
     })
     .state('app.invoice', {
          url: "/invoice",
          templateUrl: "views/placeholder/invoice.html",
          data: { pageTitle: 'Invoice' }
     })

     .state('app.issue_tracker', {
          url: "/issue_tracker",
          templateUrl: "views/placeholder/issue_tracker.html",
          data: { pageTitle: 'Issue Tracker' }
     })
     .state('app.clients', {
          url: "/clients",
          templateUrl: "views/placeholder/clients.html",
          data: { pageTitle: 'Clients' }
     })

     .state('pages', {
          abstract: true,
          url: "/pages",
          templateUrl: "views/common/content.html"
     })
     .state('pages.empty_page', {
          url: "/empy_page",
          templateUrl: "views/placeholder/empty_page.html",
          data: { pageTitle: 'Empty page' }
     })
     .state('logins', {
          url: "/logins",
          templateUrl: "views/placeholder/login.html",
          data: { pageTitle: 'Login', specialClass: 'gray-bg' }
     })
     .state('lockscreen', {
          url: "/lockscreen",
          templateUrl: "views/placeholder/lockscreen.html",
          data: { pageTitle: 'Lockscreen', specialClass: 'gray-bg' }
     })

     .state('commerce', {
          abstract: true,
          url: "/commerce",
          templateUrl: "views/common/content.html",
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                         },
                         {
                              name: 'ui.footable',
                              files: ['js/plugins/footable/angular-footable.js']
                         }
                    ]);
               }
          }
     })
     .state('commerce.orders', {
          url: "/orders",
          templateUrl: "views/placeholder/ecommerce_orders.html",
          data: { pageTitle: 'E-commerce orders' }
     })
     .state('commerce.cart', {
          url: "/cart",
          templateUrl: "views/placeholder/ecommerce_cart.html",
          data: { pageTitle: 'Shopping cart' }
     })
     .state('landing', {
          url: "/landing",
          templateUrl: "views/placeholder/landing.html",
          data: { pageTitle: 'Landing page', specialClass: 'landing-page' },
          resolve: {
               loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                         {
                              files: ['js/plugins/wow/wow.min.js']
                         }
                    ]);
               }
          }
     })

}

angular
.module('babiwasabi')
.config(config)
.run(function($rootScope, $state, AuthService, SessionService) {
     $rootScope.$state = $state;
     $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
          if (!AuthService.authorize(toState.data.access)) {
               event.preventDefault();
               $state.go('anon.login_two_columns');
          }
          if(Object.keys(SessionService.user()).length > 0) {
               if(toState.name == "anon.login_two_columns") {
                    event.preventDefault();
                    $state.go("user.dashboards.dashboard_1");
               }
          }

     });
});
