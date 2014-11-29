var users = require("./users_db.js");
var util = require("util");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var start = function() { 
    var user_chema = Schema ({ 
                name  : {
                        type : String, 
                        required : true , 
                        unique : true,
                        index : true
                },  
                password : {
                        type : String, 
                        required : true
                }, 
                statut :  String, 
                id_friends : [mongoose.Schema.Types.ObjectId],
                id_connexion : String,
                logged_at : {
                        type : Date, 
                        default : Date.now()
                }
  
}); 

    var users_db = mongoose.model("users", user_schema) ;
    users_export() ;
} ; 

var users_export = function () {
    exports.register = users["register"];
    exports.login = users["login"];
    exports.logout = users["logout"];
    exports.is_log = users["is_log"];
    exports.delete_account = users["delete_account"];
    exports.update_user = users["set_info"];;
    exports.get_info = users["get_info"];
    exports.get_friends = users["get_friends"];
    exports.set_friend = users["add_friend"];
    exports.delete_friend = users["delete_friend"]; 
    exports.set_users_db = users["set_users_db"];
};

// start() ;