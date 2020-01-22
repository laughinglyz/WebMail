page = 0;
q = -1;
cont = 0;
box = "Inbox";
document.getElementById("bt3").innerHTML = "<";
bt2 = document.getElementById("bt2");


function list() {
    var a = document.getElementById("bt2");
    a.innerHTML = "";
    var a0 = document.createElement("option");
    a0.setAttribute("selected", "yes");
    a0.innerHTML = "Move to...";
    a.appendChild(a0);
    if (box == "Inbox") {
        var a1 = document.createElement("option");
        a1.setAttribute("value", "Important");
        a1.innerHTML = "Important";
        a.appendChild(a1);
        var a2 = document.createElement("option");
        a2.setAttribute("value", "Sent");
        a2.innerHTML = "Sent";
        a.appendChild(a2);
        var a3 = document.createElement("option");
        a3.setAttribute("value", "Trash");
        a3.innerHTML = "Trash";
        a.appendChild(a3);
    }
    if (box == "Important") {
        var a1 = document.createElement("option");
        a1.setAttribute("value", "Inbox");
        a1.innerHTML = "Inbox";
        a.appendChild(a1);
        var a2 = document.createElement("option");
        a2.setAttribute("value", "Sent");
        a2.innerHTML = "Sent";
        a.appendChild(a2);
        var a3 = document.createElement("option");
        a3.setAttribute("value", "Trash");
        a3.innerHTML = "Trash";
        a.appendChild(a3);
    }
    if (box == "Sent") {
        var a1 = document.createElement("option");
        a1.setAttribute("value", "Inbox");
        a1.innerHTML = "Inbox";
        a.appendChild(a1);
        var a2 = document.createElement("option");
        a2.setAttribute("value", "Important");
        a2.innerHTML = "Important";
        a.appendChild(a2);
        var a3 = document.createElement("option");
        a3.setAttribute("value", "Trash");
        a3.innerHTML = "Trash";
        a.appendChild(a3);
    }
    if (box == "Trash") {
        var a1 = document.createElement("option");
        a1.setAttribute("value", "Inbox");
        a1.innerHTML = "Inbox";
        a.appendChild(a1);
        var a2 = document.createElement("option");
        a2.setAttribute("value", "Important");
        a2.innerHTML = "Important";
        a.appendChild(a2);
        var a3 = document.createElement("option");
        a3.setAttribute("value", "Sent");
        a3.innerHTML = "Sent";
        a.appendChild(a3);
    }
}

function moveto(ev) {
    q2 = ev.selectedIndex;
    dest = ev[q2].value;
    list();
    if (cont == 0) {
        var totalselection = 0;
        var checks = new Array("false", "false", "false");
        entries = document.getElementsByClassName("entry");
        checkboxes = document.getElementsByClassName("checkbox");
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].children[0].checked == true) {
                checks[i] = "true";
                totalselection += 1;
            }
        }
        if (totalselection > 0) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    str = xmlhttp.responseText.split("《");
                    document.getElementById("email").innerHTML += str[0];
                    pagelimit = parseInt(str[1]);
                }
            }
            xmlhttp.open("POST", "changemailbox", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("mailbox=" + box + "&page=" + page + "&dest=" + dest + "&entry0=" + checks[0] + "&entry1=" + checks[1] + "&entry2=" + checks[2] + "&totalselection=" + totalselection);

            for (var i = 0, deducted = 0; i < 3; i++) {
                if (checks[i] == "true") {
                    document.getElementById("email").removeChild(entries[i - deducted]);
                    deducted += 1;
                }
            }
        }
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                str = xmlhttp.responseText.split("《");
                document.getElementById("email").innerHTML = str[0];
                pagelimit = parseInt(str[1]);
                cont = 0;
                page = 0;
            }
        }
        xmlhttp.open("POST", "changemailbox", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("mailbox=" + box + "&q=" + q + "&dest=" + dest + "&totalselection=" + 0);
    }
}

function next() {
    if (cont == 0) {
        if (page < pagelimit - 1) {
            page += 1;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    str = xmlhttp.responseText.split("《");
                    document.getElementById("email").innerHTML = str[0];
                }
            }
            xmlhttp.open("GET", "retrieveemaillist?mailbox=" + box + "&page=" + page, true);
            xmlhttp.send();
        }
    } else {
        if (q < qlimit - 1) {
            q += 1;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    str = xmlhttp.responseText.split("《");
                    document.getElementById("email").innerHTML = str[0];
                }
            }
            xmlhttp.open("GET", "getemail?q=" + q + "&mailbox=" + box, true);
            xmlhttp.send();
        }
    }
}


function before() {
    if (cont == 0) {
        if (page > 0) {
            page -= 1;
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                str = xmlhttp.responseText.split("《");
                document.getElementById("email").innerHTML = str[0];
            }
        }
        xmlhttp.open("GET", "retrieveemaillist?mailbox=" + box + "&page=" + page, true);
        xmlhttp.send();
    } else {
        if (q > 0) {
            q -= 1;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    str = xmlhttp.responseText.split("《");
                    document.getElementById("email").innerHTML = str[0];
                }
            }
            xmlhttp.open("GET", "getemail?q=" + q + "&mailbox=" + box, true);
            xmlhttp.send();
        }
    }
}

function loadinbox() {
    cont = 0;
    box = "Inbox";
    page = 0;
    list();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            pagelimit = parseInt(str[1]);
            document.getElementById("Inbox").style.color = "black";
            document.getElementById("Important").style.color = "rgb(114, 113, 113)";
            document.getElementById("Sent").style.color = "rgb(114, 113, 113)";
            document.getElementById("Trash").style.color = "rgb(114, 113, 113)";
        }
    }
    xmlhttp.open("GET", "retrieveemaillist?mailbox=Inbox&page=" + page, true);
    xmlhttp.send();
}

function loadimportant() {
    cont = 0;
    box = "Important";
    page = 0;
    list();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("Important").style.color = "black";
            document.getElementById("Inbox").style.color = "rgb(114, 113, 113)";
            document.getElementById("Sent").style.color = "rgb(114, 113, 113)";
            document.getElementById("Trash").style.color = "rgb(114, 113, 113)";
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            pagelimit = parseInt(str[1]);
        }
    }
    xmlhttp.open("GET", "retrieveemaillist?mailbox=Important&page=" + page, true);
    xmlhttp.send();
}

function loadsent() {
    cont = 0;
    box = "Sent";
    page = 0;
    list();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("Sent").style.color = "black";
            document.getElementById("Important").style.color = "rgb(114, 113, 113)";
            document.getElementById("Inbox").style.color = "rgb(114, 113, 113)";
            document.getElementById("Trash").style.color = "rgb(114, 113, 113)";
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            pagelimit = parseInt(str[1]);
        }
    }
    xmlhttp.open("GET", "retrieveemaillist?mailbox=Sent&page=" + page, true);
    xmlhttp.send();
}

function loadtrash() {
    cont = 0;
    box = "Trash";
    page = 0;
    list();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("Trash").style.color = "black";
            document.getElementById("Important").style.color = "rgb(114, 113, 113)";
            document.getElementById("Sent").style.color = "rgb(114, 113, 113)";
            document.getElementById("Inbox").style.color = "rgb(114, 113, 113)";
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            pagelimit = parseInt(str[1]);
        }
    }
    xmlhttp.open("GET", "retrieveemaillist?mailbox=Trash&page=" + page, true);
    xmlhttp.send();
}

function loadcontent(ele) {
    q = -1;
    cont = 1;
    var p = ele.parentNode;
    var entryno = parseInt(p.id);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            q = parseInt(str[1]);
            qlimit = parseInt(str[2]);
        }
    }
    xmlhttp.open("GET", "getemail?mailbox=" + box + "&entryno=" + entryno + "&page=" + page + "&q=" + q, true);
    xmlhttp.send();
}

function Compose() {
    var list2 = document.getElementById("email");

    list2.innerHTML = "";
    list3=document.createElement("form");
    list3.setAttribute("id","myForm");
    list3.setAttribute("name","newemail");
    list3.setAttribute("method","POST");
    list3.setAttribute("action","sendemail")
    list3.setAttribute("onsubmit","submitform()");
    list2.appendChild(list3);
    list3.innerHTML = "<h2>New Message</h2><br>";
    list3.innerHTML += "To:<input id=\"myrecipient\" type=\"text\" size=\"30\" name=\"recipient\"><br>";
    list3.innerHTML += "Subject:<input id=\"mytitle\" type=\"text\" size=\"30\" name=\"title\"><br>";
    list3.innerHTML += "<textarea cols=\"30\" rows=\"10\" id=\"mycontent\"></textarea><br>";
    list3.innerHTML += "<input type=\"submit\" value=\"Submit\">";
}

function submitform() {
    event.preventDefault();
    cont = 0;
    page = 0;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            str = xmlhttp.responseText.split("《");
            document.getElementById("email").innerHTML = str[0];
            pagelimit = parseInt(str[1]);
        }
    }
    var f = document.getElementById("myForm");
    var method = f.getAttribute("method");
    var url = f.getAttribute("action");
    var myrecipient = document.getElementById("myrecipient").value;
    var mytitle = document.getElementById("mytitle").value;
    var mycontent = document.getElementById("mycontent").value;
    xmlhttp.open(method, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("myrecipient=" + myrecipient + "&mytitle=" + mytitle + "&mycontent=" + mycontent + "&mailbox=" + box);
}