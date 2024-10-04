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
    addPointToServer(point);
    FillTable();
}

async function addPointToServer(point) {
    let url = "/points";
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(point)
    });
}




function editPoint(index) {
    let currentLocation = pointsToShow[index].location;
    
    let newName = prompt("הכנס את השם החדש", currentLocation);

    if (newName === null || newName.trim() === "") { 
        return; // 
    }
    
    pointsToShow[index].location = newName; 
    console.log(pointsToShow[index].id);

    updatePointOnServer(pointsToShow[index].id, newName);
    FillTable(); 
}

async function updatePointOnServer(pointId, newName) {
    let url = `/points/${pointId}`;
    await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: newName })
    });
}




async function deletePoint(PointId) {
    await deletePointFromServer(PointId);
    FillTable();
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
