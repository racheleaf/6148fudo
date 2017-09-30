function openEditPostForm(id) {

  $('#editpostdiv').css('display', 'block');
  
  // send the AJAX request 1
  $.ajax({
    url: '/findingimageinfo',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        console.log('\n\ndata: ' + data + '\n\n');
        var elements = data.split('(()())');
        var postUsername = elements.pop();
        var hasRecipe = elements.pop();
        var postCaption = elements.pop();
        var postTitle = elements.pop();
        var imageURL = elements.pop();
        console.log(postCaption+'\n'+postTitle+'\n'+imageURL);
        if (hasRecipe === "true") {
          $('#editHasRecipe').prop('checked', true);
        } 
        else {
          $('#editHasRecipe').prop('checked', false);
        }
        $('#edit-loading').css('background-image', 'url('+imageURL+')');
        $('#editpostCaption').val(postCaption);
        $('#editpostTitle').val(postTitle);
        $('#editpostID').val(id);
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}

function editPost() {
  var id = $('#editpostID').val();
  var postTitle = $('#editpostTitle').val();
  var postCaption = $('#editpostCaption').val();
  var hasRecipe = $('#editHasRecipe').is(':checked');

  if (postTitle.length === 0) {
    $('.editpost-output').html('Please include a post title.');
  }
  else {
    // send the AJAX request
    $.ajax({
      url: '/editingpost',
      data: {
        id: id,
        postTitle: postTitle,
        postCaption: postCaption,
        hasRecipe: hasRecipe
      },
      type: 'GET',
      success: function(data) {
        if (data === "Error.") {
          console.log('\n\n:(((\n\n');
        }
        else {
          console.log('\n\ndata: ' + data + '\n\n');
          var elements = data.split('(()())');
          var postUsername = elements.pop();
          var postCaption = elements.pop();
          var postTitle = elements.pop();

          $('.'+id+'-editpostTitle').html(postTitle);

          $('#editpostdiv').css('display', 'none');
        }
      },
      error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
      }
    });
  }
}


function deletePost(id){
      swal({   
        title: "Are you sure?",   
      text: "You will not be able to recover this post!",   
      type: "warning",   
      showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "Yes, delete it!",   
        closeOnConfirm: false 
    }, 
    function(isConfirmed){ 
        if(isConfirmed) {
            $.ajax({
              url: '/deletingpost',
              data: {
                id: id
              },
              type: 'GET',
              success: function(data) {
                if (data === "Error.") {
                  console.log('\n\n:(((\n\n');
                }
                else {
                  console.log('\n\ndata: ' + data + '\n\n');
                  $('.'+id).css('display', 'none');
                }
              },
              error: function(xhr, status, error) {
                console.log("Uh oh there was an error: " + error);
              }
            });
          swal("Deleted!", "Your post has been deleted.", "success"); 
        }
      }
    );
}


function likePost(id, numLikes) {
  
  // send the AJAX request
  $.ajax({
    url: '/likingpost',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        console.log('\n\ndata: ' + data + '\n\n');
        $('.'+id+'-numLikes').text(data);
        $('.'+id+'-likingpost-submit').toggleClass('show hidden');
        $('.'+id+'-unlikingpost-submit').toggleClass('hidden show');
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}

function unlikePost(id, numLikes) {
  
  // send the AJAX request
  $.ajax({
    url: '/unlikingpost',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        console.log('\n\ndata: ' + data + '\n\n');
        $('.'+id+'-numLikes').text(data);
        $('.'+id+'-unlikingpost-submit').toggleClass('show hidden');
        $('.'+id+'-likingpost-submit').toggleClass('hidden show');
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}

function savePost(id) {
  
  // send the AJAX request
  $.ajax({
    url: '/savingpost',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        console.log('\n\ndata: ' + data + '\n\n');
        $('.'+id+'-savingpost-submit').toggleClass('show hidden');
        $('.'+id+'-unsavingpost-submit').toggleClass('hidden show');
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}

function unsavePost(id) {
  console.log('UNSAVEPOST clicked');
  
  // send the AJAX request
  $.ajax({
    url: '/unsavingpost',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        console.log('\n\ndata: ' + data + '\n\n');
        $('.'+id+'-unsavingpost-submit').toggleClass('show hidden');
        $('.'+id+'-savingpost-submit').toggleClass('hidden show');
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}

// Modal Image Gallery
function openGallery(id) {

  // send the AJAX request 1
  $.ajax({
    url: '/findingimageinfo',
    data: {
      id: id
    },
    type: 'GET',
    success: function(data) {
      if (data === "Error.") {
        console.log('\n\n:(((\n\n');
      }
      else {
        var elements = data.split('(()())');
        var postUsername = elements.pop();
        var hasRecipe = elements.pop();
        var postCaption = elements.pop();
        var postTitle = elements.pop();
        var imageURL = elements.pop();
        $('#img01').attr('src', imageURL); 
        $('#modal01').css('display', 'block');
        $('#caption').html(postCaption.replace(/\n/g, "<br/>"));
        $('#title').html(postTitle + ' | ' + postUsername);
      }
    },
    error: function(xhr, status, error) {
      console.log("Uh oh there was an error: " + error);
    }
  });
}