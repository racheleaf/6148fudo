$(document).ready(function() {

  //jQuery time
  var current_fs, next_fs, previous_fs; //fieldsets
  var left, opacity, scale; //fieldset properties which we will animate
  var animating; //flag to prevent quick multi-click glitches

  // $('.next').prop('disabled', 'disabled');

  $(".next").click(function() {
    if (animating) return false;
    animating = true;

    // clear error message
    $('.next-output').text("");

    // check name validity
    var name = $('.name').val();
    var nameValid = !(typeof name === "undefined") && (name.length > 0);

    // check username validity
    var usernameOutput = $('.username-valid').val();
    var usernameValid = (usernameOutput === "true");

    // check password validity
    var password = $('#password').val();
    var cpassword = $('#cpassword').val();
    var passwordValid = false;
    var containsNumeral = false;
    var containsAlphabetic = false;
    for (var i = 0; i < password.length; i++) {
      if (!isNaN(password[i])) {
        containsNumeral = true;
      }
      if (password.match(/[a-z]/i)) {
        containsAlphabetic = true;
      }
    }
    if ((password.length >= 8) && containsNumeral && containsAlphabetic) {
      passwordValid = true;
    }
    if (!(password === cpassword)) {
      passwordValid = false;
    }

    // determine if all entries are valid
    var isValid = usernameValid && passwordValid && nameValid;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    if (isValid) {

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function(now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'transform': 'scale(' + scale + ')',
            'position': 'absolute'
          });
          next_fs.css({
            'left': left,
            'opacity': opacity
          });
        },
        duration: 800,
        complete: function() {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
      });
    }
    else {
      // error message under NEXT button
      $('.next-output').text('Please check that you have completed all fields. Your username must be at least 5 characters long. Your password must be at least 8 characters long and must include both a letter and a number.');
      animating = false;
    }
  });

  $(".previous").click(function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
      opacity: 0
    }, {
      step: function(now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale previous_fs from 80% to 100%
        scale = 0.8 + (1 - now) * 0.2;
        //2. take current_fs to the right(50%) - from 0%
        left = ((1 - now) * 50) + "%";
        //3. increase opacity of previous_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({
          'left': left
        });
        previous_fs.css({
          'transform': 'scale(' + scale + ')',
          'opacity': opacity
        });
      },
      duration: 800,
      complete: function() {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
    });
  });

  $(".presubmit").click(function() {
    var isValid = false;

    // check email
    var email = $('#email').val();
    var re1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailValid = re1.test(email) || (email.length === 0);

    // check number
    var phone = $('#phone').val();
    var re2 = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    var phoneValid = re2.test(phone) || (phone.length === 0);

    // form is valid if email and phone number are both valid
    isValid = emailValid && phoneValid;

    if (isValid) {
      $('#submit').click();
    }
    else {
      $('.submit-output').text('Please make sure you have entered a valid email and/or phone number.');
    }
  });

  $("#username").keyup(function() {

    //get username
    var username = $('#username').val();
    $(".username-output").html("");

    // send the AJAX request
    $.ajax({
      url: '/changingusername',
      data: {
        username: username
      },
      type: 'GET',
      success: function(data) {
        // update the HTML element with the returned data
        if ((data== "Error.") || (data== "Username already exists.")) {
          $(".username-valid").val("false");
          $(".username-output").html(data);
          // $('.next').prop('disabled', true);
        }
        else {
          $(".username-valid").val("true");
        }
      },
      error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
      }
    });
  });

});