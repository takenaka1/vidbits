const router = require('express').Router();
const Video = require('../models/video');

router.post('/videos', async (req, res, next) => {
  const {title, url, description} = req.body;

  const reqVideo = new Video({title, url, description});
  const error = reqVideo.validateSync();
  if (reqVideo.errors) {
    const video = reqVideo;
    res.status(400).render('videos/create', {video, error});
  } else {
    const video = await reqVideo.save();
    res.redirect(`/videos/${video._id}`);
  }

});

router.post('/videos/:id/updates', async (req, res, next) => {
  const video = await Video.findOne({_id: req.params.id});
  const {title, url, description} = req.body;
  video.title = title;
  video.url = url;
  video.description = description;
  const error = video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/edit', {video});
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.get('/', async (req, res, next) => {
  res.redirect('/videos');
});

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/create', videos);
});

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findOne({id: req.params._id});
  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const video = await Video.findOne({id: req.params._id});
  res.render('videos/edit', {video});
});

module.exports = router;
