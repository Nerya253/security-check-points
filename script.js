let points = [];
let pointsToShow = points;

async function GetPoints() {
    let url = "/points";
    let response = await fetch(url);
    let data = await response.json();
    
    return data;
}

async function FillTable() {
    pointsToShow = await GetPoints();
    let s = "";
    for (let i = 0; i < pointsToShow.length; i++) {
        s += "<tr>";
        s += `<td>${i+1}</td>`;
        s += `<td>${pointsToShow[i].location}</td>`;
        s += `<td><button id="edit" onclick="editPoint(${i})">עריכה</button></td>`;
        s += `<td><button id="delete" onclick="deletePoint(${i})">מחיקה</button></td>`;
        s += "</tr>";
    }
    
    document.getElementById("tbodyMainTable").innerHTML = s;
}

function AddNewPoint() {
    let pointLocation = document.getElementById("point-name").value;

    if (!pointLocation) {
        alert("מלא את כל השדות");
        return;
    }

    let point = {
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


async function deletePointFromServer(PointId) {
    let url = `/points/${PointId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    }
    );
}


async function deletePoint(PointId) {
    await deletePointFromServer(PointId);
    FillTable();
    console.log("Trying to delete point with id:", PointId); // וודא שהאינדקס שאתה שולח נכון
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

FillTable();
guardPoints();





// האזנה ללחיצה על Enter 
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        AddNewPoint();
    }
});
