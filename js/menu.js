function menu(user) {
    var menu = document.getElementById("menu").children;

    for (var i = 0; i < menu.length; i++) {

        //onclick
        menu[i].addEventListener("click",function () {

            var id = this.getAttribute("id");

            //change content
            var currentContent = document.getElementsByClassName("current-content")[0];
            if(currentContent) currentContent.classList.remove("current-content");
            document.getElementById(id + "-content").className = "current-content";

            switch (id){
                case "lectures":
                    getArticles("lessons/lessons.txt","lessons",user).then(function () {
                        lessonsMenu();
                    }); break;
                case "gallery":  getArticles("users/"+user+"/gallery.txt","img",user); break;
                case "messagesWall":   getMessages(user,"messages");break;
                // case "group": getUsers();break;
            }

            //change menu li
            var currentLi = document.getElementsByClassName("current-li")[0];
            if(currentLi) currentLi.classList.remove("current-li");
            this.classList.add("current-li");

        });

        // on hover
        menu[i].addEventListener("mouseover",addPrevClass,false);
    }
}
function addPrevClass (e) {
    var target = e.target;
    var prevLi = target.parentNode.previousElementSibling;
    if(prevLi) {
        prevLi.classList.add('prev');
    }

    target.addEventListener('mouseout', function() {
        if(prevLi) prevLi.classList.remove('prev');
    }, false);
}

