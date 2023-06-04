$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function toggleAccordion(panelId) {
    var panelHeading = document.getElementById(panelId);
    panelHeading.classList.toggle("open");
}