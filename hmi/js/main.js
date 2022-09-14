

REX.HMI.init = function () {
    // Zde se doplní registrace čtení hodnot s targetu
    REX.HMI.addItems([
        { alias: "Fi1", cstring: "mic.TRND:u1" },
        { alias: "dFi1", cstring: "mic.TRND:u2" },
        { alias: "Fi2", cstring: "mic.TRND:u3" },
        { alias: "dFi2", cstring: "mic.TRND:u4" },
        { alias: "restart", cstring: "mic.MP_INTEG_RST:BSTATE", write: true },
        { alias: "MPoc", cstring: "mic.CNR_y0:ycn", write: true },
        { alias: "stouchnuti", cstring: "mic.MP_NUDGE:BSTATE", write: true },
        { alias: "PORUCHA", cstring: "mic.CNB_DISTRB:YCN", write: true },
        { alias: "poruchalevel", cstring: "mic.SGI:amp", write: true }
        
        
    ]);

    var spool = document.querySelector("#spool");
    var ball_circle = document.querySelector("#ball_circle");
    var ball = document.querySelector("#ball");

    // zobrazeni hodnoty natoceni spulky + rotace mice a spulky
    let fi1Input = document.getElementById('Fi1');
    REX.HMI.get('Fi1').on('change',function(itm){
        let value = radians_to_degrees(itm.getValue());
        // Konverze číselné hodnoty na string s třemi desetinnými místy
        value = value.toFixed(3);
        fi1Input.innerHTML = value  + " deg";
        rotate(spool, value);
        rotate(ball, -value);
    });

    // zobrazeni hodnoty rychlosti otaceni spulky
    let dFi1Input = document.getElementById('dFi1');
    REX.HMI.get('dFi1').on('change',function(itm){
        let value = radiansPerSecond_to_DegreesPerSecond(itm.getValue());
        // Konverze číselné hodnoty na string s třemi desetinnými místy
        value = value.toFixed(3);
        dFi1Input.innerHTML = value + " deg/s";
    });

    // zobrazeni hodnoty polohy stredu mice vzhledem ke stredu spulky + natocei mice vzhledem ke stredu spulky
    let Fi2Input = document.getElementById('Fi2');
    REX.HMI.get('Fi2').on('change',function(itm){
        let value = radians_to_degrees(itm.getValue());
        // Konverze číselné hodnoty na string s třemi desetinnými místy
        value = value.toFixed(3);
        Fi2Input.innerHTML = value + " deg";
        rotate(ball_circle, value);
    });

    // zobrazeni rychlosti padani mice
    let dFi2Input = document.getElementById('dFi2');
    REX.HMI.get('dFi2').on('change',function(itm){
        let value = radiansPerSecond_to_DegreesPerSecond(itm.getValue());
        // Konverze číselné hodnoty na string s třemi desetinnými místy
        value = value.toFixed(3);
        dFi2Input.innerHTML = value + " deg/s";
    });

    // tlacitko restart + nastaveni pocatecnich hodnot
    let restart = document.getElementById('restart')
    let pocatekMice = document.getElementById('pocatekMice')
    restart.addEventListener('click', function (event) {
        let pocatek
        if (pocatekMice.value < -33) {
            pocatek = degrees_to_radians(-33);
            pocatekMice.value = -33
        } else if (pocatekMice.value > 33) {
            pocatek = degrees_to_radians(33)
            pocatekMice.value = 33
        } else {
            pocatek = degrees_to_radians(Number(pocatekMice.value));
        }
        REX.HMI.get('restart').write(true);
        REX.HMI.get('MPoc').write(pocatek);
        REX.HMI.get('PORUCHA').write(true)
        REX.HMI.get('poruchalevel').write(0.05)
        document.getElementById('levelRuseni').value="male";
    })
    
    // tlacitko na stouchnuti
    let stouchnuti = document.getElementById('stouchnuti')
    stouchnuti.addEventListener('click', function (event) {
        REX.HMI.get('stouchnuti').write(true);
    })
    
    // tlacitko na šum + select menu intenzity šumu
    let rusit = document.getElementById('rusit')
    rusit.addEventListener('click', function (event) {
        let levelRuseni = document.getElementById('levelRuseni').value
        switch(levelRuseni) {
            case "zadne":
                REX.HMI.get('PORUCHA').write(false)
                break;
            case "male":
                REX.HMI.get('PORUCHA').write(true)
                REX.HMI.get('poruchalevel').write(0.05)
                break;
            case "stredni":
                REX.HMI.get('PORUCHA').write(true)
                REX.HMI.get('poruchalevel').write(0.1)
                break;
            case "velke":
                REX.HMI.get('PORUCHA').write(true)
                REX.HMI.get('poruchalevel').write(0.15)
                break;
            default:
                REX.HMI.get('PORUCHA').write(false)
}
    })
    
};

function radians_to_degrees(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}

function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

function radiansPerSecond_to_DegreesPerSecond(rad) { 
    return rad * 57.29578
}

// Rotace elementu dle stredu
function rotate(svgElement, angle) {
    svgElement.style.transform = "rotate(" + angle + "deg" + ")";
}