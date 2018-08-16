var tablolar = {
    //Hava sızdırmazlık seviyeleri Tablosu
    tablo_1_12: {
        diger: function (deger) {
            if (deger < 2) {
                return "yuksek";
            } else if (deger >= 2 && deger <= 5) {
                return "orta";
            } else {
                return "dusuk";
            }
        },
        mustakil: function (deger) {
            if (deger < 4) {
                return "yuksek";
            } else if (deger >= 4 && deger <= 10) {
                return "orta";
            } else {
                return "dusuk";
            }
        }
    },
    // Apartmanlar, ofisler ve diğer bina tipolojilerinde doğal havalandırma hava değişim sayısı Tablosu
    tablo_1_13: {
        korunmasiz: {
            cokYuzey: {
                dusuk: 1.2,
                orta: 0.7,
                yuksek: 0.5
            },
            tekYuzey: {
                dusuk: 1,
                orta: 0.6,
                yuksek: 0.5
            }
        },
        hafifKorunmali: {
            cokYuzey: {
                dusuk: 0.9,
                orta: 0.6,
                yuksek: 0.5
            },
            tekYuzey: {
                dusuk: 0.7,
                orta: 0.5,
                yuksek: 0.5
            }
        },
        tamKorunmali: {
            cokYuzey: {
                dusuk: 0.6,
                orta: 0.5,
                yuksek: 0.5
            },
            tekYuzey: {
                dusuk: 0.5,
                orta: 0.5,
                yuksek: 0.5
            }
        }
    }
};

function Øopr(Øs, Øair) {
    return 0.7 * Øs + 0.3 * Øair;
}
//Øs=Øair(Htris+Hve)-(Hve-Øsup)-Htris-Φia
function Øs(Øair, Htris, Hve, Øsup, Φia) {
    return Øair * (Htris + Hve) - (Hve - Øsup) - Htris - Φia;
}

function Øst(Am,HtrWin,Øint,Atot) {
    var Øsol;
    return (1-(Am/Atot)-(HtrWin/(9.1*Atot)))*((0.5*Øint)+Øsol);
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
 */
function Hve(h, metrekup, mekanlar, binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey) {

    var PaCa = 0.33 * h / metrekup;
    var Vveinfe = (mekanlar, binaYapiTipi, binaTipi, korunmaTipi, disaBakanYuzey, metrekup);

    /**
     * Hve = Pa.Ca. n . ((Bve,infe . Vve,infe) + (Bve,infu . Vve,infu) + (Bve,infss . Vve,infss))
     * Formulünde Vve,infu ve Vve,infss değerlerinin hesaplanması bulunamadı.
     * 
     */

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




