const express = require("express");
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const path = require("path"); 
app.use(express.static(path.join(__dirname, 'public')));

const port = 3333;

//מסלול כתובת ראשית
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/select.html'));
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
    point.location = req.body.location;
    points.push(point);

    res.status(200).json("ok");
});

// עריכת נקודה (PATCH)
app.patch('/points/:idx', (req, res) => {
    let idx = req.params.idx;  
    points[idx].location = req.body.location; 

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

app.listen(port, () => {
    console.log(`Live server! \nhttp://localhost:${port}`);
});


