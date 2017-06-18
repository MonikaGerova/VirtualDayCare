(function () {
    var user = window.location.href.split("?")[1].split("=")[1] || "teacher";
    document.getElementById("user").innerText = user;
    menu('teacher');
    getUsers().then(function () {
        var profiles = document.getElementsByClassName("kid");

        for (var i = 0; i < profiles.length; i++) {
            profiles[i].addEventListener("click",function () {
                userPanel(this.children[1].innerHTML);
            })
        }

    });

    //uploadFile
    var fileForm = document.forms.fileForm;

    fileForm.addEventListener("submit",function (event) {
        if(this.children.fileTitle.value &&(this.children["drag-and-drop"].children.file.value ||
            this.children["drag-and-drop"].children.urlFile.value)){
            uploadFile(this,"Lecture");
        }else{
            document.getElementById("uploadLectureResponse").classList.add("flaticon-letter-x");
        }
        event.preventDefault();
    });



    previewFiles();

    //Calendar
    calendarCalculations();
    calendarEvents();

})();

function clearMessageWall() {
    document.getElementById("messages").innerHTML = "";
    document.getElementById("messageBalloon").value = "";
    document.getElementById("profileInfo").children[0].children[1].innerText="";

}



function getUsers() {
    return getRequest("getUsers.php").then(function (resolve,reject) {
        var dirPaths = JSON.parse(resolve);
        var resultBox = document.getElementById("group-box");
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < dirPaths.length; i++) {
            var dir = dirPaths[i].split("\\");

            var div = document.createElement("div");
            div.classList.add("kid");
            var name = document.createElement("span");
            name.innerHTML = dir[1];
            var icon = document.createElement("img");
            icon.src = "child.png";
            icon.classList.add("profilePic");

            div.appendChild(icon);
            div.appendChild(name);
            fragment.appendChild(div);
        }

        resultBox.appendChild(fragment);

    });
}

function userPanel(user) {

    getRequest("previewTemplate.html").then(function (resolveText) {

        var previewDiv = document.getElementById("preview");
        previewDiv.innerHTML = resolveText;
        previewDiv.style.display = "block";

        var profileNameSpan = document.getElementById("profileInfo").children[0].children[1];
        profileNameSpan.innerText = user;

        document.getElementById("photo").addEventListener("change",function () {
            var photoName = document.getElementById("photoName");
            photoName.innerText = "";
            document.getElementById("uploadResponse").className = "";

            var path = this.value.split("\\") ;
            var src = path[path.length-1];
            photoName.innerText = src;

        });

        getMessages(user,"messages");
        getNotes(user);
        eventListener("teacher",user);
    })

}

function getNotes(child) {
    getRequest("users/"+child+"/notes.txt").then(function(successMessage,rejectMessage) {

        var notesWall = document.getElementById("notesWall").children;
        if(window.getComputedStyle(notesWall["notes"],null).getPropertyValue("display")=="block"){
            notesWall["notes"].innerHTML = successMessage;
        }else{
            notesWall["writeNote"].value = successMessage;
        }
    });
}

function writeNote(data,child) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "writeNote.php", true);

    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onload = function() {
        if (httpRequest.status == 200) {
            getNotes(child);
        }
    };
    var path = "users/"+child+"/notes.txt";
    httpRequest.send("data="+data+"&path="+path);

}

function previewFiles() {
    document.getElementById("file").addEventListener("change",function () {
        var dragAndDropBox = document.getElementById("drag-and-drop-box");
        dragAndDropBox.innerHTML = "";
        document.getElementById("uploadLectureResponse").className = "";

        var fragment = document.createDocumentFragment();
        // document.getElementById("drag-and-drop-box").children[0].style.display = "none";

        var previewDiv = document.createElement("div");
        previewDiv.id = "previewFile";

        var files = this.files;
        for (var i = 0; i < files.length; i++) {
            var spanIcon = document.createElement("span");
            spanIcon.classList.add("flaticon");
            spanIcon.classList.add("flaticon-list");
            spanIcon.innerText = files[i].name;
            var fileName = document.createElement("span");
            // fileName.innerText
            fragment.appendChild(spanIcon);
        }
        previewDiv.appendChild(fragment);
        dragAndDropBox.appendChild(previewDiv);

    });
}

// function uploadFile(form) {
//     var httpRequest = new XMLHttpRequest();
//     httpRequest.open("POST", "uploadFile.php", true);
//     var formData = new FormData(form);
//     httpRequest.onload = function() {
//
//         if (httpRequest.status == 200) {
//             document.getElementById("uploadLectureResponse").classList.add("flaticon-tick-mark");
//         } else {
//             document.getElementById("uploadLectureResponse").classList.add("flaticon-letter-x");
//         }
//         console.log(httpRequest.response);
//
//     };
//     httpRequest.send(formData);
// }