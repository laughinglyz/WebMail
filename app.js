var express = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');

app.use(express.static('public'), function (req, res, next) {
	req.db = db;
	next();
})

app.get('/retrieveemaillist', function (req, res) {
	var db = req.db;
	var collection = db.get('emailList');
	var mailbox = req.query.mailbox;
	var page = parseInt(req.query.page);
	loademailist(mailbox, collection, page, res);
})

app.get('/getemail', function (req, res) {
	var q = parseInt(req.query.q);
	var box = req.query.mailbox;

	var db = req.db;
	var collection = db.get('emailList');
	if (q == -1) {
		var page = parseInt(req.query.page);
		var entryno = parseInt(req.query.entryno);
		q = 3 * page + entryno;
		collection.find({ mailbox: box }, {}, function (err2, docs) {
			paixu(docs);
			res.send(resconthtml(docs, q));
		})
	} else {
		collection.find({ mailbox: box }, {}, function (err2, docs) {
			paixu(docs);
			res.send(resconthtml(docs, q));
		})
	}
})

app.post('/changemailbox', express.urlencoded({ extended: true }), function (req, res) {
	var totalselection = parseInt(req.body.totalselection);
	var db = req.db;
	var collection = db.get('emailList');
	var dest = req.body.dest;
	var box = req.body.mailbox;
	if (totalselection > 0) {
		var page = parseInt(req.body.page);
		var q;

		var entry0 = req.body.entry0;
		var entry1 = req.body.entry1;
		var entry2 = req.body.entry2;

		collection.find({ mailbox: box }, {}, function (err, docs) {
			paixu(docs);
			var co = 0;
			var pagelimit = Math.ceil((docs.length - totalselection) / 3);
			var doc = new Array();
			if (entry0 == "true") {
				q = 3 * page;
				collection.update({ "_id": docs[q]._id }, { $set: { 'mailbox': dest } });
				if (3 * page + 3 < docs.length) {
					doc[co] = docs[3 * page + 3];
					co += 1;
				}
			} if (entry1 == "true") {
				q = 3 * page + 1;
				collection.update({ "_id": docs[q]._id }, { $set: { 'mailbox': dest } });
				if (3 * page + 3 + co < docs.length) {
					doc[co] = docs[3 * page + 3 + co];
					co += 1;
				}
			} if (entry2 == "true") {
				q = 3 * page + 2;
				collection.update({ "_id": docs[q]._id }, { $set: { 'mailbox': dest } });
				if (3 * page + 3 + co < docs.length) {
					doc[co] = docs[3 * page + 3 + co];
				}
			}
			if (box == "Sent") {
				res.send(ResArray2(doc, pagelimit));
			} else {
				res.send(ResArray1(doc, pagelimit));
			}
		})
	} else {
		var q = req.body.q;
		collection.find({ mailbox: box }, {}, function (err2, docs) {
			paixu(docs);
			collection.update({ "_id": docs[q]._id }, { $set: { 'mailbox': dest } });
			var doc = new Array();
			var pagelimit = Math.ceil((docs.length - 1) / 3);
			if (q < 3) {
				for (var i = 0, cao = 0; i < 3 && (cao + i) < docs.length; i++) {
					if (i == q) {
						cao += 1;
					}
					doc[i] = docs[cao + i];
				}
				if (box == "Sent") {
					res.send(ResArray2(doc, pagelimit));
				} else {
					res.send(ResArray1(doc, pagelimit));
				}
			} else {
				for (var i = 0; i < 3 && i < docs.length; i++) {
					doc[i] = docs[i];
				}
				if (box == "Sent") {
					res.send(ResArray2(doc, pagelimit));
				} else {
					res.send(ResArray1(doc, pagelimit));
				}
			}
		});
	}
})

app.post('/sendemail', express.urlencoded({ extended: true }), function (req, res) {
	var myrecipient = req.body.myrecipient;
	var mytitle = req.body.mytitle;
	var mycontent = req.body.mycontent;
	var mailbox = req.body.mailbox;

	var db = req.db;
	var collection = db.get('emailList');

	var now = Date();
	var str = now.toString().split(" ");
	var nowstring = str[4] +" "+ str[0] +" "+ str[1] +" "+ str[2] +" "+ str[3];

	collection.insert({sender: "default@cs.hku.hk", recipient: myrecipient, title:mytitle, time:nowstring, content:mycontent, mailbox:"Sent"}, function(err, result){
		if (err==null){
			loademailist(mailbox,collection,0,res);
		}
	});
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})

function loademailist(mailbox, collection, page, res) {
	var pagelimit;
	if (mailbox == "Inbox") {
		collection.find({ mailbox: mailbox }, {}, function (err, docs) {
			if (err == null) {
				pagelimit = Math.ceil(docs.length / 3);
				d = sort(docs, page);
				res.send(ResArray1(d, pagelimit));
			}
			else
				res.send(err);
		});
	}
	else if (mailbox == "Important") {
		collection.find({ mailbox: mailbox }, {}, function (err, docs) {
			if (err == null) {
				pagelimit = Math.ceil(docs.length / 3);
				d = sort(docs, page);
				res.send(ResArray1(d, pagelimit));
			}
			else
				res.send(err);
		});
	}
	else if (mailbox == "Sent") {
		collection.find({ mailbox: mailbox }, {}, function (err, docs) {
			if (err == null) {
				pagelimit = Math.ceil(docs.length / 3);
				d = sort(docs, page);
				res.send(ResArray2(d, pagelimit));
			}
			else
				res.send(err);
		});
	}
	else if (mailbox == "Trash") {
		collection.find({ mailbox: mailbox }, {}, function (err, docs) {
			if (err == null) {
				pagelimit = Math.ceil(docs.length / 3);
				d = sort(docs, page);
				res.send(ResArray1(d, pagelimit));
			}
			else
				res.send(err);
		});
	}
}

function ResArray1(d, pagelimit) {
	var a = "";
	for (var i = 0; i < d.length; i++) {
		var b = d[i];

		a += "<div class=\"entry\" id=\"" + i + "\">";
		a += "<input class=\"checkbox\" type=\"checkbox\" name=\"checkbox\" value=\"Checkbox_value\">";
		a += "<span class=\"er\" onclick=\"loadcontent(this)\">" + b.sender + "</span>";
		a += "<span class=\"title\" onclick=\"loadcontent(this)\">" + b.title + "</span>";
		a += "<span class=\"time\" onclick=\"loadcontent(this)\">" + b.time + "</span>";
		a += "</div>"
	}
	a += "《" + pagelimit;
	return a;
}

function ResArray2(d, pagelimit) {
	var a = "";
	for (var i = 0; i < d.length; i++) {
		var b = d[i];

		a += "<div class=\"entry\" id=\"" + i + "\">";
		a += "<input class=\"checkbox\" type=\"checkbox\" name=\"checkbox\" value=\"Checkbox_value\">";
		a += "<span class=\"er\" onclick=\"loadcontent(this)\">" + b.recipient + "</span>";
		a += "<span class=\"title\" onclick=\"loadcontent(this)\">" + b.title + "</span>";
		a += "<span class=\"time\" onclick=\"loadcontent(this)\">" + b.time + "</span>";
		a += "</div>"
	}
	a += "《" + pagelimit;
	return a;
}

function sort(docs, page) {
	paixu(docs);
	var k = new Array();
	var no = docs.length / 3;
	var le = docs.length % 3;
	if (le == 0) {
		le += 3;
	}
	if (page >= no - 1) {
		for (var m = docs.length - le, n = 0; m < docs.length; m++ , n++) {
			k[n] = docs[m];
		}
	} else {
		for (var m = 3 * page, n = 0; m < docs.length && n < 3; m++ , n++) {
			k[n] = docs[m];
		}
	}
	return k;
}

function paixu(docs) {
	for (var i = 0; i < docs.length; i++) {
		for (var j = i + 1; j < docs.length; j++) {
			if (compare(docs[i], docs[j])) {
				var b = docs[i];
				docs[i] = docs[j];
				docs[j] = b;
			}
		}
	}
}

function compare(a, b) {
	var c = a.time.split(" ");
	var d = b.time.split(" ");
	c = Trans(c);
	d = Trans(d);
	var e = new Date(c[2] + " " + c[3] + ", " + c[4] + " " + c[0]);
	var f = new Date(d[2] + " " + d[3] + ", " + d[4] + " " + d[0]);
	return (e < f);
}

function Trans(x) {
	if (x[2] == "Jan") {
		x[2] = "January";
	} else if (x[2] == "Feb") {
		x[2] = "February";
	} else if (x[2] == "Mar") {
		x[2] = "March";
	} else if (x[2] == "Apr") {
		x[2] = "April";
	} else if (x[2] == "May") {
		x[2] = "May";
	} else if (x[2] == "Jun") {
		x[2] = "June";
	} else if (x[2] == "Jul") {
		x[2] = "July";
	} else if (x[2] == "Aug") {
		x[2] = "August";
	} else if (x[2] == "Sep") {
		x[2] = "September";
	} else if (x[2] == "Oct") {
		x[2] = "October";
	} else if (x[2] == "Nov") {
		x[2] = "November";
	} else if (x[2] == "Dec") {
		x[2] = "December";
	}
	return x;
}

function resconthtml(data, q) {
	var a = "";
	a += "<div id=\"content\">";
	a += "<div id=\"title1\">" + data[q].title + "</div>";
	a += "<div id=\"time1\">" + data[q].time + "</div>";
	a += "<div id=\"sender1\">" + data[q].sender + "</div>";
	a += "<div id=\"recipient1\">" + data[q].recipient + "</div>";
	a += "<div id=\"content1\">" + data[q].content + "</div>";
	a += "</div>";
	a += "《" + q + "《" + data.length;
	return a;
}
