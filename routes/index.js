var express = require('express');
var path = require('path');
var router = express.Router();
var chalk = require('chalk');
var formidable = require('formidable');
var fs = require('fs');
var imgur = require('imgur');

// Imgur Client Info
 imgur.setClientId('23ef98b40bc0e55');
 imgur.saveClientId() 
   .then(function() {
     console.log('Imgur client ID saved.');
   })
   .catch(function(err) {
     console.log(err.message);
   });
 imgur.setAPIUrl('https://api.imgur.com/3/');
 imgur.setMashapeKey('https://imgur-apiv3.p.mashape.com/');
 imgur.setCredentials('christina1998li@gmail.com', 'rachel123', '23ef98b40bc0e55');

// get the User model
var User = require('../schemas/user');

// get the Post model
var Post = require('../schemas/post');

// tells whether a user is logged in or not
var isLoggedIn = false;

// run this before accessing every page to update isLoggedIn
var checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    isLoggedIn = true;
  }
  else {
    isLoggedIn = false;
  }
  return next();
}

// redirects user to login page if not logged in 
var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to re puest object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

// for login page, if logged in user accesses login then user gets redirected to home page
var isNotAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = function(passport){

  router.get('/about', checkLoggedIn, function(req,res) {
    if (isLoggedIn) {
      Post.find({'postUsername': req.user.username}, function(err, posts) {
        var context = {
          title: 'fudo',
          posts,
          message: req.flash('message'),
          isLoggedIn
        };
        res.render('test', context);
      });
    }
    else {
      Post.find({}, function(err, posts) {
        var context = {
          title: 'fudo',
          posts,
          message: req.flash('message'),
          isLoggedIn
        };
        res.render('test', context);
      });
    }
  });

  /* GET home page. */
  router.get('/', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nHome page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
      var d = new Date();
      posts.sort(function(a,b) {
        return -((a.postLikes+1)*(a.postLikes+1)/(d.getTime()-a.postTime)) + ((b.postLikes+1)*(b.postLikes+1)/(d.getTime()-b.postTime));
      });

      var context = {
        title: 'fudo',
        posts,
        message: req.flash('message'),
        isLoggedIn
      };
      if (isLoggedIn) {
        context.activeUser = req.user.username;
        context.savedPosts = req.user.savedPosts;
        res.render('newsfeed', context);
      }
      else {
        res.render('home', context);
      }
    });
  });

  /* GET recipe home page. */
  router.get('/recipe', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nRecipe Home page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({'hasRecipe': true}, function(err, posts) {
      var d = new Date();
      posts.sort(function(a,b) {
        return -((a.postLikes+1)*(a.postLikes+1)/(d.getTime()-a.postTime)) + ((b.postLikes+1)*(b.postLikes+1)/(d.getTime()-b.postTime));
      });

      var context = {
        title: 'fudo',
        posts,
        message: req.flash('message'),
        isLoggedIn
      };
      if (isLoggedIn) {
        context.activeUser = req.user.username;
        context.savedPosts = req.user.savedPosts;
      }
      res.render('newsfeed', context);
    });
  });

  /* GET mysavedposts home page. */
  router.get('/mysavedposts', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nMysavedposts Home page accessed.\n'));
    // Display the index page with any flash message, if any
    
    Post.find({'imageID': { $in: req.user.savedPosts } }, function(err, posts){
      if (err) {
        console.log('Oops.');
      }
      else {
        console.log('\n\n SAVED POSTS: ', posts, '\n\n');
        posts.reverse();
        var context = {
          title: 'fudo',
          posts,
          message: req.flash('message'),
          isLoggedIn,
          activeUser: req.user.username,
          savedPosts: req.user.savedPosts
        };  
        res.render('mysavedposts', context);
      }
    });
  });

  /* GET login page. */
  router.get('/login', checkLoggedIn, isNotAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nLogin page accessed.\n'));
    // Display the Login page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('login', context);
    });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true  
  }));

  /* GET Registration Page */
  router.get('/signup', checkLoggedIn, isNotAuthenticated, function(req, res){
    console.log(chalk.yellow('\nSignup page accessed.\n'));
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('register', context);
    });
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true  
  }));

  /* Handle Logout */
  router.get('/logout', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nLogout.\n'));
    req.logout();
    res.redirect('/');
  });

  /* GET newsfeed */
  router.get('/newsfeed', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nNewsfeed accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
      var d = new Date();
      posts.sort(function(a,b) {
        return -((a.postLikes+1)*(a.postLikes+1)/(d.getTime()-a.postTime)) + ((b.postLikes+1)*(b.postLikes+1)/(d.getTime()-b.postTime));
      });

      var context = {
        title: 'fudo',
        posts,
        message: req.flash('message'),
        isLoggedIn
      };
      if (isLoggedIn) {
        res.redirect('/');
      }
      else {
        res.render('newsfeed', context);
      }
    });
  });

  /* GET MyProfile page. */
  router.get('/myprofile', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nProfile page accessed.\n'));

    var phoneExists = (req.user.phone.length > 0);
    var emailExists = (req.user.email.length > 0);

    console.log('\n\n' + req.user.profilepic + '\n\n');

    // Display the myprofile page with any flash message, if any
    Post.find({"postUsername": req.user.username}, function(err, posts) {
      posts.reverse();
      var context = {
        title: 'fudo',
        message: req.flash('message'),
        isLoggedIn,
        isMyProfile: true,
        activeUser: req.user.username,
        savedPosts: req.user.savedPosts,
        posts,
        username: req.user.username,
        name: req.user.name,
        about: req.user.about,
        phone: req.user.phone,
        email: req.user.email,
        profilepic: req.user.profilepic,
        phoneExists: phoneExists,
        emailExists: emailExists
      };
      res.render('myprofile', context);
    });
  });

  /* GET EditProfile page */
  router.get('/editprofile', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nEditProfile page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn,
       username: req.user.username,
       name: req.user.name,
       about: req.user.about,
       phone: req.user.phone,
       email: req.user.email
     };
     res.render('editprofile', context);
    });
  });

  /* POST to editprofile */
  /* currently unused, was linked to editprofile form */
  router.post('/editprofile', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var about = req.body.about;
    var phone = req.body.phone;
    var email = req.body.email;

    // updates user info
    User.update({
      'username': req.user.username
    }, {
      $set: {
        'name': name,
        'username': username,
        'about': about,
        'phone': phone,
        'email': email
      }, 
    }, function(err, result) {
      if (err) {
        console.log('An error occured.');
      }
    });

    // doesn't work???? might now
    //
    // User.findOne({'username': req.user.username}, function(err, userLoggedIn) {
    // if (err) {
    //   console.log('\n\nAn error occurred!\n\n');
    // } 
    // else {
    //   if (userLoggedIn) {
    //     console.log('\n\nFound user.\n\n');
    //     //userLoggedIn.name = name;
    //     //userLoggedIn.username = username;
    //     //userLoggedIn.about = about;
    //     //userLoggedIn.save();
    //   } else {
    //     console.log('\n\nUser not found.\n\n');
    //   }
    // }
  // });
      
    console.log('\n\nProfile edited!\n\n');

    // Redirecting back to the root
    res.redirect('/editprofile');
  });

  /* GET user's profile page */
  router.get('/profile/:id', checkLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log(chalk.yellow(id, "'s Profile page accessed.\n"));
    // Display the index page with any flash message, if any
    User.findOne({'username': id}, function(err, userRequested) {
    if (err) {
      console.log('An error occurred!');
    } else {
      if (userRequested) {
        if (isLoggedIn && (req.user.username === userRequested.username)) {
          res.redirect('/myprofile');
        }
        else {
          Post.find({"postUsername": userRequested.username}, function(err, posts) {
            var phoneExists = (userRequested.phone.length > 0);
            var emailExists = (userRequested.phone.length > 0);
            posts.reverse();
            var context = {
              title: 'fudo',
              message: req.flash('message'),
              isLoggedIn,
              isMyProfile: false,
              posts,
              username: userRequested.username,
              name: userRequested.name,
              about: userRequested.about,
              phone: userRequested.phone,
              email: userRequested.email,
              profilepic: userRequested.profilepic,
              phoneExists: phoneExists,
              emailExists: emailExists
            };
            if (isLoggedIn) {
              context.activeUser = req.user.username;
              context.savedPosts = req.user.savedPosts;
            }
            res.render('myprofile', context);
          });
        }
      } else {
        res.render('error', { title: 'fudo', message: "Page not found." });
      }
    }
    });
  });

  router.post('/imgur', function(req, res) {
    imgur.uploadFile('public/uploads/hampster.jpg')
        .then(function (json) {
          fileURL = json.data.link;
          console.log('\n\n SUCCESS \n\n');
          res.send(fileURL);
          fs.unlink(filePath);
        })
        .catch(function (err) {
          console.log('\n\n FAILURE \n\n');          
          res.send('Not an image.');
          console.error(err.message);
          fs.unlink(filePath);
        });
  });

  /* POST to uploadimgur */
  /* upload file to imgur */
  router.post('/uploadimgur', function(req, res){
 
    var filePath;
    var fileURL;
 
    // create an incoming form object
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, '..', 'public/uploads')
    });

    console.log(form); //imgur debugging
    // console.log(uploadDir); //imgur debugging
    
    // specify that we don't want to allow the user to upload multiple files in a single request
    form.multiples = false;
 

    // every time a file has been uploaded successfully,
    // rename it to a file with original file extension
    form.on('file', function(field, file) {
      var fileExtension = file.name.split('.').pop();
      fs.rename(file.path, file.path + "." + fileExtension);
      var completeFilePath = file.path + "." + fileExtension;
      var fileName;
      console.log(fileExtension);
      if (completeFilePath.indexOf('/') >= 0) {
        fileName = completeFilePath.split('uploads/').pop();
      }
      else {
        fileName = completeFilePath.split('uploads\\').pop();
      }
      filePath = 'public/uploads/' + fileName;
    });
 
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
 
    // once the file has been uploaded, send the location of the file back
    form.on('end', function() {
      console.log('\n\n' + filePath + '\n\n');
      imgur.uploadFile(filePath)
        .then(function (json) {
          console.log('\n\nSUCCESS\n\n');
          fileURL = json.data.link;
          res.send(fileURL);
          fs.unlink(filePath);
        })
        .catch(function (err) {
          console.log('\n\nFAILURE\n\n');
          res.send('Not an image.');
          console.error(err.message);
          fs.unlink(filePath);
        });
    });
 
    // parse the incoming request containing the form data
    form.parse(req);
 
  });

  /* POST to uploadimgurpropic */
  /* upload propic to imgur */
  router.post('/uploadimgurpropic', function(req, res){
 
    var filePath;
    var fileURL;
 
    // create an incoming form object
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, '..', 'public/uploads')
    });
 
    // specify that we don't want to allow the user to upload multiple files in a single request
    form.multiples = false;
 

    // every time a file has been uploaded successfully,
    // rename it to a file with original file extension
    form.on('file', function(field, file) {
      var fileExtension = file.name.split('.').pop();
      fs.rename(file.path, file.path + "." + fileExtension);
      var completeFilePath = file.path + "." + fileExtension;
      var fileName;
      if (completeFilePath.indexOf('/') >= 0) {
        var fileName = completeFilePath.split('uploads/').pop();
      }
      else {
        var fileName = completeFilePath.split('uploads\\').pop();
      }
      filePath = 'public/uploads/' + fileName;
    });
 
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
 
    // once the file has been uploaded, send the location of the file back
    form.on('end', function() {
      console.log('\n\n' + filePath + '\n\n');
      imgur.uploadFile(filePath)
        .then(function (json) {
          console.log('\n\nSUCCESS\n\n');
          fileURL = json.data.link;
          User.findOne({'username': req.user.username}, function(err, user) {
            if (err) {
              res.send("Your profile couldn't be updated at this time. Please Try again later.");
            } 
            else {
              if (user) {
                user.profilepic = fileURL;
                user.save();
                res.send(fileURL);
              } 
              else {
                res.send('Could not find user.');
              }
            }
          });
          fs.unlink(filePath);
        })
        .catch(function (err) {
          console.log('\n\nFAILURE\n\n');
          res.send('Not an image.');
          console.error(err.message);
          fs.unlink(filePath);
        });
    });
 
    // parse the incoming request containing the form data
    form.parse(req);
 
  });

  /*
   * Below code handle AJAX requests
  */

  /* GET editingprofile */
  router.get('/editingprofile', function(req, res, next) {
    var name = req.query.name;
    var about = req.query.about;
    var phone = req.query.phone;
    var email = req.query.email;
    
    User.findOne({'username': req.user.username}, function(err, user) {
      if (err) {
        res.send("Your profile couldn't be updated at this time. Please Try again later.");
      } 
      else {
        if (user) {
          user.name = name;
          user.about = about;
          user.phone = phone;
          user.email = email;
          user.save();
          res.send('Updated profile.');
        } else {
          res.send("Your profile couldn't be updated at this time. Please try again later.");
        }
      }
    });
  });

  /* GET changingusername */
  router.get('/changingusername', function(req, res, next) {
    var username = req.query.username;
    var length = username.length;

    User.findOne({'username': username}, function(err, user) {
      if (err) {
        res.send("Error.");
      } 
      else {
        if (user) {
          res.send("Username already exists.")
        } else {
          res.send("Username available!");
        }
      }
    });
    
  });

  /* GET addingpost */
  router.get('/addingpost', function(req, res, next) {
    var postTitle = req.query.postTitle;
    var postImage = req.query.postImage;
    var imageName = postImage.split('_').pop();
    var imageID = imageName.substring(0, imageName.indexOf('.'));
    var postCaption = req.query.postCaption;
    var hasRecipe = req.query.hasRecipe;
 
    console.log('\n\n' + postTitle);
    console.log(postImage);
    console.log('imageID: ' + imageID);
    console.log('hasRecipe: ', hasRecipe);
    console.log('postCaption: ' + postCaption + '\n\n');

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var postTime = d.getTime();
    var postDate = "";
    postDate += months[d.getMonth()] + " ";
    postDate += d.getDay() + ", ";
    postDate += d.getFullYear();
    postDate += " at " + d.getHours();
    var minute = d.getMinutes();
    if (minute < 10) {
      postDate += ":0" + d.getMinutes();
    }
    else {
      postDate += ":" + d.getMinutes();
    }
    console.log('\n\n DATE: ' + postDate + '\n\n');
 
    var newPost = new Post({
      'postTitle': postTitle,
      'postCaption': postCaption,
      'postAuthor': req.user.name,
      'postUsername': req.user.username,
      'imageURL': postImage, 
      'imageID': imageID,
      'postLikes': 0,
      'userLikes': [],
      'postTime': postTime,
      'postDate': postDate,
      'hasRecipe': hasRecipe
    });
     
    newPost.save();
 
    res.send('Success!');
     
  });

  /* GET likingpost */
  router.get('/likingpost', function(req, res, next) {
    var id = req.query.id;

    Post.findOne({'imageID': id}, function(err, post) {
      if (err) {
        res.send("Error.");
      } 
      else {
        if (post) {
          if (post.userLikes.indexOf(req.user.username) === -1) {
            post.userLikes.push(req.user.username);
          }
          post.postLikes += 1;
          post.save();
          res.send(post.postLikes.toString());
          console.log('\n\nLIKE: ' + post.userLikes + '\n\n');
        } else {
          res.send("Error.");
        }
      }
    });
    
  });

  /* GET unlikingpost */
  router.get('/unlikingpost', function(req, res, next) {
    var id = req.query.id;

    console.log('\n\nUNLIKING POST: id: ' + id + '\n\n');

    Post.findOne({'imageID': id}, function(err, post) {
      if (err) {
        res.send("Error.");
      } 
      else {
        if (post) {
          var index = post.userLikes.indexOf(req.user.username);
          if (index > -1) {
            post.userLikes.splice(index, 1);
          }
          console.log('\n\nFOUND POST\n\n');
          post.postLikes -= 1;
          post.save();
          res.send(post.postLikes.toString());
          console.log('\n\nUNLIKE: ' + post.userLikes + '\n\n');
        } else {
          res.send("Error.");
        }
      }
    });
    
  });

  /* GET savingpost */
  router.get('/savingpost', function(req, res, next) {
    var id = req.query.id;

    var user = req.user;
    if (user.savedPosts.indexOf(id) === -1) {
      user.savedPosts.push(id);
    }
    user.save();
    res.send('Success.');
    
  });

  /* GET unsavingpost */
  router.get('/unsavingpost', function(req, res, next) {
    var id = req.query.id;

    var user = req.user;
    var index = user.savedPosts.indexOf(id);
    if (index === -1 ) {
      res.send('Error.');
    }
    else {
      user.savedPosts.splice(index, 1);
      user.save();
      res.send('Success.');
    }
    
  });

  /* GET deletingpost */
  router.get('/deletingpost', function(req, res, next) {
    var id = req.query.id;
    var imageID;
    
    Post.remove({'imageID': id}, function(err, result) {
      if (err) {
        res.send('Error.');
      } 
      else {
        res.send('Deleted post.');
      }
    });
  });

  /* GET findingimageinfo */
  router.get('/findingimageinfo', function(req, res, next) {
    var id = req.query.id;
    
    Post.findOne({'imageID': id}, function(err, post) {
      if (err) {
        res.send("Error");
      } 
      else {
        if (post) {
          if (post.postCaption) {
            res.send(post.imageURL+'(()())'+post.postTitle+'(()())'+post.postCaption+'(()())'+post.hasRecipe+'(()())'+post.postUsername);
          }
          else {
            res.send(post.imageURL+'(()())'+post.postTitle+'(()())'+'(()())'+post.hasRecipe+'(()())'+post.postUsername);
          }
        } else {
          res.send("Error.");
        }
      }
    });
  });

  /* GET editingpost */
  router.get('/editingpost', function(req, res, next) {
    var id = req.query.id;
    var postTitle = req.query.postTitle;
    var postCaption = req.query.postCaption;
    var hasRecipe = req.query.hasRecipe;
    
    Post.findOne({'imageID': id}, function(err, post) {
      if (err) {
        res.send("Error");
      } 
      else {
        if (post) {
          post.postTitle = postTitle;
          post.postCaption = postCaption;
          post.hasRecipe = hasRecipe;
          post.save();
          res.send(postTitle + '(()())' + postCaption + '(()())' + post.postAuthor);
        } else {
          res.send("Error.");
        }
      }
    });
  });

  /*
   *
   * Old Unused Code -- Keep for now
   *
   */
 
   /* POST to addpost */
   router.post('/addpost', function(req, res, next) {
    var postTitle = req.body.postTitle;
    var postImage = req.body.postImage;

    var newPost = new Post({
      'postTitle': postTitle,
      'postAuthor': req.user.name,
      'postUsername': req.user.username,
      'imageURL': postImage
    });
     
    newPost.save();
     
    console.log('\n\nNew post added!\n\n');
 
    // Redirecting back to the root
    res.redirect('/');
  });
 
  /* POST to upload */
  /* upload file */
  router.post('/upload', function(req, res){
 
    var filePath;
 
    // create an incoming form object
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, '..', 'public/uploads')
    });
 
    // specify that we don't want to allow the user to upload multiple files in a single request
    form.multiples = false;
 
    // every time a file has been uploaded successfully,
    // rename it to a file with original file extension
    form.on('file', function(field, file) {
      var fileExtension = file.name.split('.').pop();
      fs.rename(file.path, file.path + "." + fileExtension);
      var completeFilePath = file.path + "." + fileExtension;
      // var fileName = completeFilePath.split('uploads').pop();
      var fileName;
      console.log(fileExtension);
      if (completeFilePath.indexOf('/') >= 0) {
        fileName = completeFilePath.split('uploads/').pop();
      }
      else {
        fileName = completeFilePath.split('uploads\\').pop();
      }

      console.log('\n\n' + fileName + '\n\n');
      // filePath = path.join('..', '/uploads/', fileName);
      filePath = '../uploads/' + fileName;
      console.log('\n\n' + filePath + '\n\n');
    });
 
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
 
    // once the file has been uploaded, send the location of the file back
    form.on('end', function() {
      res.send(filePath);
    });
 
    // parse the incoming request containing the form data
    form.parse(req);
 
  });

  /* POST to uploadpropic */
  /* upload file */
  router.post('/uploadpropic', function(req, res){
 
    var filePath;
 
    // create an incoming form object
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, '..', 'public/uploads')
    });
 
    // specify that we don't want to allow the user to upload multiple files in a single request
    form.multiples = false;
 
    // every time a file has been uploaded successfully,
    // rename it to a file with original file extension
    form.on('file', function(field, file) {
      var fileExtension = file.name.split('.').pop();
      fs.rename(file.path, file.path + "." + fileExtension);
      var completeFilePath = file.path + "." + fileExtension;
      // var fileName = completeFilePath.split('uploads').pop();
      var fileName;
      console.log(fileExtension);
      if (completeFilePath.indexOf('/') >= 0) {
        fileName = completeFilePath.split('uploads/').pop();
      }
      else {
        fileName = completeFilePath.split('uploads\\').pop();
      }

      console.log('\n\n' + fileName + '\n\n');
      // filePath = path.join('..', '/uploads/', fileName);
      filePath = '../uploads/' + fileName;
      console.log('\n\n' + filePath + '\n\n');
    });
 
    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
 
    // once the file has been uploaded, send the location of the file back
    form.on('end', function() {
      User.findOne({'username': req.user.username}, function(err, user) {
            if (err) {
              res.send("Your profile couldn't be updated at this time. Please Try again later.");
            } 
            else {
              if (user) {
                user.profilepic = filePath;
                user.save();
                res.send(filePath);
              } 
              else {
                res.send('Could not find user.');
              }
            }
          });
    });
 
    // parse the incoming request containing the form data
    form.parse(req);
 
  });

  /* GET changingcpassword */
  router.get('/changingpassword', function(req, res, next) {
    var password = req.query.password;

    if (password.length < 8) {
      res.send('Your password must contain at least 8 characters.');
    }
    else {
      var isValid = true;
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
      isValid = (containsNumeral && containsAlphabetic);

      if (isValid) {
        res.send('Password valid.');
      }
      else {
        res.send('Password invalid. Please include at least one letter and one number.');
      }
    }

  });

  /* GET changingcpassword */
  router.get('/changingcpassword', function(req, res, next) {
    var password = req.query.password;
    var cpassword = req.query.cpassword;

    if (password === cpassword) {
      res.send("Passwords match.");
    }
    else {
      res.send("Passwords don't match. Please try again.");
    }
  });

  return router;

}