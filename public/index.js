
const lib = require("recogito/annotorious");
import '@recogito/annotorious/dist/annotorious.min.css';

const anno = new Annotorious({ image: 'hallstatt' }); // image element or ID

function handleImageUpload() 
{

    var image = document.getElementById("upload").files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById("annoImg").src = e.target.result;
    }
    reader.readAsDataURL(image);
} 

function lala(){
    alert("working");
}

