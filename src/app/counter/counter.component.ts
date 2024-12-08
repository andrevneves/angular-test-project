import { Component } from '@angular/core';
import { setTimeout } from 'node:timers/promises';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  counter = 0;

  increment() {
    // const s = 'M'
    const x = 1
    if (x == 1) {
      console.log("22")
    }
    this.counter++;

    setInterval(() => {
      console.log("timeInterval")
    }, 1000);

    setTimeout(100, () => {
      console.log("setTimeout")});
  }
}
