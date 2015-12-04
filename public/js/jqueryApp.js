$(".thisOption").click(function() {
    console.log("abc");
    $(".thisOption").removeClass('activeOption');
    $(this).addClass('activeOption');
});