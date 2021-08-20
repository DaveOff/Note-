var target = '*://twitter.com/i/api/graphql/*/UserByScreenName?variables=*';
var indexedDB = (window.indexedDB || window.mozIndexedDB);
var request = indexedDB.open("Note+");
var suid,username,tabid,db;

request.onsuccess = function (event)
{
	db = event.target.result;
	pageReceiver(event.target.result);
};

request.onupgradeneeded = function (event) {
	let db = event.target.result;
	let objStore = db.createObjectStore("users", { keyPath: "uid" });
	objStore.createIndex("tag", "tag", { unique: false });
	objStore.createIndex("username", "username", { unique: false });
};

function listener(details)
{
	let filter = browser.webRequest.filterResponseData(details.requestId);
	let decoder = new TextDecoder("utf-8");
	let encoder = new TextEncoder();
	let data = [];

	filter.ondata = event => {
		data.push(event.data);
	};

	filter.onstop = event => {
		const mergedUint8Array = new Uint8Array(data.map(typedArray => [...new Uint8Array(typedArray)]).flat());	
		let obj = JSON.parse(decoder.decode(mergedUint8Array, {stream: true}));
		let uid = obj["data"]["user"]["result"]["rest_id"], uname = obj["data"]["user"]["result"]["legacy"]["screen_name"];
		suid = uid, username = uname;
		
		filter.write(encoder.encode(JSON.stringify(obj)));
		filter.disconnect();
		
		/** Send Message **/
		let dbReq = db.transaction(["users"]).objectStore("users").get(uid);
		let data = {};
		dbReq.onsuccess = function(event) {
			if(dbReq.result != undefined) {
				data.comment = dbReq.result.comment;
				data.tag = dbReq.result.tag;
			}
			browser.tabs.sendMessage(tabid, {
				action: 0,
				data: data
			});
		};
	};
	return {};
}

function pageReceiver(db)
{
	browser.runtime.onMessage.addListener(function(req, sender, sendResponse){
		switch(req.action) {
		  case 0:
			tabid = sender.tab.id;
			browser.webRequest.onBeforeRequest.addListener(
			  listener,
			  {urls: [target]},
			  ["blocking"]
			);
			break;
		  case 2:
			var objectStore = db.transaction("users", "readwrite").objectStore("users");
			objectStore.put({'uid': suid, 'username': username, 'comment': req.comment, 'tag': req.tag});
			break;
		} 
	});
}
