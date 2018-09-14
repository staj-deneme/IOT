module.exports =  {
    tablo_1_10: [{
        name: "Duvarlarda çatlak, kapı ve pencere yok",
        value: 0
    }, {
        name: "Duvarlarda çatlak yok, kapı ve pencerelerin sızdırmazlığı yüksek ",
        value: 0.5
    }, {
        name: "Duvarlarda çatlak çok az ",
        value: 1
    }, {
        name: "Hava sızdırmazlığı orta seviyede ",
        value: 3
    }, {
        name: "Hava sızdırmazlığı çok kötü ",
        value: 10
    }],
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
    },

    tablo3_1: {
        tip1: { Rsi: 0.13, Rse: 0.04 },
        tip2: { Rsi: 0.13, Rse: 0.08 },
        tip3: { Rsi: 0.13, Rse: 0 },
        tip4: { Rsi: 0.17, Rse: 0 },
        tip5: { Rsi: 0.17, Rse: 0.17 },
        tip6: { Rsi: 0.17, Rse: 0 },
        tip7: { Rsi: 0.13, Rse: 0.08 },
        tip8: { Rsi: 0.17, Rse: 0.04 },
        tip9: { Rsi: 0.13, Rse: 0.13 },
        tip10: { Rsi: 0.13, Rse: 0.13 },
        tip11: { Rsi: 0.13, Rse: 0.04 }
    },
    tablo3_2 : {
        dusey: [
            { min: 0.1, max: 10 ,Rgap:0.14},
            { min: 11, max: 20, Rgap:0.16},
            { min: 21, max: 50, Rgap:0.18},
            { min: 51, max: 100, Rgap: 0.17},
            { min: 100, max: 999999999999999999, Rgap: 0.16}
        ],
        yatay: [
            {min: 0.1, max:10, Rgap: 0.14},
            {min: 11, max:20, Rgap: 0.15},
            {min: 20, max:9999999999999999, Rgap:0.16}
        ]
    },
    
    

    tablo9_1: {
        C1: { Ad: "Çatı", Ψe: 0.55, Ψoi: 0.75, Ψi: 0.75 },
        C2: { Ad: "Çatı", Ψe: 0.5, Ψoi: 0.75, Ψi: 0.75 },
        C3: { Ad: "Çatı", Ψe: 0.4, Ψoi: 0.75, Ψi: 0.75 },
        C4: { Ad: "Çatı", Ψe: 0.4, Ψoi: 0.65, Ψi: 0.65 },
        C5: { Ad: "Çatı", Ψe: 0.6, Ψoi: 0.8, Ψi: 0.8 },
        C6: { Ad: "Çatı", Ψe: 0.5, Ψoi: 0.7, Ψi: 0.7 },
        C7: { Ad: "Çatı", Ψe: 0.65, Ψoi: 0.85, Ψi: 0.85 },
        C8: { Ad: "Çatı", Ψe: 0.45, Ψoi: 0.7, Ψi: 0.7 },
        C9: { Ad: "Çatı", Ψe: -0.05, Ψoi: 0.15, Ψi: 0.15 },
        C10: { Ad: "Çatı", Ψe: 0, Ψoi: 0.2, Ψi: 0.2 },
        C11: { Ad: "Çatı", Ψe: 0.05, Ψoi: 0.25, Ψi: 0.25 },
        C12: { Ad: "Çatı", Ψe: 0.15, Ψoi: 0.4, Ψi: 0.4 },
        B1: { Ad: "Balkon", Ψe: 0.95, Ψoi: 0.95, Ψi: 1.05 },
        B2: { Ad: "Balkon", Ψe: 0.95, Ψoi: 0.95, Ψi: 1.05 },
        B3: { Ad: "Balkon", Ψe: 0.9, Ψoi: 0.9, Ψi: 1 },
        B4: { Ad: "Balkon", Ψe: 0.7, Ψoi: 0.7, Ψi: 0.8 },
        AK1: { Ad: "Asma Kat", Ψe: 0, Ψoi: 0, Ψi: 0.1 },
        AK2: { Ad: "Asma Kat", Ψe: 0.95, Ψoi: 1.05, Ψi: 1.05 },
        AK3: { Ad: "Asma Kat", Ψe: 0.9, Ψoi: 1, Ψi: 1 },
        AK4: { Ad: "Asma Kat", Ψe: 0.7, Ψoi: 0.8, Ψi: 0.8 },
        AK5: { Ad: "Asma Kat", Ψe: 0.6, Ψoi: 0.65, Ψi: 0.65 },
        AK6: { Ad: "Asma Kat", Ψe: 0.9, Ψoi: 1, Ψi: 1 },
        AK7: { Ad: "Asma Kat", Ψe: 0.7, Ψoi: 0.8, Ψi: 0.8 },
        AK8: { Ad: "Asma Kat", Ψe: 0.45, Ψoi: 0.6, Ψi: 0.6 },
        TUD1: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.65, Ψoi: 0.8, Ψi: 0.8 },
        TUD2: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.6, Ψoi: 0.75, Ψi: 0.75 },
        TUD3: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.55, Ψoi: 0.7, Ψi: 0.7 },
        TUD4: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.5, Ψoi: 0.65, Ψi: 0.65 },
        TUD5: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.6, Ψoi: 0.75, Ψi: 0.75 },
        TUD6: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.45, Ψoi: 0.6, Ψi: 0.6 },
        TUD7: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: -0.05, Ψoi: 0.1, Ψi: 0.1 },
        TUD8: { Ad: "Toprak Üstü Yüzer Döşeme", Ψe: 0.05, Ψoi: 0.2, Ψi: 0.2 },
        AGK1: { Ad: "Asma Giriş Kat", Ψe: 0.75, Ψoi: 0.95, Ψi: 0.95 },
        AGK2: { Ad: "Asma Giriş Kat", Ψe: 0.65, Ψoi: 0.85, Ψi: 0.85 },
        AGK3: { Ad: "Asma Giriş Kat", Ψe: 0.55, Ψoi: 0.75, Ψi: 0.75 },
        AGK4: { Ad: "Asma Giriş Kat", Ψe: 0.5, Ψoi: 0.7, Ψi: 0.7 },
        AGK5: { Ad: "Asma Giriş Kat", Ψe: 0.6, Ψoi: 0.8, Ψi: 0.8 },
        AGK6: { Ad: "Asma Giriş Kat", Ψe: 0.45, Ψoi: 0.65, Ψi: 0.65 },
        AGK7: { Ad: "Asma Giriş Kat", Ψe: -0.1, Ψoi: 0.1, Ψi: 0.1 },
        AGK8: { Ad: "Asma Giriş Kat", Ψe: 0, Ψoi: 0.2, Ψi: 0.2 },
        KL1: { Ad: "Kolon", Ψe: 1.3, Ψoi: 1.3, Ψi: 1.3 },
        KL2: { Ad: "Kolon", Ψe: 1.2, Ψoi: 1.2, Ψi: 1.2 },
        KL3: { Ad: "Kolon", Ψe: 1.15, Ψoi: 1.15, Ψi: 1.15 },
        KL4: { Ad: "Kolon", Ψe: 0.9, Ψoi: 0.9, Ψi: 0.9 },

    }
}
