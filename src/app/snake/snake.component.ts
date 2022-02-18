import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

type EmptyFieldsObj = {
  [key: string]: boolean
}

// Класс нового таймера, с методами паузы и продолжения
class Timer {

  timerId: number 
  startTime: number
  remaining: number
  pauseOn: boolean
  pauseTime: number | undefined | null;
  pause: Function
  resume: Function
  stop: Function
  info: Function

  constructor(callback: Function, delay: number) {

    this.pauseOn = false;
    this.remaining = delay;
    this.startTime = Date.now();
    this.timerId = window.setTimeout(callback, this.remaining);

    this.pause = function() {
        if (!this.pauseOn) {
        window.clearTimeout(this.timerId);
        this.remaining -= Date.now() - this.startTime;
        this.pauseOn = true;
        this.pauseTime = Date.now();
        }
    };

    this.resume = function() {
        if (this.pauseOn) {
        this.startTime = Date.now();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(callback, this.remaining);
        this.pauseOn = false;
        this.pauseTime = null;
        }
    };
 
    this.stop = function() {
        window.clearTimeout(this.timerId);
    }
  
    this.info = function() {
        console.log('timerId', this.timerId);
        console.log('startTime', this.startTime);
        console.log('remaining', this.remaining);
        console.log('pauseOn', this.pauseOn);
        console.log('t', this.remaining-(Date.now()-(this.pauseTime || this.startTime)));
    }

  }
  
};


@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
  // <------ encapsulation: ViewEncapsulation.None, 
  host: {'(document:keydown)': 'handleKeyboardEvent($event)'}
})
export class SnakeComponent implements OnInit, OnDestroy {

  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
    event.preventDefault();
    const key = event.key; 
    // может принимать 4 значения "ArrowRight", "ArrowLeft", "ArrowUp", или "ArrowDown"
  switch (key) {
  case 'ArrowLeft':
    this.moveDirection = this.moveLeft;
    break;
  case 'ArrowRight':
    this.moveDirection = this.moveRight;
    break;
  case 'ArrowUp':
    this.moveDirection = this.moveUp;
    break;
  case 'ArrowDown':
    this.moveDirection = this.moveDown;
    break;
}
  }

  ngOnInit(): void {
      console.log('SNAKE ONINIT!');
  }

  ngOnDestroy(): void {
      this.stopAudio();
      this.gameOver();
  }

  constructor() {}

  playAudio(){
    if (this.flagMusicLoad) {
      this.audio.src = "../assets/music/AlmostHuman.aac";
      this.audio.load();
      this.audio.loop = true;
    }
    this.flagMusicLoad = false;
    this.audio.play();
  }

  pauseAudio() {
    this.audio.pause()
  }

  stopAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  audio: HTMLAudioElement = new Audio();
  flagMusicLoad: boolean = true;
  timer: any
  size: number = 0;
  board: string[][] = []
  points: number = 0;
  moveDirection: Function = this.moveRight
  yIndex: any
  xIndex: any
  timeout: any
  timing: number = 0;
  emptyFieldsObj: EmptyFieldsObj = {}
  snakeArr: Array<[number, number]> = [[0, 0]]
  boardHTML: string[][] = []
  devinfo1HTML: string[] = []
  devinfo2HTML: string[] = []
  fieldEmpty: string = 'field empty';
  fieldSnake: string = 'field snake';
  fieldFood: string = 'field food';
  coordinatesEnabled: boolean = false;
  isGameOver: boolean = false;

  // "Поедание клетки" (пища/пусто/тело самой змеи)
  feed (foodCoord: [number, number]) {        
    if (this.board[foodCoord[0]][foodCoord[1]] === this.fieldFood) {
      // змея ест пищу 

      this.points++;
      this.timing = this.timing/1.03
      // ускорение змеи на 3% после каждого поедания пищи

      this.addFood();
    } else if (this.board[foodCoord[0]][foodCoord[1]] === this.fieldSnake) {
      // змея кусает сама себя 
      this.gameOver();
    } else {
      // змея перемещается на пустое поле 
      let tail = this.snakeArr.shift()
      // добавляем клетку хвоста змеи в объект пустых клеток
      this.emptyFieldsObj[tail![0]+'-'+tail![1]] = true
      this.board[tail![0]][tail![1]] = this.fieldEmpty
    }
    this.snakeArr.push(foodCoord)
    this.board[foodCoord[0]][foodCoord[1]] = this.fieldSnake
    // убираем клетку перед головой змеи из объекта пустых клеток
    delete this.emptyFieldsObj[foodCoord[0]+'-'+foodCoord[1]]
  }

  // Движение
  move () {
      this.timeout.stop();
      this.timeout = new Timer(this.move.bind(this), this.timing);
      this.moveDirection() // равно одной из функций moveRight, moveLeft, moveDown или moveUp

      // Изменяем представление доски
      this.boardHTML = this.board;

      this.devinfo1HTML = this.snakeArr.map(i=>i.join('-'));
      this.devinfo2HTML = Object.keys(this.emptyFieldsObj);
  }


  // Движение вправо
  moveRight () {
    if (this.xIndex < this.size-1) {
      this.feed([this.yIndex, this.xIndex+1])
      this.xIndex++
    } else {this.gameOver();}
  }
  
  // Движение влево
  moveLeft () {
    if (this.xIndex > 0) {
      this.feed([this.yIndex, this.xIndex-1])
      this.xIndex--
    } else {this.gameOver();}
  }
  
  // Движение вниз
  moveDown () {
    if (this.yIndex < this.size-1) {
      this.feed([this.yIndex+1, this.xIndex])
      this.yIndex++
    } else {this.gameOver();}
  }
  
  // Движение вверх
  moveUp () {
    if (this.yIndex > 0) {
      this.feed([this.yIndex-1, this.xIndex])
      this.yIndex--
    } else {this.gameOver();}
  }

  

  // Добавление еды на пустое поле доски
  addFood () {
  // Случайным образом выбираем место для еды из объекта для хранения пустых клеток поля 
  // чтоб не попасть на змейку
  // Получаем массив из ключей объекта для хранения пустых клеток
  let emptyFieldsArr = Object.keys(this.emptyFieldsObj);
  let randomEmptyFieldXY: string[] = emptyFieldsArr[Math.floor(Math.random()*emptyFieldsArr.length)].split('-')
  this.board[+randomEmptyFieldXY[0]][+randomEmptyFieldXY[1]] = this.fieldFood
  delete this.emptyFieldsObj[randomEmptyFieldXY[0]+'-'+randomEmptyFieldXY[1]]
  }

  // Завершение игры
  gameOver () {
    if (this.timeout) {
    this.timeout.stop();
    // Обнуляем не только таймер объекта window но и сам объект timeout
    this.timeout = null;
    // (!!!) Убрать таймаут
    setTimeout(()=>{this.isGameOver = true}, 0);
    }
  }

  initial() {
    console.log('startINITIAL')

    // Рисуем чистую доску (квадрат this.size x this.size заполненный пустыми клетками)
    this.size = 10;
    let boardLine = Array(this.size).fill(this.fieldEmpty);
    this.board = Array(this.size).fill(1).map(i=>boardLine.slice())
    
    // Обнуляем заработанные очки
    this.points = 0;

    // Ставим флаг проигрыша в состояние false
    this.isGameOver = false;
    
    // Начальный тайминг между "шагами" змеи
    this.timing = 600
    
    // Устанавливаем начальное направление движения змейки вправо
    this.moveDirection = this.moveRight;
    
    // Создаем пустой объект для хранения пустых клеток поля
    this.emptyFieldsObj = {};
    // Заполняем его всеми возможными клетками поля
    for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
            this.emptyFieldsObj[y+'-'+x] = true;
    }
    }
    
    // Рисуем начальное положение змейки примерно посередине доски
    let initialIndex = Math.floor(this.size/2);
    this.yIndex = initialIndex;
    this.xIndex = initialIndex;
    this.board[this.yIndex][this.xIndex] = this.fieldSnake;
    // Удаляем из объекта пустых клеток поля координаты этой клетки
    delete this.emptyFieldsObj[this.yIndex+'-'+this.xIndex]
    
    // Пустой массив, для координат клеток из которх состоит тело змеи
    this.snakeArr = []
    // Добавляем голову змеи в массив клеток тела змеи
    this.snakeArr.push([this.yIndex, this.xIndex])
    
    // Выводим на поле еду в случайное место игрового поля
    this.addFood();
    
    // Изменяем представление доски
    this.boardHTML = this.board;
      
    //console.log(this.boardHTML)
    console.log('endINITIAL')
    }

    btnStartFn() {
      console.log('start')
      this.initial();
      console.log(this.timeout)
      if (this.timeout) this.timeout.stop();
      this.timeout = new Timer(this.move.bind(this), this.timing)
      console.log(this.timeout)
    }

    btnPauseFn() {
      console.log('pause')
      if (this.timeout) this.timeout.pause();
    }
    
    btnResumeFn() {
      console.log('resume')
      if (this.timeout) this.timeout.resume()
    }


}
