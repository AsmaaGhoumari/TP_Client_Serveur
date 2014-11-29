var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/users');
var assert = require("assert");
db = require("./users_db.js");

var user_test = {};
user_test.id = "" ; 
user_test.id_friends = {} ; 

var expected = "";
var i = 1;

var start = function () {
	user_test.go_test();
};

user_test.go_test = function () {

	process.stdout.write.log("\n\n");
	
    mongoose.model("users").remove({},function (e) {
		if (e) process.stdout.write.log(e);
		else process.stdout.write.log("Users DB cleared".green + "\n");
	});

    setTimeout(function () {
        if (user_test["test" + i]) user_test["test" + i++]();
    }, 100);

};

//register_test
user_test.test1= function () {
	process.stdout.write.log("\nAdding one user".lmagenta);
	expected = true;
	db.login({name: "bob", password: "coucou"}, user_test,  "assert");
};

//register_test2
user_test.test2 = function () {
	expected = true;
	db.register({name: "bob2", password: "coucou"}, user_test,  "assert");
};

//register_test3
user_test.test3= function () {
	process.stdout.write.log("\nAdding another user".lmagenta);
	expected = true;
	db.register({name: "bobby", password: "coucou"}, user_test,  "assert");
};

//login_test_failed
user_test.test4= function () {
	process.stdout.write.log("\nLogin first user failed password".magenta);
	expected = false;
	db.login({name: "bob", password: "coucou54554"}, user_test,  "assert");
};

//login_test_succeeded
user_test.test5= function () {
	process.stdout.write.log("\nLogin first user success pwd ".magenta);
	expected = true;
	db.login({name: "bob", password: "coucou"}, user_test,  "assert");
};

//is_log_test
user_test.test6 = function () {
	process.stdout.write.log("\nIs_log first user".magenta);
	expected = true;
	user_test.id = db.get_id_connexion({name: "bob", password: "coucou"}, user_test, "assert") ; 
	db.is_log(id, user_test,  "assert");
};

//add_friend_test 
user_test.test7= function () { 
	process.stdout.write.log("\nSetting one friend ".lmagenta);
	expected = true;
	var id_friend = db.get_id_connexion({name: "bob2", password: "coucou"}, user_test, "assert") ; 
	db.add_friend(user_test.id, id_friend, user_test,  "assert");
};

//set_friend_test2
user_test.test8 = function () {
	process.stdout.write.log("\nSetting another friend".lmagenta);
	var id_friend2 = db.get_id_connexion({name: "bobby", password: "coucou"}, user_test, "assert") ; 
	db.add_friend(user_test.id, id_friend2, user_test, "assert");

};

//get_friend_test
user_test.test9 = function () {
	process.stdout.write.log("\nGetting first friend".magenta);
	expected = true;
	var id_friend = db.get_id_connexion({name: "bob2", password: "coucou"}, user_test, "assert") ; 
	db.get_friends(user_test.id, id_friend, user_test, "assert");
};

//get_info_test 
user_test.test10= function () {
	process.stdout.write.log("\nGetting info first user".lmagenta);
	expected = true;
	db.get_info(user_test.id, user_test, "assert");
};

//set_info_test
user_test.test11 = function () {
	process.stdout.write.log("\nSetting new info first user".magenta);
	expected = true ;
	db.set(user_test.id, "update_statut", user_test, "assert");
};

//get_info_test2 
user_test.test12= function () {
	process.stdout.write.log("\nGetting changed info of first user".magenta);
	expected = true;
	db.get_info(user_test.id, user_test, "assert");
};


user_test.test13 = function (c) {
	process.stdout.write.log("\nLogout first user".magenta);
	expected = true;
	db.logout(user_test.id, user_test, "assert");
};

user_test.assert = function (msg) {
    if (msg == expected) process.stdout.write("\tPASSED".lgreen);
    else process.stdout.write("\tFAILED".lred);

    if (user_test["test" + i]) user_test["test" + i++]();
    else {
        mongoose.disconnect();
        process.stdout.write.log("\n\n");
    }
};

// start();