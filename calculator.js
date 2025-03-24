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

const updateScreenExpression = () => {
    screenExpression.textContent = listOfInputs.join(" ");
};


listOfNumberBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (screenInput.textContent === "") {
            checkIfImplicitMultiply()
        } 
        if (screenInput.textContent === "0")  {
            screenInput.textContent = ""
        }
        screenInput.textContent += btn.textContent
    })})


dotBtn.addEventListener("click", () => {
    if (hasDot === 0) {
        screenInput.textContent += dotBtn.textContent;
        hasDot = 1
    // verhindert "." als einzelner input und wandel sie zu "0." um.
    if (screenInput.textContent === ".") {
        screenInput.textContent = "0.";
    }       
    } else {
        return
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
    hasDot = 0
};


const clearInput = () => screenInput.textContent = "";


const listOfOperators = ["+","-","x","/"]; 
const operatorBtns = document.querySelectorAll("button.operatoren");
    //wie kann ich hier die btn auf eine handler funktion schicken die auch den btn input mitnimmt
operatorBtns.forEach((btn) => {btn.addEventListener("click", () => {

    // verhindert negations minuse als falschlicherweise zum input zu werden 
    if (screenInput.textContent === "-") {
        return  
    }

    // falls eine zahl davor eingegeben wurden, diese der liste hinzufügen und input zurücksetzen
    if (screenInput.textContent !== "" ) {
        addInputToList(screenInput.textContent);
        clearInput();
    }

    // verhindert operatoren als ersten input außer "-" für negation 
    if (listOfInputs.length === 0) {
        // falls wir nur negation der ersten zahl wollen
        if (btn.textContent === "-") {
        screenInput.textContent += btn.textContent
        }
        return
    }

    if (listOfInputs[listOfInputs.length - 1] === "(" && screenInput.textContent === "") {
        // falls wir negation nach einer klammer wollen
        if (btn.textContent === "-") {
        screenInput.textContent += btn.textContent
        }
        return
    }

    // falls probiert wird einen zweiten operator hinzuzufügen, wird der alte gelöscht außnahme ist "-" den damit wollen wir negative zahlen auch darstellen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && btn.textContent !== "-") {
        listOfInputs.pop();
    }

    // fall damit man als zweiten operator  minus haben kann aber nicht endlos viele
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && btn.textContent === "-") {
        screenInput.textContent += "-"
        return
    }

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
    übrigeOffeneKlammern = 0;
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
    //am ende kommt eine liste von Übrigen inputs zurück, die keine klammern mehr beinhaltet
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

    let newList = list

    // berechnung beginnen
    console.log("listOfInputs", newList)
    newList = handleBrackets(newList);
    console.log("after brackets", newList);
    
    //erstmal punkt operationen behandeln
    newList = punktOperationen(newList);
    console.log("nach punkt", newList);

    //strich Operationen behandlen
    newList = strichOperationen(newList);
    console.log("nach strich", newList);

    if (newList.length === 1) {
        return newList[0]
    }
    return newList
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
        hasDot = 0
        let lastInput = listOfInputs.pop();
        console.log(lastInput)
        screenInput.textContent = lastInput.slice(0,-1);
        if ( lastInput.includes(".")) {
            hasDot = 1
        }
    }
    updateScreenExpression(); 
};


redoBtn.addEventListener("click", handleRedo);

const klammerAufBtn = document.getElementById("klammer-auf");
var übrigeOffeneKlammern = 0;
const klammerZuBtn = document.getElementById("klammer-zu");


klammerAufBtn.addEventListener("click", () => {
    //letzten input falls es eine zahl war der Liste hinzufügen und den screenInput leeren, das bedeutet auch das eine implizites "x" vorhanden ist
    if (screenInput.textContent !== "") {
        addInputToList(screenInput.textContent);
        clearInput();
    }
    checkIfImplicitMultiply()
    übrigeOffeneKlammern += 1
    addInputToList("(");
    updateScreenExpression();
});


klammerZuBtn.addEventListener("click", () => {
    if (screenInput.textContent !== "") {
        addInputToList(screenInput.textContent);
        clearInput();
    }
    // das würde eine leere klammer bedeuten oder klammerzu ohne eine offene, das wollen wir verhindern
    if (listOfInputs[listOfInputs.length - 1] === "(" || übrigeOffeneKlammern === 0) {
        return
    }
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1])) {
        listOfInputs.pop();
    }

    übrigeOffeneKlammern -= 1;
    addInputToList(")");
    // nach klammer zu steht, falls kein anderes zeichen angegeben wird, ein "x"
    updateScreenExpression();
});

const checkIfImplicitMultiply = () => {
    if (listOfInputs.length === 0 || listOfInputs[listOfInputs.length - 1] === "(") {
        return
    }
    if (!listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) ) {
        addInputToList("x")
        updateScreenExpression()
    }
}
