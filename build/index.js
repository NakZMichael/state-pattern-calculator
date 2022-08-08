"use strict";
/** 計算機の描画を行うクラス */
class Calculator {
    constructor() {
        this.context = new CalculatorContext();
        /** 演算子のボタンのデフォルトのクラス */
        this.defaultOperatorButtonClasses = "calculator-button calculator-button-operator";
        /** 計算機の要素 */
        this.elements = {
            // 表示される値
            elDisplayedText: document.getElementById("displayed-text"),
            // 数値
            el0: document.getElementById("0"),
            el1: document.getElementById("1"),
            el2: document.getElementById("2"),
            el3: document.getElementById("3"),
            el4: document.getElementById("4"),
            el5: document.getElementById("5"),
            el6: document.getElementById("6"),
            el7: document.getElementById("7"),
            el8: document.getElementById("8"),
            el9: document.getElementById("9"),
            elDot: document.getElementById("dot"),
            // 入力中の数値への操作
            elC: document.getElementById("C"),
            elPlusMinus: document.getElementById("plus-minus"),
            elPercent: document.getElementById("percent"),
            // 演算子
            elDivide: document.getElementById("divide"),
            elMultiply: document.getElementById("multiply"),
            elMinus: document.getElementById("minus"),
            elPlus: document.getElementById("plus"),
            elEqual: document.getElementById("equal"),
        };
    }
    /** クリックされた際に状態と描画の更新を行う */
    handleClick(text) {
        this.context.state.handle(this.context, text);
        this.render();
    }
    /**
     * contextの値に基づいて描画を行う
     */
    render() {
        // ACかどうかの処理
        this.elements.elC.textContent = this.context.isAC ? "AC" : "C";
        // 表示されている数値の処理
        this.elements.elDisplayedText.textContent =
            String(this.context.displayedText) + (this.context.hasLastDot ? "." : "");
        // クリックされた演算子ボタンの処理
        this.elements.elDivide.className = this.defaultOperatorButtonClasses;
        this.elements.elMultiply.className = this.defaultOperatorButtonClasses;
        this.elements.elMinus.className = this.defaultOperatorButtonClasses;
        this.elements.elPlus.className = this.defaultOperatorButtonClasses;
        switch (this.context.activeOperator) {
            case "divide": {
                this.elements.elDivide.className +=
                    " calculator-button-active-operator";
                break;
            }
            case "multiply": {
                this.elements.elMultiply.className +=
                    " calculator-button-active-operator";
                break;
            }
            case "minus": {
                this.elements.elMinus.className += " calculator-button-active-operator";
                break;
            }
            case "plus": {
                this.elements.elPlus.className += " calculator-button-active-operator";
                break;
            }
        }
    }
    /** 初期化処理 */
    start() {
        this.elements.el0.addEventListener("click", () => this.handleClick("0"));
        this.elements.el1.addEventListener("click", () => this.handleClick("1"));
        this.elements.el2.addEventListener("click", () => this.handleClick("2"));
        this.elements.el3.addEventListener("click", () => this.handleClick("3"));
        this.elements.el4.addEventListener("click", () => this.handleClick("4"));
        this.elements.el5.addEventListener("click", () => this.handleClick("5"));
        this.elements.el6.addEventListener("click", () => this.handleClick("6"));
        this.elements.el7.addEventListener("click", () => this.handleClick("7"));
        this.elements.el8.addEventListener("click", () => this.handleClick("8"));
        this.elements.el9.addEventListener("click", () => this.handleClick("9"));
        this.elements.elDot.addEventListener("click", () => this.handleClick("dot"));
        this.elements.elC.addEventListener("click", () => this.handleClick("C"));
        this.elements.elPlusMinus.addEventListener("click", () => this.handleClick("plus-minus"));
        this.elements.elPercent.addEventListener("click", () => this.handleClick("percent"));
        this.elements.elDivide.addEventListener("click", () => this.handleClick("divide"));
        this.elements.elMultiply.addEventListener("click", () => this.handleClick("multiply"));
        this.elements.elMinus.addEventListener("click", () => this.handleClick("minus"));
        this.elements.elPlus.addEventListener("click", () => this.handleClick("plus"));
        this.elements.elEqual.addEventListener("click", () => this.handleClick("equal"));
        this.render();
    }
}
/**
 * 計算機のContextの保持を行うクラス
 */
class CalculatorContext {
    constructor() {
        this.activeOperator = undefined;
        this.displayedText = "0";
        this.isAC = false;
        this.hasLastDot = false;
        this.prevValue = 0;
        this.prevOperator = "plus";
        this.state = new InitialNumberInputState();
    }
    static getInitialState() {
        return {
            activeOperator: undefined,
            displayedTex: "0",
            isA: false,
            hasLastDo: false,
            prevVal: 0,
            prevOperator: "plus",
            state: new InitialNumberInputState(),
        };
    }
    /** contextの値を部分的に更新するためのメソッド */
    setContext(newContext) {
        Object.assign(this, newContext);
    }
}
/** StateはContextの更新の処理を行う */
class State {
    /** 各抽象メソッドの実行を制御するテンプレートメソッド
     *
     * 書くメソッドは具象クラスで実装される
     */
    handle(context, text) {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(text)) {
            this.handleNumber(context, text);
        }
        else if (text === "plus-minus") {
            this.handlePlusMinus(context);
        }
        else if (text === "percent") {
            this.handlePercent(context);
        }
        else if (text === "dot") {
            this.handleDot(context);
        }
        else if (text === "divide" ||
            text === "multiply" ||
            text === "minus" ||
            text === "plus") {
            this.handleOperator(context, text);
        }
        else if (text === "equal") {
            this.handleEqual(context);
        }
        else if (text === "C") {
            this.handleC(context);
        }
    }
    /** 数字がクリックされた時に表示される値を計算する */
    appendNumber(current, text) {
        if (current === "0") {
            return text;
        }
        else if (current === "-0") {
            return "-" + text;
        }
        return current + text;
    }
    /** ％がクリックされたときの表示される値を計算する */
    calcPercent(current) {
        return String(this.textToNumber(current) / 100);
    }
    /** ±がクリックされたときに表示される値を計算する  */
    calcPlusMinus(current) {
        return current.charAt(0) === "-" ? current.replace("-", "") : "-" + current;
    }
    /** 計算を実行する */
    calcNumber(prev, current, operator) {
        switch (operator) {
            case "divide":
                // 割り算は小数点10桁まで計算して四捨五入する
                return Math.floor((prev * 10 ** 10) / current) / 10 ** 10;
            case "multiply":
                return prev * current;
            case "minus":
                return prev - current;
            case "plus":
                return prev + current;
        }
    }
    /** 表示されているテキストを数値に変換する */
    textToNumber(text) {
        return parseFloat(text);
    }
}
/** 初期状態または初期状態から数値のみが入力された状態 */
class InitialNumberInputState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: this.appendNumber(context.displayedText, text),
        });
    }
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            prevValue: this.textToNumber(context.displayedText),
            state: new OperatorInputState(),
        });
    }
    handleC(context) {
        context.setContext({
            isAC: true,
            displayedText: "0",
            state: new ACInitialState(),
        });
    }
    handleDot(context) {
        if (!context.displayedText.includes(".")) {
            context.setContext({
                hasLastDot: true,
                state: new DotInitialState(),
            });
        }
    }
    handlePercent(context) {
        context.setContext({
            displayedText: this.calcPercent(context.displayedText),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus(context.displayedText),
        });
    }
    handleEqual(context) { }
}
/** 初期状態で.がクリックされた状態 */
class DotInitialState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: context.displayedText + "." + text,
            hasLastDot: false,
            state: new InitialNumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus(context.displayedText),
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: this.calcPercent(context.displayedText),
            hasLastDot: false,
            state: new InitialNumberInputState(),
        });
    }
    handleC(context) {
        context.setContext({
            isAC: true,
            hasLastDot: false,
            displayedText: "0",
            state: new ACInitialState(),
        });
    }
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            prevValue: this.textToNumber(context.displayedText),
            hasLastDot: false,
            state: new OperatorInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            hasLastDot: false,
            state: new InitialNumberInputState(),
        });
    }
    handleEqual(context) {
        context.setContext({
            hasLastDot: false,
            state: new InitialNumberInputState(),
        });
    }
}
/** 演算子がクリックされた状態 */
class OperatorInputState extends State {
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
        });
    }
    handleDot(context) {
        context.setContext({
            displayedText: "0",
            hasLastDot: true,
            activeOperator: undefined,
            prevOperator: context.activeOperator,
            state: new DotState(),
        });
    }
    handleNumber(context, text) {
        context.setContext({
            displayedText: text,
            prevOperator: context.activeOperator,
            activeOperator: undefined,
            state: new NumberInputState(),
        });
    }
    handleC(context) {
        context.setContext({
            displayedText: "0",
            isAC: true,
            state: new ACOperatorInputState(),
        });
    }
    handleEqual(context) {
        context.setContext({
            prevOperator: context.activeOperator,
            activeOperator: undefined,
        });
        const result = this.calcNumber(context.prevValue, context.prevValue, context.prevOperator);
        context.setContext({
            displayedText: String(result),
            prevValue: result,
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: "0",
            activeOperator: undefined,
            prevOperator: context.activeOperator,
            state: new NumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: "-0",
            activeOperator: undefined,
            prevOperator: context.activeOperator,
            state: new NumberInputState(),
        });
    }
}
/** 初期状態の後に1回以上演算子がクリックされた後に数値がクリックされた状態 */
class NumberInputState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: this.appendNumber(context.displayedText, text),
        });
    }
    handleDot(context) {
        if (!context.displayedText.includes(".")) {
            context.setContext({
                hasLastDot: true,
                state: new DotState(),
            });
        }
    }
    handlePercent(context) {
        context.setContext({
            displayedText: this.calcPercent(context.displayedText),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus(context.displayedText),
        });
    }
    handleC(context) {
        context.setContext({
            isAC: true,
            displayedText: "0",
            activeOperator: context.prevOperator,
            state: new ACNumberInputState(),
        });
    }
    handleOperator(context, text) {
        const result = this.calcNumber(context.prevValue, this.textToNumber(context.displayedText), context.prevOperator);
        context.setContext({
            prevValue: result,
            activeOperator: text,
            hasLastDot: false,
            displayedText: String(result),
            state: new OperatorInputState(),
        });
    }
    handleEqual(context) {
        const result = this.calcNumber(context.prevValue, this.textToNumber(context.displayedText), context.prevOperator);
        context.setContext({
            prevValue: result,
            displayedText: String(result),
            state: new AfterEqualState(),
        });
    }
}
/** 初期状態の後に1回以上演算子がクリックされた後に.がクリックされた状態 */
class DotState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: context.displayedText + "." + text,
            hasLastDot: false,
            state: new NumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus(context.displayedText),
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: this.calcPercent(context.displayedText),
            hasLastDot: false,
            state: new NumberInputState(),
        });
    }
    handleC(context) {
        context.setContext({
            isAC: true,
            hasLastDot: false,
            displayedText: "0",
            state: new ACNumberInputState(),
        });
    }
    handleOperator(context, text) {
        const result = this.calcNumber(context.prevValue, this.textToNumber(context.displayedText), context.prevOperator);
        context.setContext({
            activeOperator: text,
            prevValue: result,
            displayedText: String(result),
            hasLastDot: false,
            state: new OperatorInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            hasLastDot: false,
            state: new NumberInputState(),
        });
    }
    handleEqual(context) {
        const result = this.calcNumber(context.prevValue, this.textToNumber(context.displayedText), context.prevOperator);
        context.setContext({
            prevValue: result,
            hasLastDot: false,
            displayedText: String(result),
            state: new AfterEqualState(),
        });
    }
}
/** =がクリックされたあとの状態 */
class AfterEqualState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: text,
            state: new InitialNumberInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            displayedText: "0",
            hasLastDot: true,
            state: new DotInitialState(),
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: "0",
            state: new InitialNumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus("0"),
            state: new InitialNumberInputState(),
        });
    }
    handleC(context) {
        context.setContext({
            isAC: true,
            displayedText: "0",
            state: new ACInitialState(),
        });
    }
    handleEqual(context) { }
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            prevValue: this.textToNumber(context.displayedText),
            state: new OperatorInputState(),
        });
    }
}
/** 初期状態でCがクリックされた状態 */
class ACInitialState extends State {
    handleNumber(context, text) {
        context.setContext({
            displayedText: text,
            isAC: false,
            state: new InitialNumberInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            displayedText: "0",
            isAC: false,
            state: new DotInitialState(),
        });
    }
    handleC(context) {
        context.setContext(Object.assign({}, new CalculatorContext()));
    }
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            prevValue: 0,
            isAC: false,
            state: new OperatorInputState(),
        });
    }
    handlePercent(context) {
        context.setContext({
            isAC: false,
            state: new InitialNumberInputState(),
        });
    }
    handleEqual(context) {
        context.setContext({
            isAC: false,
            state: new InitialNumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: "-0",
            isAC: false,
            state: new InitialNumberInputState(),
        });
    }
}
/** NumberInputStateでCがクリックされた状態 */
class ACNumberInputState extends State {
    handleC(context) {
        context.setContext(Object.assign({}, CalculatorContext.getInitialState()));
    }
    handleNumber(context, text) {
        context.setContext({
            displayedText: text,
            activeOperator: undefined,
            isAC: false,
            state: new NumberInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            displayedText: "0",
            activeOperator: undefined,
            hasLastDot: true,
            isAC: false,
            state: new DotState(),
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: "0",
            activeOperator: undefined,
            isAC: false,
            state: new NumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: this.calcPlusMinus("0"),
            activeOperator: undefined,
            isAC: false,
            state: new NumberInputState(),
        });
    }
    handleEqual(context) {
        context.setContext({
            displayedText: String(context.prevValue),
            activeOperator: undefined,
            isAC: false,
            state: new AfterEqualState(),
        });
    }
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            isAC: false,
            state: new OperatorInputState(),
        });
    }
}
/** OperatorInputStateでCがクリックされた状態 */
class ACOperatorInputState extends State {
    handleOperator(context, text) {
        context.setContext({
            activeOperator: text,
            state: new OperatorInputState(),
            isAC: false,
        });
    }
    handleC(context) {
        context.setContext(Object.assign({}, CalculatorContext.getInitialState()));
    }
    handleNumber(context, text) {
        context.setContext({
            displayedText: text,
            prevOperator: context.activeOperator,
            isAC: false,
            state: new NumberInputState(),
        });
    }
    handleDot(context) {
        context.setContext({
            displayedText: "0",
            prevOperator: context.activeOperator,
            hasLastDot: true,
            isAC: false,
            state: new DotState(),
        });
    }
    handlePercent(context) {
        context.setContext({
            displayedText: "0",
            prevOperator: context.activeOperator,
            isAC: false,
            state: new NumberInputState(),
        });
    }
    handlePlusMinus(context) {
        context.setContext({
            displayedText: "-0",
            isAC: false,
            prevOperator: context.activeOperator,
            state: new NumberInputState(),
        });
    }
    handleEqual(context) { }
}
/** main関数 */
function main() {
    const context = new Calculator();
    context.start();
}
main();
