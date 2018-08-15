function Øopr(Øs,Øair){
    return 0.7*Øs+0.3*Øair
}
//Øs=Øair(Htris+Hve)-(Hve-Øsup)-Htris-Φia
function Øs(Øair,Htris,Hve,Øsup,Φia){
    return Øair*(Htris+Hve)-(Hve-Øsup)-Htris-Φia
}
// Hve 26. sayfada


/**
 *  İç yüzey ve kütle arasında ısı geçiş katsayısı
 *  Htr,ms = hms . Am
 *  hms = 9,1 W/m²K sabit 
 *  Am  = Tablo 1.1’ deki 3 değer zone kaydı yapılırken alınarak Am için kullanılır. 
 *  
 */
 function Htrms(Am) {
     return (9.1*Am);
 }