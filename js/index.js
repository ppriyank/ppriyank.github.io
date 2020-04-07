var work = document.getElementById("portfolioItemContainer");
var workRequest = new XMLHttpRequest();

var publication = document.getElementById("publicationContainer");
var publicationRequest = new XMLHttpRequest();


var link = document.getElementById("socialLinkContent");
var linkRequest = new XMLHttpRequest();

publicationRequest.open("GET", "json/publication.json", true);
publicationRequest.onreadystatechange = function () {
    if (publicationRequest.readyState === 4) {
        if (publicationRequest.status === 200 || publicationRequest.status == 0) {
            var html = "";
            JSON.parse(publicationRequest.responseText).forEach(function (publication) {
                console.log(publication.name);
                console.log(html);
                // html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.arxiv + " target=\"_blank\">arxiv</a></p><p><a href=" + work.github + " target=\"_blank\">github</a></p></div>       <div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";    
                html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.arxiv + " target=\"_blank\">Visit</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";    
            });
            publication.innerHTML = html;
        }
    }
};
publicationRequest.send(null);



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

workRequest.open("GET", "json/items.json", true);
workRequest.onreadystatechange = function () {
    if (workRequest.readyState === 4) {
        if (workRequest.status === 200 || workRequest.status == 0) {
            var html = "";
            JSON.parse(workRequest.responseText).forEach(function (work) {
                console.log(work.name);
                console.log(html);
                if (work.name != "Publication"){
                    html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.link + " target=\"_blank\">Visit</a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";    
                }
                else{
                 html += "<div class=\"col s12 m6 l6\"><div class=\"card hoverable\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\" src=" + work.image + "></div><div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.arxiv + " target=\"_blank\"> arxiv </a></p></div><i class=\"material-icons right\">keyboard_arrow_up</i></span><p><a href=" + work.github + " target=\"_blank\"> github </a></p></div><div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\">" + work.name + "<i class=\"material-icons right\">close</i></span><p>" + work.description + "</p></div></div></div>";       
                }
                
            });
            work.innerHTML = html;
        }
    }
};
workRequest.send(null);
