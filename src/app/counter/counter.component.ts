import { Component } from '@angular/core';

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
    if (x = 1) {
      console.log("1")
    }
    this.counter++;
  }
}
