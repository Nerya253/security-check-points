const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const express = require("express");
const app = express();
app.use(express.json());

const path = require("path"); 
app.use(express.static(path.join(__dirname, 'public')));

const port = 3333;

app.listen(port, () => {
    console.log(`Live server! \nhttp://localhost:${port}`);
});

//מסלול כתובת ראשית
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/select.html'));
});

//נקודות התחלה
const points = [
    { location: "כניסה"},
    { location: "קומה 1"},
    { location: "קומה 2"}
];

app.get('/points-list', (req, res) => {
    res.status(200).json(points);
});

//יצירת נקודה חדשה (POST)
app.post('/points', (req, res) => {
    let point = {};
    point.location =req.body.location;
    points.push(point);

    res.status(200).json("ok");
});

//עדכון נקודה (PATCH)
app.patch('/points'), (req, res) => {
    let idx = req.body.idx;
    let point = {};
    point.location = req.body.location;
    points[idx] = point;

    res.status(200).json("ok");
}

// קריאת כל הנקודות (get)
app.get('/points'), (req, res) => {
    res.status(200).json(points);
}

//מחיקת נקודה (DELETE)
app.delete('/points'), (req, res) => {
    let idx = req.query.id;
    points.splice(idx, 1);

    res.status(200).json(points);
}