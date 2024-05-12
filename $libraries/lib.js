"use strict";
function gethtmlbyselector({element=null, cls=null, id=null}){
    if (element==null) {element="*"}
    if (cls==null) {cls=""} else {cls="."+cls}
    if (id==null) {id=""} else {id="#"+id}
    let selector=(element) + (cls) + (id);
    try{
    return document.querySelector(selector).innerHTML
    } catch (TypeError) {}
}
function SetHtmlByID(id,result) {
    document.getElementById(id).innerHTML = result;
}
function SetHtmlByClass(className,result) {
    document.getElementsByClassName(className).innerHTML = result;
}
const xhttp = new XMLHttpRequest();
const sideBarManager={
    init: {
        all: function() {},
    },
    sidebarshow:{all:false,otherpages:false},
    hide: {
        all: function (){
            const style=document.styleSheets[2]
            ,sidestyle= style.cssRules[0].style
            ,mainstyle= style.cssRules[1].style
            ,showstyle= style.cssRules[2].style;
            if (sideBarManager.sidebarshow.all==true){
                sidestyle["display"]="none";
                showstyle["display"]="block";
                mainstyle["margin-left"]="50px";
                sideBarManager.sidebarshow.all=false;
            } else {
                sidestyle["display"]="block";
                showstyle["display"]="none";
                mainstyle["margin-left"]="160px";
                sideBarManager.sidebarshow.all=true;
            }
        },
        otherpages: function(){
            if (sideBarManager.sidebarshow.otherpages==true){
                document.getElementById("sidebarOtherpages").style.display="none";
                sideBarManager.sidebarshow.otherpages=false;
            } else {
                document.getElementById("sidebarOtherpages").style.display="inline";
                sideBarManager.sidebarshow.otherpages=true;
            }
        }
    }
};
sideBarManager.init.all();

function textToCSS(text){
    const stylesheet=new CSSStyleSheet();
    stylesheet.replace(text);
    document.adoptedStyleSheets.push(stylesheet);
}