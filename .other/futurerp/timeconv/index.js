"use strict";
function getDate(date){
    function toDay(d){
        return Math.floor(d.getTime()/86400000)
    }
    const start = toDay(new Date("2024-04-09"));
    let day = toDay(date) - start;
    
    const rmonth = day % 12;
    const ryear = Math.floor(day / 12) + 2566;
    
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May",
        "Jun", "Jul", "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ]
    const monthlen = [
        31, 28, 31, 30, 31, 30, 31, 31, 30,
        31, 30, 31
    ]
    const nmon = months[rmonth]
    const monl = monthlen[rmonth]
    
    const rday = Math.floor(date.getHours() / 24 * monl) + 1
    
    if (ryear < 0){
        return `${-ryear}BC`
    }
    if (nmon !== undefined){
        return `${nmon} ${rday}, ${ryear}`
    }
    return `${ryear}`
}
const r = getDate(new Date());
document.getElementById("ctime").innerHTML =
`Current: ${r}`

function changeOption(){
    const date = document.getElementById("enter").value;
    
    document.getElementById("res").innerHTML =
    `Output: ${getDate(new Date(date))}`
}
