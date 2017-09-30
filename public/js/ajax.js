$(document).ready(function() {

  $('.open_controls').click(function(e) {
    e.preventDefault();
    
    $(this).siblings('.controls').fadeToggle(200);
  });

  $('#propic').hover(function() {
    $('#changepropic').css('display', 'block');
  }, function() {
    $('#changepropic').css('display', 'none');
  });

  $('#changepropic').click(function() {
    $('#propic-input').click();
  })

  $('#propic-input').on('change', function(){

    var files = $(this).get(0).files;

    if (files.length > 0){
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
      }

      $.ajax({
        url: '/uploadpropic',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if (data === 'Not an image.') {
            swal("Oops...", "Please upload an image!", "error");
          }
          else if (data === 'Could not find user.') {
            $('.propic-output').text('Sorry, your profile picture could not be updated at this time.');
          }
          else {
            console.log('\n\nupload successful!\n' + data);
            $('#propic').css('background-image', 'url('+data+')');
          }
        },
        error: function(xhr, status, error) {
          console.log("Uh oh there was an error: " + error);
        }
      });

    }
  });

  $(".editprofile-submit").click(function() {

    // get updated user info
    var name = $(".name").val();
    var username = $('.username').val();
    var about = $('.about').val();
    var phone = $('.phone').val();
    var email = $('.email').val();

    // send the AJAX request
    $.ajax({
      url: '/editingprofile',
      data: {
        name: name,
        username: username,
        about: about,
        phone: phone,
        email: email
,      },
      type: 'GET',
      success: function(data) {
        // update the HTML element with the returned data
        $(".editprofile-output").text(data);
      },
      error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
      }
    });
  });


  $(".likingpost-submit").click(function() {

    // var myUrl = $(".imageURL").val();
    // var myURL = "http://i.imgur.com/ZEiHTsI.jpg";
    // console.log('\n\n'+myURL+'\n\n');

    // send the AJAX request
    $.ajax({
      url: '/likingpost',
      data: {
        url: "http://i.imgur.com/ZEiHTsI.jpg"
      },
      type: 'GET',
      success: function(data) {
        // update hbs file with returned data
        // $(".likingpost-output").text(data);
        $(".score").text(data);
      },
      error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
      }
    });
  });

});
