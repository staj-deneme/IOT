var tablolar = require("./tables");

function Øopr(Øs, Øair) {
    return 0.7 * Øs + 0.3 * Øair
}
//Øs=Øair(Htris+Hve)-(Hve-Øsup)-Htris-Φia
function Øs(Øair, Htris, Hve, Øsup, Φia) {
    return Øair * (Htris + Hve) - (Hve - Øsup) - Htris - Φia
}
    
/**
 *  İç yüzey ve kütle arasında ısı geçiş katsayısı
 *  Htr,ms = hms . Am
 *  hms = 9,1 W/m²K sabit 
 *  Am  = Tablo 1.1’ deki 3 değer zone kaydı yapılırken alınarak Am için kullanılır. 
 */
function Htrms(Am) {
    return (9.1 * Am);
}


/**
 *  Hve = Havalandırma ısı geçiş katsayısı W/K
 *  Hve = Pa.Ca. n . ((Bve,infe . Vve,infe) + (Bve,infu . Vve,infu) + (Bve,infss . Vve,infss))
 * 
 *  Pa.Ca = Havanın ısıl kapasitesi, J / ( m3 · K ) = 0,33 W · h(zaman) / ( m3 · K ) 
 * 
 *  Bve,infe = Doğal havalandırma için düzeltme katsayısı 
 *  Vve,infe = Doğal havalandırma hacimsel hava debisi, m3 / h , max(Vve,min , Vve,d)
 * 
 *  Bve,infu = İklimlendirilmeyen zondan havalandırma için düzeltme katsayısı  
 *  Vve,infu = İklimlendirilmeyen zon ile iklimlendirilen zon arasındaki hacimsel hava debisi, m3 / h 
 * 
 *  Bve,infss = Sera ile iklimlendirilen zon arasındaki havalandırma için düzeltme katsayısı 
 *  Vve,infss = Sera ile iklimlendirilen zon arasındaki hacimsel hava debisi, m3 / h  
 * 
 *  Bve,infe, Bve,infu Bve,infss değerleri Btrden değer alır.
 * 
 */
function Hve(h, metrekup, mekanlar, binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey) {

    var PaCa = 0.33 * h / metrekup;
    var Vveinfe = (mekanlar, binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey, metrekup);

    //Bve,infe, Bve,infu Bve,infss değerleri Btrden değer alır. Üçünü Bve ile gösterdim.
    var Hiu = Hviu(PaCa, metrekup, Niu);
    var Hue = Hvue(PaCa, camMetreKare, ruzgarHizi);



    var Bve = Btr(Hiu, Hue);



    return PaCa;

}

/**
 * Vve,infe = Doğal havalandırma hacimsel hava debisi, m3 / h 
 * Vve,infe = max(Vve,min , Vve,d)
 * 
 * Cevaba Göre Düzeltilecek
 */
function Vveinfe(mekanlar, binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey, metrekup) {

    var VveMin = VveMin(mekanlar);
    var VveD = VveD(binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey, metrekup);

    return (VveMin > VveD) ? VveMin : VveD;

}

/**
 * Vve,min = (Np . Qp) + (A . Qm)
 * 
 * Np : Kişi Sayısı
 * Qp : Kişi başına gerekli taze hava miktarı, m3/kişi.h 
 * A  : Zonun/mekânın alanı m2 
 * Qm : m2 başına gerekli taze hava miktarı, m3/m2.h 
 * 
 * @param {*} mekanlar Zonun içindeki odalar ve bilgileri nesne olarak alınacak // EKLENECEK!!! Cevaba Göre Düzeltilecek
 * 
 */
function VveMin(mekanlar) {
    var VveMinTot = 0;

    mekanlar.forEach(mekan => {
        VveMinTot += (mekan.Np * mekan.Qp) + (mekan.A * mekan.Qm);
    });

    return VveMinTot;
}

/**
 * Vve,d : Tasarım hacimsel hava debisi
 * Vve,d = V.n
 * n : Zondaki hava değişim sayısı, tablo1.11 , tablo1.12 ve tablo1.13 ten n değeri bulunur.
 * V : Zonun hacmi, m3  
 * 
 * 
 * @param {*} binaYapiTipi Bina nesnesinden gelen bilgi // EKLENECEK!!!
 * @param {*} binaTipi Bina nesnesinden gelen bilgi // EKLENECEK!!!
 */
function VveD(binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey, metrekup) {

    var sizdirmaDeger = {
        ahsap: 3,
        tuglaBlok: 8,
        betonPerde: 3
    };
    var havasizdirmaDegeri = sizdirmaDeger[binaYapiTipi];

    var havaDegisimOrani = tablolar.tablo_1_12[binaTipi](havasizdirmaDegeri);

    var yuzey = (disaBakanYuzey > 1) ? "cokYuzey" : "tekYuzey";

    var n = tablolar.tablo_1_13[korunmaTipi][yuzey][havaDegisimOrani];

    return metrekup * n;

}

/**
 * Btr = İklimlendirilen zonun dışa açık iklimlendirilmeyen zona bitişik yüzeyleri için düzeltme faktörü 
 * @param {*} Hiu  İklimlendirilen zon ile iklimlendirilmeyen zon arasındaki toplam ısı geçiş katsayısı
 * @param {*} Hue  İklimlendirilmeyen zon ile dış ortam arasındaki toplam ısı geçiş katsayısı
 */
function Btr(Hiu, Hue) {
    return Hue / (Hiu + Hue);
}
/**
 * İklimlendirilmeyen zon ile iklimlendirilen zon arasındaki i elemanından havalandırma ısı geçiş katsayısı, W / K 
 * 
 * @param {*} PaCa  Havanın ısıl kapasitesi, J / ( m3 · K ) = 0,33 W · h / ( m3 · K ) 
 * @param {*} metrekup  Zonun hacmi 
 * @param {*} Niu  İklimlendirilen zon ile iklimlendirilmeyen zon arasındaki hava değişim sayısı
 * *
 * **İklimlendirilmeyen zon ile, iklimlendirilen zon arasındaki hava değişim sayısı (niu) değeri iklimlendirilmeyen zonun özelliğine göre Tablo 1.10’ den alınır
 * 
 */
function Hviu(PaCa, metrekup, Niu) {
    var Vviu = metrekup * Niu;
    return PaCa * Vviu;
}
/**
 * İklimlendirilmeyen zon ile dış ortam arasındaki havalandırma ısı geçiş katsayısı Hv,ue aşağıdaki formül kullanılarak bulunur.  
 * 
 * @param {*} PaCa Havanın ısıl kapasitesi, J / ( m3 · K ) = 0,33 W · h / ( m3 · K ) 
 * @param {*} camMetreKare Camın metrekaresi
 * @param {*} ruzgarHizi Meteorolojik verilerden alınmış anlık rüzgar hızı
 */
function Hvue(PaCa, camMetreKare, ruzgarHizi) {
    var Vvue = camMetreKare * ruzgarHizi;
    return PaCa * Vvue;
}

/*Htris: İç yüzey ile iç ortam arasındakı ısı geçis katsayısı -syf:38
Htris = his*Atot
his : 3.45 (sabit katsayı)
*/
/**
 * 
 * @param {*} Atot : bir zonu çevreleyen tüm iç yüzeylerin alanları toplamı
 */
function Htris(Atot) {
    const his = 3.45;
    return Atot * his;
}

/* Htrop: Zonu çevreleyen opak yüzeylerin iletim ve taşınım ısı geçiş katsayısı -syf:10
  Aopi: Opak yüzeyin alanı, m^2
  Uopi: Opak bileşenin ısıl geçirgenlik katsayısı, W/(m²*K)
  Lopi: Doğrusal ısı köprüsü uzunluğu, m
  Ψoi: Doğrusal ısı köprüsü birim uzunluk başına ısı geçiş katsayısı, W/(m*K)

 Htrop= Σ Aopi*Uopi + Σ Lopi*Ψoi
  opbil: opak bileşen dizisi
  */
/**
 * 
 * @param {*} kod : ısı köprüsü tipi (tablo 9.1)
 * @param {*} tip : yapı bileşen tipi (tablo 3.1)
 * @param {*} yon : opak bileşenin yönü (yatay/düşey)
 * @param {*} bosluk_kal : boşluk kalınlığı
 */
function Htrop(kod, tip, yon, bosluk_kal) {
    var Uopi = Uopi(tip, yon, bosluk_kal);
    var sum = 0;
    opbil.forEach(element => {
        sum += ((element.Aopi) * Uopi) + (element * Lopi) * (tablolar.tablo9_1[kod.Ψoi]);
    });
    return sum;
}


/*  Uopi: Opak bir bileşenin ısıl geçirgenlik katsayısı - syf:10
hsi: İç yüzey ısıl taşınım katsayısı, W/(m^2.K)
hse: Dış yüzey ısı taşınım katsayısı, W/(m^2.K)
dl: l nci malzemenin kalınlığı, m 
λhl: l nci malzemenin ısıl iletkenlik hesap değeri, W/(m.K)
Rgap: Opak bileşen malzemeleri arasındaki boşluğun ısıl direnci, m²K/W
sum : Σ dl/λhl
Uopi = 1/(1/hsi + Σ dl/λhl + 1/hse +Rgap)
*/
/** 
 * @param {*} tip : yapı bileşen tipi (tablo 9.1)
 * @param {*} yon : opak bileşenin yönü (yatay/düşey)
 * @param {*} bosluk_kal : yapı malzemeleri arasındaki boşluk kalınlığı
 */
function Uopi(tip, yon, bosluk_kal) {
    var hsi = 1 / (tablolar.tablo3_1[tip.Rsi]);
    var hse = 1 / (tablolar.tablo3_1[tip.Rse]);
    var sum = 0;
    opbil.malzeme.forEach(element => {
        sum += (element.dl / element.λhl);
    });
    tablolar.tablo3_2[yon].forEach(element => {
        if (element.min <= bosluk_kal && element.max >= bosluk_kal) {
            Rgap = element.Rgap;
        }
    });
    return 1 / ((1 / hsi) + sum + (1 / hse) + Rgap);
}

/* Φia : İç hava sıcaklığına etki eden ısı kazanç miktarı 
*/
/**
 * 
 * @param {*} bina : bina türü (ofis/fabrika)
 * @param {*} Np : kişi sayısı
 * @param {*} Af : zon/ofis alanı
 * @param {*} Φintlg : aydınlatma aygıtlarından ısı kazancı
 */
function Φia(bina, Np, Af, Φintlg) {
    var Φint
    if (bina == "ofis") {
        Φint = ofisΦint(Np, Af, Φintlg);
    }
    else if (bina == "fabrika") {
        Φint = fabrikaΦint(Φintlg);
    }

    return 0.5 * Φint;
}

/* Ofis binalarında iç kazanç
Np: kişi sayısı
Af: ofis döşeme alanı
 */
function ofisΦint(Np, Af, Φintlg) {
    var Φintoc = 130 * Np;
    var ΦintAppunit = ofisyogunlugu(Np, Af);
    var ΦintApp = Af * ΦintAppunit;

    return Φintoc + ΦintApp + Φintlg;
}

/**
 * 
 * @param {*} Np : kişi sayısı
 * @param {*} Af : zon/ofis döşeme alanı
 */

function ofisyogunlugu(Np, Af) {
    var ΦintAppunit
    var yogunluk
    if (Af / Np >= 15.5) {
        yogunluk = "Az Yoğun"
        ΦintAppunit = 5.4
    }
    else if (Af / Np >= 11.6 || Af / Np < 15.5) {
        yogunluk = "Orta Yoğun"
        ΦintAppunit = 10.8
    }
    else if (Af / Np >= 9.3 || Af / Np < 11.6) {
        yogunluk = "Yoğun"
        ΦintAppunit = 16.1
    }
    else {
        yogunluk = "Çok Yoğun"
        ΦintAppunit = 21.5
    }
    return ΦintAppunit;
}
/* Np: kişi sayısı
   Af: Zonun döşeme alanı
*/
function fabrikaΦint(Φintlg, Np, Af) {
    const ΦintOcsen = 3.6
    const ΦintOclat = 2.6
    var ΦintApp = 0
    var alan = 0

    zones.forEach(element => {
        var Af = zones.rooms.forEach(element => { alan += rooms.width * rooms.length });
        var ΦintAppunit = ofisyogunlugu(Np, Af);
        ΦintApp += Af * ΦintAppunit;
    })
    var Φint = (Np * (ΦintOcsen + ΦintOclat)) + ΦintApp + Φintlg;

    return Φint;
}

function Øst(Am, HtrWin, Øint, Atot) {
    var Øsol;
    return (1 - (Am / Atot) - (HtrWin / (9.1 * Atot))) * ((0.5 * Øint) + Øsol);
}


/**
 *  Øsol Bina elemanından güneş kazançlarını ifade eden ısı miktarı
 * 
 *  Fshobk =  Çevre binalardan bir k yüzeyinin gölgelenme katsayısı  
 *  Asolk = değerlendirilmekte olan zon veya binada verilen bir yön ve eğim açısındaki k yüzeyinin etkin toplama alanı, m2 
 *  Isolk = verilen yön ve eğim açısındaki k yüzeyinin toplama alanının metrekaresi başına gelen toplam güneş ışınımı, W/m2 
 *  Frk = k bina elemanı ve gökyüzü arasındaki ışınımsal biçim faktörüdür ve değerleri aşağıdaki gibidir:
 *  Fr = 1 : gölgelenmemiş yatay yüzeyler için,     Fr = 0,5 : gölgelenmemiş düşey yüzeyler için
 *  Ørk = k  bina elemanından gökyüzüne ısıl ışınım ile  ısı kaybı miktarı, W 
 * 
 */
function Øsol(Idir, Idif, Isolk, Sh, a, Aov, Ffin, Ggl, Awin, Ff, Asolem, Rse, Uop, Aop, Frk, colorFactor, deltaØer) {

    var Fov = Fov(Aov, Sh, Idir, Idif, Isolk);

    var Fshobk = Fshobk(Idir, Idif, Isolk, Sh, a);
    var Asolk = Asolk(Fov, Ffin, Ggl, Awin, Ff, Asolem, Rse, Uop, Aop);
    var Ørk = Ørk(Rse, Uop, Aop, colorFactor, deltaØer);

    return Fshobk * Asolk * Isolk - Frk * Ørk;

}
/**
 * Verilen derecenin tanjantını geri döndürür
 * @param {*} degrees tanjantını almak isediğin derece
 */
function getTan(degrees) {
    return Math.tan(degrees * Math.PI / 180);
}

/**
 * Yatay gölgeleme katsayısı
 * @param {*} Aov Yatay engel açısı 
 * @param {*} Sh  Zenit açısı // Güneş yükseliş açısı
 * @param {*} Idir  yüzeyin yön ve eğimine göre düzleme gelen doğrudan güneş ışınımı
 * @param {*} Idif  yüzeyin yön ve eğimine göre düzleme gelen yaygın güneş ışınımı
 * @param {*} Isolk toplam güneş ışınımı
 * Fovdif = Yatay engelin yaygın ışınımı gölgeleme katsayısı 
 * Fovdir = Yatay engelin doğrudan ışınımı gölgeleme katsayısı 
 */
function Fov(Aov, Sh, Idir, Idif, Isolk) {

    var maxDeger = 1 - (0.5 * getTan(Aov) / getTan(90 - Sh));

    var Fovdir = 0 > maxDeger ? 0 : maxDeger;
    var Fovdif = 1 - (Aov / Math.PI / 2);

    var Rdir = Idir / Isolk;
    var Rdif = Idif / Isolk;
    var Rtot = Rdir + Rdif;

    return (Fovdir * Rdir + Fovdif * Rdif + 1 - Rtot) / Rtot;
}

/**
 * Belirli bir bina kabuk elemanından gökyüzüne ısıl ışınımdan kaynaklanan ısı kaçısı,   aşağıdaki eşitlik ile verilir ve W cinsinden ifade edilir:
 * @param {*} Rse  elemanın dış yüzey ısıl direnç katsayısı, m2K/W 
 * @param {*} Uop  opak elemanın ısıl geçirgenlik katsayısı, W/m2K 
 * @param {*} Aop  opak elemanın izdüşüm alanı, m
 * @param {*} colorFactor dış ışınımsal ısı geçiş katsayısı, W/m2K 
 * @param {*} deltaØer  dış hava sıcaklığı ile görünür gökyüzü sıcaklığının ortalama farkıdır, °C 
 */
function Ørk(Rse, Uop, Aop, colorFactor, deltaØer) {
    hr = 5 * colorFactor;
    return Rse * Uop * Aop * Hr * deltaØer;
}

/**
 * 
 * Rdir  =  yüzeyin yön ve eğimine göre düzleme gelen doğrudan güneş ışınımının (Idir) toplam güneş ışınımına (Isol,k) oranı 
 * Rdif  =  yüzeyin yön ve eğimine göre düzleme gelen yaygın güneş ışınımının (Idif) toplam güneş ışınımına oranı
 * Rtot  =  yüzeyin yön ve eğimine göre düzleme gelen yaygın ve doğrudan güneş ışınım oranlarının toplamı
 * 
 * @param {*} Idir  yüzeyin yön ve eğimine göre düzleme gelen doğrudan güneş ışınımı
 * @param {*} Idif  yüzeyin yön ve eğimine göre düzleme gelen yaygın güneş ışınımı
 * @param {*} Isolk toplam güneş ışınımı
 * @param {*} Sh    Güneş yükseliş açısı 
 * @param {*} a     Karşı bina gölgelenme açısı
 */
function Fshobk(Idir, Idif, Isolk, Sh, a) {
    var Rdir = Idir / Isolk;
    var Rdif = Idif / Isolk;
    var Rtot = Rdir + Rdif;

    return (Sh > a) ? 1 : 1 - (Rdir / Rtot);
}

/**
 *  Asolk = değerlendirilmekte olan zon veya binada verilen bir yön ve eğim açısındaki k yüzeyinin etkin toplama alanı, m2  
 * 
 *  Asol = Asolop + Asolgl
 *  Asolop = değerlendirilmekte olan zon veya binada, verilen bir yön ve eğim açısındaki opak yüzeyin etkin toplama alanıdır, m2
 *  Asolgl = değerlendirilmekte olan zon veya binada, verilen bir yön ve eğim açısındaki saydam yüzeyin etkin toplama alanıdır, m2 
 * 
 */
function Asolk(Fov, Ffin, Ggl, Awin, Ff, Asolem, Rse, Uop, Aop) {
    var Asolop = Asolop(Asolem, Rse, Uop, Aop);
    var Asolgl = Asolgl(Fov, Ffin, Ggl, Awin, Ff);

    return Asolop + Asolgl;
}


/**
 * 
 * Asolgl = Saydam bileşenlerin (örneğin pencere) etkin güneş ışınımı toplama alanı
 * 
 * @param {*} Fov yatay gölgeleme elemanının gölgeleme faktörü 
 * @param {*} Ffin düşey gölgeleme alanının gölgeleme faktörü
 * @param {*} Ggl saydam bileşenin cam yüzeyi için toplam güneş enerjisi geçirgenlik katsayısı 
 * @param {*} Awin  çerçeve dahil saydam bileşenin toplam alanı, m2 
 * @param {*} Ff  çerçeve faktörü, sabit pencereler için 0,2, açılır pencereler için 0,3 alınmaktadır
 */
function Asolgl(Fov, Ffin, Ggl, Awin, Ff) {

    var Fshgl = Fov * Ffin;
    var Agl = Awin * (1 - Ff); // saydam bileşenin (örneğin, pencere) toplam alanı, m2

    return Fshgl * Ggl * Agl;
}

/**
 * Bina kabuğunun opak bileşeninin etkin güneş enerjisi toplama alanı metre kare cinsinden aşağıdaki eşitlik ile verilir
 * 
 * @param {*} Asolem opak yüzeyin güneş ışınımı yutuculuk katsayısı
 * @param {*} Rse  opak bileşen dış yüzey ısıl direnci
 * @param {*} Uop opak bileşen ısıl geçirgenlik katsayısı
 * @param {*} Aop opak bileşen izdüşüm alanı, m2
 */
function Asolop(Asolem, Rse, Uop, Aop) {
    return Asolem * Rse * Uop * Aop;
}


/*
    bir zonu çevreleyen saydam bileşenlerden ısı geçiş katsayısı sayfa13
        Htrwin=ggl*awin*uwin
        ggl->güneş enerjisi geçirgenlik faktörü örnek tablo 1.4
        awin-> saydam bileşen alanı m2
        uwin->saydam bileşenin geçirgenlik katsayısı(W/m2*K)
     Htrwin çağırma örnek->   Htrwin(5,6,uwin(ugl,uf,tip)) (uwin için uwin fonksiyonu parametreleriyle çağırılır)
*/
function Htrwin(ggl, awin, uwin) {
    return ggl * awin * uwin;
}
/*
    uwin= tablo1.7[ugl][uf]
    ugl-> camın ısıl gerçigenlik katsayısı parametre(tablo1.5)(W/m^2*K)
    uf-> cam çervevesi ısıl geçirgenlik katsayısı(tablo1.6)(W/m^2*K)
    tip->cam tipi (tek cam çift cam üçlü cam)(single,double,triple)
    çağırma örnek ->uwin(0.5,7,"triple") 0 dönerse parametreler hatalı, parametreler doğruysa tablodaki değer döner
*/
var ugluf //ilk satır uf , ilk sutun ugl değerleri
function uwin(ugl, uf, tip) {
    ugluf = new Array(24); //ugluf= tablo 1.7 (2017/1 pdf sayfa15)
    var tugl = 3.7; //ilk sutunun setlenmesi için gerekli
    for (var i = 0; i < 24; i++) {
        ugluf[i] = new Array(10);
        //ilksütunu ugl değerleri ile setleme
        ugluf[i][0] = tugl;
        tugl -= 2 / 10 //yada 0.2
        tugl = Math.round(tugl * 100) / 100 //bu olmadan 3,3den sonra 3.0999..gibi oluyor(sebep javascripttin tatlı canı yüzünden)
        if (i == 13) {
            tugl = 2.3
        } //13.satırda değer tekrar 2.3 oluyor
    }
    ugluf[0][0] = null;
    ugluf[1][0] = 5.7 //ilk sutunun ilk iki değeri
    //dizi oluşturuldu ilk sütün setlendi(yukarıda)
    var tuf = 1;
    for (var i = 1; i < 10; i++) {
        ugluf[0][i] = tuf;
        tuf += 4 / 10;
        tuf = Math.round(tuf * 100) / 100; //bu olmadan 3,3den sonra 3.0999..gibi oluyor(sebep javascripttin tatlı canı yüzünden)
    }

    ugluf[0][9] = 7; //son tuf değeri
    //ilk satır setlendi (yukarıda)
    //tablonun dizi şeklinde oluşturulması alttaki scope.(dizi şeklinde olması hız bakımından daha iyi dizi boyutu= 4*23*10=940byte)
    {
        //SATIR1(TEK CAM)
        ugluf[1][1] = ugluf[1][2] = 4.8; /**/
        ugluf[1][3] = 4.9; /**/
        ugluf[1][4] = 5; /**/
        ugluf[1][5] = 5.1; /**/
        ugluf[1][6] = 5.2; /**/
        ugluf[1][7] = 5.2; /**/
        ugluf[1][8] = 5.3; /**/
        ugluf[1][9] = 5.9;
        //ÇİFT CAM
        //SATIR2
        ugluf[2][1] = 2.9; /**/
        ugluf[2][2] = 3.0; /**/
        ugluf[2][3] = 3.1; /**/
        ugluf[2][4] = 3.2; /**/
        ugluf[2][5] = 3.3; /**/
        ugluf[2][6] = ugluf[2][7] = 3.4; /**/
        ugluf[2][8] = 3.5; /**/
        ugluf[2][9] = 4.0;
        //SATIR3
        ugluf[3][1] = ugluf[3][2] = 2.8; /**/
        ugluf[3][3] = 2.9; /**/
        ugluf[3][4] = 3; /**/
        ugluf[3][5] = 3.1; /**/
        ugluf[3][6] = 3.2; /**/
        ugluf[3][7] = 3.3; /**/
        ugluf[3][8] = 3.4; /**/
        ugluf[3][9] = 3.9;
        //SATIR4
        ugluf[4][1] = 2.6; /**/
        ugluf[4][2] = 2.7; /**/
        ugluf[4][3] = ugluf[4][4] = 2.8; /**/
        ugluf[4][5] = ugluf[4][6] = 3; /**/
        ugluf[4][7] = 3.1; /**/
        ugluf[4][8] = 3.2; /**/
        ugluf[4][9] = 3.7;
        //SATIR5
        ugluf[5][1] = 2.4; /**/
        ugluf[5][2] = 2.5; /**/
        ugluf[5][3] = 2.6; /**/
        ugluf[5][4] = 2.7; /**/
        ugluf[5][5] = 2.8; /**/
        ugluf[5][6] = 2.9; /**/
        ugluf[5][7] = ugluf[5][8] = 3.0; /**/
        ugluf[5][9] = 3.6;
        //SATIR6
        ugluf[6][1] = 2.3; /**/
        ugluf[6][2] = 2.4; /**/
        ugluf[6][3] = 2.5; /**/
        ugluf[6][4] = 2.6; /**/
        ugluf[6][5] = ugluf[6][6] = 2.7; /**/
        ugluf[6][7] = 2.8; /**/
        ugluf[6][8] = 2.9; /**/
        ugluf[6][9] = 3.4;
        //SATIR7
        ugluf[7][1] = 2.1; /**/
        ugluf[7][2] = 2.2; /**/
        ugluf[7][3] = 2.3; /**/
        ugluf[7][4] = 2.4; /**/
        ugluf[7][5] = 2.5; /**/
        ugluf[7][6] = 2.6; /**/
        ugluf[7][7] = ugluf[7][8] = 2.7; /**/
        ugluf[7][9] = 3.3;
        //SATIR8
        ugluf[8][1] = 2.0; /**/
        ugluf[8][2] = 2.1; /**/
        ugluf[8][3] = ugluf[8][4] = 2.2; /**/
        ugluf[8][5] = 2.3; /**/
        ugluf[8][6] = 2.4; /**/
        ugluf[8][7] = 2.5; /**/
        ugluf[8][8] = 2.6; /**/
        ugluf[8][9] = 3.1;
        //SATIR9
        ugluf[9][1] = 1.8; /**/
        ugluf[9][2] = 1.9; /**/
        ugluf[9][3] = 2; /**/
        ugluf[9][4] = 2.1; /**/
        ugluf[9][5] = 2.2; /**/
        ugluf[9][6] = ugluf[9][7] = 2.3; /**/
        ugluf[9][8] = 2.4; /**/
        ugluf[9][9] = 3.0;
        //SATIR10
        ugluf[10][1] = 1.7; /**/
        ugluf[10][2] = ugluf[10][3] = 1.8; /**/
        ugluf[10][4] = 2.9; /**/
        ugluf[10][5] = 2.0; /**/
        ugluf[10][6] = 2.1; /**/
        ugluf[10][7] = 2.2; /**/
        ugluf[10][8] = 2.3; /**/
        ugluf[10][9] = 2.8;
        //SATIR11
        ugluf[11][1] = 1.5;
        ugluf[11][2] = 1.6; /**/
        ugluf[11][3] = 1.7; /**/
        ugluf[11][4] = 1.8; /**/
        ugluf[11][5] = ugluf[11][6] = 1.9; /**/
        ugluf[11][7] = 2.0; /**/
        ugluf[11][8] = 2.1; /**/
        ugluf[11][9] = 2.6;
        //SATIR12
        ugluf[12][1] = ugluf[12][2] = 1.4; /**/
        ugluf[12][3] = 1.5; /**/
        ugluf[12][4] = 1.6; /**/
        ugluf[12][5] = 1.7; /**/
        ugluf[12][6] = 1.8; /**/
        ugluf[12][7] = 1.9; /**/
        ugluf[12][8] = 2; /**/
        ugluf[12][9] = 2.5;
        //SATIR13
        ugluf[13][1] = 1.2; /**/
        ugluf[13][2] = 1.3; /**/
        ugluf[13][3] = ugluf[13][4] = 1.4; /**/
        ugluf[13][5] = 1.5; /**/
        ugluf[13][6] = 1.6; /**/
        ugluf[13][7] = 1.7; /**/
        ugluf[13][8] = 1.8; /**/
        ugluf[13][9] = 2.3;
        //ÜÇLÜ CAM
        //SATIR14 
        ugluf[14][1] = 2.1; /**/
        ugluf[14][2] = 2.2; /**/
        ugluf[14][3] = 2.3; /**/
        ugluf[14][4] = 2.4; /**/
        ugluf[14][5] = 2.5; /**/
        ugluf[14][6] = ugluf[14][7] = 2.6; /**/
        ugluf[14][8] = 2.7; /**/
        ugluf[14][9] = 3.2;
        //SATIR15
        ugluf[15][1] = ugluf[15][2] = 2; /**/
        ugluf[15][3] = 2.1; /**/
        ugluf[15][4] = 2.2; /**/
        ugluf[15][5] = 2.3; /**/
        ugluf[15][6] = 2.4; /**/
        ugluf[15][7] = 2.5; /**/
        ugluf[15][8] = 2.6; /**/
        ugluf[15][9] = 3.1;
        //SATIR16
        ugluf[16][1] = 1.8; /**/
        ugluf[16][2] = 1.9; /**/
        ugluf[16][3] = ugluf[16][4] = 2.0; /**/
        ugluf[16][5] = ugluf[16][6] = 2.2; /**/
        ugluf[16][7] = 2.3; /**/
        ugluf[16][8] = 2.4; /**/
        ugluf[16][9] = 2.9;
        //SATIR17
        ugluf[17][1] = 1.6; /**/
        ugluf[17][2] = 1.7; /**/
        ugluf[17][3] = 1.8; /**/
        ugluf[17][4] = 1.9; /**/
        ugluf[17][5] = 2.0; /**/
        ugluf[17][6] = 2.1; /**/
        ugluf[17][7] = ugluf[17][8] = 2.2; /**/
        ugluf[17][9] = 2.8;
        //SATIR18
        ugluf[18][1] = 1.5; /**/
        ugluf[18][2] = 1.6; /**/
        ugluf[18][3] = 1.7; /**/
        ugluf[18][4] = 1.8; /**/
        ugluf[18][5] = ugluf[18][6] = 1.9; /**/
        ugluf[18][7] = 2.0; /**/
        ugluf[18][8] = 2.1; /**/
        ugluf[18][9] = 2.6;
        //SATIR19
        ugluf[19][1] = ugluf[19][2] = 1.4; /**/
        ugluf[19][3] = 1.5; /**/
        ugluf[19][4] = 1.6; /**/
        ugluf[19][5] = 1.7; /**/
        ugluf[19][6] = 1.8; /**/
        ugluf[19][7] = 1.9; /**/
        ugluf[19][8] = 2.0; /**/
        ugluf[19][9] = 2.5;
        //SATIR20
        ugluf[20][1] = 1.2; /**/
        ugluf[20][2] = 1.3; /**/
        ugluf[20][3] = ugluf[20][4] = 1.4; /**/
        ugluf[20][5] = 1.5; /**/
        ugluf[20][6] = 1.6; /**/
        ugluf[20][7] = 1.7; /**/
        ugluf[20][8] = 1.8; /**/
        ugluf[20][9] = 2.3;
        //SATIR21
        ugluf[21][1] = 1.0; /**/
        ugluf[21][2] = 1.1; /**/
        ugluf[21][3] = 1.2; /**/
        ugluf[21][4] = 1.3; /**/
        ugluf[21][5] = 1.4; /**/
        ugluf[21][6] = 1.5; /**/
        ugluf[21][7] = ugluf[21][8] = 1.6; /**/
        ugluf[21][9] = 2.2;
        //SATIR22
        ugluf[22][1] = 0.9; /**/
        ugluf[22][2] = ugluf[22][3] = 1.0; /**/
        ugluf[22][4] = 1.1; /**/
        ugluf[22][5] = 1.2; /**/
        ugluf[22][6] = 1.3; /**/
        ugluf[22][7] = 1.4; /**/
        ugluf[22][8] = 1.5; /**/
        ugluf[22][9] = 2.0;
        //SATIR23
        ugluf[23][1] = 0.7; /**/
        ugluf[23][2] = 0.8; /**/
        ugluf[23][3] = 0.9; /**/
        ugluf[23][4] = 1.0; /**/
        ugluf[23][5] = 1.1; /**/
        ugluf[23][6] = ugluf[23][7] = 1.2; /**/
        ugluf[23][8] = 1.3; /**/
        ugluf[23][9] = 1.8;
    }
    //console.log(ugluf)
    var ii = 0,
        jj = 0;
    for (var i = 0; i < 10; i++) {
        if (ugluf[0][i] == uf) {
            switch (tip) {
                case "single":
                    if (ugl == 5.7) {
                        ii = i;
                        jj = 1 //tablodan değer okunması için indis
                    }
                    break;
                case "double":
                    for (j = 1; j < 14; j++) {
                        if (ugluf[j][0] == ugl) {
                            ii = i;
                            jj = j;
                        }
                    }
                    break;
                case "triple":
                    for (j = 14; j < 24; j++) {
                        if (ugluf[j][0] == ugl) {
                            ii = i;
                            jj = j;
                        }
                    }
                    break;
                default:
                    console.log("cam tipi/veri geçersiz")
                    break;
            }
        }
    }
    //console.log(jj+"jj  "+ii+"ii  "+ugluf[jj][ii]);
    if (ii * jj == 0) {
        return 0;
    } else {
        return ugluf[jj][ii];
    }
}
//console.log("geri dönüş değeri:  "+uwin(0.5,7,"triple"));
//console.log("Htrwin(2,3,uwin(0.5,7,'triple') ===="+Htrwin(2,3,uwin(0.5,7,'triple')));

/*
    Htrms->kütle ile iç yüzey arası ısı geçiş katsayısı
    Am->etkin kütle alanı (tablo 1.1)
    hms-> sabit katsayı 9.1 W/m^2*K dir
*/
function Htrms(Am, hms) {
    return Am * hms
}
