let points = [];
let pointsToShow = points;



//קבלת כל הנקודות הקיימות
async function GetPoints() {
    let url = "/points";
    let response = await fetch(url);
    let data = await response.json();

    return data;
}
//תמלא את הטבלה
async function FillTable() {
    pointsToShow = await GetPoints();
    let s = "";
    for (let i = 0; i < pointsToShow.length; i++) {
        console.log(pointsToShow[i]);

        s += "<tr>";
        s += `<td>${i + 1}</td>`;
        s += `<td>${pointsToShow[i].location}</td>`;
        s += `<td><button id="edit" onclick="editPoint(${i})">עריכה</button></td>`;
        s += `<td><button id="delete" onclick="deletePoint(${i})">מחיקה</button></td>`;
        s += "</tr>";
    }

    document.getElementById("tbodyMainTable").innerHTML = s;
}


//הוספת נקודה חדשה
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

    document.getElementById("point-name").value = "";
}
//הוספת הנקודה החדשה לשרת
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

//עריכת נקודה
function editPoint(index) {
    let currentLocation = pointsToShow[index].location;

    let newName = prompt("הכנס את השם החדש", currentLocation);

    if (newName === null || newName.trim() === "") {
        return;
    }

    pointsToShow[index].location = newName;

    editPointOnServer(pointsToShow[index].id, newName);
    FillTable();
}
//שמירת הנקודה הערוכה בשרת
async function editPointOnServer(pointId, newName) {
    let url = `/points/${pointId}`;
    await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: newName })
    });
}

//מחיקת נקודה
async function deletePoint(pointId) {
    await deletePointFromServer(pointId);

    for (let i = 0; i < pointsToShow.length; i++) {
        if (pointsToShow[i].id > pointId) {
            pointsToShow[i].id--;
        }
    }

    FillTable();
}
//מחיקת הנקודה מהשרת
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

//קבלת כל הרשימה מהשרת לדף של השומר
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

//שמירת תיעוד ביקוד
function submitVisit() {
    let select = document.getElementById("visitPointSelect");
    let pointId = select.value;
    let pointName = select.options[pointId].text;
    let visitTime = new Date().toLocaleTimeString();
    let visitDate = new Date().toLocaleDateString();

    let visitData = {
        pointName: pointName,
        time: visitTime,
        date: visitDate
    };
    sendVisitToServer(visitData);
}
//שמירת כל נתוני התיעוד בשרת
async function sendVisitToServer(visitData) {
    let url = "/Visit";
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(visitData)
    });
}

//קבלת כל רשימת התיעודים מהשרת לדף המנהל
async function managerGetVisits() {
    let url = "/Visit";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const visits = await response.json();
console.log(visits);

    let tbody = document.getElementById("visitsBody");
    tbody.innerHTML = "";

    visits.forEach(visit => {
        let row = `<tr>
                    <td>${visit.pointName}</td>
                    <td>${visit.time}</td>
                    <td>${visit.date}</td>
                   </tr>`;
        tbody.innerHTML += row;
    });
}


function loadManagerPage(){
    FillTable();
    managerGetVisits();
}

// האזנה ללחיצה על Enter 
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        AddNewPoint();
    }
});
