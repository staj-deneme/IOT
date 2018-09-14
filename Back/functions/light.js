var aydinlatmatablo = require ("./lighttables");

/*
Her bir zonun aydınlatılması için harcanan enerji

Wly: tamamen yapay aydınlatma varsa
Wld: Yapay+ doğal aydınlatma (pencere varsa)
Wp: Hazırda bekleme gücü için harcanan enerji
Fc: sabit aydınlık faktörü
Pa: Armatür gücü, kWh 
Fo: kullanıma bağlı faktör
*/
/**
 * 
 * @param {*} windows : Pencere sayısı
 * @param {*} tk : Her bir zon için yıllık kullanım süresi(h)
 * @param {*} hacimturu : Aydınlatılan hacimin türü (tablo4.2)
 * @param {*} sensor : Otomatik hareket sensörü bilgisi (sensorlu/sensorsuz)
 * @param {*} kontrol : Aydınlatma kontrolü türü (tablo4.1)
 * @param {*} Azon: Zon alanı
 * @param {*} otomatik :otomatik aydınlatma kontrolü (boolean) 
 * @param {*} acil : acil durum aydınlatması (boolean)
 * 
 */
function Wt (windows,tk,buildingId,hacimturu,sensor,kontrol,Azon,otomatik,acil) {
    var Pa = Pafunc(buildingId);
    var Fc = Fcfunc(buildingId);
    var Fo = Fofunc(hacimturu,sensor,kontrol);
    var lsource = lightsource(buildingId);
    var Wly = (Pa *tk * 1/Fc * Fo )/1000;
    var st;
    var Wld = 0;
    var Wp = 0;
    lsource.forEach(element=> {
        if (element.isOn) {
            st = 1;
        }
        else {
            st = 0;
        }
        for(var h=1;h<=tk;h++) {
            Wld += ((Pa*h)*st*1/Fc*Fo)/1000
        }
    });

    if (otomatik) {
        if (acil) {
            Wp = Azon*0.4;
        }
        else {
         Wp = Azon*0.3;
        }
    }
    if (acil) {
        Wp = Azon*0.1;
    }
    if (windows == 0) {
        return Wly + Wp;
    }
    else {
         return Wld + Wp;
    }
}

/*Fc: sabit aydınlık faktörü
*/
/**
 * @param {*} buildingId : bina numarası 
 */
function Fcfunc (buildingId) {
    var Pa = Pafunc(buildingId);
    var Fc = 0;
    var lsource = lightsource(buildingId);
    lsource.forEach(element=> {
        var Pai;
        var Fci = aydinlatmatablo.tablo2_1[element.armaturetype][element.condition];
        if (element.power == null) {
            Pai = aydinlatmatablo.tablo3_1[element.name][element.flow];
        }
        else {
            Pai = element.power;
        }
    Fc += (Pai *Fci)/Pa; 
    });
    return Fc;
 }

 function lightsource (buildingId) {
    BuildingSchema.findOne(buildingId, (err, data) => {
        if (err) reject(err);
        var binaBilgileri = data;
        var isikkaynaklari;
        binaBilgileri.floors.forEach(floor => {
            
            floor.forEach(zone => {
                isikkaynaklari.push(zone.lsource);
            });
        });
    });
    return isikkaynaklari;
}

/* Pa: armatür Gücü (kWh)
     kWh = W*zaman(h)/1000 ----> W  kWh dönüşümü
     power : lamba gücü(W)
     Pi : kwH (lamba gücü)
*/
function Pafunc (buildingId) {
    var Pa;
    var lsource = lightsource(buildingId);
    lsource.forEach(element => {
        if(element.power== null) {
            var Pi = (aydinlatmatablo.tablo3_1[element.name][element.flow]/1000);
            var enerjikaybi;

            var balast = aydinlatmatablo.tablo3_1 [element.name.balast];
                if (balast) {
                    if(element.energyEf==null) {
                        element.energyEf = "C";
                        enerjikaybi= aydinlatmatablo.tablo3_2[element.energyEf];
                    }
                    else {
                        enerjikaybi= aydinlatmatablo.tablo3_2[element.energyEf];
                    }
                }
                else {
                    enerjikaybi = 0;
                }
            Pa += Pi*element.n*(1+enerjikaybi);
        }
        else {
            Pa+=(element.power/1000);
        }
    });
return Pa;
}

/* Fo: Kullanıma bağlı faktör
   Foc: Aydınlatma kontrolüne bağlı faktör (tablo 4.1)
   Fa: Hacmin kullanımına bağlı faktör (tablo 4.2) 
*/
/**
 * @param {*} hacimturu : Aydınlatılan hacimin türü (tablo 4.2)
 * @param {*} sensor : Otomatik hareket sensörü bilgisi (sensorlu/sensorsuz)
 * @param {*} kontrol : Aydınlatma kontrolü türü (tablo 4.1)
 */
function Fofunc (hacimturu,sensor,kontrol) {
    var Fa = aydinlatmatablo.tablo4_2[hacimturu];
    var Foc = aydinlatmatablo.tablo4_1[sensor][kontrol];
    var Fo;

    if (Fa>=0 || Fa<0.2) {
        Fo = 1-((1-Foc)*Fa/2);
    }
    if (Fa>=0.2 || Fa<0.9) {
        Fo = Foc+0.2-Fa;
    }
    if (Fa>=0.9 || Fa<=1) {
        Fo = (7-(10*Foc))*(Fa-1);
    }
    return Fo;
}


// Güneş ışınımının iç mekanların aydınlatma enerjisi ile ilişkisi
/*
Esaat: Zondaki ortalama aydınlık düzeyi 
Iegimli : Eğik düzlem üzerine gelen toplam ışınım
*/
 /**
/  * @param {*} Eistenen :Zonda olması gereken aydınlık seviyesi(binanın her bir zonu için bina
    sakinleri tarafından belirlenir)
    @param {*} manuel :aydınlatmada manuel kontrol var mı(boolean)
/  */
function gunesisinimi (Eistenen,buildingId,Apen,Azon,tavanRengi,duvarRengi,zeminRengi,camTuru,manuel,β,I,Idirekt,Iyayinik,n,t,dk,sn,b,e,γ) {
    var Esaat = Esaatfunc(β,Apen,Azon,tavanRengi,duvarRengi,zeminRengi,camTuru,I,Idirekt,Iyayinik,n,t,dk,sn,b,e,γ);
    var Iegimli = Iegimlifunc(β);
    var Pa;
    var Pao;
    if(manuel) {
    if(Esaat < Eistenen*0.6) {
        Pa = Pafunc(buildingId);
    }
    else {
        Pa = 0; 
    }
    return Pa;
 }
 else {
    if (Esaat < Eistenen * 0.9) {
        Pa = Pafunc(buildingId);
        Pao = ((Eistenen * 0.9)-Esaat)/Eistenen*Pa //Pa (WATT)????????? CEVAP GELİNCE DÜZELT!!!!!!!!!! 
        return Pao;
    }
    else {
        Pa = 0;
        return Pa;
    }
 }
}

/* Esaat: Zondaki ortalama aydınlık düzeyi 
τ : Pencere geçirgenliği (tablo 5.2)
ρ : Net yansıma katsayısı (tablo 5.1)
Tavan,duvar zemin renkleri {
                                cokacik : beyaz,saman rengi,kemik rengi,açık mavi,açık yeşil
                                acik : kavuniçi, sarı bej, turuncu
                                orta : gök mavisi, çimen yeşili }
*/
/**
 * @param {*} Apen: İlgili zonda toplam pencere alanı (bina geometrisinden) 
 * @param {*} Azon: İlgili zonun toplam zemin alanı (bina geometrisinden)
 * @param {*} camTuru: cam türü (tablo 5.2)
 */
function Esaatfunc(β,Apen,Azon,tavanRengi,duvarRengi,zeminRengi,camTuru,I,Idirekt,Iyayinik,n,t,dk,sn,b,e,γ) {

    var Iegimli = Iegimlifunc(β,I,Idirekt,Iyayinik,n,t,dk,sn,b,e,γ); 
    
    var tavank = aydinlatmatablo.tablorenkler[tavanRengi];
    var duvark = aydinlatmatablo.tablorenkler[duvarRengi];
    var zemink = aydinlatmatablo.tablorenkler[zeminRengi];
    
    var ρ = aydinlatmatablo.tablo5_1[tavank][duvark][zemink];
    var τ = aydinlatmatablo.tablo5_2[camTuru.gecirgenlik];
    var Esaat = 1/2*Iegimli*τ*(Apen/Azon)*ρ;

    return Esaat;
} 

/* Eğik düzlem üzerine gelen toplam ışınım (Iegimli)
*/
/**
 * @param {*} β : (Yüzeyin Eğim Açısı) düzlemin yatay düzlem ile yaptığı açı 
 * @param {*} Idirekt : Yatay düzleme gelen ışınım değerinin direkt bileşeni 
 * @param {*} Iyayinik : Yatay düzleme gelen ışınım değerinin yayınık bileşeni 
 * @param {*} I : Yatay düzleme gelen toplam ışınım değeri 
 * */
function Iegimlifunc(β,I,Idirekt,Iyayinik,n,t,dk,sn,b,e,γ) {

    var Rb = Rbfunc(n,t,dk,sn,b,e,γ);
    var Iegimli ;
    if (Idirekt*Rb <0){
        Iegimli = 0;
    } 
    else {
       Iegimli = Idirekt*Rb*Iyayinik*((1+Math.cos(β))/2)+(I*0.2*((1-Math.cos(β))/2));
    }
    return Iegimli;
}

// Her saat için ayrı ayrı hesaplanacak
/** 
 * @param {*} n : Gün sayısı (1-365)
 * @param {*} t : saat (0-23) 
 */
function fyfunc (n,t) {

     return Math.PI * 2 /365 *((n-1)+(t-12)/24);
}

 /* AYD Deklinasyon Açısı (δ)
fy : radyan cinsinden oransal yıl 
*/
/**
 * @param {*} n : gün sayısı (1-365)
 * @param {*} t : saat (0-23)
 */
function δfunc(n,t) {

var fy = fyfunc(n,t);
var δ = (0.006918-(0.399912*Math.cos(fy))+(0.070257*Math.sin(fy))-(0.006758*Math.cos(2*fy))+(0.000907*Math.sin(2*fy))-(0.002697*Math.cos(3*fy))+(0.00148*Math.sin(3*fy)))*180/Math.PI;

return δ;
}

/* AYD Saat Açısı (ω)
tos : Başlangıç meridyenine göre zaman kaydırma miktarı
eq : dakika cinsinden zaman denklemi
tst : UTC'ye göre zaman dilimi */
/**
 * @param {*} n : gün sayısı (1-365)
 * @param {*} t : saat (0-23)
 * @param {*} dk : dakika(0-59)
 * @param {*} sn : saniye (0-59)
 * @param {*} b : boylam açısı (başlangıç meridyeninin doğusundaki veya batısındaki herhangi bir noktanın açısal mesafesi)
 */
function ωfunc(n,t,dk,sn,b) {
    var fy = fyfunc(n,t);
    var eq = 229.18*(0.000075+(0.001868*Math.cos(fy))-(0.32077*Math.sin(fy))-(0.014615*Math.cos(2*fy))+(0.040849*Math.sin(2*fy)));
    var tos = eq - (4*(b)) +120;
    var tst = (t*60)+ dk+ (sn/60)+ tos;
    var ω = (tst/4)-180;
 return  ω; 
}

/* z : (AYD Zenit Açısı) Güneş ışınlarının yatay düzleme geliş açısı */
/**
 * @param {*} n : gün sayısı (1-365)
 * @param {*} t : saat (0-23)
 * @param {*} dk : dakika(0-59)
 * @param {*} sn : saniye (0-59) 
 * @param {*} b : boylam açısı (başlangıç meridyeninin doğusundaki veya batısındaki herhangi bir noktanın açısal mesafesi)
 * @param {*} e : enlem açısı (yeri dünya merkezine birleştiren doğrunun dünyanın Ekvator düzlemi ile yaptığı açıdır.
                   Kuzey yarım kürede pozitif, güney yarım kürede negatif olarak alınır)
 */
function zfunc(n,t,dk,sn,b,e) {
    var δ = δfunc(n,t);
    var ω = ωfunct(n,t,dk,sn,b);
    var z = Math.acos(Math.cos(e)*Math.cos(Math.abs(δ))*Math.cos(ω)+Math.sin(e)*Math.sin(Math.abs(δ)));
    return z;
}

/* as : Güneş yükseklik açısı  
*/
function asfunc(n,t,dk,sn,b,e) {
    var z = zfunc(n,t,dk,sn,b,e);
    var as = Math.asin(Math.cos(z)); //Math.sin(as) = Math.cos(z);    
    return as;
}

/* Güneş Azimut açısı (γs)
*/
function γsfunc(n,t,dk,sn,b,e) {
var δ = δfunc(n,t); 
var as = asfunc(n,t,dk,sn,b,e);
var γs = Math.acos((Math.sin(as)*Math.sin(e)-Math.sin(δ))/Math.cos(as)*Math.cos(e));
    return γs;
}

// Rb : Güneş Işınım Direkt Bileşen Oranı 
/**
 * @param {*} γ : yüzey azimut açısı yüzeyin normalinin yatay düzlemdeki iz düşümünün güneyden batıya doğru pozitif, 
 * doğuya doğru negatif olarak ölçüldüğü açıdır. Bu yöntemde binanın ilgili penceresinin güney ile yaptığı açıdır
 */
function Rbfunc(n,t,dk,sn,b,e,γ) {
    var z = zfunc(n,t,dk,sn,b,e);
    var γs = γsfunc(n,t,dk,sn,b,e); 
    var cosθ = Math.sin(z)*Math.cos(γs-γ);
    return cosθ/Math.cos(z);
}