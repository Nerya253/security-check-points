const express = require("express");
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

const port = 3333;

//מסלול כתובות ראשיות
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/select.html'));
});
app.get('/manager', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/manager.html'));
});
app.get('/guard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/guard.html'));
});


let points = [];
let pointsCnt = 0;

// קריאת כל הנקודות (get)
app.get('/points', (req, res) => {
    res.status(200).json(points);
});

//יצירת נקודה חדשה (POST)
app.post('/points', (req, res) => {
    let point = {};
    point.id = pointsCnt++;
    point.pointName = req.body.pointName;
    points.push(point);

    res.status(200).json("ok");
});

//עריכת נקודה (PATCH)
app.patch('/points/:idx', (req, res) => {
    let idx = req.params.idx;
    visitLogs.forEach(visit => {
        if(visit.pointName === points[idx].pointName)
            {
                visit.pointName = req.body.pointName;
            }    
        })
    points[idx].pointName = req.body.pointName;
    res.status(200).json("ok");
});

//מחיקת נקודה (DELETE)
app.delete('/points/:idx', (req, res) => {
    let idx = req.params.idx;
    points.splice(idx, 1);

    for (let i = 0; i < points.length; i++) {
        points[i].id = i;
    }
    pointsCnt = points.length;

    res.status(200).json(points);
});


let visitLogs = [];

// רשימת התיעודים
app.get('/visit', (req, res) => {
    res.status(200).json(visitLogs);
});

//שמירת תיעוד
app.post('/Visit', (req, res) => {
    let visitData = req.body;
    visitLogs.push(visitData);

    res.status(200).json("ביקור נרשם בהצלחה");
});



app.listen(port, () => {
    console.log(`Live server! \nhttp://localhost:${port}`);
});


