var express = require('express');
var request = require('request');
var router = express.Router();

var apiLink = process.env.SERVERLINK;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/ekle', function (req, res, next) {

    var viewData = {};

    request({
        url: apiLink + "/routes/getBuilding"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            viewData.buildings = JSON.parse(body);
            res.render('ekle', viewData);
        }
    });

});

router.post('/binaEkle', function (req, res, next) {
    request({
        url: apiLink + "/routes/createBuilding",
        json: true,
        body: {
            bName: req.body.bName
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            res.redirect("/ekle");
        }
    });

});


router.post('/katEkle', function (req, res, next) {
    request({
        url: apiLink + "/routes/addFloor",
        json: true,
        body: {
            bName: req.body.bName,
            idF: req.body.idF
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            res.redirect("/ekle");
        }
    });

});


module.exports = router;