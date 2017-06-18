(function () {
    var user = window.location.href.split("?")[1].split("=")[1] || "child";
    document.getElementById("user").innerText = user;
    menu(user);

    //preview
    var closeButtons = document.getElementsByClassName("close-button");
    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener("click",function () {
            clearPreview(this.parentNode);
        });
    }

    //Exercises
    TaksShowHide();

    eventListener("child",user);
})();

//Gallery
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

function getArticles(url,type,user) {
    return getRequest(url).then(function(successMessage,rejectMessage) {
        var arr = [];
        arr.push.apply(arr, successMessage.split("\n"));

        if(type =="img")
            var content  = document.getElementById('pictures');
        else if(type=="lessons"){
            var content = document.getElementById("lessons-nav");
        }
        content.innerHTML = "";
        var fragment = document.createDocumentFragment();

        for (var i = 0; i <arr.length; i++) {

            if(arr[i]){
                if(type=="img"){
                    var imageDiv = document.createElement('div');
                    imageDiv.className = "image";
                    var imgEl = document.createElement("img");
                    imgEl.setAttribute("src","users/"+user+"/"+arr[i]);
                    imageDiv.appendChild(imgEl);

                    fragment.appendChild(imageDiv);
                }else if(type="lessons"){
                    var json = JSON.parse(arr[i]);
                    var li = document.createElement('li');
                    li.setAttribute("lesson","lessons/"+json.url);
                    li.innerHTML = json.name;
                    fragment.appendChild(li);
                }
            }
        }

        // if(arr.length ==1){
        //     var div = document.createElement('div');
        //     div.setAttribute("id", "noPhotosYet");
        //     div.innerHTML = "<h3>No photos yet</h3>" +
        //         "<div id=\"uploadFile\">Upload Photo</div>";
        //     fragment.appendChild(div);
        //
        //     content.appendChild(fragment);
        //
        //     document.getElementById("uploadFile").addEventListener("click",function () {
        //         document.getElementById("addPhoto-panel").style.display = "block";
        //     });
        // }else{
            content.appendChild(fragment);
        //}

        if(type=="img") previewImages(content.children);
    });
}

function previewImages(imageDivs) {

    for (var i = 0; i < imageDivs.length; i++) {

        var imageEl = imageDivs[i].children[0];

        var img = new Image();
        img.src = imageEl.getAttribute("src");
        img.element = imageEl;
        img.element.parent = imageDivs[i];
        img.element.parentSiblings = [imageDivs[i - 1], imageDivs[i + 1]];

        img.element.addEventListener("click", function () {
            this.parent.classList.add("currentPic");
            preview(this);
        });
    }

    var arrows = document.getElementsByClassName("arrow");
    for (var j = 0; j < arrows.length; j++) {
        arrows[j].i = j;
        arrows[j].addEventListener("click", function () {
            var imageEl = changeCurrentPic(this.i);
            preview(imageEl);
        });
    }
    document.addEventListener("keydown",function (e) {
        var imageEl;
        if(e.keyCode ==39){
            imageEl = changeCurrentPic(1);
            preview(imageEl);
        }else if(e.keyCode ==37){
            imageEl = changeCurrentPic(0);
            preview(imageEl);
        }
        else if(e.keyCode == 27){
            clearPreview(document.getElementById("preview"));
        }

    })
}

function changeCurrentPic(i) {
    var current = document.getElementsByClassName("currentPic")[0];
    var previousSibling = current.previousElementSibling;
    var nextSibling = current.nextElementSibling;

    var imageEl;
    if(i){ // right
        imageEl = nextSibling.children[0];
    }else{ //left
        imageEl = previousSibling.children[0];
    }

    current.classList.remove("currentPic");
    imageEl.parentNode.classList.add("currentPic");

    return imageEl;
}

function preview(image) {

    var previewDiv = document.getElementById("preview");
    previewDiv.style.display = "block";
    var imageDiv = previewDiv.children[1];
    imageDiv.innerHTML = "";
    var imgEl = image.cloneNode(true);

    var parent = image.parentNode;

    if(!parent.nextElementSibling){
       document.getElementById("rightArrow").style.display = "none";
    }else{
        document.getElementById("rightArrow").style.display = "block";
    }
    if(!parent.previousElementSibling){
        document.getElementById("leftArrow").style.display = "none";
    }else{
        document.getElementById("leftArrow").style.display = "block";
    }

    imageDiv.appendChild(imgEl);
}


//Lectures

function viewLesson(url) {
    var previewDiv = document.getElementById("preview");
    previewDiv.style.display = "block";
    var parent = previewDiv.children[1];
    parent.innerHTML = "";

    var arrows = document.getElementsByClassName("arrow");
    arrows[0].style.display = "none";
    arrows[1].style.display = "none";

    var fragment = document.createDocumentFragment();

    var embededTag;
    if(url.split('.')[1].trim() == 'pdf'){
        embededTag= document.createElement('embed');
        embededTag.src = url;
        embededTag.height = "100%";

    }else if(url.includes("http://") || url.includes("www")){
       embededTag = document.createElement("iframe");
        embededTag.height = "100%";
        embededTag.src="https://www.youtube.com/embed/XGSy3_Czz8k";
    }else{
        embededTag = document.createElement("video");
        var source = document.createElement("source");
        embededTag.controls = true;
        source.src=url;
        embededTag.appendChild(source);
    }

    embededTag.width = "800";
    fragment.appendChild(embededTag);
    parent.appendChild(fragment);

}

function lessonsMenu() {
    var menu = document.getElementById("lessons-nav").children;


    for (var i = 0; i < menu.length; i++) {
        menu[i].addEventListener("click",function () {
            var lesson = this.getAttribute("lesson");

            viewLesson(lesson);
        })
    }
}

/* Exercises */

function TaksShowHide() {
    var tasks = document.getElementsByClassName("task");

    for (var i = 0; i < tasks.length; i++) {
        tasks[i].addEventListener("click",function () {
           var content = this.children[1];
            if(window.getComputedStyle(content, null).getPropertyValue("display") =="none"){
                content.style.display="block";
            }else{
                content.style.display = "none";
            }

        })

    }
}

