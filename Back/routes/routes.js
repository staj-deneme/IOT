var express = require('express');
var router = express.Router();
var Building=require("../models/schema");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//boş bina oluştur
router.post('/createBuilding',function(req,res,next){
    var b=new Building({
        name:req.body.bName,
    });
    b.save(function(err,data){
        if(err) res.send("createBuilding hata");
        res.send('createBuilding ok');
    });
});
//binaya kat ekle
router.post('/addFloor',function(req,res,next){
    var floor={
        idF:req.body.idF,
        zones:[]            
    }
    var buildings
    Building.findOne({name:req.body.bName},function(err,data){
        if(err)res.send(err);
        else{
            buildings=data                            
            buildings.floors.push(floor);
            //dbye yaz
            Building.findOneAndUpdate({name:req.body.bName},
            {floors:buildings.floors},function(err,data){
            if(err)res.send(err);
            res.send("addfloor ok");
            }); 
        }     
    });   
});
//binaya zone ekle
router.post('/addZone',function(req,res,next){
    var zone={
        idZ:req.body.idZ,
        wall:{
            material:req.body.material,
            witdh:req.body.witdh
        },
        floorMat:req.body.floorMat,//döşeme
        windows:req.body.windows,
        properties:{
            ema:req.body.ema,//Am(m2) etkin kütle alanı/effective mass area 
            hcs:req.body.hcs,//Cm(W*s/K)  yüzeylerin etkin ısı kapasitesi//effective heat capacity of the surfaces 
            htc:{//hve hariç hepsi sabit
                Hve:null,
                Htrwin:req.body.Htrwin,
                Htrop:req.body.Htrop,
                Htrem:req.body.Htrem,
                Htris:req.body.Htris,
                Htrms:req.body.Htrms
            } //Hx ısı geçiş katsayıları/heat transfer coefficients        
        },
        airCond:[],
        devicesI:[],
        devicesR:[],
        heaterR:[],
        humans:null,//insan yoğunluğu
        lSource:[],
        ssd:[],
        timeinterval:req.body.timeinterval        
    }
    var floors
    Building.findOne({name:req.body.bName},function(err,data){
        if(err)res.send(err);
        else{
            floors=data.floors
            for(var i=0;i<floors.length;i++){
                if(floors[i].idF==req.body.idF){                
                    floors[i].zones.push(zone);
                }
            }
            //dbye yaz
            Building.findOneAndUpdate({name:req.body.bName},
            {floors:floors},function(err,data){
                if(err)res.send(err);
                else{
                    res.send("adzone ok");
                }                
            }); 
            
        }
    });
});
module.exports = router;
