// it's so beautiful
$("input:radio#storyTypeStory").change(() => {
    $("#adventureIdField").fadeOut(() => {
        $("#storyLinkField").fadeIn();
        $("#referenceId").removeAttr("required");
        $("#referenceId").removeClass("form-control");
        $("#link").attr("required", "required");
        $("#link").addClass("form-control");
    });
});
$("input:radio#storyTypeAdventure").change(() => {
    $("#storyLinkField").fadeOut(() => {
        $("#adventureIdField").fadeIn();
        $("#referenceId").attr("required", "required");
        $("#referenceId").addClass("form-control");
        $("#link").removeAttr("required");
        $("#link").removeClass("form-control");
    });
});