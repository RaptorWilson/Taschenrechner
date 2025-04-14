const screenExpression = document.getElementById("term");
const screenInput = document.getElementById("input");
const listOfNumberBtns = document.querySelectorAll("button.number");
const dotBtn = document.getElementById("dot");
const zeroBtn = document.getElementById("zero");
const memoryBtn = document.getElementById("memory-btn");
const memoryBox = document.getElementById("memory-box");
const ACBtn = document.getElementsByClassName("AC");
const equalsBtn = document.getElementById("equals");
const redoBtn = document.getElementById("redo");
const klammerAufBtn = document.getElementById("klammer-auf");
const klammerZuBtn = document.getElementById("klammer-zu");
const grid1 = document.getElementById("grid1")
const grid2 = document.getElementById("grid2")
const operatorBtns = document.querySelectorAll("button.operatoren");
const switchBtn = document.getElementById("switch-button")
const eBtn = document.getElementById("e")
const piBtn = document.getElementById("pi")
const quadratBtn = document.getElementById("quadrat")
const wurzelBtn = document.getElementById("wurzel")
const fakultätBtn = document.getElementById("fakultät");
const lnBtn = document.getElementById("ln") 
const xHochYBtn = document.getElementById("x-hoch-y")
const yWurzelXBtn = document.getElementById("y-wurzel-x");
const radDegBtn = document.getElementById("rad-deg");
const arcsinBtn = document.getElementById("arcsin");
const arccosBtn = document.getElementById("arccos");
const arctanBtn = document.getElementById("arctan");
const listOfOperators = ["+","-","x","/"]; 
const listOfTrigBtns = document.querySelectorAll("button.trig"); // sin cos tan 

var mode = "Rad"
var übrigeOffeneKlammern = 0;
let hasDot = 0;
let listOfInputs = [];


const updateScreenExpression = () => {
    screenExpression.textContent = listOfInputs.reduce((acc, input) => {
        // fälle in denen ich kein space will "²", "!"
        if ( input === "²" || input === "!") {
            return acc + input
        }
        // der rest mit leerzeichen zwischen drin
        return acc + " " + input
    }, "")
};


const handleNumber = (event) => {
    if (screenInput.textContent === "") {
        checkIfImplicitMultiply()
    } 
    if (screenInput.textContent === "0")  {
        screenInput.textContent = ""
    }
    screenInput.textContent += event.target.textContent
}


const handleDot = () => {
        if (! screenInput.textContent.includes(".")) {
            screenInput.textContent += dotBtn.textContent;
        // verhindert "." als einzelner input und wandelt sie zu "0." um.
            if (screenInput.textContent === ".") {
                screenInput.textContent = "0.";
            }       
        } 
    }


const handleZero = () =>  {
    // verhindert doppete nullen wie 00 oder 000
    if (screenInput.textContent === "0") {
        return
    }
    screenInput.textContent += "0";
}


const addInputToList = (input) => {
    listOfInputs.push(input);
};


const addNumber = () => {
    if (screenInput.textContent === "") {
        return
    }
    if (screenInput.textContent === "-" && (listOfInputs.length === 0 || listOfInputs[listOfInputs.length - 1] === "(")) {
        addInputToList("-")
        clearInput()
        updateScreenExpression()
        return
    }
    var number = screenInput.textContent
    if (number.includes(".")) {
        listOfInputs.push(parseFloat(number))
    }
    else {
        listOfInputs.push(parseInt(number))
    }
    clearInput()
}


const clearInput = () => screenInput.textContent = "";


const handleOperator = (event) => {
    
    //sichergehen das der input nicht nur minus ist 
    if (screenInput.textContent === "-" ) {
        return
    }

    // falls eine zahl davor eingegeben wurden, diese der liste hinzufügen und input zurücksetzen
        addNumber(screenInput.textContent);

    // verhindert operatoren als ersten input außer "-" für negation
    if (listOfInputs.length === 0) {
        // falls wir nur negation der ersten zahl wollen
        if (event.target.textContent === "-") {
        screenInput.textContent += event.target.textContent
        }
        return
    }

    if (listOfInputs[listOfInputs.length - 1]  === "(" && screenInput.textContent === "") {
        // falls wir nur negation der ersten zahl in einer klammer wollen
        if (event.target.textContent === "-") {
        screenInput.textContent += event.target.textContent
        }
        return
    }

    // falls probiert wird einen zweiten operator hinzuzufügen, wird der alte gelöscht außnahme ist "-" den damit wollen wir negative zahlen auch darstellen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && event.target.textContent !== "-") {
        listOfInputs.pop();
    }
    // fall damit man als zweiten operator  minus haben kann aber nicht endlos viele
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && event.target.textContent === "-") {
        screenInput.textContent += "-"
        return
    }
    // operator der liste hinzufügen und screenExpression updaten
    addInputToList(event.target.textContent);
    updateScreenExpression();
}




const handleACBtn = () => {
    // alles zurcüksetzten
    screenInput.textContent = "";
    screenExpression.textContent = "";
    listOfInputs = [];
    übrigeOffeneKlammern = 0;
};


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
            //console.log("berechne subList:", subList)
            var solution = berechnen(subList)
            //console.log("subList Ergebnis:", solution);
            shortList = shortList.slice(0,lastOpenBracket)
            shortList.push(solution);
            //console.log("shortList nach der klammer berechnung" , shortList);
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
        if (shortList[0] === "-" && typeof shortList[1] === "number") {
            var number = shortList.pop()
            shortList[0] = number * (-1)
        }
        if (shortList.length > 2) {
            let firstNumber = shortList[shortList.length - 3];
            let operator = shortList[shortList.length - 2];
            let secondNumber = shortList[shortList.length - 1];
            if (operator === "+") {
                var solution = ad(firstNumber, secondNumber);
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


const handleExponent = (list) => {
    let shortList = []
    for (let i = 0; i < list.length; i ++) {

        shortList.push(list[i])
        if (shortList.length > 1) {
            let base = shortList[shortList.length - 3];
            let operator = shortList[shortList.length - 2];
            let exponent = shortList[shortList.length - 1];
            if (operator === "^") {
                var solution = base ** exponent
                shortList.pop()
                shortList.pop()
                console.log(solution)
                shortList[shortList.length - 1] = solution
            }
            if (operator === "root") {
                // bei wurzel ist es anderes herum die erste zahl ist y und die zweite zahl die basis
                var solution = exponent ** (1 / base )
                shortList.pop()
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
            if (operator === wurzelBtn.textContent && typeof exponent === "number") {
                // bei quadratwurzel ist die benennung auch anders dort ist nur das symbol der operator und 
                // exponent die zahl die wir radizieren wollen
                var solution = Math.sqrt(exponent)
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
            if (exponent === "²") {
                //hier ist exponent der exponent und operator die zahl
                var solution = operator ** 2
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
        }
    }
    return shortList
}


const calculateLn = (list) => {
    let shortList = [];
    for ( let i = 0; i < list.length; i ++) {
        shortList.push(list[i])
        if (shortList.length > 1) {
            let funktion = shortList[shortList.length - 2]
            let number = shortList[shortList.length - 1]
            if (funktion === "ln") {
                var solution = Math.log(number)
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
        }
    }
    return shortList
}


const calculateFakultät = (list) => {
    let shortList = [];
    for (let i = 0; i < list.length; i ++) {
        shortList.push(list[i]);
        if (shortList.length > 1) {
            let number = shortList[shortList.length - 2]
            let fakultät = shortList[shortList.length - 1]
            if (fakultät === "!") {
                if (number === parseFloat(number)) {
                    var solution = 1
                    for (let j = 1; j <= number ; j ++) {
                        solution *= j
                    }
                    shortList.pop()
                    shortList[shortList.length - 1] = solution;
                } else {
                    console.log("Fakultät Fehler, probier bitte eine ganze Zahl")
                }
            }
        }
    }
    return shortList
}


const calculateTrig1 = (list) => {
    let shortList = [];
    for ( let i = 0; i < list.length; i ++) {
        shortList.push(list[i])
        if (shortList.length > 1) {
            let funktion = shortList[shortList.length - 2]
            let number = shortList[shortList.length - 1]
            if (mode === "Deg") {
                number = number * Math.PI / 180
            }
            if (funktion === "sin") {
                var solution = Math.sin(number)
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
            if (funktion === "cos") {
                var solution = Math.cos(number)
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
            if (funktion === "tan") {
                var solution = Math.tan(number)
                shortList.pop()
                shortList[shortList.length - 1] = solution
            }
        }
    }
    return shortList
}


const radToDeg = (number) => {
    if (mode === "Deg") {
        return number * 180 / Math.PI
    }
    return number
}


const calculateTrig2 = (list) => {
    let shortList = [];
    for ( let i = 0; i < list.length; i ++) {
        shortList.push(list[i])
        if (shortList.length > 1) {
            let funktion = shortList[shortList.length - 2]
            let number = shortList[shortList.length - 1]
            if (funktion === "sin\u207B\u00B9") {
                var solution = Math.asin(number)
                shortList.pop()
                shortList[shortList.length - 1] = radToDeg(solution)

            }
            if (funktion === "cos\u207B\u00B9") {
                var solution = Math.acos(number)
                shortList.pop()
                shortList[shortList.length - 1] = radToDeg(solution)
            }
            if (funktion === "tan\u207B\u00B9") {
                var solution = Math.atan(number)
                shortList.pop()
                shortList[shortList.length - 1] = radToDeg(solution)
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
const handleEquals = () => {

    // schauen ob es eine unaufgelistete zahl, diese dann zur liste hinzufügen, screenInput wieder leeren um wiederholtes "=" drücken das selbe noch mal zählen lassen 
    addNumber(screenInput.textContent);
    if (listOfInputs.length < 2) {
        return console.log("nope")
    }    
    // schauen ob letzter input ein operator war, falls ja diesen löschen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1])) {
        //oder eine delete and update funktion und vielleicht die add funktion auch updaten lassen
        listOfInputs.pop();
    }
    updateScreenExpression();

    // überprüfen ob alle klammern zu sind, wenn nicht einfach ranhängen
    if (übrigeOffeneKlammern !== 0) {
        for (let i = übrigeOffeneKlammern; i > 0; i --) {
            listOfInputs.push(")");
            screenExpression.textContent += " )";
        }
        übrigeOffeneKlammern = 0
    }
    const antwort = berechnen(listOfInputs);
    antwortAnzeigenUndWeiterRechnenVorbereiten(antwort);
}


const berechnen = (list) => {

    console.log(list)
    // e und pi mit der Zahl ersetzten
    var newList = list.map((item) => {
        if ( item === "e") {
            return Math.E
        } else if ( item === "\u03C0") {
            return Math.PI
        } else {
            return item
        }
        })

    // berechnung beginnen
    newList = handleBrackets(newList);              

    // funktionen: ln , fakultät, trig1 und trig2
    newList = calculateTrig1(newList) // cos sin tan
    newList = calculateTrig2(newList) // arcsin arccos arctan
    newList = calculateLn(newList)
    newList = calculateFakultät(newList)
    //console.log("nach funktionen", newList)

    //wurzeln und potenzen berechnen
    newList = handleExponent(newList)

    //punkt operationen behandeln
    newList = punktOperationen(newList);

    //strich Operationen behandlen
    newList = strichOperationen(newList);

    if (newList.length === 1) {
        return newList[0]
    }
    return "Fehler" , listOfInputs
}  


const antwortAnzeigenUndWeiterRechnenVorbereiten = (zahl) => {
    screenExpression.textContent += " = ";
    memoryBox.innerHTML += `<div class="memory"> ${screenExpression.textContent} ${zahl} </div>` ;
    screenInput.textContent = zahl; 
    listOfInputs = []
}


const handleMemoryBtnClick = () => {
    // box anzeigen lassen 
    if (memoryBox.style.display === "none" || memoryBox.style.display === "") {
        memoryBox.style.display = "block";
    //box verstecken
    } else {
        memoryBox.style.display = "none";
}};


//  redo soll entweder den letzten input in der Liste löschen oder die zahl um einen verkleinern also ["2", "+", "4", "-"] -> ["2", "+", "4"] oder ["2,454"] -> []
//  screenInput = 2,45 also gewünschtes verhalten  
const handleRedo = () => {
    if (screenInput.textContent !== "") {
        screenInput.textContent = screenInput.textContent.slice(0,-1)
    } else if (typeof listOfInputs[listOfInputs.length - 1] === "number") {
        var number = listOfInputs.pop()
        screenInput.textContent = number   
    } else {
        var removed = listOfInputs.pop()
        if (removed === "(") {
            übrigeOffeneKlammern -= 1
        }
    }
    updateScreenExpression()    
};


const handleKlammerAuf = () => {
    //letzten input falls es eine zahl war der Liste hinzufügen und den screenInput leeren, das bedeutet auch das eine implizites "x" vorhanden ist
    addNumber(screenInput.textContent);
    checkIfImplicitMultiply()
    übrigeOffeneKlammern += 1
    addInputToList("(");
    updateScreenExpression();
};

const handleKlammerZu = () => {
    addNumber(screenInput.textContent);
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
}

// die funktion die tatsächlich die grids tauscht
const swapGrid = () => {
    if (getComputedStyle(grid1).display === "grid") {
        grid1.style.display = "none"
        grid2.style.display = "grid"
        
    } else if ( getComputedStyle(grid1).display === "none") {
        grid1.style.display = "grid"
        grid2.style.display = "none"
    }
}


const handleSwitchBtn = () => {
    if (switchBtn.textContent === "Fx") {
        switchBtn.textContent = "123"
        swapGrid()
    } else if (switchBtn.textContent === "123") {
        switchBtn.textContent = "Fx"
        swapGrid()
    }

}


const handleEBtn = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("e")
    updateScreenExpression()
}


const handlePiBtn = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("\u03C0") //pi symbol
    updateScreenExpression()
}


const handleQuadrat = () => {
    // falls wir warten mit dem rechnen nur das quadrat ranhängen
    if (listOfInputs[listOfInputs.length - 1] === ")" 
        || listOfInputs[listOfInputs.length - 1] === "e"
        || listOfInputs[listOfInputs.length - 1] === "\U03C0" // für pi
        || listOfInputs[listOfInputs.length - 1] === "²" // wiederholtes quadrat für potenztürme ermöglichen
        ) {
        addInputToList("²")
        updateScreenExpression()
        return
    }
    // verhindern von leeren inputs
    if (screenInput.textContent === "" || screenInput.textContent === "-" ) {
        return
    }
    //direktes berechnen beim drücken
    var solution = Math.pow(parseFloat(screenInput.textContent), 2)
    screenInput.textContent = solution 
    updateScreenExpression()
}


const checkIfImplicitMultiply = () => {
    // umkehren von diesen fall ist vielleicht kürzer if (listOfInputs === 0 || !(typeof listOfInputs[listOfInputs.length - 1] === "number"))
    if (listOfInputs.length === 0 ||
        listOfInputs[listOfInputs.length - 1] === "(" ||
        listOfInputs[listOfInputs.length - 1] === wurzelBtn.textContent ||
        listOfInputs[listOfInputs.length - 1] === "ln" ||
        listOfInputs[listOfInputs.length - 1] === "^" ||
        listOfInputs[listOfInputs.length - 1] === "root" ||
        listOfInputs[listOfInputs.length - 1] === "sin" || 
        listOfInputs[listOfInputs.length - 1] === "cos" ||
        listOfInputs[listOfInputs.length - 1] === "tan" ||
        listOfInputs[listOfInputs.length - 1] === "sin\u207B\u00B9" ||
        listOfInputs[listOfInputs.length - 1] === "cos\u207B\u00B9" ||
        listOfInputs[listOfInputs.length - 1] === "tan\u207B\u00B9" )   {
        return
    }
    // falls letzter input in der liste kein operator ist brauchen wir einen
    if (!listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) ) {
        addInputToList("x")
    }
}


const handleWurzel = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList(wurzelBtn.textContent)
    handleKlammerAuf()
    updateScreenExpression()
}


const handleFakultät = () => {
    if (screenInput.textContent === "" && listOfInputs[listOfInputs.length - 1] !== "!") {
        return
    }
    addNumber()
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1])) {
        return
    }
    addInputToList("!")
    updateScreenExpression()
}


const handleLn = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("ln")
    handleKlammerAuf();
}


const handleXHochY = () => {
    // verhindert leere potenzen
    if (screenInput.textContent === "" && listOfInputs.length === 0) {
        return
    }
    // verhindert widerholtes benutzen ohne weiteren input und invalide inputs wie "(^"
    if (listOfInputs[listOfInputs.length - 1] === "^" || listOfInputs[listOfInputs.length - 1] === "(")  {
        return
    }
    addNumber(screenInput.textContent)
    addInputToList("^")
    updateScreenExpression()
}


const handleYWurzelX = () => {
    //nur kosmetischer natur verhindert das zum input werden von nur minus durch diesen button
    if ( screenInput.textContent === "-") {
        return
    }
    addNumber()
    //geht sicher das eine zahl vor dem root drücken vorhanden ist, denn sonst haben wir einen invaliden input
    if (typeof listOfInputs[listOfInputs.length - 1] !== "number"  ) {
        return
    }
    addInputToList("root")
    handleKlammerAuf()
    updateScreenExpression()
}

// handler für Deg und Rad switch button, setzt auch den modus zum rechnen fest in der mode variable, die den rechen modus bestimmt
// Deg = degree gibt ergebnisse in grad an und rechnet auch mit grad angaben, 
// Rad = radiant steht für bogenmaß und rechnet dann in mit vielfachen von pi und gibt die ergebnisse dann auch so an
const handleDegRadBtn = () => {
    if (radDegBtn.textContent === "Rad") {
        radDegBtn.textContent = "Deg"
        mode = "Deg"
    } else if (radDegBtn.textContent === "Deg") {
        radDegBtn.textContent = "Rad"
        mode = "Rad"
    }
}


const handleArcsin = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("sin\u207B\u00B9")
    handleKlammerAuf()
    updateScreenExpression()
}


const handleArctan = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("tan\u207B\u00B9")
    handleKlammerAuf()
    updateScreenExpression()
}


const handleArccos = () => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList("cos\u207B\u00B9")
    handleKlammerAuf()
    updateScreenExpression()
}

// handler für sin cos und tan
const handleTrig = (event) => {
    addNumber()
    checkIfImplicitMultiply()
    addInputToList(event.target.textContent)
    handleKlammerAuf()
    updateScreenExpression()
}


// Handler für die tastatur zahlen außer 0
const handleNumber2 = (number) => {
    if (screenInput.textContent === "") {
        checkIfImplicitMultiply()
    } 
    if (screenInput.textContent === "0")  {
        screenInput.textContent = ""
    }
    screenInput.textContent += number
}

// operatoren funktion für die tasten 
const handleOperator2 = (input) => {    
    //sichergehen das der input nicht nur minus ist 
    if (screenInput.textContent === "-" ) {
        return
    }
    // falls eine zahl davor eingegeben wurden, diese der liste hinzufügen und input zurücksetzen
    addNumber(screenInput.textContent);
    // verhindert operatoren als ersten input außer "-" für negation
    if (listOfInputs.length === 0) {
        // falls wir nur negation der ersten zahl wollen
        if (input === "-") {
        screenInput.textContent += input
        }
        return
    }
    if (listOfInputs[listOfInputs.length - 1]  === "(" && screenInput.textContent === "") {
        // falls wir nur negation der ersten zahl in einer klammer wollen
        if (input === "-") {
        screenInput.textContent += input
        }
        return
    }
    // falls probiert wird einen zweiten operator hinzuzufügen, wird der alte gelöscht außnahme ist "-" den damit wollen wir negative zahlen auch darstellen
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && input !== "-") {
        listOfInputs.pop();
    }
    // fall damit man als zweiten operator  minus haben kann aber nicht endlos viele
    if (listOfOperators.includes(listOfInputs[listOfInputs.length - 1]) && input === "-") {
        screenInput.textContent += "-"
        return
    }
    // operator der liste hinzufügen und screenExpression updaten
    addInputToList(input);
    updateScreenExpression();
}



// eventListener für die tastaturtasten
document.addEventListener("keydown", (event) => {
    if (event.key === "0") {
        handleZero()
    } else if (event.key === "1" || event.key === "2" || event.key === "3" ||
               event.key === "4" || event.key === "5" || event.key === "6" ||
               event.key === "7" || event.key === "8" || event.key === "9") {
        handleNumber2(event.key)
    } else if (event.key === "." || event.key === ",") {
        handleDot()
    } else if (event.key === "Enter") {
        event.preventDefault();
        handleEquals()
    } else if (event.key === "+" || event.key === "*" ||
               event.key === "-" || event.key === "/") {
        if (event.key === "*") {
            handleOperator2("x")
            return
        }
        handleOperator2(event.key)
    } else if (event.key === "Backspace" ) {
        handleRedo()
    } else if (event.key === "(") {
        handleKlammerAuf()
    } else if (event.key === ")") {
        handleKlammerZu()
    } else {
        return
    }
})

// eventlistener für mehrere objekte gleichzeitig
listOfTrigBtns.forEach((btn) => {btn.addEventListener("click", handleTrig)})
operatorBtns.forEach((btn) => {btn.addEventListener("click", handleOperator)})
listOfNumberBtns.forEach((btn) => {btn.addEventListener("click", handleNumber )})

//einzelne eventlistener
dotBtn.addEventListener("click", handleDot);
ACBtn[0].addEventListener("click", handleACBtn)
zeroBtn.addEventListener("click", handleZero)
equalsBtn.addEventListener("click", handleEquals)
memoryBtn.addEventListener("click", handleMemoryBtnClick);
redoBtn.addEventListener("click", handleRedo);
klammerAufBtn.addEventListener("click", handleKlammerAuf)
klammerZuBtn.addEventListener("click", handleKlammerZu );
switchBtn.addEventListener("click", handleSwitchBtn);
eBtn.addEventListener("click", handleEBtn)
piBtn.addEventListener("click", handlePiBtn)
quadratBtn.addEventListener("click", handleQuadrat)
wurzelBtn.addEventListener("click", handleWurzel)
fakultätBtn.addEventListener("click", handleFakultät)
lnBtn.addEventListener("click", handleLn)
xHochYBtn.addEventListener("click", handleXHochY)
yWurzelXBtn.addEventListener("click", handleYWurzelX)
radDegBtn.addEventListener("click", handleDegRadBtn)
arcsinBtn.addEventListener("click", handleArcsin)
arctanBtn.addEventListener("click", handleArctan)
arccosBtn.addEventListener("click", handleArccos)
