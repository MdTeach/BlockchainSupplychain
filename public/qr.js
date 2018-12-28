const generateButton = document.getElementById("send");
const dataText = document.getElementById("hash");

generateButton.addEventListener('click',(e)=>{
    let data = dataText.value;
    if(data){
        let url = window.location.href
        let arr = url.split("/");
        let result = arr[0] + "//" + arr[2]
        result+="?hash="+data;
        dataText.value = "";
        create(result);
    }
});

function create(data)
{
    document.getElementById("root").innerHTML="<img src='https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+encodeURIComponent(data)+"'/>";
}
