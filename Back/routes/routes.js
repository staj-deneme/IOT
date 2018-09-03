var express = require('express');
var router = express.Router();
var Building = require("../models/schema");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
//Bina listesini getir
router.get('/getBuilding', function (req, res, next) {
    Building.find({}, function (err, data) {

        res.send(data);

    }).select('name');
});

//boş bina oluştur
router.post('/createBuilding', function (req, res, next) {
    var b = new Building({
        name: req.body.bName,
        ema:req.body.ema,
        hcs:req.body.hcs
    });
    b.save(function (err, data) {
        if (err) res.send("createBuilding hata");
        res.send('createBuilding ok');
    });
});
//binaya kat ekle
router.post('/addFloor', function (req, res, next) {
    var floor = {
        idF: req.body.idF,
        typeF:req.body.typeF,
        zones: []
    }
    var buildings
    Building.findOne({
        name: req.body.bName
    }, function (err, data) {
        if (err) res.send(err);
        else {
            if(data==null){ res.send("böyle birbina bulunamadı")}
            buildings = data
            buildings.floors.push(floor);
            //dbye yaz
            Building.findOneAndUpdate({
                name: req.body.bName
            }, {
                floors: buildings.floors
            }, function (err, data) {
                if (err) res.send(err);
                res.send("addfloor ok");
            });
        }
    });
});
//kata zone ekle
router.post('/addZone', function (req, res, next) {
    var zone = {
        idZ: req.body.idZ,
        typeZ:req.body.typeZ,
        rooms:[]
    }
    var floors
    Building.findOne({
        name: req.body.bName
    }, function (err, data) {
        if (err) res.send(err);
        else {
            if(data==null){res.send("adzone hata")}
            floors = data.floors
            for (var i = 0; i < floors.length; i++) {
                if (floors[i].idF == req.body.idF) {
                    floors[i].zones.push(zone);
                }
            }
            //dbye yaz
            Building.findOneAndUpdate({
                name: req.body.bName
            }, {
                floors: floors
            }, function (err, data) {
                if (err) res.send(err);
                else {
                    res.send("adzone ok");
                }
            });

        }
    });
});
//zonea oda ekle
router.post('/addRoom', function (req, res, next) {
    var room = {
        idR: req.body.idR,
        walls:[],
        ground:{//döşeme 
            material:"String",//req.body.material
            witdh:1,//req.body.width
            length:2,//req.body.length
            height:3//req.body.height
        },
        airCond: [],
        devicesI: [],
        devicesR: [],
        heaterR: [],
        humans: null, //insan yoğunluğu
        lSource: [],
        ssd: [],
        timeinterval:0,//req.body.timeinterval
    }
    var floors
    Building.findOne({
        name: req.body.bName
    }, function (err, data){
        if (err) res.send(err);
        else {
            if(data==null){res.send("adroom hata")}
            else{
                floors = data.floors
                for (var i = 0; i < floors.length; i++) {
                    if (floors[i].idF == req.body.idF) {
                        for(var j=0;j<floors[i].zones.length;j++){
                            /*
                                zonlar kullanıcı tanımlı olacaksa(yani bu oda şu zondadır diye tanımlama);
                            Alttaki if'in koşulu floors[i].zones[j].idZ == req.body.idZ
                                Eğer odalar zonların tipine göre zona eklenecekse;
                            Alttaki if'in koşulu floors[i].zones[j].typeZ == req.body.typeZ                       
                            */
                            if (floors[i].zones[j].idZ == req.body.idZ) {
                                floors[i].zones[j].rooms.push(room);
                            }
                        }
                    }
                }
                //dbye yaz
                Building.findOneAndUpdate({
                    name: req.body.bName
                }, {
                    floors: floors
                }, function (err, data) {
                    if (err) res.send(err);
                    else {
                        res.send("adzone ok");
                    }
                });
            }           

        }
    });
});
//odaya elemanları ekle(cihazlar vb)
router.post('/addElem',function(req,res,next){//camları ekleme eksik else durumunda res send unutma
    switch(req.body.item){
        case "airCond":
            var newaircond={
                id:req.body.elemid,
                heat:null,
                fad:null
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    if(data==null)res.send("böye bir bina yok")
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].airCond.push(newaircond);
                                        }
                                    }                                    
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (aircond) ok");
                    }); 
                }     
            });   
            break;
        case "deviceI":
            var newdeviceI={
                id:req.body.elemid,
                output:0,//req.body.output
                power:0,//req.body.power
                efficiency:0,//req.body.effiency
                isOn:false
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].devicesI.push(newdeviceI);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (deviceI) ok");
                    }); 
                }     
            });   
            break;
        case "deviceR":
            var newdeviceR={
                id:req.body.elemid,
                output:0,//req.body.output
                relay:0,//req.body.relay
                isOn:false
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].devicesR.push(newdeviceR);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (deviceR) ok");
                    }); 
                }     
            });
            break;
        case "heaterR":
            var newheaterR={
                id:req.body.elemid,
                output:0,//req.body.output
                size:0,//req.body.size
                efficiency:0,//req.body.effiency
                heat:null,
                isOn:false
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].heaterR.push(newheaterR);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (heaterR) ok");
                    }); 
                }     
            });
            break;
        case "lSource":
            var newlSource={
                id:req.body.elemid,
                power:null,//req.body.power
                flow:null,//req.body.flow
                lds:null,//req.body.lds
                isOn:false
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].lSource.push(newlSource);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (lsource) ok");
                    }); 
                }     
            });
            break;
        case "ssd":
            var newssd={
                id:req.body.elemid,
                ssdVal:null
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].ssd.push(newssd);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (ssd) ok");
                    }); 
                }     
            });
            break;
        case "wall":
            var newwall={
                typeWall:null,//req.body.typeWall
                inOut:null,//req.body.inout
                material:null,//req.body.material
                witdh:null,//req.body.width
                length:null,//req.body.length
                height:null,//req.body.height
                //camlar için kullanılcak yöntem?
                windowRatio:null,//req.body.ratio
                //yada
                windows:[]
            }
            Building.findOne({name:req.body.bName},function(err,data){
                if(err)res.send(err);
                else{
                    var tdata=data;
                    for(var i=0;i<tdata.floors.length;i++){
                        if(tdata.floors[i].idF==req.body.idF){
                            for(var j=0;j<tdata.floors[i].zones.length;j++){
                                if(tdata.floors[i].zones[j].idZ==req.body.idZ){
                                    for(var k=0;k<tdata.floors[i].zones[j].rooms.length;k++){
                                        if( tdata.floors[i].zones[j].rooms[k].idR==req.body.idR){
                                            tdata.floors[i].zones[j].rooms[k].walls.push(newwall);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //dbye yaz
                    Building.findOneAndUpdate({name:req.body.bName},
                    {floors:tdata.floors},function(err,data){
                    if(err)res.send(err);
                    res.send("addelem (wall) ok");
                    }); 
                }     
            });
            break;
        default:
            break;
    }
});
module.exports = router;