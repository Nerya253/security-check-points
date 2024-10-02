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

function AddNewPoint() {
    let pointId = points.length+1;
    let pointLocation = document.getElementById("point-name").value;

    if (!pointLocation ) {
        alert("מלא את כל השדות");
        return;
    }

    point = {
        id: pointId,
        location: pointLocation
    };

    points.push(point);

    createPointToServer(point);

    FillTable();
}




document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); //מבטל פעולת ברירת מחדל
        AddNewPoint();
    }
});