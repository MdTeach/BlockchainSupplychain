const generateButton = document.getElementById("send");
const dataText = document.getElementById("hash");

generateButton.addEventListener('click',(e)=>{
    let data = dataText.value;
    if(data){
        create();
        dataText.value = "";
    }
});

function create(data)
{
    document.getElementById("root").innerHTML="<img src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+encodeURIComponent(data)+"'/>";
}
