module.exports = {
    tablo2_1: {
        ciplak: { T: 0.86, N: 0.83, K: 0.79},
        acik_reflektor: { T: 0.89, N: 0.87, K: 0.85},
        kapali_reflektor: { T: 0.88, N: 0.85, K: 0.80},
        toz_korunumluIP5X: { T: 0.90, N: 0.89, K: 0.86},
        endirekt_armatur: { T: 0.80, N: 0.76, K :0.71}
    },
 
    tablo3_1: {
        MetalHalideSeramik:{
            balast: true,
            1700:20,
            3250:35,
            6700:70,
            9100:100,
            14350:150
        },
        MetalHalideQuartz:{
            balast: true,
            5550:70,
            8100:100,
            12200:150
        },
        CivaBuharli:{
            balast: true,
            1800:50,
            3500:80,
            6400:125,
            14000:250,
            24000:400
        },
        Fluoresan:{
            balast: true,
            140:4,
            250:6,
            370:8,
            825:13,
            1160:14,
            1400:16,
            1170:18,
            1850:21,
            1700:24,
            2525:28,
            1900:30,
            3150:35,
            2800:36,
            3300:39,
            4100:49,
            4350:54,
            // 4350:58 ???? iki aynı değer var
            6200:70,
            6080:80
        },
        
        Enkandesan:{
            balast: false,
            200:25,
            450:40,
            710:60,
            1000:75,
            1340:100,
            2160:150,
            3040:200
        },
        KompaktFluoresan:{
            balast : false,
            230:5,
            395:8,
            420:9,
            530:10,
            600:11,
            630:12,
            810:14,
            860:15,
            890:16,
            1100:18,
            1200:20,
            1440:23,
            1750:25,
            1850:27
        },
        Halojen:{
            balast : false,
            220:18,
            250:25,
            345:28,
            460:33,
            475:40,
            630:42,
            800:48,
            840:52,
            810:60,
            1240:70,
            1080:75,
            1500:80,
            1520:100,
            1900:105,
            2375:120,
            2430:150,
            3300:160,
            3500:200,
            4490:230,
            5300:300,
            9200:400,
            9500:500      
    }
    },

    tablo3_2: {
         A1: {enerjikaybi: 0.05},
         A2: {enerjikaybi: 0.07},
         A3: {enerjikaybi: 0.10},
         B1: {enerjikaybi: 0.15},
         B2: {enerjikaybi: 0.20},
         C: {enerjikaybi: 0.25}
    },

    tablo4_1: {
        sensorsuz: {
            kontrol1: { Tip: "Manuel açma kapama anahtarı", Foc: 1},
            kontrol2: { Tip: "Manuel açma kapama anahtarı-otomatik söndürme sinyali ilaveli", Foc: 0.95}
        },
        sensorlu: {
            kontrol1: { Tip: "Otomatik açma/dimmerli", Foc: 0.95},
            kontrol2: { Tip: "Otomatik açma/kapama", Foc: 0.90},
            kontrol3: { Tip: "Elle (manuel) açma/dimmerli", Foc: 0.90},
            kontrol4: { Tip: "Elle(manuel) açme/kapama", Foc: 0.80}
        }

    },

    tablo4_2: { 
        tur1: { HacimTuru: "1 kişilik ofis odası", FA: 0.4},
        tur2: { HacimTuru: "2 kişilik ofis odası", FA: 0.3},
        tur3: { HacimTuru: "Açık planlı ofis>6 kişilik 30 m2", FA: 0},
        tur4: { HacimTuru: "Açık planlı ofis>6 kişilik 10 m2", FA: 0.2},
        tur5: { HacimTuru: "Koridor(dimmerlenmiş)", FA: 0.4},
        tur6: { HacimTuru: "Giriş holü", FA: 0},
        tur7: { HacimTuru: "WC", FA: 0.9},
        tur8: { HacimTuru: "Teknik servis odası", FA: 0.98},
        tur9: { HacimTuru: "Fotokopi- bilgi işlem odası", FA: 0.5},
        tur10: { HacimTuru: "Konferans odası", FA: 0.5},
        tur11: { HacimTuru: "Arşiv", FA: 0.98},
        tur12: { HacimTuru: "Yemek holü, kafeterya", FA: 0},
        tur13: { HacimTuru: "Mutfak", FA: 0},
        tur14: { HacimTuru: "Depo alanları", FA: 0.4},
        tur15: { HacimTuru: "Açık depolar", FA: 0.2},
        tur16: {HacimTuru: "Boyahaneler", FA: 0.2}

    },

    tablorenkler: {
        cokacik: {katsayı:0.7},
        acik: {katsayı:0.5},
        orta: {katsayı:0.3}
    },

    tablo5_1: {
        //tavan
        0.7: { 
            //duvar
            0.7: {
                //zemin
                0.7: { ρ: 1 },
                0.5: { ρ: 0.877 },
                0.3: { ρ: 0.783 }
            },
            0.5: { 
                0.7: { ρ: 0.877 },
                0.5: { ρ: 0.794 },
                0.3: { ρ: 0.728 }
            },
            0.3: {
                0.7: { ρ: 0.783 },
                0.5: { ρ: 0.728 },
                0.3: { ρ: 0.684 }
            }
        },
        /***********************************/
        //tavan
        0.5: { 
            //duvar
            0.7: {
                //zemin
                0.7: { ρ: 0.877 },
                0.5: { ρ: 0.794 },
                0.3: { ρ: 0.728 }
            },
            0.5: { 
                0.7: { ρ: 0.794 },
                0.5: { ρ: 0.738 },
                0.3: { ρ: 0.69 }
            },
            0.3: {
                0.7: { ρ: 0.728 },
                0.5: { ρ: 0.69 },
                0.3: { ρ: 0.66 }
            }
        },
        /**********************************/
        //tavan
        0.3: {
            //duvar
            0.7: { 
                //zemin
                0.7: { ρ: 0.783 },
                0.5: { ρ: 0.728 },
                0.3: { ρ: 0.684 }
            },
            0.5: {
                0.7: { ρ: 0.728 },
                0.5: { ρ: 0.69 },
                0.3: { ρ: 0.66 }
            },
            0.3: {
                0.7: { ρ: 0.684 },
                0.5: { ρ: 0.66 },
                0.3: { ρ: 0.637 }
            }
        }
    },

    tablo5_2 :{
        cam1: { Ad: "Yalınkat Cam,4mm", gecirgenlik: 0.34},
        cam2: { Ad: "Yalınkat Cam,6mm", gecirgenlik: 0.34},
        cam3: { Ad: "Isıcam Yalıtım Camları", gecirgenlik: 0.31},
        cam4: { Ad: "Low-E Kombinasyonlu Isıcam Yalıtım", gecirgenlik: 0.3},
        cam5: { Ad: "Düz Cam (3mm)", gecirgenlik: 0.9},
        cam6: { Ad: "Düz Cam (4mm)", gecirgenlik: 0.89},
        cam7: { Ad: "Düz Cam (5mm)", gecirgenlik: 0.89},
        cam8: { Ad: "Düz Cam (6mm)", gecirgenlik: 0.88},
        cam9: { Ad: "Düz Cam (8mm)", gecirgenlik: 0.87},
        cam10: { Ad: "Düz Cam (10mm)", gecirgenlik: 0.86},
        cam11: { Ad: "Düz Cam (12mm)", gecirgenlik: 0.85},
        cam12: { Ad: "Düz Cam (15mm)", gecirgenlik: 0.83},
        cam13: { Ad: "Hat Dışı kaplamalı Isı ve Güneş Kontrolü", gecirgenlik: 0.49},
        cam14: { Ad: "Yalınkat Camlar -Yeşil(4mm)", gecirgenlik: 0.78},
        cam15: { Ad: "Yalınkat Camlar -Füme(4mm)", gecirgenlik: 0.57},
        cam16: { Ad: "Yalınkat Camlar -Bronz(4mm)", gecirgenlik: 0.61},
        cam17: { Ad: "Yalınkat Camlar -Mavi(4mm)", gecirgenlik: 0.66},
        cam18: { Ad: "Yalınkat Camlar -Yeşil(6mm)", gecirgenlik: 0.72},
        cam19: { Ad: "Yalınkat Camlar -Füme(6mm)", gecirgenlik: 0.44},
        cam20: { Ad: "Yalınkat Camlar -Bronz(6mm)", gecirgenlik: 0.5},
        cam21: { Ad: "Yalınkat Camlar -Mavi(6mm)", gecirgenlik: 0.55},
        cam22: { Ad: "Yalınkat Camlar -Yeşil(8mm)", gecirgenlik: 0.68},
        cam22: { Ad: "Yalınkat Camlar -Füme(8mm)", gecirgenlik: 0.35},
        cam23: { Ad: "Yalınkat Camlar -Bronz(8mm)", gecirgenlik: 0.41},
        cam24: { Ad: "Yalınkat Camlar -Mavi(8mm)", gecirgenlik: 0.48},
        cam25: { Ad: "Isı Yalıtımlı -Yeşil", gecirgenlik: 0.64},
        cam26: { Ad: "Isı Yalıtımlı -Füme", gecirgenlik: 0.39},
        cam27: { Ad: "Isı Yalıtımlı -Bronz", gecirgenlik: 0.45}
    }
        
}