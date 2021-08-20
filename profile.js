const styleVisible = "opacity: 1;visibility: visible";
const styleHidden = "opacity: 0;visibility: hidden;"

/***** Init *****/
browser.runtime.sendMessage({
	action: 0
});

function backReceiver(request, sender, sendResponse)
{
	switch(request.action) {
	  case 0:
		createMyNote(request.data);
		break;
	}
}
browser.runtime.onMessage.addListener(backReceiver);

function createMyNote(data)
{
	if(document.getElementById("myNote") != null) document.getElementById("myNote").remove();
	var box = document.getElementsByClassName("css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs")[0];
	var div1 = document.createElement('div');
	var div2 = document.createElement('div');

	div1.id = "myNote";
	div1.onclick = function(){
		var popup = document.getElementById('popup');
		popup.getElementsByClassName('popupCloseButton')[0].onclick = function(){
			popup.style = styleHidden
		};
		popup.getElementsByTagName("button")[0].onclick = function(){
			let comment = popup.getElementsByTagName("textarea")[0];
			let tag = popup.getElementsByTagName("input")[0];
			if(comment.textLength == 0) {
				popup.style = styleHidden;
				return;
			}
			browser.runtime.sendMessage({
				action: 2,
				comment: comment.value,
				tag: tag != undefined ? tag.value : undefined
			 });
		};
		popup.style = styleVisible;
	}
	div1.className = "css-18t94o4 css-1dbjc4n r-1niwhzg r-1ets6dv r-sdzlij r-1phboty r-rs99b7 r-6gpygo r-1kb76zh r-2yi16 r-1qi8awa r-1ny4l3l r-o7ynqc r-6416eg r-lrvibr";
	div2.className = "css-901oao r-1awozwy r-18jsvk2 r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0";
	div2.style = "padding: 0 10px;";
	div2.textContent = "Note+";
	div1.appendChild(div2);
	div1.appendChild(div2);
	document.body.insertAdjacentHTML('beforeend', createPopUp(data));
	box.prepend(div1);
}

function createPopUp(data)
{
	let comment = '', tag = '';
	if(Object.keys(data).length > 0){
		comment = data.comment;
		tag = data.tag;
	}	
	return `
				<div class="hover_bkgr_fricc" id="popup">
					<span class="helper"></span>
					<div>
						<div class="popupCloseButton">&times;</div>
						<textarea class="styled" placeholder="Comment">${comment}</textarea>
						<input class="styled" type="text" placeholder="Tag" value="${tag}"/>
						<button class="styled" type="button">Save</button> 
			
					</div>
				</div>
				<style>
					/* Popup box BEGIN */
					textarea.styled {
						width: calc(100% - 20px);
						height: 120px;
						border: 1px solid #cccccc;
						padding: 5px;
						direction: ltr;
						font-size: 14px;
						font-family: arial;
						resize: none;
						transition: 750ms all;
					}
					input.styled {
						border: 1px solid #cccccc;
						width: calc(100% - 20px);
						padding: 5px;
						margin-top: 4px;
						font-size: 14px;
						font-family: arial;
					}
					button.styled {
						margin-top: 4px;
						float: left;
						background-color: #F9F9F9;
						border: 1px solid #CCC;
						padding: 4px 20px;
						margin-left: 5px;
						cursor: pointer;
						font-family: arial;
						color: #8E8E8E;
					}
					button.styled:hover {
						background-color: #EEE;
						color: #575757;
					}
					textarea.styled:focus, input.styled:focus {
						outline: none !important;
					}
					.hover_bkgr_fricc{
						background:rgba(0,0,0,.4);
						opacity: 0;
						visibility: hidden;
						height:100%;
						position:fixed;
						text-align:center;
						top:0;
						width:100%;
						z-index:10000;
					  -webkit-transition: opacity 400ms, visibility 400ms;
					  transition: opacity 400ms, visibility 400ms;
					}
					.hover_bkgr_fricc .helper{
						display:inline-block;
						height:100%;
						vertical-align:middle;
					}
					.hover_bkgr_fricc > div {
						background-color: #fff;
						box-shadow: 10px 10px 60px #555;
						display: inline-block;
						height: auto;
						max-width: 351px;
						min-height: 100px;
						vertical-align: middle;
						width: 60%;
						position: relative;
						border-radius: 5px;
						padding: 15px 1%;
					}
					.popupCloseButton {
						background-color: #fff;
						border: 3px solid #999;
						border-radius: 50px;
						cursor: pointer;
						display: inline-block;
						font-family: arial;
						font-weight: bold;
						position: absolute;
						top: -20px;
						right: -20px;
						font-size: 25px;
						line-height: 30px;
						width: 30px;
						height: 30px;
						text-align: center;
					}
					.popupCloseButton:hover {
						background-color: #ccc;
					}
					.trigger_popup_fricc {
						cursor: pointer;
						font-size: 20px;
						margin: 20px;
						display: inline-block;
						font-weight: bold;
					}
					/* Popup box BEGIN */

				</style>
				`;
}
