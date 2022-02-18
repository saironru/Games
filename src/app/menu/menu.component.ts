import { Router } from '@angular/router';
import { Component, OnInit, DoCheck } from '@angular/core';

class GameListItem {
  constructor(public title: string, public url: string) {}
}

@Component({
  selector: 'top-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  gameList: Array<GameListItem> = [
    new GameListItem('Главная', '/'),
    new GameListItem('Лабиринт', '/maze'),
    new GameListItem('Морской бой', '/seabattle'),
    new GameListItem('Змейка', '/snake'),
    new GameListItem('Крестики-Нолики', '/tic-tac-toe')
  ];

  gameMenu: Array<GameListItem> = [];

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    console.log('DO CHECK')
    this.gameMenu = this.gameList.filter(i => i.url !== this.router.url);


  }

}
