import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

titleColorStyle: Object = {};

  constructor(private router: Router, public titleService: Title ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router)
      )
      .subscribe((event) => {
          const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
          this.titleService.setTitle(title);
          this.titleColorStyle = {'color': this.getColor(this.router.routerState, this.router.routerState.root).join(' | ')};
        }
      );
      this.router.events.subscribe(event =>{
        if (event instanceof NavigationStart){
         console.log('navigation start')
        }
     })
  }

  getTitle(state: any, parent: any): Array<string> {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  getColor(state: any, parent: any): Array<string> {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.color);
    }

    if (state && parent) {
      data.push(... this.getColor(state, state.firstChild(parent)));
    }
    return data;
  }

}
