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
    res.sendFile(path.join(__dirname, '/public/manager.html'));
});

//נקודות התחלה
const points = [
    { id: 1, location: "כניסה"},
    { id: 2, location: "קומה 1"},
    { id: 3, location: "קומה 2"}
];

// קריאת כל הנקודות (get)
app.get('/point-get', (req, res) => {
    res.status(200).json(points);
});

//יצירת נקודה חדשה (POST)
app.post('/point-new', (req, res) => {
    let point = {};
    point.id = points.length+1;          
    point.location = req.body.location;

    points.push(point);

    res.status(200).json("ok");
});

//עדכון נקודה (PATCH)
app.patch('/points-edit/:idx', (req, res) => {
    let idx = points.length+1;  
    let point = {};
    point.location = req.body.location;
    points[idx] = point;

    res.status(200).json("ok");
});

//מחיקת נקודה (DELETE)
app.delete('/points-delete/:idx'), (req, res) => {
    let idx = req.query.id;
    points.splice(idx, 1);

    res.status(200).json(points);
}


app.listen(port, () => {
    console.log(`Live server! \nhttp://localhost:${port}`);
});

