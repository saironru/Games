import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnakeComponent } from './snake/snake.component';
import { SeabattleComponent } from './seabattle/seabattle.component';
import { MazeComponent } from './maze/maze.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelloComponent } from './hello/hello.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';


@NgModule({
  declarations: [
    AppComponent,
    SnakeComponent,
    SeabattleComponent,
    MazeComponent,
    NotFoundComponent,
    MenuComponent,
    HelloComponent,
    TicTacToeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
