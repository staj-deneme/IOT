function Øopr(Øs, Øair) {
    return 0.7 * Øs + 0.3 * Øair
}
//Øs=Øair(Htris+Hve)-(Hve-Øsup)-Htris-Φia
function Øs(Øair, Htris, Hve, Øsup, Φia) {
    return Øair * (Htris + Hve) - (Hve - Øsup) - Htris - Φia

}


/*Htris: İç yüzey ile iç ortam arasındakı ısı geçis katsayısı -syf:38
Htris = his*Atot
his : 3.45 (sabit katsayı)
Atot : bir zonu çevreleyen tüm iç yüzeylerin alanları toplamı 
*/
function Htris(Atot) {
    const his = 3.45
    return Atot * his
}

/* Htrop: Zonu çevreleyen opak yüzeylerin iletim ve taşınım ısı geçiş katsayısı -syf:10
  Aopi: Opak yüzeyin alanı, m^2
  Uopi: Opak bileşenin ısıl geçirgenlik katsayısı, W/(m²*K)
  Lopi: Doğrusal ısı köprüsü uzunluğu, m
  Ψoi: Doğrusal ısı köprüsü birim uzunluk başına ısı geçiş katsayısı, W/(m*K)

 Htrop= Σ Aopi*Uopi + Σ Lopi*Ψoi

  kod: ısı köprüsü tipi (tablo 9.1)
  opbil: opak bileşen dizisi
*/
function Htrop(kod) {
    var Uopi = Uopi();
    var sum= 0
 opbil.forEach(element =>{
     sum += ((element.Aopi)*Uopi) + (element*Lopi)*(tablolar.tablo9_1[kod.Ψoi])
 });
return sum
}

/*  Uopi: Opak bir bileşenin ısıl geçirgenlik katsayısı - syf:10
hsi: İç yüzey ısıl taşınım katsayısı, W/(m^2.K)
hse: Dış yüzey ısı taşınım katsayısı, W/(m^2.K)
dl: l nci malzemenin kalınlığı, m 
λhl: l nci malzemenin ısıl iletkenlik hesap değeri, W/(m.K)
Rgap: Opak bileşen malzemeleri arasındaki boşluğun ısıl direnci, m²K/W

Uopi = 1/(1/hsi + Σ dl/λhl + 1/hse +Rgap)

tip: yapı bileşen tipi (tablo 3.1)
yon: yatay/dusey (tablo 3.2)
bosluk_kal: boşluk kalınlığı (tablo 3.2)
malzeme : opak bileşenin oluştuğu malzeme dizisi
*/

function Uopi(tip,yon,bosluk_kal) {
    var hsi = 1 / (tablolar.tablo3_1[tip.Rsi])
    var hse = 1 / (tablolar.tablo3_1[tip.Rse])
    var sum = 0
    opbil.malzeme.forEach(element => {
        sum += (element.dl / element.λhl)
    });
    tablolar.tablo3_2[yon].forEach(element => {
        if(element.min <= bosluk_kal && element.max >=bosluk_kal){
         Rgap = element.Rgap
        }

    });
    return 1 / ((1 / hsi) + sum + (1 / hse) + Rgap)
}

/* Φia : İç hava sıcaklığına etki eden ısı kazanç miktarı 
*/
function Φia (){
    var Φint = ofisΦint(); 
    return 0.5* Φint
}

/* Ofis binalarında iç kazanç
 */
function ofisΦint (Np,Af,Φintlg){
 var Φintoc = 130*Np
 var ΦintAppunit
 var ΦintApp = Af*


}