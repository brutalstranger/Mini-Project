// Empty JS for your own code to be here

function test() {
    document.getElementById("demo").innerHTML = "Hello World";
}

    /**
     * TODO:
     * 1. Search for data related to first and second words
     * 2. Create Graph 
     * 3. Add data of both words to graph
     **/
function runSearch() {
  var searchTxt1 = $("#txtInput1").val();
  var searchTxt2 = $("#txtInput2").val();
document.getElementById("debug").innerHTML += "Starting javascript runSearch function.<br />";
document.getElementById("debug").innerHTML += "str1 is: " + searchTxt1 + "</br>" ;
document.getElementById("debug").innerHTML += "str2 is: " + searchTxt2 + "</br>";
	
	//Check input validity
	 if (searchTxt1 == "" || searchTxt2 =="") {
        document.getElementById("txtHint").innerHTML = "Please fill both text boxes";
        return;
    } else { document.getElementById("debug").innerHTML += "Search Terms filled out correctly.<br />"; //debug
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			//document.getElementById("debug").innerHTML += "IE7+, Firefox, Chrome, Opera, Safari DETECTED <br />";
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
			//document.getElementById("debug").innerHTML += "IE5/6 detected <br />";
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
			document.getElementById("debug").innerHTML += "got to state change - status OK  <br />"; //debug
			document.getElementById("txtHint").innerHTML = this.responseText;
            }
        };
		document.getElementById("debug").innerHTML += "searcher.php?searchWord1=" + searchTxt1 + "&searchWord2=" + searchTxt2 + "</br>" ; //debug
		
        xmlhttp.open("GET","searcher.php?searchWord1="+ searchTxt1 + "&searchWord2=" + searchTxt2 ,true);
        xmlhttp.send();
    }
}