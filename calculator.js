const screenExpression = document.getElementById("term");
const screenInput = document.getElementById("input");
const listOfNumberButtons = document.querySelectorAll("button.number");
const dotBtn = document.getElementById("dot");
const zeroBtn = document.getElementById("zero");
const memoryBtn = document.getElementById("memory-btn");
const memoryBox = document.getElementById("memory-box");
let hasDot = 0;
let listOfInputs = [];
let listOfIndexOfNegation = [];
let ans = 0;

// Adding eventListener to number buttons numberButtons = ["1","2","3","4","5","6","7","8","9"];
listOfNumberButtons.forEach((btn) => { 
    btn.addEventListener("click", () => {
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
    // !!!!fehlt noch der teil mit der führenden 0 !!!!
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
const dotOperationen = () => {
    //listOfInputs sollte immer ungerader größe sein deshalb enden wir nach 0-indexierung von beliebiger länge auf 0
    //idee rechnung von hinten an der liste, durchgehen in dreier paaren, berechne das ergebnis des paare, speichere das ergebnis
    // an dem vordersten Index, ersetzte die benutzten mit "already used", verschiebe die index um 2 nach rechts. falls der operator nicht "x" oder "/" ist
    // nur verschieben
    let curIndex = listOfInputs.length - 1;
    while (curIndex !== 0) {
        let secondNumber = listOfInputs[curIndex];
        let operator = listOfInputs[curIndex - 1];
        let firstNumber = listOfInputs[curIndex - 2];
        if (operator === "x" ) {
            const solution = multi(firstNumber, secondNumber);
            listOfInputs[curIndex - 2] = solution;
            listOfInputs[curIndex - 1] = "already used";
            listOfInputs[curIndex] = "already used";
            curIndex -= 2;
            continue;
        } else if (operator === "/") {
            const solution = divide(firstNumber, secondNumber);
            listOfInputs[curIndex - 2] = solution;
            listOfInputs[curIndex - 1] = "already used";
            listOfInputs[curIndex] = "already used";
            curIndex -= 2;
            continue;
        } else {
            curIndex -= 2;
            continue;
        }
    }
}

    //strich operationen durchgehen
const strichOperationen = (filterdList) => {
    // curIndex platzieren
    let curIndex2 = filterdList.length - 1;
    while (curIndex2 > 1) {
        let secondNumber = filterdList[curIndex2];
        let operator = filterdList[curIndex2 - 1];
        let firstNumber = filterdList[curIndex2 - 2];
        if (operator === "+") {
            const solution = ad(parseFloat(firstNumber), parseFloat(secondNumber));
            filterdList[curIndex2 - 2] = solution;
            filterdList.pop();
            filterdList.pop();
        }
        if (operator === "-") {
            const solution = sub(firstNumber, secondNumber);
            filterdList[curIndex2 - 2] = solution;
            filterdList.pop();
            filterdList.pop();
        }
        curIndex2 -= 2;
    }
}

var operatorCount = 0;
const listOfOperatoren = ["+", "-", "x", "/"]
const operatoren = document.querySelectorAll("button.operatoren");
operatoren.forEach((op) => {
    op.addEventListener("click", () => {
        // falls es schon ein ergebnis gab, und wir damit weiterrechnen, damit aber die vorherige expression
        // mit dem ergebnis ersetzen
        if (ans === 1) {
            ans = 0;
            screenExpression.textContent = screenInput.textContent;
        }
        // hasDot zurücksetzen
        hasDot = 0;
        // falls screenInput.textContent kein operator ist der liste der inputs hinzufügen
        if ( !listOfOperatoren.includes(screenInput.textContent)) {
            listOfInputs.push(screenInput.textContent);
        }
        // dritter operator der nicht minus ist => letzten beiden operatoren löschen und den neuen hinzufügen
        if (operatorCount === 2 && op.textContent !== "-") {
            let cur = screenExpression.textContent;
            screenExpression.textContent = cur.slice(0, - 2) + op.textContent;
            screenInput.textContent = op.textContent;
            operatorCount = 1;
        } // zweiter operator nicht minus => alte operatoren löschen neuen hinzufügen , operatorCount bleibt gleich
        else if (operatorCount === 1 && op.textContent !== "-") {
            screenInput.textContent = op.textContent;
            screenExpression.textContent.slice(0,-1) + op.textContent;
        }   // operator hinzufügen  
        else if (operatorCount === 0 || (operatorCount === 1 && op.textContent === "-")) {
            screenInput.textContent = op.textContent;
            screenExpression.textContent += op.textContent;
            operatorCount += 1;
        } // bleibt noch der fall mit OperatorCount = 2 und op.textContent = "-" hier bleibt alles gleich
    })
});
// erstellt eine neue liste ohne die schon verwendeten inputs
const filterTheList = (list) => {
    const newList = [];
    list.forEach(element => {
        if (element !== "already used") {
            newList.push(element)
        };
    })
    return newList
};

const divide = (x, y) =>  x / y; 
const multi = (x, y) => x * y;
const ad = (x , y) => x + y;
const sub = (x, y) => x - y;

// funktion von = button
const equalsBtn = document.getElementById("equals");
equalsBtn.addEventListener("click", () => {
    // controllieren ob überhaupt zu rechnen ist, falls nicht abbrechen
    if (listOfInputs.length < 2) {
        return
    };
    // schauen ob letzter input ein operator war, falls ja diesen löschen
    if (listOfOperatoren.includes(screenInput.textContent)) {
        screenExpression.textContent.slice(0,-1);
    }
    // sonst ist es eine unaufgelistete zahl, diese dann zur liste hinzufügen, screenInput wieder leeren um wiederholtes "=" drücken das selbe noch mal zählen lassen 
    else {
        if (screenInput.textContent !== 0) {
        listOfInputs.push(screenInput.textContent);
        screenInput.textContent = "";
    }}
    // negationen anwenden, negations liste zurücksetzten
    listOfIndexOfNegation.forEach((index) => {
        if (index < listOfInputs.length) {
            listOfInputs[index] = "-" +listOfInputs[index];
        }
    listOfIndexOfNegation = [];
    })
    //erstmal punkt operationen behandeln
    dotOperationen();

    // gekürzte liste erstellen, die nur noch nicht verwendete inputs beinhaltet
    const filterdList = filterTheList(listOfInputs);

    //strich Operationen behandlen
    strichOperationen(filterdList);

    // angeben das es ein ergbnis gibt, screenExpression anpassen, listOfInputs zurcüksetzten, screenInput zum weiterrechnen vorbereiten
    ans = 1;
    screenExpression.textContent += " = " + filterdList[0];
    memoryBox.innerHTML += `<div class="memory"> ${screenExpression.textContent} </div>` ;
    listOfInputs = [];
    screenInput.textContent = filterdList[0];
})  

// operator/n der liste hinzufügen, operatorCount zurücksetzten, ,screenInput leeren
const resetCount = () => {
    if (operatorCount === 1) {
        listOfInputs.push(screenInput.textContent);
    } else {
        let firstNewOperator = screenExpression.textContent.charAt(screenExpression.textContent.length - 2);
        listOfInputs.push(firstNewOperator);
        listOfIndexOfNegation.push(listOfInputs.length);
    }
    operatorCount = 0;
    screenInput.textContent = "";
}

const handleACBtn = () => {
    // alles zurcüksetzten
    screenInput.textContent = "";
    screenExpression.textContent = "";
    listOfInputs = [];
    listOfIndexOfNegation = [];
    hasDot = 0;
    operatorCount = 0;
    ans = 0;
    memoryBox.innerHTML = "";

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
