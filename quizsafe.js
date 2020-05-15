var quiz = {};
var a = 0;
quiz.xml = function (xml, a) {
    var xmlDOM = xml.responseXML;
    var quizy = xmlDOM.querySelectorAll("quiz");
    quizy.length = 0;
    for (var i = 0; i < a || i > quizy.length; i++) {
        var nazev = xmlDOM.querySelectorAll('vsechny quiz nazev')[i].childNodes[0];
        document.querySelector(".nazev").innerHTML = nazev.nodeValue;
        var otazka = xmlDOM.querySelectorAll('vsechny quiz otazka')[i].childNodes[0];
        document.querySelector(".otazka").innerHTML = otazka.nodeValue;
        var sprOdpoved = xmlDOM.querySelectorAll('vsechny quiz odpovedi odp[spravne="ano"]')[i].childNodes[0];
        for (let c = 0; c < 4; c++) {
            var odpoved = xmlDOM.querySelectorAll('vsechny quiz')[i].querySelectorAll('odpovedi odp')[c].childNodes[0];
            document.querySelectorAll(".odpovedi button")[c].innerHTML = odpoved.nodeValue;
            if (sprOdpoved == odpoved) {
                document.querySelectorAll(".odpovedi button")[c].style.color = "green";
            } else {
                document.querySelectorAll(".odpovedi button")[c].style.color = "red";
            }
        }

        
    }
}
quiz.xmlLoad = function () {
    var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        quiz.xml(this, a);
    }
};
xhttp.open("GET", "quiz.xml", true);
xhttp.send();
}
quiz.listen = function(){
    var tlac = document.querySelectorAll("button");
    for (let loop = 0; loop < tlac.length; loop++) {
        tlac[loop].addEventListener("click", function(e){
            var ktere = e.target;
            console.log(ktere);
            a++;
            quiz.xmlLoad(a);
        });   
    }
}
quiz.listen()