import { Component } from '@angular/core';
import { evaluate } from '@cloudmark/evaluator';

// I needed to redeclare that type, cz unfortunately it is not exported from the lib.
type Result<Input, Output> = {
  success: true;
  value: Output;
  rest: Input;
  column: number;
} | {
  success: false;
  reason: string;
  column: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  expression: string = '';
  errorMessage: string | null = null;
  history: { expression: string; val: number }[] = [];
  response: Result<string, number>
  numbersArray: string[];

  commandKeyMapping = {
    delete: {key: 'DEL'},
    clear: {key: 'AC'},
    plus: {key: '+'},
    minus: {key: '-'},
    multiply: {key: '*'},
    divide: {key: '/'},
  }
  constructor() {
    this.numbersArray = Array.from({ length: 9 }, (_, index) => `${9 - index}`);
  }

  getObjectKeys(obj: Record<string, Record<string, string>>): string[] {
    return Object.keys(obj);
  }

  onInputChange() {
    this.errorMessage = null;

    this.response = evaluate(this.expression);

    if (this.response.success == false) {
      this.errorMessage = this.response.reason;
    }
  }

  addToHistory(expression: string, val: number) {
    this.history.unshift({ expression, val });
    if (this.history.length > 5) {
      this.history.pop();
    }
  }

  command(command) {
    switch (command) {
      case this.commandKeyMapping.delete.key: {
        this.expression = this.expression.slice(0,-1);
        break;
      }
      case this.commandKeyMapping.clear.key: {
        this.expression = '';
        break;
      }
    }

    if (this.expression.length) {
      this.onInputChange();
    }
  }

  concat(symbol: string) {
    this.expression += symbol;

    this.onInputChange();
  }
  calculate() {
    if (this.response.success) {
      this.addToHistory(this.expression, this.response.value);
      this.expression = this.response.value+'';
      this.errorMessage = null;
    }

    if (this.response.success == false){
      this.errorMessage = this.response.reason;
    }
  }
}
