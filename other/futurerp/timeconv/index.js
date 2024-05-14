"use strict";
function convertTZ(date, tzString="utc") {
    return new Date(
        (typeof date === "string" ? new Date(date) : date)
        .toLocaleString("en-US", {timeZone: tzString})
    );   
}
function getDate(date){
    date = convertTZ(date)
    function toDay(d){
        return Math.floor(d.getTime()/86400000)
    }
    const start = toDay(convertTZ(new Date("2024-04-09")));
    let day = toDay(date) - start;
    const rmonth = day % 12;
    const ryear = Math.floor(day / 12) + 2565;
    
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May",
        "Jun", "Jul", "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ]
    const nmon = months[rmonth]
    
    const rday = Math.ceil(date.getHours() / 24 * 30) + 1
    
    if (ryear < 0){
        return `${-ryear}BC`
    }
    if (nmon !== undefined){
        return `${nmon} ${rday}, ${ryear}`
    }
    return `${ryear}`
}

setInterval(function(){
    document.getElementById("ctime").innerHTML =
    `Current: ${getDate(new Date())}`;
}, 1)

function changeOption(){
    const date = document.getElementById("enter").value;
    const time = document.getElementById("entert").value;

    if (!(date && time)){
        return;
    }
    
    document.getElementById("res").innerHTML =
    `Output: ${getDate(new Date(`${date} ${time}`))}`
}
