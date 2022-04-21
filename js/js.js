function activeSidebar(className) {
    var listMenu = document.querySelectorAll(".sidebar_link");
    listMenu.forEach(ele => ele.classList.remove("active"));
    if(className != null){
        document.querySelector("."+className).classList.add("active");
    }
}



