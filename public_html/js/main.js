/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function(){
    //Prototyp funkce a variables
    var xhr;
    var timeStamp = 0; //TOhle vypíše pouze poslední příspěvek. Musím se na to kouknout. Myslím, že to je přepisováním hodnoty timestamp při iteraci polem textů na straně serveru.
    vyrobXhr();
    var ChatPrototype = function(){};
    ChatPrototype.prototype.box = document.createElement('div');
    ChatPrototype.prototype.header = document.createElement('div');
    ChatPrototype.prototype.h1 = document.createElement('h1');
    ChatPrototype.prototype.chat = document.createElement('div');
    ChatPrototype.prototype.controls = document.createElement('div');
    ChatPrototype.prototype.form = document.createElement('form');
    ChatPrototype.prototype.responseLine = document.createElement('input');
    ChatPrototype.prototype.nameLine = document.createElement('input');
    ChatPrototype.prototype.sendButton = document.createElement('button');
    ChatPrototype.prototype.clearXML = document.createElement('button');

    
    //Vytvářím instanci objektu
    var MujChat = new ChatPrototype();
    
    //Skládám jednotlivé divy a prvky dohromady
    MujChat.header.appendChild(MujChat.h1);
    MujChat.box.appendChild(MujChat.header);
    MujChat.box.appendChild(MujChat.chat);
    MujChat.form.appendChild(MujChat.nameLine);
    MujChat.form.appendChild(MujChat.responseLine);
    MujChat.form.appendChild(MujChat.sendButton);
    MujChat.form.appendChild(MujChat.clearXML);
    MujChat.controls.appendChild(MujChat.form);
    MujChat.box.appendChild(MujChat.controls);
    
    //Přiděluji názvy class
    MujChat.box.className='box';
    MujChat.header.className='header';
    MujChat.h1.className='h1';
    MujChat.chat.className='chat';
    MujChat.controls.className='controls';
    MujChat.form.className='form';
    MujChat.nameLine.className='nameLine';
    MujChat.nameLine.type='text';
    MujChat.nameLine.placeholder='Nick';
    MujChat.responseLine.className='responseLine';
    MujChat.responseLine.type='text';
    MujChat.responseLine.placeholder='Vlož text';
    MujChat.sendButton.className='sendButton';
    MujChat.sendButton.type='submit';
    MujChat.clearXML.className='clearXML';
    
    //Vyplňuji další parametry
    MujChat.h1.innerHTML = 'Toto je cvičný chat';
    MujChat.sendButton.innerHTML = 'Odeslat';
    MujChat.clearXML.innerHTML = 'Smazat historii chatu';
    MujChat.chat.innerHTML = 'Dobrý den, zde se bude zobrazovat váš chat.';
    //Zobrazují do DOM
    document.body.appendChild(MujChat.box);    //Vypisova a odesilaci funkce od uzivatele
    //Přidávám event
    MujChat.form.addEventListener('submit', vypisZpravu, false);
    MujChat.clearXML.addEventListener('click', resetXML, false);
    //Zapínám časovač na čtení ze serveru
    setInterval(function(){dotazNaServer(1,'');},3000);
    // OBSLUZNE FUNKCE
    function vypisZpravu(e){
        e.preventDefault();
        timeStamp = new Date().getTime();
        var novaZprava = document.createElement('p');
        var message = encodeHTML(MujChat.nameLine.value) + ' - ' + encodeHTML(MujChat.responseLine.value);
        novaZprava.innerHTML = message;
        MujChat.responseLine.value = '';
        MujChat.chat.appendChild(novaZprava);//pridam zpravu do okna
        dotazNaServer(0, message);
    }
    function resetXML(e){
        e.preventDefault();
        dotazNaServer(2,'');
        }
    
    function dotazNaServer(id,message){
        xhr.open('POST', 'http://chat.kolich-technologies.com/chatHandler.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('message=' + encodeURIComponent(message) + '&timeStamp=' + encodeURIComponent(timeStamp) + '&id=' + encodeURIComponent(id));//odeslání zprávy na server
    }
        
    //Vypisova funkce ze serveru
    function vypisZpravuServeru(){
        if (xhr.readyState === 4 && xhr.status === 200) {
              var novaZprava = document.createElement('p');//nejsem si jistý jestli by to nemělo být spíš v tom mapu
              var response = xhr.responseText;
              if(!response){}
              else{
                response = JSON.parse(response);
                timeStamp = response.timeStamp;
                response.messages.map(function(){
                    novaZprava.innerHTML = arguments[0];
                    novaZprava.className = 'resp';
                    MujChat.chat.appendChild(novaZprava);
                });
                }
            }
    }
        
    //Vyrob xhr
    function vyrobXhr(){
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
           alert('Nejde udělat instance XMLHTTP');
           return false;
        }
        
        xhr.onreadystatechange = vypisZpravuServeru;
    }
    
    //pro filtraci html
    function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
    
    };