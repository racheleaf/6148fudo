$(document).ready(function() {

  $(document).scroll(function() {
    if ($(document).scrollTop() >= $(window).height()-50) {
    	$('.masthead-brand a').css('color', '#111111');
    	$('.discovericon').attr('src', '../../images/worldicon_black.png');
    	$('.loginicon').attr('src', '../../images/loginicon_black.png');
    }
    else {
    	$('.masthead-brand a').css('color', '#eeeeee');
    	$('.discovericon').attr('src', '../../images/worldicon.png');
    	$('.loginicon').attr('src', '../../images/loginicon.png');
    }
    // if ($(document).scrollTop() + $(window).height() >= $('#aboutus-section').offset().top) {
    //     $("#aboutus-section").fadeIn("slow");
    // }
  });

  $('#divein').click(function(){
    $('html,body').animate({scrollTop: $('#aboutus-section').offset().top}, 800);
    // $("#aboutus-section").delay(1000).animate({ opacity: 1 }, 700);​
  });

});


