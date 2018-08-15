function Building(name){
    this.name=name;
}

function Floor(number){
    Building.call(name);
    this.number=number;
}

function Zone(){
    Floor.call(name,number);
    this.wall={
        material,
        witdh
    };
    this.floorMat;//döşeme
    this.windows;
    this.properties={
        ema,//etkin kütle alanı/effective mass area
        hcs,//yüzeylerin etkin ısı kapasitesi//effective heat capacity of the surfaces
        htc={} //ısı geçiş katsayıları/heat transfer coefficients        
    };
    
}
