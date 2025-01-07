$(function(){

    $(document).ready(function () {
        $('.switchBtn').click(function (evenet) {
            $('.darkMode').toggleClass('dark')
            $('.switchBtn').toggleClass('active')
        });
    });
});