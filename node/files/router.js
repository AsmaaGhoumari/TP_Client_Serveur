var util = require("util"); 
var url = require("url");
var fs = require("fs");
var nodemailer = require("nodemailer");
var formidable = require("formidable"); 
var get = require("./get.js");
var post = require("./post.js");

exports.router = function (req, resp) {
    var inc_request = new srouter(req, resp);
    inc_request.run(); 
    inc_request = null;
};

srouter = function (req, resp) {
    if (req && resp) { 
        this.req = req;
        this.resp = resp;
        this.pathname = "";
        this.filetype = "";
        this.path = "";/
        this.image_file = "jpg png jpeg bmp";  
    } else {  
        util.log("ERROR - A srouter object need a request and a response object");
        return;
    }
};

srouter.prototype = {

    run : function () {
            this.rest_method();
        },
        
    rest_method : function(){
            if (this.req.method == "GET"){
                get.get(this.req, this.resp); 
            } else if (this.req.method == "POST") {
                var reg = new RegExp("multipart/form-data", "g");
                if(!reg.test(this.req.headers["content-type"])){
                    post.post_method(this.req, this.resp);
                } else {
                    if (req.url == '/' && req.method.toLowerCase() == 'post') {
                        var form = new formidable.IncomingForm();
                        form.parse(req, function(err, fields, files) {
                            fs.rename(files.upload.path, "./files/"+ files.upload.name , "utf8", function (e) {
                                if (e) console.log(e);
                            });
                            news.news_from_site(fields, files.upload.name);
                            res.writeHead(200, {'content-type': 'text/plain'});
                            res.end();
                        });
                        return;
                    }
                }
            } else {
                this.resp.writeHead(501, {"Content-Type": "application/json"}); 
                this.resp.write(JSON.stringify({message: "Not Implemented"})); 
                this.resp.end(); 
                return;
            }
        },
}; 