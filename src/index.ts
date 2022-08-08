/** 計算機の描画を行うクラス */
class Calculator {
  context = new CalculatorContext();
  /** 演算子のボタンのデフォルトのクラス */
  defaultOperatorButtonClasses = "calculator-button calculator-button-operator";
  /** 計算機の要素 */
  elements: {
    elDisplayedText: HTMLElement;
    el0: HTMLElement;
    el1: HTMLElement;
    el2: HTMLElement;
    el3: HTMLElement;
    el4: HTMLElement;
    el5: HTMLElement;
    el6: HTMLElement;
    el7: HTMLElement;
    el8: HTMLElement;
    el9: HTMLElement;
    elDot: HTMLElement;
    elC: HTMLElement;
    elPlusMinus: HTMLElement;
    elPercent: HTMLElement;
    elDivide: HTMLElement;
    elMultiply: HTMLElement;
    elMinus: HTMLElement;
    elPlus: HTMLElement;
    elEqual: HTMLElement;
  } = {
    // 表示される値
    elDisplayedText: document.getElementById("displayed-text")!,
    // 数値
    el0: document.getElementById("0")!,
    el1: document.getElementById("1")!,
    el2: document.getElementById("2")!,
    el3: document.getElementById("3")!,
    el4: document.getElementById("4")!,
    el5: document.getElementById("5")!,
    el6: document.getElementById("6")!,
    el7: document.getElementById("7")!,
    el8: document.getElementById("8")!,
    el9: document.getElementById("9")!,
    elDot: document.getElementById("dot")!,
    // 入力中の数値への操作
    elC: document.getElementById("C")!,
    elPlusMinus: document.getElementById("plus-minus")!,
    elPercent: document.getElementById("percent")!,
    // 演算子
    elDivide: document.getElementById("divide")!,
    elMultiply: document.getElementById("multiply")!,
    elMinus: document.getElementById("minus")!,
    elPlus: document.getElementById("plus")!,
    elEqual: document.getElementById("equal")!,
  };
  /** クリックされた際に状態と描画の更新を行う */
  handleClick(text: string) {
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
    this.elements.elDot.addEventListener("click", () =>
      this.handleClick("dot")
    );
    this.elements.elC.addEventListener("click", () => this.handleClick("C"));
    this.elements.elPlusMinus.addEventListener("click", () =>
      this.handleClick("plus-minus")
    );
    this.elements.elPercent.addEventListener("click", () =>
      this.handleClick("percent")
    );
    this.elements.elDivide.addEventListener("click", () =>
      this.handleClick("divide")
    );
    this.elements.elMultiply.addEventListener("click", () =>
      this.handleClick("multiply")
    );
    this.elements.elMinus.addEventListener("click", () =>
      this.handleClick("minus")
    );
    this.elements.elPlus.addEventListener("click", () =>
      this.handleClick("plus")
    );
    this.elements.elEqual.addEventListener("click", () =>
      this.handleClick("equal")
    );
    this.render();
  }
}
/** 演算子の種類 */
type Operators = "divide" | "multiply" | "minus" | "plus";
/**
 * 計算機のContextの保持を行うクラス
 */
class CalculatorContext {
  /** Stateオブジェクト
   *
   * 定性的な状態を表す役割とクリックされた際の処理の実装を持つ
   */
  state: State;
  /** ディスプレイ上でクリックされたとわかる演算子 */
  activeOperator: Operators | undefined;
  /** ディスプレイ上に表示される数値 */
  displayedText: string;
  /** 直前に確定した計算結果 */
  prevValue: number;
  /** 直前に入力が確定した演算子 */
  prevOperator: Operators;
  /** isAC=trueのときにCではなくACが表示される */
  isAC: boolean;
  /** .がクリックされたが、まだ小数点以降の数値が入力されていない状態を表す */
  hasLastDot: boolean;
  /** Contextの初期状態を取得するstaticメソッド */
  static getInitialContext() {
    return {
      activeOperator: undefined,
      displayedTex: "0",
      isA: false,
      hasLastDo: false,
      prevVal: 0,
      prevOperator: "plus" as const,
      state: new InitialNumberInputState(),
    };
  }

  constructor() {
    this.activeOperator = undefined;
    this.displayedText = "0";
    this.isAC = false;
    this.hasLastDot = false;
    this.prevValue = 0;
    this.prevOperator = "plus";
    this.state = new InitialNumberInputState();
  }

  /** contextの値を部分的に更新するためのメソッド */
  set(newContext: Partial<CalculatorContext>): void {
    Object.assign(this, newContext);
  }
}
/** StateはContextの更新の処理を行う */
abstract class State {
  /** 各抽象メソッドの実行を制御するテンプレートメソッド
   *
   * 書くメソッドは具象クラスで実装される
   */
  handle(context: CalculatorContext, text: string): void {
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(text)) {
      this.handleNumber(context, text);
    } else if (text === "plus-minus") {
      this.handlePlusMinus(context);
    } else if (text === "percent") {
      this.handlePercent(context);
    } else if (text === "dot") {
      this.handleDot(context);
    } else if (
      text === "divide" ||
      text === "multiply" ||
      text === "minus" ||
      text === "plus"
    ) {
      this.handleOperator(context, text);
    } else if (text === "equal") {
      this.handleEqual(context);
    } else if (text === "C") {
      this.handleC(context);
    }
  }
  /** 0~9の数字がクリックされたときの処理 */
  abstract handleNumber(context: CalculatorContext, text: string): void;
  /** ±がクリックされたときの処理 */
  abstract handlePlusMinus(context: CalculatorContext): void;
  /** %がクリックされたときの処理 */
  abstract handlePercent(context: CalculatorContext): void;
  /** .がクリックされたときの処理 */
  abstract handleDot(context: CalculatorContext): void;
  /** +,-,÷,×がクリックされたときの処理 */
  abstract handleOperator(context: CalculatorContext, text: Operators): void;
  /** =がクリックされたときの処理 */
  abstract handleEqual(context: CalculatorContext): void;
  /** CまたはACがクリックされたときの処理 */
  abstract handleC(context: CalculatorContext): void;
  /** 数字がクリックされた時に表示される値を計算する */
  protected appendNumber(current: string, text: string): string {
    if (current === "0") {
      return text;
    } else if (current === "-0") {
      return "-" + text;
    }
    return current + text;
  }
  /** ％がクリックされたときの表示される値を計算する */
  protected calcPercent(current: string) {
    return String(this.textToNumber(current) / 100);
  }
  /** ±がクリックされたときに表示される値を計算する  */
  protected calcPlusMinus(current: string) {
    return current.charAt(0) === "-" ? current.replace("-", "") : "-" + current;
  }
  /** 計算を実行する */
  protected calcNumber(
    prev: number,
    current: number,
    operator: Operators
  ): number {
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
  protected textToNumber(text: string): number {
    return parseFloat(text);
  }
}
/** 初期状態または初期状態から数値のみが入力された状態 */
class InitialNumberInputState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: this.appendNumber(context.displayedText, text),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      prevValue: this.textToNumber(context.displayedText),
      state: new OperatorInputState(),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      isAC: true,
      displayedText: "0",
      state: new ACInitialState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    if (!context.displayedText.includes(".")) {
      context.set({
        hasLastDot: true,
        state: new DotInitialState(),
      });
    }
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPercent(context.displayedText),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus(context.displayedText),
    });
  }

  handleEqual(context: CalculatorContext): void {}
}
/** 初期状態で.がクリックされた状態 */
class DotInitialState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: context.displayedText + "." + text,
      hasLastDot: false,
      state: new InitialNumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus(context.displayedText),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPercent(context.displayedText),
      hasLastDot: false,
      state: new InitialNumberInputState(),
    });
  }

  handleC(context: CalculatorContext): void {
    context.set({
      isAC: true,
      hasLastDot: false,
      displayedText: "0",
      state: new ACInitialState(),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      prevValue: this.textToNumber(context.displayedText),
      hasLastDot: false,
      state: new OperatorInputState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      hasLastDot: false,
      state: new InitialNumberInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {
    context.set({
      hasLastDot: false,
      state: new InitialNumberInputState(),
    });
  }
}
/** 演算子がクリックされた状態 */
class OperatorInputState extends State {
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      hasLastDot: true,
      activeOperator: undefined,
      prevOperator: context.activeOperator,
      state: new DotState(),
    });
  }
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: text,
      prevOperator: context.activeOperator,
      activeOperator: undefined,
      state: new NumberInputState(),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      isAC: true,
      state: new ACOperatorInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {
    context.set({
      prevOperator: context.activeOperator,
      activeOperator: undefined,
    });
    const result = this.calcNumber(
      context.prevValue,
      context.prevValue,
      context.prevOperator
    );
    context.set({
      displayedText: String(result),
      prevValue: result,
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      activeOperator: undefined,
      prevOperator: context.activeOperator,
      state: new NumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: "-0",
      activeOperator: undefined,
      prevOperator: context.activeOperator,
      state: new NumberInputState(),
    });
  }
}
/** 初期状態の後に1回以上演算子がクリックされた後に数値がクリックされた状態 */
class NumberInputState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: this.appendNumber(context.displayedText, text),
    });
  }
  handleDot(context: CalculatorContext): void {
    if (!context.displayedText.includes(".")) {
      context.set({
        hasLastDot: true,
        state: new DotState(),
      });
    }
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPercent(context.displayedText),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus(context.displayedText),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      isAC: true,
      displayedText: "0",
      activeOperator: context.prevOperator,
      state: new ACNumberInputState(),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    const result = this.calcNumber(
      context.prevValue,
      this.textToNumber(context.displayedText),
      context.prevOperator
    );
    context.set({
      prevValue: result,
      activeOperator: text,
      hasLastDot: false,
      displayedText: String(result),
      state: new OperatorInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {
    const result = this.calcNumber(
      context.prevValue,
      this.textToNumber(context.displayedText),
      context.prevOperator
    );
    context.set({
      prevValue: result,
      displayedText: String(result),
      state: new AfterEqualState(),
    });
  }
}
/** 初期状態の後に1回以上演算子がクリックされた後に.がクリックされた状態 */
class DotState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: context.displayedText + "." + text,
      hasLastDot: false,
      state: new NumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus(context.displayedText),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPercent(context.displayedText),
      hasLastDot: false,
      state: new NumberInputState(),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      isAC: true,
      hasLastDot: false,
      displayedText: "0",
      state: new ACNumberInputState(),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    const result = this.calcNumber(
      context.prevValue,
      this.textToNumber(context.displayedText),
      context.prevOperator
    );
    context.set({
      activeOperator: text,
      prevValue: result,
      displayedText: String(result),
      hasLastDot: false,
      state: new OperatorInputState(),
    });
  }

  handleDot(context: CalculatorContext): void {
    context.set({
      hasLastDot: false,
      state: new NumberInputState(),
    });
  }

  handleEqual(context: CalculatorContext): void {
    const result = this.calcNumber(
      context.prevValue,
      this.textToNumber(context.displayedText),
      context.prevOperator
    );
    context.set({
      prevValue: result,
      hasLastDot: false,
      displayedText: String(result),
      state: new AfterEqualState(),
    });
  }
}
/** =がクリックされたあとの状態 */
class AfterEqualState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: text,
      state: new InitialNumberInputState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      hasLastDot: true,
      state: new DotInitialState(),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      state: new InitialNumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus("0"),
      state: new InitialNumberInputState(),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      isAC: true,
      displayedText: "0",
      state: new ACInitialState(),
    });
  }
  handleEqual(context: CalculatorContext): void {}
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      prevValue: this.textToNumber(context.displayedText),
      state: new OperatorInputState(),
    });
  }
}
/** 初期状態でCがクリックされた状態 */
class ACInitialState extends State {
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: text,
      isAC: false,
      state: new InitialNumberInputState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      isAC: false,
      state: new DotInitialState(),
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({
      ...new CalculatorContext(),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      prevValue: 0,
      isAC: false,
      state: new OperatorInputState(),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      isAC: false,
      state: new InitialNumberInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {
    context.set({
      isAC: false,
      state: new InitialNumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: "-0",
      isAC: false,
      state: new InitialNumberInputState(),
    });
  }
}
/** NumberInputStateでCがクリックされた状態 */
class ACNumberInputState extends State {
  handleC(context: CalculatorContext): void {
    context.set({ ...CalculatorContext.getInitialContext() });
  }
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: text,
      activeOperator: undefined,
      isAC: false,
      state: new NumberInputState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      activeOperator: undefined,
      hasLastDot: true,
      isAC: false,
      state: new DotState(),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      activeOperator: undefined,
      isAC: false,
      state: new NumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: this.calcPlusMinus("0"),
      activeOperator: undefined,
      isAC: false,
      state: new NumberInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {
    context.set({
      displayedText: String(context.prevValue),
      activeOperator: undefined,
      isAC: false,
      state: new AfterEqualState(),
    });
  }
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      isAC: false,
      state: new OperatorInputState(),
    });
  }
}
/** OperatorInputStateでCがクリックされた状態 */
class ACOperatorInputState extends State {
  handleOperator(context: CalculatorContext, text: Operators): void {
    context.set({
      activeOperator: text,
      state: new OperatorInputState(),
      isAC: false,
    });
  }
  handleC(context: CalculatorContext): void {
    context.set({ ...CalculatorContext.getInitialContext() });
  }
  handleNumber(context: CalculatorContext, text: string): void {
    context.set({
      displayedText: text,
      prevOperator: context.activeOperator,
      isAC: false,
      state: new NumberInputState(),
    });
  }
  handleDot(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      prevOperator: context.activeOperator,
      hasLastDot: true,
      isAC: false,
      state: new DotState(),
    });
  }
  handlePercent(context: CalculatorContext): void {
    context.set({
      displayedText: "0",
      prevOperator: context.activeOperator,
      isAC: false,
      state: new NumberInputState(),
    });
  }
  handlePlusMinus(context: CalculatorContext): void {
    context.set({
      displayedText: "-0",
      isAC: false,
      prevOperator: context.activeOperator,
      state: new NumberInputState(),
    });
  }
  handleEqual(context: CalculatorContext): void {}
}
/** main関数 */
function main() {
  const context = new Calculator();
  context.start();
}

main();
