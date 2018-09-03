/*
Her bir zonun aydınlatılması için harcanan enerji

Wly: tamamen yapay aydınlatma varsa
Wld: Yapay+ doğal aydınlatma (pencere varsa)
tk :Her bir zon için yıllık kullanım süresi (günlük çalışma saati x haftalık iş günü x yılda çalışılan hafta sayısı) 
*/
/**
 * 
 * @param {*} windows pencere sayısı
*/

function Wt (windows){
    var Wly = (Pa *tk * 1/Fc * Fo )/1000
 if (windows == 0){
     return Wly + Wp
 }
 else {
     return Wld + Wp
 }
}
