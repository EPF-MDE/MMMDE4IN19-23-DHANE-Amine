document.addEventListener("DOMContentLoaded", function (event) {

    // Select the button using querySelector
    $(".update-btn").click(function() {
        var studentId = $(this).data("student-id");
        var studentName = $(this).closest("tr").find("td:first-child").text();
        var studentSchool = $(this).data("student-school");

        var form = $("#update-form");
        form.attr("action", "/students/" + studentId); // Update the form's action

        $("#student-id-input").val(studentId); // Set the student ID in the hidden input field
        $("#name-input").val(studentName); // Set the name in the input field
        $("#school-input").val(studentSchool); // Set the school value in the input field

        $("#update-form-modal").modal("show"); // Open the modal
    });
});






