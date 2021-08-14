

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
