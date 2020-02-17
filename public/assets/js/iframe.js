$(document).ready(function () {
    $('iframe').on("load", function() {
        this.style.height = this.document.body.offsetHeight + 'px';
    });
});