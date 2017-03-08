/*
* Author : Sunny Chauhan
* Module : CommonService
* Description : Contains Common Functions used throughout the applications
*/

module.exports = {

     /** generate numeric OTP */
     generateOtp : function (num) {
          let text = "";
          let possible = "0123456789";
          for( let i = 0; i < num; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
     },

     /** generate alphanumeric OTP */
     generateAlphaNumericString : function (num) {
          let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          let possible = "0123456789";
          for( let i = 0; i < num; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
     },

     /** retrieving Email Templates */
     getEmailTemplate : function (referenceId, cb) {
          const TemplateModel = require(APP_PATH + '/models/template.js');
          TemplateModel
          .findOne(
                    {
                         "title" : referenceId,
                         "status" : true
                    },
                    {
                         "status" : 0,
                         "isDeleted" : 0,
                         "createdDate" : 0,
                         "modifiedDate" : 0
                    }
          )
          .exec(
               function (err, template) {
                    if(err) {
                         cb();
                    } else {
                         if(template) {
                              cb(template);
                         } else {
                              cb();
                         }
                    }
               }
          )
     }
}
