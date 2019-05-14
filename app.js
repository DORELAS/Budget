// Moduli qe kontrollon te dhenat
// THIS VARIABLE IS AN IMMEDIATELY INVOKED FUNCTION EXPRESSION IiFE THAT RETURNS AN OBJECT
var kontroll_buxheti = (function() {
    //Konstruktori i te ardhurave
      var ardhura = function(id, permbajtje, leke) {
          this.id = id;
          this.permbajtje = permbajtje;
          this.leke = leke;
      };
      //Konstruktori i shpenzimeve
      var shpenzime = function(id, permbajtje, leke) {
        this.id = id;
        this.permbajtje = permbajtje;
        this.leke = leke;
        this.perqindje = -1;
    };
shpenzime.prototype.gjejPerqindje = function (ardhuraTotale) {
    if(ardhuraTotale > 0 ) {
     this.perqindje = Math.round((this.leke / ardhuraTotale) * 100);
    } else {
        this.perqindje = -1;
    }
};
shpenzime.prototype.merr_perqindje = function() {
    return this.perqindje;
};
var shuma = function(tipi) {
    var shume = 0;

    dhena.elem[tipi].forEach(function(current) {
        shume += current.leke;
    });
dhena.total[tipi] = shume;
};

var dhena = {
        elem: {
            shp: [],
            adh: []
        },
        total: {
            shp: 0,
            adh: 0
        },
        buxhet: 0,
        perqindje: -1
    };

return {
    shtoElem: function(tipi, permb, vl) {
         var element, ID;
         //Vlera e id ne baze te elementeve te bashkesive dhe veprimet me ta
         if( dhena.elem[tipi].length > 0 ) {
         ID =  dhena.elem[tipi][ dhena.elem[tipi].length - 1].id + 1;
          } else { ID = 0;  }
         //Krijimi i nje elementi te ri duke u bazuar ne tipin 'inc' ose 'exp'
         if(tipi === 'shp') {
             element = new shpenzime(ID, permb, vl);
         } else if(tipi === 'adh') {
              element = new ardhura(ID, permb, vl);
         }
         //Te dhenat e marra i vendosim ne bashkesine e objeketeve
          dhena.elem[tipi].push(element);
         //Rikthejme vleren e elementtit te ri
          return element;
    },

    fshiVlere: function(tipi, id) {
       var ids, index;

       ids = dhena.elem[tipi].map(function(current) {
        return current.id;
       });

       index = ids.indexOf(id);

       if(index !== -1) {
           dhena.elem[tipi].splice(index, 1);
       }
    }, 

 Veprime: function() {

    // 1. Veprimet pr shumen e te ardhurave dhe shpenzimeve
    shuma('adh');
    shuma('shp');
    // 2. Gjejme buxhetin : te ardhura - shpenzime
    dhena.buxhet = dhena.total.adh - dhena.total.shp;
    // 3. Gjejme % e shpenzimeve te bera
    if (dhena.total.adh > 0) {
    dhena.perqindje = Math.round((dhena.total.shp / dhena.total.adh) * 100);   }
    else { dhena.perqindje = -1; }
 },

 veprimePerqindje: function() {
dhena.elem.shp.forEach(function(current) {
current.gjejPerqindje(dhena.total.adh);
});
 },

 merr_perqindjet: function() {
     var perqTotale = dhena.elem.shp.map(function(current) {
         return current.merr_perqindje();
     });
     return perqTotale;
 },

marrBuxhetin: function() {
    return {
        buxheti: dhena.buxhet,
        totaliArdhurave: dhena.total.adh,
        totaliShpenzimeve: dhena.total.shp,
        perqindje: dhena.perqindje
    };
},
// Testim
testim: function() {
       console.log(dhena);
},
};
})();

//Moduli qe kontrollon user interface
var kontroll_UI = (function() {
// Vendosim nje emer per emrat e klasave te marra
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
  var  formatNumer = function(numer, tipi) {
        var numSplit, int, dec, tipi, shenja;
            numer = Math.abs(numer);
            numer = numer.toFixed(2);
        
            numSplit = numer.split('.');
            int = numSplit[0];
            if(int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
            }
            dec = numSplit[1];
            if(tipi === 'shp') { shenja = '-';}
            else {shenja = '+'; }

           return shenja + ' ' + int + '.' + dec;
        };

    var nodeList = function(liste, callback) {
        for(var i = 0; i < liste.length; i++) {
            callback(liste[i], i);
        }
  };
    return {
        get_vlera: function() {
            return {
                tipi: document.querySelector(DOMstrings.inputType).value, // Marrim shenjen nga te dhenat
                pershkrim: document.querySelector(DOMstrings.inputDescription).value, //Marrim pershkrimin nga te dhenat
                //Marrim vleren e lekeve ne string prandaj nepermjet parseFloat e kthejme ne numer
                vlera: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            };
        },

        shtoListeElem: function(obj, tipi) {
             var html, htmlRe, element;
             // Vendosim tekstin ne kod html marre nga faqja index se bashku me placeholder me tekst
             if(tipi === 'adh') {
                 element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="adh-%id%"><div class="item__description">%permbajtje%</div><div class="right clearfix"><div class="item__value">%leke%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
             } else if(tipi === 'shp') {
                 element = DOMstrings.expensesContainer;

            html = ' <div class="item clearfix" id="shp-%id%"><div class="item__description">%permbajtje%</div><div class="right clearfix"><div class="item__value">%leke%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
             }
             // Tekstin e placeholder e zevendesojme me tekstin e vendosur nga ne
            htmlRe = html.replace('%id%', obj.id);
            htmlRe = htmlRe.replace('%permbajtje%', obj.permbajtje);
            htmlRe = htmlRe.replace('%leke%', formatNumer(obj.leke, tipi));
            // Vendosim html ne DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', htmlRe);
        },  
    //Metoda qe fshin element 
    FshijmeElemListe: function(zgjedhesiID) {
        var el = document.getElementById(zgjedhesiID);
        el.parentNode.removeChild(el);
    },  

        //Funksioni qe ka per qellim te pastroj fushen pasi eshte ruajtur e dhena.
        pastroFushe: function() {
            var fushe, fusheBashkesi;
            fushe = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        // Te dhenen e ruajme si nje bashkesi pasi eshte e ruajtur ne formen e nje liste.
            fusheBashkesi = Array.prototype.slice.call(fushe);
            fusheBashkesi.forEach(function(current, index, array) {
                current.leke = "";
            });
           fusheBashkesi[0].focus();
        },

        shfaqBuxhet: function(obj) {
            var tipi;
            obj.buxhet > 0 ? tipi = 'adh' : tipi = 'shp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumer(obj.buxheti, tipi);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumer(obj.totaliArdhurave, 'adh');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumer(obj.totaliShpenzimeve, 'shp');
            if(obj.perqindje > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.perqindje + '%'; 
            } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
shfaqPerqindje: function(perqindja) {
    var fush = document.querySelectorAll(DOMstrings.expensesPercLabel);


    nodeList(fush, function(current, index) {
        if(perqindja[index] > 0) {
            current.textContent = perqindja[index] + '%';
        } else {
            current.textContent = '---';
        }
    });
},
shfaqMuaj: function() {
    var viti, tani, muaj;
    tani = new Date();
    muajViti = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nentor', 'Dhjetor'];
    muaj = tani.getMonth();
    viti = tani.getFullYear();
    document.querySelector(DOMstrings.dateLabel).textContent = muajViti[muaj] + ' ' + viti;
},
ndryshoTip: function() {
    var fushe = document.querySelectorAll(DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
    nodeList(fushe, function(current) {
         current.classList.toggle('red-focus');
    });
    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
},
    // Bejme publike variablin DOMstrings per te gjithe
        get_variabla: function() {
            return DOMstrings;
        }
    }
})();

//Moduli i kontrollorit te gjithe aplikacionit
//Kryen lidhjen ndermjet modulit te UI dhe modulit te buxhetit  me njeri tjetrin duke i kaluar dy modulet si paramera
var kontroll_applikacioni = (function(buxhetCtrl, UICtrl) {

    // Eventet te grupuarane nje funksion te vetem
    var eventePerfshires = function() {

    // Marrim vlerat e variablit DOMstrings
        var dom = UICtrl.get_variabla();

    document.querySelector(dom.inputBtn).addEventListener('click', ctrlShtoElem);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
           ctrlShtoElem();
        }
});
   document.querySelector(dom.container).addEventListener('click', ctrlFshiElem);
   document.querySelector(dom.inputType).addEventListener('change', UICtrl.ndryshoTip);
    };

    var updateBuxheti = function() {
    // 1. Kryejme veprimet me te dhenat e marra
    buxhetCtrl.Veprime();
    // 2. Kryejme veprimet per gjetjen e shumes
    var buxheti = buxhetCtrl.marrBuxhetin();
    // 3. I paraqesim te dhenat ne UI
    UICtrl.shfaqBuxhet(buxheti);
    };

var updatePerqindje = function() {
    // 1. Gjejme perqindjet 
    buxhetCtrl.veprimePerqindje();
    // 2. Lexojme perqindjet nga buxheti i kontrollit
    var prq = buxhetCtrl.merr_perqindjet();
    // 3. Update user interface me perqindjet e reja
    UICtrl.shfaqPerqindje(prq);
};

    var ctrlShtoElem = function() {
        var vlere_marre, elemRi;
    // 1. Marrim te dhenat e vendosura
     vlere_marre =  UICtrl.get_vlera();
     if(vlere_marre.pershkrim !== '' && vlere_marre.vlera > 0 && !isNaN(vlere_marre.vlera))  {
    // 2. Vendosim te dhenat ne Modulin e buxhetit
     elemRi = buxhetCtrl.shtoElem(vlere_marre.tipi, vlere_marre.pershkrim, vlere_marre.vlera);
    // 3. Te dhenat i paraqesim ne UI
     UICtrl.shtoListeElem(elemRi, vlere_marre.tipi);
    // 4. Pstrojme fushat ku shkruajtem 
     UICtrl.pastroFushe();
    // 5. Gjejme dhe update buxhetin
     updateBuxheti(); 
    // 6. Gjejme dhe update i perqindjes 
     updatePerqindje();
     }
    };

    var ctrlFshiElem = function(event) {
       var elemID, ndajID, ID, tipi;

       elemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(elemID) {
        ndajID = elemID.split('-');
        tipi = ndajID[0];
        ID = parseInt(ndajID[1]);

        // 1. Fshijme te dhenen nga struktura 
        buxhetCtrl.fshiVlere(tipi, ID);
        // 2. Fshijme te dhenen nga User Interface
        UICtrl.FshijmeElemListe(elemID);
        // 3. Update dhe japim buxhetin e ri 
        updateBuxheti();
        // 4. Gjejme dhe update perqindjen
        updatePerqindje();
    }
    };

    return {
      init: function() {
          UICtrl.shfaqBuxhet({
            buxheti: 0,
            totaliArdhurave: 0,
            totaliShpenzimeve: 0,
            perqindje: -1
          });
          UICtrl.shfaqMuaj();
          eventePerfshires();
      }
    };
})(kontroll_buxheti, kontroll_UI);

kontroll_applikacioni.init();
