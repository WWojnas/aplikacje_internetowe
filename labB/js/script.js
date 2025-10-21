function draw() {
    let userList = localStorage.getItem("list");
    if (userList == null) {
        localStorage.setItem("list", "[]");
        return;
    }
    let userListJSON = JSON.parse(userList);
    
    if (userListJSON.length == 0) {
        document.getElementById("list").innerHTML = " ";
        return;
    }
    
    let newNode = " ";

    for (let i = 0; i < userListJSON.length; i++) {
        newNode += "<span id='" + userListJSON[i][2] + "' class='entry'>";
        newNode += "<a class='entry-content' onclick='edit("+userListJSON[i][2] + ")'>" + userListJSON[i][0] + "</a>";
        newNode += "<a class='entry-date' onclick='edit("+userListJSON[i][2] + ")'>" + userListJSON[i][1] + "</a>";
        newNode += "<button class='entry-button' onClick='pop(" + userListJSON[i][2] + ")'>Usuń</button>";
        newNode += "</span>";
    }
    
    document.getElementById("list").innerHTML = newNode;
}

function pop(entry){
    userList = localStorage.getItem("list");
    userListJSON = JSON.parse(userList);
    newList = [];
    for(let i = 0; i < userListJSON.length; i++){
        if(userListJSON[i][2] == entry){
            continue;
        }
        newList.push(userListJSON[i])
    }
    localStorage.setItem("list",JSON.stringify(newList));
    draw()
}

function add(){
    userList = localStorage.getItem("list");
    userListJSON = JSON.parse(userList);
    newContent = document.getElementById("new-entry-content").value;
    newDateContent = document.getElementById("new-entry-date").value;
    data = new Date(newDateContent);
    data.setHours(0, 0, 0, 0);
    let yesterday = new Date;
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (newContent.length < 3){
        alert("Wprowadź co najmniej 3 znaki do pola TODO: ");
        return;
    }
    if(data <= yesterday){
        alert("Wprowadź date dzisiejszą albo poźniejszą");
        return;
    }
    currentIndex = parseInt(localStorage.getItem("index"))
    userListJSON.push([newContent,newDateContent,currentIndex])
    localStorage.setItem("list",JSON.stringify(userListJSON));
    localStorage.setItem("index",currentIndex+1)
    draw();
}

function searchHelper(entry, searchTerm){
    return entry[0].toLowerCase().includes(searchTerm.toLowerCase());
}

function edit(id) {
    if (currentEditId !== null && currentEditId !== id) {
        save(currentEditId);
    }

    currentEditId = id;
    const span = document.getElementById(id);
    const userListJSON = JSON.parse(localStorage.getItem("list"));

    let content = "";
    let date = "";

    for (let i = 0; i < userListJSON.length; i++) {
        if (userListJSON[i][2] == id) {
            content = userListJSON[i][0];
            date = userListJSON[i][1];
        }
    }

    currentEditSpan = span;

    span.innerHTML = "";

    const inputContent = document.createElement("input");
    inputContent.type = "text";
    inputContent.setAttribute("maxlength", "255");
    inputContent.value = content;

    const inputContentDate = document.createElement("input");
    inputContentDate.type = "date";
    inputContentDate.value = date;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("entry-button");
    deleteButton.setAttribute("onclick", "pop(" + id + ")");
    deleteButton.textContent = "Usuń";

    span.appendChild(inputContent);
    span.appendChild(inputContentDate);
    span.appendChild(deleteButton);

    inputContent.focus();

    function handleClickOutside(event) {
        if (!span.contains(event.target)) {
            save(id, inputContent.value, inputContentDate.value);
        }
    }

    if (currentEditId !== id) {
        document.removeEventListener("click", handleClickOutside);
    }

    document.addEventListener("click", handleClickOutside);

    span.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

function save(id, content, date) {
    console.log("Saving content:", content, "Date:", date);

    const span = document.getElementById(id);
    const userListJSON = JSON.parse(localStorage.getItem("list"));

    for (let i = 0; i < userListJSON.length; i++) {
        if (userListJSON[i][2] == id) {
            userListJSON[i][0] = content;
            userListJSON[i][1] = date;
        }
    }
    localStorage.setItem("list", JSON.stringify(userListJSON));

    const dateElement = document.createElement("span");
    dateElement.textContent = date;
    span.appendChild(dateElement);

    currentEditId = null;
    currentEditSpan = null;
    draw();

}

function search(){
    searchTerm = document.getElementById("search-bar").value;
    if (searchTerm.length < 2) {
        draw();
        return;
    }
    document.getElementById("list").innerHTML = " "
    let userListJSON = JSON.parse(localStorage.getItem("list"));
    let filteredList = userListJSON.filter(entry => searchHelper(entry, searchTerm));

    newNode = "";
    for (let i = 0; i < filteredList.length; i++) {
        newNode += "<span id='" + filteredList[i][2] + "' class='entry'>";
        newNode += "<a class='entry-content' onclick='edit("+filteredList[i][2] + ")'>" + filteredList[i][0].replaceAll(searchTerm,"<mark>" + searchTerm + "</mark>") + "</a>";
        newNode += "<a class='entry-date' onclick='edit("+filteredList[i][2] + ")'>" + filteredList[i][1] + "</a>";
        newNode += "<button class='entry-button' onClick='pop(" + filteredList[i][2] + ")'>Usuń</button>";
        newNode += "</span>";
    }
    document.getElementById("list").innerHTML = newNode;
}

if(localStorage.getItem("index") == null){
    localStorage.setItem("index",0)
}
let currentEditId = null
draw()