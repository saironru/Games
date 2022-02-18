import { Component, OnInit} from '@angular/core'

interface Pointers {
  [key: string]: boolean;
}

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {

  fieldSize: number = 32;
  fieldBorderSize: number = 1;
  sizeY: number = 12;
  sizeX: number = 11;
  arrStyles: string[][] = [[]];
  arrValues: number[][] = [[]];
  boardWidth: string = '';
  pointCounter: number = 0;
  diagonally: boolean = false;
  objPointers: Pointers = {};
  message: string = '';
  arrWay: number[][] = [];
  arrWave: number[][] = [];
  arrPointers: number[][] = [];

  constructor() { 
    this.boardBuild([
      ["wall","wall","empty","wall","empty","empty","empty","empty","empty","empty","point"],
      ["empty","empty","empty","wall","empty","wall","empty","wall","wall","wall","wall"],
      ["empty","wall","empty","wall","empty","empty","empty","empty","empty","empty","empty"],
      ["point","wall","empty","wall","wall","wall","wall","wall","empty","wall","wall"],
      ["wall","wall","empty","wall","empty","empty","empty","wall","empty","empty","empty"],
      ["empty","wall","empty","wall","empty","wall","empty","wall","wall","wall","empty"],
      ["empty","wall","empty","empty","empty","wall","empty","wall","empty","wall","empty"],
      ["empty","wall","empty","wall","empty","wall","empty","empty","empty","wall","empty"],
      ["empty","wall","empty","wall","empty","wall","empty","wall","empty","empty","empty"],
      ["empty","empty","empty","wall","empty","wall","empty","wall","empty","wall","empty"],
      ["empty","wall","empty","wall","empty","wall","wall","wall","empty","wall","empty"],
      ["empty","wall","empty","wall","empty","empty","empty","empty","empty","empty","empty"]
    ], 2, {'3-0': true, '0-10': true})}

  ngOnInit(): void {
  }

  boardBuild(arrStyles?: string[][], pointCounter?: number, objPointers?: Pointers) {

    this.message = '';
    this.pointCounter = pointCounter || 0;
    this.objPointers = objPointers || {};
    this.boardWidth = `${this.sizeX * (this.fieldSize + 2 * this.fieldBorderSize)}px`
    this.arrStyles =  arrStyles || Array.from({length: this.sizeY}, item => Array.from({length: this.sizeX}, i=>'empty'))
    this.arrValues = Array.from({length: this.sizeY}, item => Array.from({length: this.sizeX}, i=>Infinity))

    this.render();

  }

  // Переделать более лаконично (!!!)
  foo(event: any) {
    console.log(event)
    event.preventDefault();
    let coordinates = event.target.id.split('-');
    let y = +coordinates[1];
    let x = +coordinates[2];
    if (event.type === 'click') {
      if (this.arrStyles[y][x] === 'wall') {
        this.arrStyles[y][x] = 'empty';
      } else if (this.arrStyles[y][x] === 'empty') {
        this.arrStyles[y][x] = 'wall';
      } else if (this.arrStyles[y][x] === 'way') {
        this.arrStyles[y][x] = 'wall';
        let index = this.arrWay.findIndex(i => i[0] === y && i[1] === x);
        this.arrWay.splice(index, 1);
      } else if (this.arrStyles[y][x] === 'point') {
        return;
      }
    } else if (event.type === 'contextmenu') {
      //if (this.pointCounter === 2) return;
      if (this.arrStyles[y][x] === 'empty') {
        if (this.pointCounter !== 2) {
          this.arrStyles[y][x] = 'point';
          this.pointCounter++;
          this.objPointers[`${y}-${x}`] = true;
        } else {
          return;
        }
      } else if (this.arrStyles[y][x] === 'point') {
        this.arrStyles[y][x] = 'empty';
        this.pointCounter--;
        delete this.objPointers[`${y}-${x}`];
      } else if (this.arrStyles[y][x] === 'wall' || this.arrStyles[y][x] === 'way') {
        return;
      } 
    }

    this.render();
  }

  liWave() {
    // Если не указано две точки, между которыми необходимо найти кротчайшее расстояние (отмечены как point в this.arrStyles), 
    // то сразу завершаем ф-цию
    if (this.pointCounter !== 2) return;
    // Из this.objPointers получаем 2 массива начальных и конечных координат точек point
    // Какая из точек начало, а какая конец - не важно
    this.arrPointers = Object.keys(this.objPointers).map(i => i.split('-').map(Number));
    let [startCoordinates, finishCoordinates] = this.arrPointers;
    // Создаем стек для хранения текущего фронта волны
    let stack = [];
    // d - текущее значение волны, которое увеличивается по мере удаления от начала распространения волны,
    // по сути, кратчайшее расстояние от клетки старта волны до клетки помеченной конкретным значением d
    // для точки старта волны d = 0
    let d = 0;
    // Добавляем в стек стартовую точку
    stack.push(startCoordinates);
    // Отмечаем значение стартовой точки в массиве значений клеток this.arrValues
    this.arrValues[startCoordinates[0]][startCoordinates[1]] = 0;
    // Выполняем цикл для каждого фронта волны (точек с одинаковым расстоянием d от старта)
    while (stack.length && this.arrValues[finishCoordinates[0]][finishCoordinates[1]] === Infinity) {
      //alert(stack)
      this.markNeighborsForEach(stack, d+1);
      d++;
    }

    console.log('this.arrStyles', this.arrStyles)
    console.log('this.arrValues', this.arrValues)
    console.log('this.arrWay', this.arrWay)
    console.log('this.arrWave', this.arrWave)
    
    this.liBuildWay();

  }

  markNeighborsForEach(stack: number[][], value: number) {
    // Формируем массив для хранения следующего фронта волны
    let s: number[][] = [];
    // Обрабатываем текущий фронт волны
    while (stack.length) {
        let item = stack.pop();
        let y = +item![0];
        let x = +item![1];
        // Получаем всех возможных соседей, потом
        // Фильтруем соседей, оставляя
        // валидные (не выходящие за край поля), свободные (не равные стенам лабиринта wall), 
        // не посещенные ранее (значение в массиве this.arrValues для этой клетки равно Infinity)
        this.getNeighbors(x, y)
          .filter(i => 
            i[0]>=0 && 
            i[1]>=0 && 
            i[0]<this.sizeY && 
            i[1]<this.sizeX && 
            this.arrStyles[i[0]][i[1]] !== 'wall' && 
            this.arrValues[i[0]][i[1]] === Infinity)
          .forEach(c => {
            // ... и для каждого такого соседа отмечаем значение фронта волны в массиве this.arrValues,
            // и добавляем его в массив для хранения следующего фронта волны s
            this.arrValues[c[0]][c[1]] = value;
            // добавляем клетки в массив тех клеток, до которых дошел фронт волны
            this.arrWave.push([c[0], c[1]]);
            s.push(c)
        })

    }
    // Весь текущий фронт волны обработан, stack пуст, записываем в него все клетки, попавшие в следующий фронт волны
    // по сути, делаем СЛЕДУЮЩИЙ фронт волны ТЕКУЩИМ
    s.forEach(i => stack.push(i));
  }

  getNeighbors(x: number, y: number) {
    let output = [[y, x-1], [y, x+1], [y+1, x], [y-1, x]];
    // Если отмечена опция "Можно передвигаться на соседние клетки по диагонали" добавляем 4 клетки находящиеся по-диагонали
    if(this.diagonally) {
      output.push([y-1, x-1], [y-1, x+1], [y+1, x+1], [y+1, x-1]);
    }
    return output;
  }

  liBuildWay() {
    let finishCoordinates = this.arrPointers[1];
    if (this.arrValues[finishCoordinates[0]][finishCoordinates[1]] === Infinity) {
      this.message = 'Не существует пути между двумя точками';
    } else {
      let value = +this.arrValues[finishCoordinates[0]][finishCoordinates[1]];
      this.message = `Длина пути: ${value}` 
      let currentCoordinates = finishCoordinates;
      while (value !== 1) {
        let y = currentCoordinates[0];
        let x = currentCoordinates[1];
        let neighborsCoordinates = this.getNeighbors(x, y);
        // Выбрать среди соседних ячейку (любую), помеченную числом на 1 меньше числа в текущей ячейке
        let neiCoord = neighborsCoordinates.filter(i=>
          i[0]>=0 && 
          i[1]>=0 && 
          i[0]<this.sizeY && 
          i[1]<this.sizeX && 
          this.arrStyles[i[0]][i[1]] !== 'wall' &&
          this.arrValues[i[0]][i[1]] === value - 1
        )[0];
        currentCoordinates = neiCoord;
        value--;
        // Помечаем ячейку как путь
        this.arrStyles[neiCoord[0]][neiCoord[1]] = 'way';
        // Добавляем клетку в массив координат клеток пути
        this.arrWay.push([neiCoord[0], neiCoord[1]]);
      }
    }


  }

  clearWay() {
    
    this.arrWay.forEach(i=>{
      this.arrStyles[i[0]][i[1]] = 'empty';
    })
    this.arrWave.forEach(i=>{
      this.arrValues[i[0]][i[1]] = Infinity;
    })
    this.arrPointers.forEach(i=>{
      this.arrValues[i[0]][i[1]] = Infinity;
    })
    this.arrWay = [];
    this.arrWave = [];
    this.arrPointers = [];
  }

  render() {
    this.clearWay();
    setTimeout(()=>this.liWave(), 0)
  }
  





}
