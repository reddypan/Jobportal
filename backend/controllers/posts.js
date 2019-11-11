const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    jobTitle: req.body.jobTitle,
    jobDescription: req.body.jobDescription,
    salary: req.body.salary,
    jobType: req.body.jobType,
    requiredSkills: req.body.requiredSkills,
    companyName: req.body.companyName,
    companyDescription: req.body.companyDescription,
    location: req.body.location,
    createdOn: req.body.createdOn,
    endsOn: req.body.endsOn,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    appliedpeople: []
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    curl = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    jobTitle: req.body.jobTitle,
    jobDescription: req.body.jobDescription,
    salary: req.body.salary,
    jobType: req.body.jobType,
    requiredSkills: req.body.requiredSkills,
    companyName: req.body.companyName,
    companyDescription: req.body.companyDescription,
    location: req.body.location,
    createdOn: req.body.createdOn,
    endsOn: req.body.endsOn,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};

exports.addApplication = (req, res, next) => {
  console.log(req.params.id)
  Post.findById( req.params.id)
    .then(result => {
      result.appliedpeople.push(req.body.userId);

      Post.updateOne({
        _id: req.params.id
      }, {
        $set: { "appliedpeople": result.appliedpeople }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};
