function eventListener(user,child) {

    var forms = document.forms;
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit",function (event) {


           if(this.id == "messagesForm"){
               var messageBalloon = document.getElementById("messageBalloon");
               PostMessage(messageBalloon,child,user,"users/"+child+"/messages.txt","messages");
           }
           else if(this.id == "uploadForm"){
                document.getElementById("hiddenUsername").value=child;
                uploadFile(this,"Photo");
           }

            event.preventDefault();
        }, false);
    }

    window.addEventListener("keydown",function (e) {

        if(e.keyCode == 13 && document.activeElement.tagName == "TEXTAREA"){
            var active = document.activeElement;
            var type = '';
            if(active.id == "messageBalloon") {
                type = "messages";
                PostMessage(active, child, user, "users/" + child + "/" + type + ".txt", type);
            }
        }

    });

    var noteEvent = document.getElementById("notes");
    var writeNoteArea = document.getElementById("writeNote");
    if(noteEvent){
        noteEvent.addEventListener("click",function () {
            this.style.display = "none";
            writeNoteArea.style.display="block";
            writeNoteArea.focus();
            getNotes(child);
        });
    }
    if(writeNoteArea){

        writeNoteArea.addEventListener("focusout",function () {
            this.style.display = "none";
            noteEvent.style.display="block";
            writeNote(this.value,child);
        });
    }

    var closeButtons = document.getElementsByClassName("close-button");
    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener("click",function () {
            clearPreview(this.parentNode);

        });
    }
}


function getMessages(username,type) {

    getRequest("users/"+username+"/"+type+".txt").then(function(successMessage,rejectMessage) {
        var arr = [];
        arr.push.apply(arr, successMessage.split("\n"));
        var content  = document.getElementById(type);

        content.innerHTML = "";
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                arr[i] = JSON.parse(arr[i]);
                var key = Object.keys(arr[i])[0];

                var messageDiv = document.createElement('div');
                messageDiv.classList.add(type.substring(0, type.length - 1));

                var messageEl = document.createElement("span");
                messageEl.innerHTML = arr[i][key];
                if (key == "child") {
                    messageEl.classList.add("child");
                    messageDiv.style.textAlign = "right";
                } else {
                    messageEl.classList.add("teacher");
                    messageDiv.style.textAlign = "left";
                }

                messageDiv.appendChild(messageEl);
                fragment.appendChild(messageDiv);
            }
        }

        content.appendChild(fragment);
        content.scrollTop = content.scrollHeight;
    });
}

function uploadFile(form, fileType) { // type can be Lecture or Photo
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "upload"+fileType+".php", true);
    var formData = new FormData(form);
    httpRequest.onload = function() {

        if (httpRequest.status == 200) {
            document.getElementById("uploadResponse").classList.add("flaticon-tick-mark");
        } else {
            document.getElementById("uploadResponse").classList.add("flaticon-letter-x");
        }
    };
        console.log(httpRequest.response);
    httpRequest.send(formData);
}
function PostMessage(response,user,from,path,type) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "postMessage.php", true);

    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onload = function() {
        if (httpRequest.status == 200) {
            response.value = "";
            getMessages(user,type);
        }
    };
    var data ={};
    if(response.value){
        data[from] = response.value;
        httpRequest.send("data="+JSON.stringify(data)+"&path="+path);
    }

}

function getRequest(url) {

    return new Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.send();
        httpRequest.onload = function () {
            if (httpRequest.status == 200) {
                resolve(httpRequest.responseText);
            }else{
                reject("false");
            }
        };
    }, 250);
}


// CLEAR PREVIEW PANEL
function clearPreview(panel) {

    panel.style.display = "none";
    panel.children[1].innerHTML ="";

    panel.children[2].innerHTML = "";


    document.getElementById("preview").removeAttribute("src");

    var currentPic = document.getElementsByClassName("currentPic")[0];
    if(currentPic){
        currentPic.classList.remove("currentPic");
    }

}

//CALENDAR
function calendarCalculations(add){
    add = add || 0;
    var date = new Date;
    var month = date.getMonth() + add;
    var year = date.getFullYear();

    var countMore = month-11;

    if(countMore == 0){
        month=0;
        year++;
    }
    if(countMore >0){
        month = 0 + countMore;
        year++;
    }
    else if(month == -1){
        year--;
        month = 11;
    }

    console.log("add= "+add,"month= "+month,"year= "+year,"countMore= " +countMore);
    var daysInMonth = 0;
    var isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    var firstDay = new Date(year,month, 1);

    //choose month
    switch (month) {
        case 0: month = "Януари"; daysInMonth = 31; break;
        case 1: month = "Февруари"; daysInMonth = (isLeapYear)?29:28; break;
        case 2: month = "Март"; daysInMonth = 31; break;
        case 3: month = "Април"; daysInMonth = 30;break;
        case 4: month = "Май"; daysInMonth = 31; break;
        case 5: month = "Юни"; daysInMonth = 30; break;
        case 6: month = "Юли"; daysInMonth = 31; break;
        case 7: month = "Август"; daysInMonth = 31; break;
        case 8: month = "Септември"; daysInMonth = 30; break;
        case 9: month = "Октомври"; daysInMonth = 31; break;
        case 10: month = "Ноември"; daysInMonth = 30; break;
        case 11: month = "Декември"; daysInMonth = 31; break;
        default:console.log("Error in calendar! Month error!")
    }

    //set month and year
    document.getElementById("calendar-month-year").innerHTML = month+" "+year;

    //set days
    var day = date.getDay();
    if(day==0){day=7}else{day=day+1}
    var daysArr = document.getElementsByTagName("td");
    // var firstDay = new Date(date.getFullYear(),month, 1);
    if(firstDay.getDay() == 0){
        firstDay = 7;
    }
    else {
        firstDay = firstDay.getDay();
    }
    for (var i = 7,dayIterator = 1; dayIterator <= daysInMonth; i++) {
        if(dayIterator==date.getDate()){
            daysArr[i].id = "calendar-today";
        }
        if(i < 7+firstDay-1){
            daysArr[i].innerText = " ";
        }
        else{
            daysArr[i].innerText = dayIterator;
            daysArr[i].style.visibility="visible";
            daysArr[i].classList.add("visible");
            dayIterator++;
        }
    }
}

function calendarEvents(){
    var daysArr = document.getElementsByClassName("visible");
    for (var i = 0; i < daysArr.length; i++) {
        daysArr[i].addEventListener("click",function(){
            //black screen
            //clean black screen

        });
    }

    var add = 0;
    var leftArrow = document.getElementById("calendar-Arrows").children[0];
    var rightArrow = document.getElementById("calendar-Arrows").children[1];

    leftArrow.addEventListener("click",function () {
        add = add-1;
        calendarCalculations(add);
    });
    rightArrow.addEventListener("click",function () {
        add = add+1;
        calendarCalculations(add);
    });
}