let points = [];
let pointsToFill = "";
let pointsToShow=points;

async function GetPoints(){
    let url = "/point-get";
    let response = await fetch(url);
    let data=await response.json();
    points = data;
    pointsToShow = points;
    FillTable()
}

function FillTable(){
    let s="";
    for(let point of pointsToShow){
        s+="<tr>";
        s+=`<td>${point.id}</td>`;
        s+=`<td>${point.location}</td>`;
        s+="</tr>";
    }
    document.getElementById("MainTable").innerHTML=s;
}

GetPoints();