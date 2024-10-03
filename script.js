let points = [];
let pointsToShow = points;

async function GetPoints() {
    let url = "/points";  
    let response = await fetch(url);
    let data = await response.json();
    points = data;
    pointsToShow = points;
    FillTable(); 
}


function FillTable() {
    let s = "";
    for (let i = 0; i < pointsToShow.length; i++) {
        s += "<tr>";
        s += `<td>${pointsToShow[i].id}</td>`;
        s += `<td>${pointsToShow[i].location}</td>`;
        s += `<td><button id="edit" ">עריכה</button></td>`;
        s += `<td><button id="delete" ">מחיקה</button></td>`;
        s += "</tr>";
    }
    document.getElementById("tbodyMainTable").innerHTML = s;
}


function AddNewPoint() {
    let pointId = points.length + 1;
    let pointLocation = document.getElementById("point-name").value;

    if (!pointLocation) {
        alert("מלא את כל השדות");
        return;
    }

    let point = {
        id: pointId,
        location: pointLocation
    };

    points.push(point);
    createPointToServer(point);  
    FillTable();
}


async function createPointToServer(point) {
    let url = "/points"; 
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(point)
    });
}


async function guardPoints() {
    let url = "/points";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    let data = await response.json();
    let s = "";
    for (let point_id in data) {
        s += `<option value="${data[point_id].id}">${data[point_id].location}</option>`;
    }
    document.getElementById("visitPointSelect").innerHTML = s;
}

GetPoints(); 
guardPoints();


// האזנה ללחיצה על Enter להוספת נקודה חדשה
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        AddNewPoint();
    }
});
