var mongoose = require("mongoose");
var user_js = require('./user.js') ; 
var Schema = mongoose.Schema;

var user = {} ; 

var timeout_time  = 14400000;

var start = function() {		
	exports.register = user["register"];
	exports.login = user["login"];
	exports.logout = user["logout"];
	exports.is_log = user["is_log"];
	exports.del_account = user["delete"];
	exports.update_user = user["set_info"];;
    exports.get_info = user["get_info"];
    exports.get_info = user["get_friends"];
    exports.get_info = user["add_friend"];
    exports.set_users_db = user["set_users_db"];
}; 


user.set_users_db = function (o) {
    user.users_db = o;
};

// *************************** ajout/supp utilisateur****************** ******************************************

/**
* 
*@param us
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.register = function (us, obj, cb_succes, cb_err) {
	var date_now =  Date().valueOf() ; 
	var u = new user.users_db({name: us.name, password: us.password, statut : "", id_friends : [], id_connexion : _id + date_now, logged_at : date_now });
	us.users_db.save(function (err,d) {
		if (e) {
			console.log("ERROR".red + " -- register failed -- " + us.name);
			obj[cb_succes](false);
		} else {
			console.log("INFO".blue + " -- register success -- " + us.name);
			obj[cb_succes](true);
		}
	});

};

/**
*
*
*@param id
*/
user.delete_account = function (id) {
	user.users_db.remove({id_connexion: id}, function (err, docs) {
		if (err) console.log("ERROR".red + "-- delete failed  -- id :" +  id);
		else console.log("INFO".blue + " - delete success  -- id : " + id);
	});
};

//************************************** Infos ************************************************************

/**
*
*
*@param id
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.get_info = function (id, obj, cb, cb_err) {
	user.users_db.findOne({id_connexion: id}, function (err, docs) {
        if (err || !docs) {
        	console.log("ERROR".red + " -- Friends not found -- id:" + id) ;
        	obj[cb](false);
        } 
        else  obj[cb](docs.statut);
    });
};

/**
*
*
*@param id
*@param update_statut
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.set_info = function(id , update_statut, obj, cb, cb_err) { 
	user.users_db.findOne({id_connexion : id}, function (err, docs){
		if (err ||!docs)  obj[cb](false);
		else {
			docs.statut = update_statut ; 
			docs.save() ;
			obj[cb](true) ; 
		}
	}); 
}; 


//*************************************** Friends ***********************************************************
/**
*
*
*@param id 
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.get_friends = function(id, obj, cb_succes, cb_err) {  
	user.users_db.findOne({id_connexion: id}, "id_friends", function(err, docs) { 
		if (err || !docs) {
			console.log("ERROR".red + " -- Friends not found -- id:" +id) ;
			obj[cb_succes](false) ;
		} else {
			obj[cb_succes](docs.id_friends) ; 
		}		
	});
}; 


/**
*
*
*@param id
*@param id_friend
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.add_friend = function (id, id_friend,  obj, cb_succes, cb_err) { 
		user.users_db.update({ id_connexion: id}, {$addToSet : {id_friends : id_friend}}, function(err){
			if (err) {
				console.log("ERROR".red + " -- Adding friend fail -- id:" +id) ;
				obj[cb_succes](false);
			} else  obj[cb_succes](true); 
		});	
};

/**
*
*
*@param id 
*@param id_friend 
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.delete_friend = function(id, id_friend, obj, cb) { 
		user.users_db.update ({id_connexion : id }, {$pull : {id_friends : id_friend}}, function (err) {
			if (err) {
				 console.log("ERROR".red + "-- delete friend failed  -- id :" +  id);
				 obj[cb_succes](false);
			} else  obj[cb_succes](true);
		}); 
};

//**************************************** Login ************************************************************************************

/**
*
*
*@param
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param  cb (string)
*/
user.login = function (u, obj, cb_succes, cb_err) {
	user.users_db.findOne ({name: u.name, password: u.password}, function (err, docs) {
		if (err || !docs) {
			console.log("ERROR".red + " - Login failed " + u.name);
			obj[cb_succes](false);
		} else {
			docs.id_connexion = docs._id + Date().valueOf();
			docs.logged_at = new Date().valueOf();
			docs.save(function (er) {
				if (er) {
					docs.id_connexion = docs._id + Date().valueOf();
					docs.save();
				}
				util.log("INFO".blue + " - Login success " + docs.name);
				obj[cb_succes](docs.id_connexion, docs.name);
			});
		}
	});
};



/**
*
*
*@param
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param  cb (string)
*/
user.logout = function (id, obj, cb) {
	user.users_db.findOne({id_connexion: id}, function (err, docs) {
		if (err || !docs) {
			console.log("ERROR".red + " - Logout fail:" + id);
			obj[cb](false);
		} else {
			d.id_connexion = "";
			d.save(function () {
				obj[cb](true);
			});
		}
	});
};

/**
*
*
*@param id example : 
*@param obj (object) instanceof get_obj which contains the request obj and the response object
*@param cb (string)
*/
user.is_log = function (id, obj, cb_succes, cb_err) {
	user.users_db.findOne({ id_connexion : id}, function (err, docs) {
		if (err || !docs) {
			obj[cb](false);
		} else {
			var date_now = new Date().valueOf();
			if (date_now - docs.logged_at < timeout_time) {
				docs.logged_at = date_now;
				docs.save();
				obj[cb](docs.id_connexion);
			} else {
				util.log("WARNING".green + " -- User timed out -- id  : " + id);
				obj[cb](false);
			}
		}
	});
};

/**
*
*
*/
user.get_id_connexion = function (u, obj, cb_succes, cb_err) {
	user.users_db.findOne ({name : u.name, password : u.password}, function (err, docs) {
			if (err || !docs) {
				console.log("ERROR".red + " - Get  id failed " + u.name);
				obj[cb_succes](false);
			} else {
				 obj[cb_succes](docs.id_connexion);
			}
	})
}

// start(); //a decommenter