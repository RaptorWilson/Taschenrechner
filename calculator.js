const screenExpression = document.getElementById("term");
const screenInput = document.getElementById("input");
const listOfNumberButtons = document.querySelectorAll("button.number");
const dotBtn = document.getElementById("dot");
const zeroBtn = document.getElementById("zero");
const memoryBtn = document.getElementById("memory-btn");
const memoryBox = document.getElementById("memory-box");
let hasDot = 0;
let listOfInputs = [];
let ans = 0;

listOfNumberButtons.forEach((btn) => { 
    btn.addEventListener("click", () => {
        // führenden null löschen falls vorhanden
        if (screenInput.textContent[0] === "0" && hasDot === 0) {
            screenInput.textContent = "";
            screenExpression.textContent = screenExpression.textContent.slice(0,-1);
        }
        //operator verarbeiten und screenInput zurücksetzen
        if (operatorCount !== 0){
            resetCount();
        };
        // falls wir schon ein ergebis hatten, danach noch eine zahl drücken wird alles zurückgesetzt und nur der letzte input behalten
        if (ans === 1){
            handleACBtn();
        };
        screenInput.textContent += btn.textContent;
        screenExpression.textContent += btn.textContent;
});})

// dotBtn ist besonderes denn es darf nur einen punkt pro zahl geben sonst entstehen invalide zahlen. wie ..4 oder 0.1.2
    // man könnte .3 noch zu 0.3 umschreiben ist aber optional
dotBtn.addEventListener("click",() => {
    //falls operator der letzte input davor war und input reseten
    if (operatorCount !== 0){
        resetCount()
    }
    // ähnlich wie eine zahl direkt nach ergebnis, wird hier wieder zurückgesetzt
    if (ans === 1){
        handleACBtn();
    };
    // checken ob es noch keinen punkt gibt, denn können wir einen plazieren, sonst nicht
    if (hasDot === 0) {
    hasDot = 1;
    screenInput.textContent += ".";
    screenExpression.textContent += ".";
}})

// 0 ist besonders da man keine zahlen außer decimalzahlen mit 0 beginnen also ist 0123 entweder ungültig
// oder man lässt 0 einfach weg => 0 ersetzen falls allein und zahl gedrückt wird
zeroBtn.addEventListener("click", () => {
    //den operator speicher der list hinzufügen und counter resetten, input zurücksetzten
    if (operatorCount !== 0){
        resetCount()
    }
    if (ans === 1){
        handleACBtn();
    };
    //falls es eine zahl die nicht null ist schon gibt platzier 0 oder falls es mehrer zahlen schon gibt plazier 0
    if (screenInput.textContent.length > 1 || screenInput.textContent !== "0" ) {
        screenInput.textContent += "0";
        screenExpression.textContent += "0";
    }
})

// idee zu operator funktion, "-" abspalten damit weniger code notwendig oder zumindest mehr klarheit
var operatorCount = 0;
var lastOperatorCount = 0;
const listOfOperatoren = ["+", "-", "x", "/"]
const operatoren = document.querySelectorAll("button.operatoren");
operatoren.forEach((op) => {
    op.addEventListener("click", () => {
        // falls es schon ein ergebnis gab und wir damit weiterrechnen, damit aber die vorherige expression
        // mit dem ergebnis ersetzen
        if (ans === 1) {
            ans = 0;
            screenExpression.textContent = listOfInputs[0];
        }
        // hasDot zurücksetzen
        hasDot = 0;

        // falls screenInput.textContent kein operator ist und nicht leer ist, der liste der inputs hinzufügen
        if ( (!listOfOperatoren.includes(screenInput.textContent)) && screenInput.textContent !== "") {
            listOfInputs.push(screenInput.textContent);
        }

        if (listOfInputs[listOfInputs.length - 1] === "(") {
            return console.log("Error: Operator after open bracket")
        }
        // starten mit operator sollte nur gehen falls es um negation einer zahl geht, sonst fehler
        // sollte hier noch überarbeiten sodass minus getrennt ist
        // vorerst ignorieren
        if ((listOfInputs.length === 0 )) { // drei klammern entfernen sobald änderungen gemacht wurden
            //&& op.textContent !== "-") || screenExpression.textContent === " - " ) {
            return console.log("Error: Operator without number")
        }        

        //fall 1 kein operatorCount = 0 => einfach hinzufügen, leerzeichen für lesbarkeit, operatorCount erhöhen
        if (operatorCount === 0) {
            screenInput.textContent = op.textContent;
            screenExpression.textContent += " " + op.textContent + " ";
            operatorCount += 1;
        } // ein operator davor und jetztiges zeichen "-" => auch einfach hinzufügen, operatorCount erhöhen
        else if (operatorCount === 1 && op.textContent === "-") {
            screenInput.textContent = op.textContent;
            screenExpression.textContent += "-";
            operatorCount += 1;
        } // operatorCount = 1 und jetztiges vorzeichen nicht minus => letzten operator mit jetztigen ersätzen 
        else if (operatorCount === 1 && op.textContent !== "-") {
            screenInput.textContent = op.textContent;
            screenExpression.textContent = screenExpression.textContent.slice(0,-2) + op.textContent + " ";
        } // operatorCount = 2, jetztiger operator nicht minus => letzten beiden entfernen, jetztigen hinzufügen 
        else if (operatorCount === 2 && op.textContent !== "-") {
            screenExpression.textContent = screenExpression.textContent.slice(0, -3) + op.textContent + " ";
            screenInput.textContent = op.textContent;
            operatorCount = 1;
        }
    })
});

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

// funktion von = button
const equalsBtn = document.getElementById("equals");

const handleEquals = () => {
    // controllieren ob überhaupt zu rechnen ist, falls nicht abbrechen
    if (listOfInputs.length < 2) {
        return
    };
    // schauen ob letzter input ein operator war, falls ja diesen löschen
    if (listOfOperatoren.includes(screenInput.textContent)) {
        screenExpression.textContent.slice(0,-1);
    }
    // sonst ist es eine unaufgelistete zahl, diese dann zur liste hinzufügen, screenInput wieder leeren um wiederholtes "=" drücken das selbe noch mal zählen lassen 
    if (screenInput.textContent.length !== 0) {
        listOfInputs.push(screenInput.textContent);
        screenInput.textContent = "";
    }
    // überprüfen ob alle klammern zu sind, wenn nicht einfach ranhängen
    if (übrigeOffeneKlammern !== 0) {
        for (let i = übrigeOffeneKlammern; i > 0; i --) {
            listOfInputs.push(")");
            screenExpression.textContent += " )";
        }
    }

    const antwort = berechnen(listOfInputs);
    antwortAnzeigenUndWeiterRechnenVorbereiten(antwort);
}

equalsBtn.addEventListener("click", handleEquals)

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
            subList = punktOperationen(subList);
            subList = strichOperationen(subList);
            if (lastOpenBracket === 0){
                shortList = subList
            } else {
                shortList = shortList.slice(0,lastOpenBracket)
                shortList.push(subList[0]);
            }
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

const berechnen = (list) => {

    // berechnung beginnen
    list = handleBrackets(list);

    //erstmal punkt operationen behandeln
    list = punktOperationen(list);

    //strich Operationen behandlen
    list = strichOperationen(list);

    return list[0]
}  

const antwortAnzeigenUndWeiterRechnenVorbereiten = (zahl) => {
    ans = 1;
    screenExpression.textContent += " = " + zahl;
    memoryBox.innerHTML += `<div class="memory"> ${screenExpression.textContent} </div>` ;
    listOfInputs = [zahl];
}

// operator/en der liste hinzufügen, operatorCount zurücksetzten, screenInput leeren
const resetCount = () => {
    if (operatorCount === 1) {
        listOfInputs.push(screenInput.textContent);
        screenInput.textContent = "";
    } else {
        let firstNewOperator = screenExpression.textContent.charAt(screenExpression.textContent.length - 3);
        listOfInputs.push(firstNewOperator);
    }
    lastOperatorCount = operatorCount;
    operatorCount = 0;
}

const handleACBtn = () => {
    // alles zurcüksetzten
    screenInput.textContent = "";
    screenExpression.textContent = "";
    listOfInputs = [];
    hasDot = 0;
    operatorCount = 0;
    lastOperatorCount = 0;
    ans = 0;
    memoryBox.innerHTML = "";
    übrigeOffeneKlammern = 0;
};
// AC button eventListener
const ACBtn = document.getElementsByClassName("AC");
ACBtn[0].addEventListener("click", handleACBtn)

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
// den jetztigen input bearbeiten, davon die hinterste Zahl abschneiden erlaubt auch verändern des operators
// noch nicht sicher ob ich den redo button noch mächtiger machen will (erlauben alles zu löschen)
const handleRedo = () => {
    if (!listOfOperatoren.includes(screenInput.textContent) && screenInput.textContent.length > 0) {
        screenInput.textContent = screenInput.textContent.slice(0,-1);
        screenExpression.textContent = screenExpression.textContent.slice(0,-1);
        // falls der input komplett rückgängig gemacht wurde, ist vorsicht geboten, da nach der eingabe von
        // einer zahl der operatorCount resetet wurde. 
        if (screenInput.textContent === "" || screenInput.textContent === "-") {
            operatorCount = lastOperatorCount;
            listOfInputs.pop();
        }
    }
};

redoBtn.addEventListener("click", handleRedo);

const klammerAufBtn = document.getElementById("klammer-auf");
var übrigeOffeneKlammern = 0;
const klammerZuBtn = document.getElementById("klammer-zu");
// klammerCount zu benutzten fehlt bis jetzt

klammerAufBtn.addEventListener("click", () => {
    // falls es schon ein ergebnis gab
    if (ans === 1) {
        screenExpression.textContent = listOfInputs[0];
        listOfInputs.push("x");
        ans = 0;
    }
    //unverarbeitete Inputs benutzen
    // es ergeben nur operatorCount = 0 und 1 sinn, da doppelte vorzeichen falls doppelte vorzeichen wollen
    // später dafür sorgen, dass das "-" in der klammer ist, aber er keine fehler beim redoBtn macht. Noch 
    // nicht implementiert
    if (operatorCount === 1) {
        resetCount();
    }

    if (screenInput.textContent.length > 0 && screenInput.textContent !== "-") {
        listOfInputs.push(screenInput.textContent);
        screenInput.textContent = "";
        // falls kein operator vor der klammer ist gilt, "x" als operator
        listOfInputs.push("x");
    }
    if (operatorCount === 2) {
        //erstmal reicht hier eine fehlermeldung der rest kommt noch
        return console.log("Error: OperatorCount === 2 and open bracket not yet implemented");
    }
    screenExpression.textContent += " ( ";
    listOfInputs.push("(");
    übrigeOffeneKlammern += 1
});


// schauen ob ich nicht sowas wie eine bereingungsfunktion machen will die alte inputs verarbeitet, damit
// die funktionen weniger komplex sind.
klammerZuBtn.addEventListener("click", () => {
    // schauen ob alte inputs noch nicht verarbeitet wurden
    if (operatorCount !== 0) {
    //zwei optionen 1. letzten operator löschen oder 2. klammerzu nicht zulassen. ich wähle option 2
        return  console.log("Error: Not a valid input: Closed bracket after operator")
    }
    // falls eine zahl dort ist, der liste hinzufügen
    if (screenInput.textContent !== "") {
        listOfInputs.push(screenInput.textContent);
        screenInput.textContent = "";
        // benötigt noch ein "x"
        listOfInputs.push("x");
    }
    // schauen ob altes ergebnis noch dort ist
    if (ans === 1) {
        return console.log("Error: Not a valid input: Closed bracket after old solution")
    }
    // falls versucht wird direkt nach der Klammer auf eine Klammer zu als input anzugeben
    if (listOfInputs[listOfInputs.length - 1] === "(") {
        return console.log("Error: Not a valid input: Closed bracket after open bracket")
    }
    screenExpression.textContent += " )";
    listOfInputs.push(")");
    übrigeOffeneKlammern -= 1
});
