const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuildingSchema = new Schema({
    buildingId:Number,
    name:String,
    ema:Number,//Am(m2) etkin kütle alanı/effective mass area 
    hcs:Number,//Cm(W*s/K)  yüzeylerin etkin ısı kapasitesi//effective heat capacity of the surfaces 
    //Katlar
    floors:[{
        idF:Number,//kat idsi yada isim(1.kat)
        typeF:String,//Kat tipi( bodrum kat, zemin kat, ara kat, çatı arası)
    //Zonelar
        zones:[{
            idZ:Number,//zon idsi yada isim(1.zon)
            typeZ:String,//Zon tipi
            /*  typeZ===
                üretim alanı, atölye, depo, kişisel ofis (tek kişilik), grup çalışma ofisi (en fazla 6 kişilik),
                açık ofis (7 ve üstü kişilik), toplantı, seminer ve konferans odası, lobi / giriş holü, 
                yemekhane, mutfak, tuvalet, yardımcı mekanlar (yaşanmayan odalar,vestiyer odası, arşiv, koridor),
                sirkülasyon alanları/koridorlar, sunucu odası, bilgisayar merkezi.
            */

            //Odalar
            rooms:[{
                idR:Number,//room idsi yada ismi
                neighbors:[],//komşu oda idleri
                walls:[{//odanın duvarları
                    typeWall:Number,//tip 1-11 arası sayfa 10
                    inOut:Boolean,//dış duvar ise true, iç duvar ise false
                    material:String,
                    width:Number,
                    length:Number,
                    height:Number,
                    //camlar için kullanılcak yöntem?
                    windowRatio:Number,//duvar pencere oranı
                    //yada
                    windows:[{
                        typeWindow:String,//tek çift üçlü cam
                        width:Number,
                        length:Number,
                        ugl:Number,//camın ısı geçrigenlikatsayısı
                        uf:Number//çerçevenin ısı geçirgenlik katsayısı
                    }]
                }],
                ground:{//döşeme 
                    material:String,
                    width:Number,
                    length:Number,
                    height:Number//pdf 1 sayfa 8
                },
                properties:{htc:{//hve hariç hepsi sabit
                        Hve:Number,Htrwin:Number,Htrop:Number,Htrem:Number,Htris:Number,Htrms:Number
                    } //Hx ısı geçiş katsayıları/heat transfer coefficients        
                },
                airCond:[{//klimalar (fad hava debisis)
                    id:Number,
                    heat:Number,//ısı ayarı
                    fad:Number
                }],
                devicesI:[{//indüktif(motor)
                    id:Number,
                    output:Number,//çıkış gücü
                    power:Number,//motor gücü
                    efficiency:Number,//verimlilik
                    isOn:Boolean//açıkmı kapalımı?
                     //ısı kazancı fonk ile hesaplanabilir???
                }],
                devicesR:[{//resiztif(elektririkli ısıtıcı)
                    id:Number,
                    output:Number,//çıkış gücü
                    relay:Number,//ağ sistemi yoksa röle tabanlı bir sistem ile algoyla çalışcak
                    isOn:Boolean//açıkmı kapalımı?
                     //ısı kazancı fonk ile hesaplanabilir???
                }],
                heaterR:[{//resiztif
                    id:Number,
                    size:Number,//petek boyutu
                    output:Number,//Çıkış gücü
                    efficiency:Number,//verim
                    heat:Number,//ısıtma su sıcaklığı
                    isOn:Boolean//açıkmı kapalımı?
                     //ısı kazancı fonk ile hesaplanabilir???
                }],
                humans:Number,//insan yoğunluğu??sayısı
                  //Işık kaynakları syf 61-62-63
                lSource:[{
                    id:Number,//id yerine namede olabilir tek çeşit ışık kaynağı varsa sadece id yeterli
                    name:String, //lamba türü ismi
                    armaturetype:String, //armatür tipi
                    condition:String, // armatürün ortam şartları (temiz/normal/kirli)
                    power:Number,//güç (W)
                    flow:Number,//ışık akısı(Im)
                    energyEf:String, // enerji sınıfı
                    n:Number,// lamba sayısı
                    lds:Number,//röle için ışık yoğunluğu değeri
                    isOn:Boolean//açıkmı kapalımı?
               //ısı kazancı fonk ile hesaplanabilir???
               }],
                ssd:[{
                    ssdVal:Number,//süzme sayac param
                }],
                timeinterval:Number
            }]
        }]
    }],
});
/*
//HAVA DEBİSİ
    SDebi dediğimiz, birim zamandaki akış miktarıdır.
Serbest Hava Debisinde, FAD kompresör'ün bastığı havanın emdiği havanın miktarı cinsinden anlatımıdır.
1 Dakikada emilen hava miktarı 1 m3/dk ise atmosfer basıncında olmak kaydıyla 20 C emiş sıcaklığı vardır.Kompresör'ün fad değeri, yukarıdaki 
belirttiğimiz değerlerde 1-1.013 bar mutlak basınçta dolduracağı hacim'e denir.Hava soğudukça yani sıcaklık azaldıkça kompresör'ün bastığı 
havanın kütlesi artacaktır, tam tersi hava ısındıkça azalır. Kompresör'ün çıkışına gelen havan ısınmış olduğu için emdiğinden büyük hacimli olur.
Boru içinden geçen hava miktarı kompresör'ün FAD değerinin çalışma mutlak değere bölünmesiyle bulunur.
//RÖLE
Fotoselli röleleri, aynı amaçlarla kullanılan astronomik zaman rölelerinden ayıran en önemli fark; röle ile birlikte kullanılan gözdür. 
Bu göz LDR ( light dependent resistor) denilen, ışık şiddeti ile direnci değişen bir devre elemanıdır, diğer bir deyişle bu gözün görevi 
ışık şiddetini algılayarak aydınlatma sisteminin açılması veya kapanması için röleye bilgi vermektir.
//SÜZME ENERJİ SAYACI
Süzme enerji sayaçları fabrikalar, siteler, oteller, büyük iş merkezleri, yat limanları (marina) vb.. gibi tüketim noktalarının dağınık olduğu 
ve dahili tüketimlerin izlenmesi gereken yerlerde kullanılmak üzere dizayn edilmişlerdir. Küçük boyutları, yüksek ölçüm hassasiyetleri, değişik 
ihtiyaçlar için farklı modellerin bulunması, otomasyon sistemlerinden izlenebilir olmalarından dolayı tercih edilmektedirler.
*/
module.exports = mongoose.model("building", BuildingSchema);