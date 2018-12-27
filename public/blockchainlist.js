let rootDiv = document.querySelector("#root");
let content = document.createElement("div");

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        let jsonData = JSON.parse(xhr.responseText);
        makeUl(jsonData.chain);
    }
};
xhr.open('GET','getChain');
xhr.send();

function makeUl(jsonArray){
    jsonArray.forEach((element)=>{
        let ul = document.createElement("ul");
        Object.keys(element).forEach((key)=>{
            if(key === "transcations"){
                let li = displayTransaction(element["transcations"]);
                ul.appendChild(li);
            }else{
                let li = getLi(key + ": "+  element[key]);
                ul.appendChild(li);
            }
        });
        let hash = getLi("Hash "+ sha256(JSON.stringify(element)))
        ul.appendChild(hash);
        rootDiv.appendChild(ul);
        rootDiv.appendChild(document.createElement("br"));
    });
}

function getLi(message){
    let li = document.createElement("li");
    li.innerText = message;
    return li;
}

function displayTransaction(jsonData){
    let ul = document.createElement("ul");
    Object.keys(jsonData).forEach((key)=>{
        let li = getLi(key+": "+jsonData[key]);
        ul.append(li);
    });
    let li = getLi("Transactions: ");
    li.appendChild(ul);
    return li;
}