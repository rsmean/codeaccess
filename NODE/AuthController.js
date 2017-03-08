/*
* Author : Sunny Chauhan
* Module : AuthsController
* Description : Use to register users (sales Representives)
*/

/** Including config files */
var ENV_OBJ = require(APP_PATH + '/config/env.js')();
var SERVER_MESSAGE = require(APP_PATH + '/config/messages.js');
var SERVER_CONSTANT = require(APP_PATH + '/config/constant.js');
var SERVER_LOG = require(APP_PATH + '/config/log.js');

var CommonService = require(APP_PATH + '/services/CommonService.js');

var UserModel = require(APP_PATH + '/models/userModel.js'); // requiring User Model
var UserModelMethods = new UserModel(); // Using User Models Methods

var EmailService = require(APP_PATH + '/services/EmailService.js');

var JwtService = require(APP_PATH + '/services/JwTokenService.js');

module.exports =  {

     /**--------------------------------------------------------------------------
     | Function    : sales - signup
     | Description : use to  register sales Representives
     |--------------------------------------------------------------------------*/
     register : function (req, res)  {
          let email = req.body.email;
          let password = req.body.password;
          let userObj = {};
          if(!email){
               res.json({
                    status  : 'error',
                    message : 'Email field is required',
               });
          }

          if(!password){
               res.json({
                    status  : 'error',
                    message : 'Password field is required',
               });
          }

          let OTP = CommonService.generateOtp(6);
          userObj['role'] = 'SALES';
          userObj['otp'] = OTP;
          userObj['email'] = email.toLowerCase();
          userObj['password'] = password;
          userObj['name.first'] = req.body.firstname;
          userObj['name.last'] = req.body.lastname;
          userObj['business.name'] = req.body.LbusinessName;
          UserModel(userObj).save(function (err, data) {
               if(err) return res.json({ status: 'error', message: SERVER_MESSAGE.error.REGISTER});
               let async = require('async');

               async.waterfall ([
                    function (callback) {
                         CommonService.getEmailTemplate("ACCOUNT_CREATION", function (template) {
                              if(template) {
                                   callback (null, template);
                              } else {
                                   callback (null, "");
                              }
                         });
                    },
                    function (template, callback) {
                         if (template) {
                              template.description = template.description.replace("{{OTP}}", OTP);
                              template.description = template.description.replace("{{USERNAME}}", req.body.firstname);
                              let mailOptions = {
                                   from : SERVER_CONSTANT.EMAIL,
                                   subject : template.subject,
                                   html : template.description
                              }
                              EmailService.send([email], mailOptions, function (status) {
                                   statusMsg = status ? 'Email Sent' : 'Email Not Sent';
                                   callback(null, statusMsg);
                              });
                         } else {
                              callback(null, 'Email Not Sent');
                         }
                    }
               ], function (err, result) {
                    if (err) {
                         SERVER_LOG.log('error', 'REGISTER', { "Message" : err});
                    } else {
                         SERVER_LOG.log('error', 'REGISTER', { "Message" : result });
                    }
               });
               return res.json({
                    status  : 'success',
                    message : "Verification OTP has been sent to your email, Please verify your account.",
                    result :  data._id
               });
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : verifyOTP
     | Description : verifyOTP
     |--------------------------------------------------------------------------*/
     verifyRegistrationOTP : function (req, res)  {
          let OTP = req.body.otp;
          let reqId = req.body.referenceId;
          if(!reqId) {
               return res.json({resStatus:'error', msg : SERVER_MESSAGE.error.verifyRegistrationOTP});
          }

          UserModel.findOneAndUpdate(
                              { "_id" : reqId, isDeleted : false, role : 'SALES', "otp" : OTP} ,
                              {"otp" : "", status : true},
                              {"new" : true})
                    .exec(function (err, data) {
                         if(err) return res.json({status:'error', message : SERVER_MESSAGE.error.SERVER});
                         if(!data) {
                              return res.json({status:'error', message : SERVER_MESSAGE.error.verifyRegistrationOTP});
                         } else {
                                   return res.json({
                                        status :'success',
                                        message : SERVER_MESSAGE.success.verifyRegistrationOTP,
                                        result : data._id
                                   });
                         }
                    });
     },

     /**--------------------------------------------------------------------------
     | Function    : forgot
     | Description : forgot password
     |--------------------------------------------------------------------------*/
     forgot : function (req, res)  {
          let email = req.body.email;
          if (!email) {
               return res.json({
                         status : 'error',
                         message : 'Email is required'
               });
          }
          let OTP = CommonService.generateOtp(6);
          UserModel.findOneAndUpdate(
                              { "isDeleted" :false, status : true, "role" : 'SALES', "email" : email },
                              {otp : OTP},
                              {new : true}
                         )
                         .exec( function (err, resData) {
                              if(err) return res.json({status:'error', message : SERVER_MESSAGE.error.SERVER});
                              if(!resData) {
                                   return res.json({status:'error', message : SERVER_MESSAGE.error.INVALID_EMAIL});
                              } else {
                                   let async = require ('async');
                                   async.waterfall ([
                                        function (callback) {
                                             CommonService.getEmailTemplate("FORGOT_PASSWORD", function (template) {
                                                  if(template) {
                                                       callback (null, template);
                                                  } else {
                                                       callback (null, "");
                                                  }
                                             });
                                        },
                                        function (template, callback) {
                                             if (template) {
                                                  template.description = template.description.replace("{{OTP}}", OTP);
                                                  template.description = template.description.replace("{{USERNAME}}", resData.name.first);
                                                  let mailOptions = {
                                                       from : SERVER_CONSTANT.EMAIL,
                                                       subject : template.subject,
                                                       html : template.description
                                                  }
                                                  EmailService.send([email], mailOptions, function (status) {
                                                       statusMsg = status ? 'Email Sent' : 'Email Not Sent';
                                                       callback(null, statusMsg);
                                                  });
                                             } else {
                                                  callback(null, 'Email Not Sent');
                                             }
                                        }
                                   ], function (err, result) {
                                        if (err) {
                                             SERVER_LOG.log('error', 'REGISTER', { "Message" : err});
                                        } else {
                                             SERVER_LOG.log('error', 'REGISTER', { "Message" : result });
                                        }
                                   });
                                   return res.json({
                                             status : 'success',
                                             message : SERVER_MESSAGE.success.FORGOT,
                                             result : resData._id
                                        });
                              }
                         });
     },

     /**--------------------------------------------------------------------------
     | Function    : verifyOTP
     | Description : verifyOTP
     |--------------------------------------------------------------------------*/
     verifyForgetOTP : function (req, res)  {
          let OTP = req.body.otp;
          let reqId = req.body.referenceId;
          if(!reqId) {
               return res.json({status :'error', message : SERVER_MESSAGE.error.verifyRegistrationOTP});
          }
          UserModel.findOneAndUpdate(
                              { "_id" : reqId, isDeleted : false, role : 'SALES', "otp" : OTP} ,
                              {"otp" : "" },
                              {"new":true})
                    .exec(function (err, data) {
                         if(err) return res.json({status:'error', message : SERVER_MESSAGE.error.SERVER});
                         if(!data) {
                              return res.json({status:'error', message : SERVER_MESSAGE.error.verifyRegistrationOTP});
                         } else {
                                   return res.json({
                                        status :'success',
                                        message : SERVER_MESSAGE.success.VERIFYFORGETOTP,
                                        result : data._id
                                   });
                         }
                    });
     },

     /**--------------------------------------------------------------------------
     | Function    : sales - login
     | Description : use to login
     |--------------------------------------------------------------------------*/
     login: function (req, res) {
          let email = req.body.email;

          let password = req.body.password;

          if (!password) {
               return res.json({status:'error', message :'Password is required'});
          }

          if (!email) {
               return res.json({status:'error', message :'Email is Required'});
          }

          req.body.platform = req.body.platform || 'WEB';
          req.body.deviceToken = req.body.deviceToken || '';

          UserModel.findOne({isDeleted:false, status : true, 'role' : 'SALES', email : email},{'business.image' : 1, password : 1, name : 1, role : 1, isAccept : 1, socialLogin : 1},function(err, user) {
               if (!user) {
                    return res.json({
                              status:'error',
                              message : SERVER_MESSAGE.error.LOGIN_INVALID
                    });
               }
               UserModelMethods.comparePassword(password, user,  function(err, valid) {
                    if (err) {
                         return res.json({
                                   status:'error',
                                   message : SERVER_MESSAGE.error.LOGIN_PASSWORD
                         });
                    }

                    if (!valid) {
                         return res.json({
                                   status:'error',
                                   message : SERVER_MESSAGE.error.LOGIN_INVALID
                         });
                    } else {
                         user.password = undefined;
                         return res.json({
                                   status:'success',
                                   message : SERVER_MESSAGE.success.LOGIN,
                                   token: JwtService.issueToken(
                                                       user._id,
                                                       req.body.platform,
                                                       req.body.deviceToken),
                                   result : user
                         });
                    }
               });
          })
     },

     /**--------------------------------------------------------------------------
     | Function    : reSendOtp
     | Description : use to resend OTP in case of OTP not received
     |--------------------------------------------------------------------------*/
     resendOTP: function (req, res) {
          let reqId = req.params.referenceId;
          let OTP = CommonService.generateOtp(6);
          UserModel.findOneAndUpdate( { _id : reqId },{ otp : OTP },function (err, data) {
               if(err) return res.json({ status:'error', message : SERVER_MESSAGE.error.SERVER });

               if(!data) {
                    return res.json({ status:'error', message : SERVER_MESSAGE.error.SERVER });
               } else {
                    let async = require ('async');
                    async.waterfall ([
                         function (callback) {
                              CommonService.getEmailTemplate("RESEND_OTP", function (template) {
                                   if(template) {
                                        callback (null, template);
                                   } else {
                                        callback (null, "");
                                   }
                              });
                         },
                         function (template, callback) {
                              if (template) {
                                   template.description = template.description.replace("{{OTP}}", OTP);
                                   template.description = template.description.replace("{{USERNAME}}", data.name.first);
                                   let mailOptions = {
                                        from : SERVER_CONSTANT.EMAIL,
                                        subject : template.subject,
                                        html : template.description
                                   }
                                   EmailService.send([data.email], mailOptions, function (status) {
                                        statusMsg = status ? 'Email Sent' : 'Email Not Sent';
                                        callback(null, statusMsg);
                                   });
                              } else {
                                   callback(null, 'Email Not Sent');
                              }
                         }
                    ], function (err, result) {
                         if (err) {
                              SERVER_LOG.log('error', 'REGISTER', { "Message" : err});
                         } else {
                              SERVER_LOG.log('error', 'REGISTER', { "Message" : result });
                         }
                    });

               return res.json({
                         status:'success',
                         message : SERVER_MESSAGE.success.RESENDOTP
                    });
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : resetPassword
     | Description : use to reset password
     |--------------------------------------------------------------------------*/
     resetPassword: function (req, res) {
          let reqId = req.body.referenceId;
          if(!reqId) {
               return res.json({status:'error', message : SERVER_MESSAGE.error.SERVER});
          }

          let password = req.body.password;
          let confirm_password = req.body.confirmPassword;

          if (!password) {
               return res.json({status:'error', message :'Password is required'});
          }

          if (!confirm_password) {
               return res.json({status:'error', message :'Confirm Password is required'});
          }

          if (password != confirm_password) {
               return res.json({status:'error', message :'Passwords do not match'});
          }
          UserModel.findOne({ "_id" : reqId }).exec(function(err, userData){
               if (err) return res.json({resStatus:'error', message : SERVER_MESSAGE.error.RESETPASSWORD});
               if(userData != null) {
                    userData.password = req.body.password;
                    userData.fcm.platform = "WEB";
                    userData.save(function(err, data) {
                         if (err) return res.json({status:'error',message : AppMessages.error.RESETPASSWORD});
                         return res.json({status:'success', message : SERVER_MESSAGE.success.RESETPASSWORD});
                    });
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : logout
     | Description : use to logout the user
     |--------------------------------------------------------------------------*/
     logout : function (req, res)  {
          return res.json({
                    status:'success',
                    message : SERVER_MESSAGE.success.LOGOUT
          });
     }
}

