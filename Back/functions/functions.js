

function Øopr(Øs,Øair){
    return 0.7*Øs+0.3*Øair
}
//Øs=Øair(Htris+Hve)-(Hve-Øsup)-Htris-Φia
function Øs(Øair,Htris,Hve,Øsup,Φia){
    return Øair*(Htris+Hve)-(Hve-Øsup)-Htris-Φia
}

