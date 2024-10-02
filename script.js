let points = [];
let pointsToFill = "";
let pointsToShow = points;

async function GetPoints() {
    let url = "/point-get";
    let response = await fetch(url);
    let data = await response.json();
    points = data;
    pointsToShow = points;
    FillTable()
}

function FillTable() {
    let s = "";
    for (let i = 0; i < pointsToShow.length; i++) {
        s += "<tr>";
        s += `<td>${points[i].id}</td>`;
        s += `<td>${points[i].location}</td>`;
        s += `<td><button id="edit" onclick="editPoint(${i})">עריכה</button></td>`
        s += `<td><button id="delete" onclick="deletePoint(${i})">מחיקה</button></td>`
        s += "</tr>";
    }
    document.getElementById("tbodyMainTable").innerHTML = s;
}

GetPoints();


