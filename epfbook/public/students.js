document.addEventListener("DOMContentLoaded", function (event) {
    // Create a link element
    var link = document.createElement("AnchorNewStudent");
    
    // Set the link's href attribute to "/students/create"
    link.href = "/students/create";
    
    // Set the link's text content
    link.textContent = "Create a new student";
    
    // Append the link to the document body
    document.body.appendChild(link);

    // Select the button using querySelector
    document.querySelector("#test").addEventListener("click", function(event) {
    alert("CLICKED!");
});
});


