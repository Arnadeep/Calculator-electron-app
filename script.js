window.addEventListener('wheel', (event) => {
    console.log("fe")
    if (!window.electronAPI?.changeOpacity) return;
  
    if (event.deltaY > 0) {
      window.electronAPI.changeOpacity('down');
    } else if (event.deltaY < 0) {
      window.electronAPI.changeOpacity('up');
    }
  });
  




const resultDiv = document.querySelector(".display-result");
const equationDiv = document.querySelector(".display-eq");
let result = "0";
let equation = "";
let opMode = false;
let lastOperation = "";
let sign = "+";
let equalsPressed = false;
const lengthMax = 36;
// let decimalUsed = false;


document.getElementById('pi').addEventListener('click', () => digit("pi"));

document.getElementById('e').addEventListener('click', () => digit("e"));

document.getElementById('clear').addEventListener('click', () => {
    result = "0";
    equation = "";
    opMode = false;
    lastOperation = "";
    sign = "+";
    // decimalUsed = false;
    updateEquation();
    updateResultDiv();
});

document.getElementById('back').addEventListener('click', () => {
    if (result.charAt(result.length - 1) == ".") {
        decimalUsed = false;
    }
    result = result.slice(0, result.length - 1);
    if(sign == "-"){
        if(result.length == 1){
            sign = "+";
            result = "0";
        }
    }else{
        if(result.length == 0){
            result = "0";
        }
    }
    updateResultDiv();
});

document.getElementById('sqrt').addEventListener('click', () => mathsOp("sqrt"));
document.getElementById('log').addEventListener('click', () => mathsOp("log"));
document.getElementById('ln').addEventListener('click', () => mathsOp("ln"));
document.getElementById('sin').addEventListener('click', () => mathsOp("sin"));
document.getElementById('cos').addEventListener('click', () => mathsOp("cos"));
document.getElementById('tan').addEventListener('click', () => mathsOp("tan"));

function mathsOp(op){
    equalsPressed = true;
    if(equation.trim() == "" && result == "")return;
    if(!opMode){
        equation += result;
    }
    // console.log("oink")

    if(op == "sqrt"){
        // console.log("oink")
        equation = "Math.sqrt(" + equation + ")";
    }else if(op == "log"){
        equation = "Math.log10(" + equation + ")";
    }else if(op == "ln"){
        equation = "Math.log(" + equation + ")";
    }else if(op == "sin"){
        equation = "Math.sin(" + equation + ")";
    }else if(op == "cos"){
        equation = "Math.cos(" + equation + ")";
    }else if(op == "tan"){
        equation = "Math.tan(" + equation + ")";
    }
    // console.log("oink")
    updateEquation(" = ");
    opMode = true;
    result = String(eval(equation));
    lastOperation = "";
    updateResultDiv();
    
}

// +-/*.......................

document.getElementById('divide').addEventListener('click', () => arithmeticOp(" / "));
document.getElementById('multiply').addEventListener('click', () => arithmeticOp(" * "));
document.getElementById('minus').addEventListener('click', () => arithmeticOp(" - "));
document.getElementById('plus').addEventListener('click', () => arithmeticOp(" + "));

function arithmeticOp(op){
    if(equation.trim() == "" && result == "")return;
    if(equalsPressed){
        // console.log("Reesult"+result)
        equation = result;
        equalsPressed = false;
        updateEquation();
    }
    lastOperation = op;
    if(opMode){
        // console.log("true")
    }else{
        // console.log("false");
        equation += result; 
    }
    // console.log(equation);
    opMode = true;
    result="0";
    updateEquation();
}

// equalsssssssssssssssssssssss

document.getElementById('equals').addEventListener('click', () => {
    equalsPressed = true;
    op = " = ";
    if (equation.trim() == "" && result == "") return;
    else if (equation.trim() == "" && result != "") {
        equation += result;
    } else if (lastOperation != "") { equation += result; }
    lastOperation = "";
    updateEquation(op);
    opMode = true;
    result = String(eval(equation));
    updateResultDiv();
});


// digits ..........................


document.getElementById('seven').addEventListener('click', () => digit("7"));
document.getElementById('eight').addEventListener('click', () => digit("8"));
document.getElementById('nine').addEventListener('click', () => digit("9"));
document.getElementById('four').addEventListener('click', () => digit("4"));
document.getElementById('five').addEventListener('click', () => digit("5"));
document.getElementById('six').addEventListener('click', () => digit("6"));
document.getElementById('one').addEventListener('click', () => digit("1"));
document.getElementById('two').addEventListener('click', () => digit("2"));
document.getElementById('three').addEventListener('click', () => digit("3"));
document.getElementById('zero').addEventListener('click', ()=> digit("0"));

function digit(x) {
    if (result.replaceAll("-","").replaceAll(".","").length > lengthMax) {
        return;
    }
    if(equalsPressed){
        result="0";
        equalsPressed = false;
        equation = "";
        lastOperation = "";
        updateEquation();
    }
    if(x != "0" && (result == "0" || result == "-0")){
        if(sign == "+")
            result = "";
        else
            result = "-";
    }
    if(x == "0" && result == "0"){
    }else{
        if(x == "pi"){
            result = "3.1415926535897";
        }else if(x == "e"){
            result = "2.71828182845";
        }
        else{
            result += x;
        }
    }
    if(opMode){equation += lastOperation;}
    opMode = false;
    updateResultDiv();
}

// sign and dot..............

document.getElementById('sign').addEventListener('click', () => {
    if(result.charAt(0)=="-" && result.length > 0){
        result = result.substring(1);
        sign = "+";
    }
    else if(result.length > 0){
        result = "-" + result;
        sign = "-";
    }
    updateResultDiv();
});

document.getElementById('dot').addEventListener('click', () => {
    if (result.includes(".")) return;
    result += ".";
    updateResultDiv();
});

let memory = 0;
let memoryUsed = false;
const memoryIndicator = document.getElementById("mshow");
const memoryClear = document.getElementById("mc");
const memoryRecall = document.getElementById("mr");

const ar = [document.getElementById("mshow"),
    document.getElementById("mc"),
    document.getElementById("mr")
];

document.getElementById("mc").addEventListener('click', () => {
    if(!memoryUsed)return;
    memory = 0;
    memoryUsed = false;
    ar.forEach((x)=>x.classList.add("memory-button-disabled"))
});
document.getElementById("mr").addEventListener('click', () => {
    if(!memoryUsed)return;
    result = String(memory);
    if(result < 0){
        sign = "-";
    }
    updateResultDiv();
});
document.getElementById("mplus").addEventListener('click', () => memoryOp("+"));
document.getElementById("mminus").addEventListener('click', () => memoryOp("-"));
document.getElementById("mstore").addEventListener('click', () => memoryOp(""));

function memoryOp(op){
    if(op == "+"){
        memory += Number(result);
    }else if(op == "-"){
        memory -= Number(result);
    }else{
        memory = Number(result);
    }
    memoryUsed = true;

    memoryIndicator.classList.remove("memory-button-disabled");
    memoryClear.classList.remove("memory-button-disabled");
    memoryRecall.classList.remove("memory-button-disabled");
    

}
// document.getElementById("mshow").addEventListener('click', () => {});


function updateResultDiv() {
    fmax = 8;
    fmin = 4.5;
    fdiff = fmax - fmin;
    
    resultDiv.style.fontSize = String(fmax - (fdiff / (lengthMax-1)) * result.replaceAll("-", "").replaceAll(".", "").length) + "cqw";
    resultDiv.textContent = result;
    // console.log(equation);
}

function updateEquation(operation) {
    let modifiedEq = equation;
    modifiedEq = modifiedEq.replaceAll("Math.sqrt(", "sqrt(");
    modifiedEq = modifiedEq.replaceAll("Math.log10(","log(");
    modifiedEq = modifiedEq.replaceAll("Math.log(","ln(");
    modifiedEq = modifiedEq.replaceAll("Math.sin(","sin(");
    modifiedEq = modifiedEq.replaceAll("Math.cos(","cos(");
    modifiedEq = modifiedEq.replaceAll("Math.tan(", "tan(");
    
    // console.log(modifiedEq);

    if (operation == " = ") {
        equationDiv.textContent = modifiedEq + operation;
    }
    else{
        equationDiv.textContent = modifiedEq + lastOperation;
    }
    // console.log(equation);
}

updateResultDiv();