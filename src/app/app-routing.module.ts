import { HelloComponent } from './hello/hello.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnakeComponent } from './snake/snake.component';
import { SeabattleComponent } from './seabattle/seabattle.component';
import { MazeComponent } from './maze/maze.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HelloComponent, pathMatch: 'full', data: { title: 'Главная' }  },
  { path: 'snake', component: SnakeComponent, data: { title: 'Змейка', color: '#bdef53' } },
  { path: 'seabattle', component: SeabattleComponent, data: { title: 'Морской бой', color: '#93cadf' } },
  { path: 'maze', component: MazeComponent, data: { title: 'Лабиринт', color: 'yellow' } },
  { path: 'tic-tac-toe', component: TicTacToeComponent, data: { title: 'Крестики-Нолики', color: '#e9723d' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Error 404: Not Found', color: 'red' }  }
];
// , { useHash: true }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
