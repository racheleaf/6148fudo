$(document).ready(function() {

  $('#upload-btn').on('click', function() {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    return false;
  });

  $('#upload-input').on('change', function(){

    $('#loading').attr('class', 'show');
    $('#loading').css('background-image', "url('../images/loading.gif')");
    $('.upload-output').text('');

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
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if (data === 'Not an image.') {
            $('#loading').attr('class', 'hidden');
            $('.upload-output').text('Please upload an image.');
          }
          else {
            console.log('\n\nupload successful!\n' + data);
            $('#postImage').val(data);
            // $('#loading').css('background-image', 'url('+data+')');
            $('#loading').css('background-image', 'url('+data+')');
          }
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }

            }

          }, false);

          return xhr;
        }
      });

    }
  });

  $("#postSubmit").click(function() {

    // get post info
    var postImage = $("#postImage").val();
    var postTitle = $('#postTitle').val();
    var postCaption = $('#postCaption').val();
    var postImage = $('#postImage').val();
    var hasRecipe = $('#hasRecipe').is(':checked');

    if (postImage.length > 0 && postTitle.length > 0) {

      // send the AJAX request
      $.ajax({
        url: '/addingpost',
        data: {
          postImage: postImage,
          postTitle: postTitle,
          postCaption: postCaption,
          postImage: postImage,
          hasRecipe: hasRecipe
,       },
        type: 'GET',
        success: function(data) {
          console.log('New post added!');
          location.reload();
        },
        error: function(xhr, status, error) {
          console.log("Uh oh there was an error: " + error);
        }
      });
    } 

    else {
      $(".post-output").text('Please make sure you have uploaded an image and written a title!');
    }
  });

  $('#addpost-view').on('click', function() {
    $('#addpostdiv').css('display', 'block');
    return false;
  });

  $('#addpost-hide').on('click', function() {
    $('#addpostdiv').css('display', 'none');
    return false;
  });

  $('#post-view').on('click', function() {
    $('#modal01').css('display', 'block');
    return false;
  });

  $('#post-hide').on('click', function() {
    $('#modal01').css('display', 'none');
    return false;
  });


  $('#editpost-hide').on('click', function() {
    $('#editpostdiv').css('display', 'none');
    return false;
  });

});