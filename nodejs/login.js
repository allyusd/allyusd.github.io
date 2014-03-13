$(document).ready(function() {  
	// Start with a check that the browser supports websockets
    if(!("WebSocket" in window)){  
        $('#eventLog, input, button, #examples').fadeOut("fast");  
        $('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
        
    }else{  
	    //The user has WebSockets  
	    connect();  
	    
	    function connect(){  
	        try{  
		        var host = "ws://localhost:8080/socket";  
		        var socket = new WebSocket(host);  
		      
	            message('<p class="event">Socket Status: '+socket.readyState);  
	      
	            socket.onopen = function(){  
	                 message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
	            }; 
	      
	            socket.onmessage = function(msg){
	                 message('<p class="message">Received: '+msg.data);
                   dispatch(msg.data);
	            };  
	      
	            socket.onclose = function(){  
	                 message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');  
	            };             
		      
	        } catch(exception){  
	             message('<p>Error'+exception);  
	        }  
	        
	        /**
	         * Append a message to the event log
	         */
	        function message(msg){  
		        $('#eventLog').append(msg+'</p>');
          }

          function dispatch(msg)
          {
            var jsonpack = jQuery.parseJSON(msg);
            switch(jsonpack.CmdId)
            {
              case 1792:
                checkLoginResponse(jsonpack.Data);
              break;
              case 1794:
                onGameList(jsonpack.Data);
              break;
              case 1795:
                onCCSList(jsonpack.Data);
              break;
              case 1797:
                onControlCCS(jsonpack.Data);
              break;
              case 1806:
                onDenyCCS(jsonpack.Data);
              break;
            }
          }
	        
	        /**
	         * Check if login response and if so, check the result.
	         * We are only considering the first element (if any) in the array
	         */
	        function checkLoginResponse(msg){
	        	console.log("Check login %s", msg);
	        	var loginResponse = jQuery.parseJSON(msg);
            
			      $('#result').append("Login " + loginResponse.LoginStatus + '</p>');
            
            switch (loginResponse.LoginStatus)
            {
            case 0:
              $('#result').append("Login Success</p>");
              break;
            case 1:
              $('#result').append("Login Fail</p>");
              break;
            case 2:
              $('#result').append("Login DuplicateOnline</p>");
              break;
            case 3:
              $('#result').append("Login ConnectFail</p>");
              break;
            }
		    }  
        
        	function onGameList(msg){
	        	var dataTable = jQuery.parseJSON(msg);
            
            for (var i = 0; i < dataTable.length; i++)
            {
              $('#gamelist').append('<p>' + dataTable[i].GameName + '</p>');
            }
          }
          
          function onCCSList(msg){
	        	var dataSet = jQuery.parseJSON(msg);
            
            var dataTable = dataSet.Table1;
            
            for (var i = 0; i < dataTable.length; i++)
            {
              $('#ccslist').append('<p>' + dataTable[i].AgentAccount + '</p>');
            }
            
            var dataTable2 = dataSet.Table2;
            
            for (var i = 0; i < dataTable2.length; i++)
            {
              $('#ccslist').append('<p>' + dataTable2[i].CCSNickName + '</p>');
            }
          }
          
          function onControlCCS(msg){
            console.log(msg);
          }
          
          function onDenyCCS(msg){
            console.log(msg);
          }
	        
	        /**
	         * Login button was clicked - send a login request
	         */
	        $('#login').click(function(){
	        	$('#result').empty();  
	            sendLogin();
	        }); 
          
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdGameList').click(function(){
	            sendGameList();
	        });
          
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdCCSList').click(function(){
	            sendCCSList();
	        });
          
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdControlCCS').click(function(){
	            sendControlCCS();
	        });
	        
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdDenyCCS').click(function(){
	            sendDenyCCS();
	        });
          
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdGetServerSetting').click(function(){
	            sendGetServerSetting();
	        });
          
          /**
	         * Login button was clicked - send a login request
	         */
	        $('#cmdSetServerSetting').click(function(){
	            sendSetServerSetting();
	        });
	        
	        /**
	         * Send login request to Firebase
	         */
	        function sendLogin(){  
	            var username = $('#username').val();
	            var password = $('#password').val();  
	            if(username=="" || password=="" ){  
	                message('<p class="warning">Please enter a user name and a password');  
	                return ;  
	            }
              
              var pack = '{"Account":"' + username + '","Password":"' + password + '","Version":"1234","AgentCode":"1","operatorId":"1"}';
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 2326, "Data":' + packdata + ' }';
            	send(jsonpack);	          
	        }  
          
          /**
	         * Send login request to Firebase
	         */
	        function sendGameList(){
              var pack = '';
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 2306, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
          
          /**
	         * Send login request to Firebase
	         */
	        function sendCCSList(){
              var pack = '';
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 2307, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
	                  
          /**
	         * Send login request to Firebase
	         */
	        function sendControlCCS(){
              var pack = '{"TargetCCSAccount":"730003000001"}';;
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 2309, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
          
          /**
	         * Send login request to Firebase
	         */
	        function sendDenyCCS(){
              var pack = '{"CCSID":2,"DenyStatus":true}';;
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 2318, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
          
          /**
	         * Send login request to Firebase
	         */
	        function sendGetServerSetting(){
              var pack = '{"ClientCommand":527}';;
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 257, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
          
          /**
	         * Send login request to Firebase
	         */
	        function sendSetServerSetting(){
              var pack = '{"ClientCommand":558,"F9Password":"1","F11Password":"1","KeyInUnit":2,"KeyOutUnit":3,"BillInUnit":4,"CoinPayoutUnit":5,"KeyInLimitOne":10000000,"KeyInLimitALL":20000000,"Prize":false}';;
              var packdata = JSON.stringify(pack);
	            
	            var jsonpack = '{"CmdId": 257, "Data":' + packdata + ' }';
            	send(jsonpack);	              
	        }
          
	        /**
	         * Send any data over the socket
	         */
	        function send(msg){  
	            try{  
	                socket.send(msg);  
	                message('<p class="event">Sent: '+msg);
	            } catch(exception){  
	            	message('<p class="warning"> Error:' + exception);  
	            }  
	        }  
	        
	    } // End connect()  
    }
});  