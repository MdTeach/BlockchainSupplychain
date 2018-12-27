const getChainButton = document.querySelector("#getChainButton");
const mineBlockButton = document.querySelector("#mineBlockButton") ;
const rootDiv = document.querySelector("#root");

getChainButton.addEventListener('click',()=>{
    makeGetRequest('getChain');
});

mineBlockButton.addEventListener('click',()=>{
    makeGetRequest('mine');
});


function makeGetRequest(requestUrl){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            let jsonData = JSON.parse(xhr.responseText);
            console.log(jsonData)
        }
    };
    xhr.open('GET',requestUrl);
    xhr.send();
}