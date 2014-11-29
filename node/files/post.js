var util = require("util"); 
var url = require("url");
var fs = require("fs");
var user=require("./user.js");
var db = require("./users_db.js");

var post;

var pm ;  


var pm = function (req, resp) {
    this.req = req;
    this.resp = resp;
    this.data ;
};

//*******************************************************************************
pm.prototype = {
post_method : 
        function() { 
            var _this = this;  
            var _data = ""; 

            if (this.req.headers["content-type"].indexOf("multipart/form-data") >= 0){
                    this.form_receive();
            } else {        
                this.req.on("data", function(d) {
                     _data += d; 
                });

                this.req.on("end",function() {
                    var dd = JSON.parse(_data);
                    _this.route(dd);
                });
            }

        }, 

route : 
        function (data) {

                if (data.action == "register") {
                    this.user_register({name : data.name, password : data.password}, this, "general_error");
                } else if (data.action == "login") {
                    this.user_login({name : data.name, password : data.password}, this, "general_error");
                } else if (data.action == "logout") {
                    this.user_logout(data.id_connexion, this, "general_error");
                }  else {
                    this.data = data;
                    db.is_log(this.data.id_connexion, this, "logged_action", "general_error");
                }
}, 

logged_action : 
    function(data) {

        var action = data.action ; 
        var id = data.id_connexion ; 

        if (action == "get_info") {
                    db.get_info(id, this, "user_get_info_cb", "general_error") ;
        } else if (action == "set_info") {
                    db.set_info(id, data.statut, "user_set_info_cb", "general_error") ;
        } else if (action == "get_friends") {
                    db.get_friends(id, this, "user_get_friends_cb",  "general_error") ;
        } else if (action == "add_friend") {
                    db.add_friend(id, data.id_friend, "user_add_friend_cb", "general_error") ;
        } else if (action == "delete_friend") {
                    db.delete_friend(id, data.id_friend, "user_delete_friend_cb", "general_error") ; 
        } else if (data.action == "delete_account") {
                    db.delete_account(data.id_connexion);
        }else {
            this.resp.writeHead(200, {"Content-Type": "application/json"});
            this.resp.write(JSON.stringify({resp: false}));
            this.resp.end();
        }
}, 

user_get_friends_cb : 
    function (bool) {
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
},

user_set_info_cb : 
    function (bool) {
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
}, 

user_get_friends_cb : 
    function (bool) {
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
}, 

user_add_friend_cb : 
    function (bool) {
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
}, 

user_delete_friend_cb : 
    function (bool) { 
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
}, 

user_register : 
    function (data) {
        var user = {name: data.name, password: data.password};
        console.log(user.name);
        db.register(user, this, "user_register_cb", "general_error"); 
}, 

user_register_cb:
    function (bool) {
        this.resp.writeHead(200, {"Content-Type": "application/json"});
        this.resp.write(JSON.stringify({resp: bool}));
        this.resp.end();
},
    
user_login:
    function(data) {
        db.login({name: data.name, password: data.password}, this, "user_login_cb", "general_error");
},
    
user_login_cb:
    function (id_connexion, _name) {
        if (id_connexion) {
            this.resp.writeHead(200, {"Content-Type": "application/json", "Set-Id": "id=" + id_connexion});
            this.resp.write(JSON.stringify({resp: true, name: _name}));
        } else {
            this.resp.writeHead(200, {"Content-Type": "application/json"});
            this.resp.write(JSON.stringify({resp: false}));
        }
        this.resp.end();
    },

general_error:
    function (err) {
        util.log("ERROR".red + " - " + err);
}

};        

//*********************************************** ancien code ***********************************************************************
// /**
//  * This is the parametred constructor of a srouter
//  * @param req (Object) the request object 
//  * @param resp (Object) the response object
//  */
// post_router = function (req, resp) { 
//     if (req && resp) { 
//         this.req = req;
//         this.resp = resp;
//         this.pathname = "";
//         this.filetype = "";
//         this.path = "";
//         this.image_file = "jpg png jpeg bmp";
//         this.video_file = "mp4 avi mkv wmv mov DivX Xvic"; 
//     } else { 
//         util.log("ERROR - A srouter object need a request and a response object");
//         return;
//     }
// };


// exports.post = function (req, resp) {
//     var inc_request = new post_router(req, resp);
//     inc_request.run(); 
//     inc_request = null;
// };

// post_router.prototype = {
//     run : 
//     function (){
//         this.post_method(this.req,this.resp);
//     }
// };

// exports.post_method = function(req, resp){

//     var glob=''; 
//     req.on('data', function(data) {
//          glob+= data; 
//     });
//     // var cookie = req.headers.cookie;

//     //comment on récup l'id de connexion ????

//     req.on('end',function() {
//         var obj = JSON.parse(glob); 
//         if (obj.action == "login" || obj.action == "register") {
//             user.run(obj, resp); 
//             resp.end();
//          } else {
//             db_users.get_login(obj.id_connexion, this, "cb"); 
//             this.cb=function(id_connexion){ 
//                 obj.id_connexion = id_connexion;
//                 user.run(obj, resp);
//             };
//         }
//     });
// };

