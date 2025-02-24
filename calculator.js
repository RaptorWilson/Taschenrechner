const screenExpression = document.getElementById("term");
const screenInput = document.getElementById("input");
const listOfNumberBtns = document.querySelectorAll("button.number");
const dotBtn = document.getElementById("dot");
const zeroBtn = document.getElementById("zero");
const memoryBtn = document.getElementById("memory-btn");
const memoryBox = document.getElementById("memory-box");
let hasDot = 0;
let listOfInputs = [];
let ans = 0;

// idee von diesem Branch ist es eine neue Implementierung von screenExpression zu erstellen
// die auf basis von listOfInputs dynamisch generiert wird
// bisher funtioniert das hinzufügen so, es wird der liste hinzugefügt wenn ein operator gedrückt wird
// dafür eine funktion erstellen die das tut.
// dazu gehört auch ein update von listOfInputs

const updateScreenExpression = () => {
    screenExpression.textContent = listOfInputs.join(" ");
};


listOfNumberBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        screenInput.textContent += btn.textContent
    })})


dotBtn.addEventListener("click", () => {
    if (hasDot === 0) {
        screenInput.textContent += dotBtn.textContent;
    }
});


zeroBtn.addEventListener("click", () => {
    // verhindert doppete nullen wie 00 oder 000
    if (screenInput.textContent === "0") {
        return
    }
    screenInput.textContent += "0";
})


const addInputToList = (input) => {
    listOfInputs.push(input);
};


const clearInput = () => screenInput.textContent = "";








const listOfOperators = ["+","-","x","/"]; 
const operatorBtns = document.querySelectorAll("button.operatoren");
    //wie kann ich hier die btn auf eine handler funktion schicken die auch den btn input mitnimmt
operatorBtns.forEach((btn) => {btn.addEventListener("click", () => {
    // falls eine zahl davor eingegeben wurden, diese der liste hinzufügen und input zurücksetzen
    if (screenInput.textContent !== "") {
        addInputToList(screenInput.textContent);
        clearInput();
    }
    // falls probiert wird einen zweiten operator hinzuzufügen, wird der alte gelöscht außnahme ist "-" den damit wollen wir negative zahlen auch darstellen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && btn.textContent !== "-") {
        listOfInputs.pop();
    }
    if (listOfInputs[l])

    // operator der liste hinzufügen und screenExpression updaten
    addInputToList(btn.textContent);
    updateScreenExpression();
})})


const handleACBtn = () => {
    // alles zurcüksetzten
    screenInput.textContent = "";
    screenExpression.textContent = "";
    listOfInputs = [];
    hasDot = 0;
    ans = 0;
    memoryBox.innerHTML = "";
    ungeschlosseneKlammern = 0;
};


// AC button eventListener
const ACBtn = document.getElementsByClassName("AC");
ACBtn[0].addEventListener("click", handleACBtn)


const handleBrackets = (list) => {
    var listOfOpenBrackets = [];
    var shortList = [];
    for (let i = 0; i < list.length; i ++) {
        //falls der input eine Schließendeklammer ist, wollen wir alle vorherigen inputs bis zur letzten 
        // Öffnendenklammer in einer Subliste speichern und die mithilfe von punkt- und strichOperation 
        // berechnen, dann gilt die Klammer als aufgelöst, weshalb sie mit dem Ergebnis ersetzt werden kann.
        //die benutzte Öffnendeklammer muss noch aus der list der Öffnendenklammern gelöscht werden
        if (list[i] === ")") {
            var lastOpenBracket = listOfOpenBrackets[listOfOpenBrackets.length - 1];
            var subList = shortList.slice(lastOpenBracket + 1, shortList.length);
            console.log("berechne subList:", subList)
            subList = punktOperationen(subList);
            subList = strichOperationen(subList);
            console.log("subList Ergebnis:",subList[0]);
            if (lastOpenBracket === 0){
                shortList = subList
            } else {
                shortList = shortList.slice(0,lastOpenBracket)
                shortList.push(subList[0]);
            }
            console.log("shortList innen" , shortList);
            listOfOpenBrackets.pop();
            continue
        } 
        //input der shortList hinzufügen
        shortList.push(list[i]);
        //falls es eine Öffnendeklammer ist wollen wir die in der listOfOpenBrackets speichern.
        if (shortList[shortList.length - 1] === "(") {
            listOfOpenBrackets.push(shortList.length - 1);
        } 
    }
    //am ende kommt eine liste von Übrigen inputs zurück, die keine klammern mehr beinhalten sollte.
    return shortList
}


const punktOperationen = (list) => {
    let shortList = []
    for (let i = 0; i < list.length; i ++) {
        shortList.push(list[i]);
        if (shortList.length > 2) {
            let firstNumber = shortList[shortList.length - 3];
            let operator = shortList[shortList.length - 2];
            let secondNumber = shortList[shortList.length - 1];
            if (operator === "x") {
                var solution = multi(firstNumber, secondNumber);
                shortList.pop();
                shortList.pop();
                shortList[shortList.length - 1] = solution;
            }
            if (operator === "/") {
                var solution = divide(firstNumber, secondNumber);
                shortList.pop();
                shortList.pop();
                shortList[shortList.length - 1] = solution
            } 
        } 
    }
    return shortList
}


const strichOperationen = (list) => {
    let shortList = [];
    for (let i = 0; i < list.length; i ++) {
        shortList.push(list[i]);
        if (shortList.length > 2) {
            let firstNumber = shortList[shortList.length - 3];
            let operator = shortList[shortList.length - 2];
            let secondNumber = shortList[shortList.length - 1];
            if (operator === "+") {
                var solution = ad(parseFloat(firstNumber), parseFloat(secondNumber));
                shortList.pop();
                shortList.pop();
                shortList[shortList.length - 1] = solution;
            }
            if (operator === "-") {
                var solution = sub(firstNumber, secondNumber);
                shortList.pop();
                shortList.pop();
                shortList[shortList.length - 1] = solution
            } 
        }
    }
    return shortList
}


const divide = (x, y) =>  x / y; 
const multi = (x, y) => x * y;
const ad = (x , y) => x + y;
const sub = (x, y) => x - y;


const equalsBtn = document.getElementById("equals");
// funktion von = button
const handleEquals = () => {
    // controllieren ob überhaupt zu rechnen ist, falls nicht abbrechen
    if (listOfInputs.length < 2) {
        return
    };

    // schauen ob es eine unaufgelistete zahl, diese dann zur liste hinzufügen, screenInput wieder leeren um wiederholtes "=" drücken das selbe noch mal zählen lassen 
    if (screenInput.textContent.length !== 0) {
        addInputToList(screenInput.textContent);
        clearInput();
    }
    // schauen ob letzter input ein operator war, falls ja diesen löschen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1])) {
        //oder eine delete and update funktion und vielleicht die add funktion auch updaten lassen
        listOfInputs.pop();
    }
    updateScreenExpression();

    // überprüfen ob alle klammern zu sind, wenn nicht einfach ranhängen
    if (übrigeOffeneKlammern !== 0) {
        console.log("vergessene Klammern:", übrigeOffeneKlammern);
        for (let i = übrigeOffeneKlammern; i > 0; i --) {
            listOfInputs.push(")");
            screenExpression.textContent += " )";
        }
    }
    const antwort = berechnen(listOfInputs);
    antwortAnzeigenUndWeiterRechnenVorbereiten(antwort);
}
equalsBtn.addEventListener("click", handleEquals)


const berechnen = (list) => {

    // berechnung beginnen
    console.log("listOfInputs", list)
    list = handleBrackets(list);
    console.log("after brackets", list);   

    //erstmal punkt operationen behandeln
    list = punktOperationen(list);
    console.log("nach punkt", list);

    //strich Operationen behandlen
    list = strichOperationen(list);
    console.log("nach strich", list);

    return list[0]
}  


const antwortAnzeigenUndWeiterRechnenVorbereiten = (zahl) => {
    ans = 1;
    screenExpression.textContent += " = " + zahl;
    memoryBox.innerHTML += `<div class="memory"> ${screenExpression.textContent} </div>` ;
    listOfInputs = [zahl.toString()];
}

const handleMemoryBtnClick = () => {
    // box anzeigen lassen 
    if (memoryBox.style.display === "none" || memoryBox.style.display === "") {
        memoryBox.style.display = "block";
    //box verstecken
    } else {
        memoryBox.style.display = "none";
}};


memoryBtn.addEventListener("click", handleMemoryBtnClick);


const redoBtn = document.getElementById("redo");
//  redo soll entweder den letzten input in der Liste löschen oder die zahl um einen verkleinern also ["2", "+", "4", "-"] -> ["2", "+", "4"] oder ["2,454"] -> []
//  screenInput = 2,45 also gewünschtes verhalten  
const handleRedo = () => {
    if (screenInput.textContent !== "") {
        screenInput.textContent = screenInput.textContent.slice(0,-1)

    }
    else  {
        let lastInput = listOfInputs.pop();
        console.log(lastInput)
        screenInput.textContent = lastInput.slice(0,-1);
    }
    updateScreenExpression();
};


redoBtn.addEventListener("click", handleRedo);

const klammerAufBtn = document.getElementById("klammer-auf");
var ungeschlosseneKlammern = 0;
const klammerZuBtn = document.getElementById("klammer-zu");


klammerAufBtn.addEventListener("click", () => {
    //letzten input falls es eine zahl war der Liste hinzufügen und den screenInput leeren, das bedeutet auch das eine implizites "x" vorhanden ist
    if (screenInput.textContent !== "") {
        addInputToList(screenInput.textContent);
        clearInput();
        addInputToList("x");
    }
    ungeschlosseneKlammern += 1
    addInputToList("(");
    updateScreenExpression();
});


klammerZuBtn.addEventListener("click", () => {
    if (screenInput.textContent !== "") {
        addInputToList(screenInput.textContent);
        clearInput();
    }
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1])) {
        listOfInputs.pop();
    }
    ungeschlosseneKlammern -= 1;
    addInputToList(")");
    updateScreenExpression();
});
