window.onload = function(){
    //Constants for clearer code.
    var SEND_MESSAGE = 0;
    var PULL_NEWS = 1;
    var CLEAR_XML = 2;
    
    //Global variables.
    var xhr;
    var timeStamp = 0; //TOhle vypíše pouze poslední příspěvek. Musím se na to kouknout. Myslím, že to je přepisováním hodnoty timestamp při iteraci polem textů na straně serveru.
    createXhr();
    
    //Creating a prototype function.
    var ChatPrototype = function(){};
    
    //Prototyping all parts of the future chat.
    ChatPrototype.prototype.box = document.createElement('div');
    ChatPrototype.prototype.header = document.createElement('div');
    ChatPrototype.prototype.h1 = document.createElement('h1');
    ChatPrototype.prototype.chat = document.createElement('div');
    ChatPrototype.prototype.controls = document.createElement('div');
    ChatPrototype.prototype.form = document.createElement('form');
    ChatPrototype.prototype.responseLine = document.createElement('input');
    ChatPrototype.prototype.nickLine = document.createElement('input');
    ChatPrototype.prototype.sendButton = document.createElement('button');
    ChatPrototype.prototype.clearXML = document.createElement('button');

    
    //Instance creation.
    var MyChat = new ChatPrototype();
    
    //Putting the peaces together.
    MyChat.header.appendChild(MyChat.h1);
    MyChat.box.appendChild(MyChat.header);
    MyChat.box.appendChild(MyChat.chat);
    MyChat.form.appendChild(MyChat.nickLine);
    MyChat.form.appendChild(MyChat.responseLine);
    MyChat.form.appendChild(MyChat.sendButton);
    MyChat.form.appendChild(MyChat.clearXML);
    MyChat.controls.appendChild(MyChat.form);
    MyChat.box.appendChild(MyChat.controls);
    
    //Class, type and values setting.
    MyChat.box.className='box';
    MyChat.header.className='header';
    MyChat.h1.className='h1';
    MyChat.chat.className='chat';
    MyChat.controls.className='controls';
    MyChat.form.className='form';
    MyChat.nickLine.className='nameLine';
    MyChat.nickLine.type='text';
    MyChat.nickLine.placeholder='Nick';
    MyChat.responseLine.className='responseLine';
    MyChat.responseLine.type='text';
    MyChat.responseLine.placeholder='Enter text';
    MyChat.sendButton.className='sendButton';
    MyChat.sendButton.type='submit';
    MyChat.clearXML.className='clearXML';
    
    //Setting inner HTML.
    MyChat.h1.innerHTML = 'SimpleChat';
    MyChat.sendButton.innerHTML = 'Send';
    MyChat.clearXML.innerHTML = 'Erase history';
    MyChat.chat.innerHTML = 'Hi, here will be your communication soon.';
    
    //Inserting DOM to the website.
    document.body.appendChild(MyChat.box);
    //
    //Adding events.
    MyChat.form.addEventListener('submit', sendMessage, false);
    MyChat.clearXML.addEventListener('click', resetXML, false);
    
    //I'm starting timer for regular questions for new messages.
    setInterval(function(){sendToServer(PULL_NEWS,'');},3000);
    
    // All functions are here.
    function sendMessage(e){
        e.preventDefault();
        timeStamp = new Date().getTime();
        var newMessage = document.createElement('p');
        var message = encodeHTML(MyChat.nickLine.value) + ' - ' + encodeHTML(MyChat.responseLine.value);
        newMessage.innerHTML = message;
        MyChat.responseLine.value = '';
        MyChat.chat.appendChild(newMessage);//adds message to the chat div.
        sendToServer(SEND_MESSAGE, message);
    }
    function resetXML(e){
        e.preventDefault();
        sendToServer(CLEAR_XML,'');
        }
    
    function sendToServer(id,message){
        xhr.open('POST', 'http://chat.kolich-technologies.com/chatHandler.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('message=' + encodeURIComponent(message) + '&timeStamp=' + encodeURIComponent(timeStamp) + '&id=' + encodeURIComponent(id));//POST data encode and sending to server.
    }
        
    //Vypisova funkce ze serveru
    function handleServerResponse(){
        if (xhr.readyState === 4 && xhr.status === 200) {
              var newMessage = document.createElement('p');//I'm not 100% positive if I should putt this to the map function below.
              var response = xhr.responseText;
              if(!response){}
              else{
                response = JSON.parse(response);
                timeStamp = response.timeStamp;
                response.messages.map(function(){
                    newMessage.innerHTML = arguments[0];
                    newMessage.className = 'resp';
                    MyChat.chat.appendChild(newMessage);
                });
                }
            }
    }
        
    //This handles diferent xhr creation processes fow IE and other browsers.
    function createXhr(){
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
           try {
             xhr = new ActiveXObject("Msxml2.XMLHTTP");
           } 
           catch (e) {
             try {
               xhr = new ActiveXObject("Microsoft.XMLHTTP");
             } 
             catch (e) {}
           }
        }

        if (!xhr) {
           alert("I can't create XMLHTTP.");
           return false;
        }
        
        xhr.onreadystatechange = handleServerResponse;
    }
    
    //For basic HTML tag filtration.
    function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
    
    };