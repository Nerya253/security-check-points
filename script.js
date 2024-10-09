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
        s += "<tr>";
        s += `<td>${i + 1}</td>`;
        s += `<td>${pointsToShow[i].pointName}</td>`;
        s += `<td><button id="edit" onclick="openModal(${i})">EDIT</button></td>`;
        s += `<td><button id="delete" onclick="deletePoint(${i})">DELETE</button></td>`;
        s += "</tr>";
    }
    document.getElementById("tbodyMainTable").innerHTML = s;
}


//הוספת נקודה חדשה
function AddNewPoint() {
    let newPointName = document.getElementById("point-name").value;

    if (!newPointName) {
        alert("מלא את כל השדות");
        return;
    }

    if (sameName(newPointName)) {
        alert("There is already a point in this name");
        return;
    }

    let point = {
        pointName: newPointName
    }

    points.push(point);
    addPointToServer(point);
    FillTable();

    document.getElementById("point-name").value = "";
}

//בדיקה שברגע הוספת נקודה אין נקודה עם אותו שם
function sameName(newPointName) {
    let same = false;
    for (let i = 0; i < pointsToShow.length; i++) {
        if (pointsToShow[i].pointName === newPointName) {
            same = true;
            break;
        }
    }
    return same;
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

let isModalOpen = false; 
let editIndex = null;

function openModal(index) {
    editIndex = index;
    let currentPoint = pointsToShow[index].pointName;
    document.getElementById("edit-point-name").value = "";
    document.getElementById("editModal").style.display = "block";
    isModalOpen = true; 
    document.getElementById("edit-point-name").focus(); 

}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
    isModalOpen = false;   
}

//עריכת נקודה
function editPoint() {
    let currentPoint = pointsToShow[editIndex].pointName;
    let newName = document.getElementById("edit-point-name").value;
    let haveOneMore = false;
    
    if (newName === null || newName.trim() === "") {
        return;
    }
    
    pointsToShow.forEach(point => {
        if (newName === point.pointName) {
            alert("There is already a point in this name");
            haveOneMore = true;
            return;
        }
    })
    if (haveOneMore) return
    
    pointsToShow[editIndex].pointName = newName;
    
    updateEditPointOnServer(pointsToShow[editIndex].id, newName);
    FillTable();
    closeModal();
    updateVisitLogs(currentPoint, newName);
}

//במידה וערכתי את השם תעדכן גם בטבלת תיעודים
function updateVisitLogs(currentPoint, newName) {
    visits.forEach(visit => {
        console.log(visit, currentPoint);
        if (visit.pointName === currentPoint) {
            visit.pointName = newName;
        }
    })
    managerGetVisits();
}

//עדכון העריכה בשרת
async function updateEditPointOnServer(pointId, newName) {
    let url = `/points/${pointId}`;
    await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pointName: newName })
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
        s += `<option value="${data[point_id].id}">${data[point_id].pointName}</option>`;
    }
    document.getElementById("visitPointSelect").innerHTML = s;
}

//שמירת תיעוד ביקור
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
    alert("התיעוד נשלח")
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
let visits;

//קבלת כל רשימת התיעודים מהשרת לדף המנהל
async function managerGetVisits() {
    let url = "/Visit";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    visits = await response.json();

    let tbody = document.getElementById("visitsBody");
    tbody.innerHTML = "";

    visits.forEach(visit => {
        let row = 
            `<tr>
            <td>${visit.pointName}</td>
            <td>${visit.time}</td>
            <td>${visit.date}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

function loadManagerPage() {
    FillTable();
    managerGetVisits();
}

// האזנה ללחיצה על Enter 
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        if (isModalOpen) {
            editPoint();
        } else {
            AddNewPoint();
        }
    }
});