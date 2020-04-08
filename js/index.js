var work = document.getElementById("portfolioItemContainer");
var workRequest = new XMLHttpRequest();

var publication = document.getElementById("publicationContainer");
var publicationRequest = new XMLHttpRequest();

var projects = document.getElementById("projectContainer");
var projectsRequest = new XMLHttpRequest();


var link = document.getElementById("socialLinkContent");
var linkRequest = new XMLHttpRequest();

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
};


linkRequest.open("GET", "json/links.json", true);
linkRequest.onreadystatechange = function () {
    if (linkRequest.readyState === 4) {
        if (linkRequest.status === 200 || linkRequest.status == 0) {
            var html = "";
            JSON.parse(linkRequest.responseText).forEach(function (link) {
                console.log(link.name);
                html += "<div class=\"links waves-effect\"><a href=" + link.url + " class=\"black-text valign-wrapper\" target=\"_blank\"><i class=\"link_icon mdi mdi-" + link.icon + "\" style=\"color: " + link.color + "\"></i>&nbsp; " + link.name + "</a></div>";
            });
            link.innerHTML = html;
        }
    }
};
linkRequest.send(null);

publicationRequest.open("GET", "json/publication.json", true);
publicationRequest.onreadystatechange = function () {
    if (publicationRequest.readyState === 4) {
        if (publicationRequest.status === 200 || publicationRequest.status == 0) {
            var html = "";
            JSON.parse(publicationRequest.responseText).forEach(function (publication) {
                console.log(publication.name);
                html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + publication.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + publication.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + publication.link + " target=\"_blank\">Arxiv  </a>    <a href=" + publication.github + " target=\"_blank\">  Github</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + publication.name + "<i class=\"material-icons right\">close</i></span><p>" + publication.description + "</p></div></div></div>";    
            });
            publication.innerHTML = html;
        }
    }
};
publicationRequest.send(null);


projectsRequest.open("GET", "json/projects.json", true);
projectsRequest.onreadystatechange = function () {
    if (projectsRequest.readyState === 4) {
        if (projectsRequest.status === 200 || projectsRequest.status == 0) {
            var html = "";
            JSON.parse(projectsRequest.responseText).forEach(function (projects) {
                console.log(projects.name);
                // if (projects.name == "Spatial Transformers Traffic signal classification"){
                //     console.log("=========");
                //     html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" width=\"200px\" height=\"250px\" src=" + projects.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.github + " target=\"_blank\">  Github</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                // }
                if (projects.gif){
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator centered-and-cropped\"   height=\"243px\" width=\"300\" src=\"" + projects.gif +  "\" alt=\"this slowpoke moves\"></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.github + " target=\"_blank\">  Github</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                }
                else if (projects.web)
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + projects.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.web + " target=\"_blank\">Website  </a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                else if (!projects.github)
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + projects.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.pdf + " target=\"_blank\">Pdf  </a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                else if (projects.pdf)
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + projects.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.pdf + " target=\"_blank\">Pdf  </a>    <a href=" + projects.github + " target=\"_blank\">  Github</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                else
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + projects.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + projects.github + " target=\"_blank\">Github</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + projects.name + "<i class=\"material-icons right\">close</i></span><p>" + projects.description + "</p></div></div></div>";    
                    
            });
            projects.innerHTML = html;
        }
    }
};
projectsRequest.send(null);



// workRequest.open("GET", "json/items.json", true);
// workRequest.onreadystatechange = function () {
//     if (workRequest.readyState === 4) {
//         if (workRequest.status === 200 || workRequest.status == 0) {
//             var html = "";
//             JSON.parse(workRequest.responseText).forEach(function (work) {
//                 console.log(work.name);
//                 // console.log(html);
//                 // if (work.name != "Publication"){
//                     html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.link + " target=\"_blank\">Visit</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";    
//                 // }
//                 // else{
//                  // html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.arxiv + " target=\"_blank\"> arxiv </a></p></div><i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.github + " target=\"_blank\"> github </a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";       
//                 // }
                
//             });
//             work.innerHTML = html;
//         }
//     }
// };
// workRequest.send(null);
