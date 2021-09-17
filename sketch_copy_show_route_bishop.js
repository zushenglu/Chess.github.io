// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

/* code for each piece:

white:        black:
  1: pawn     7
  2: rook     8
  3: horse    9
  4: bishop   10
  5: queen    11
  6: king     12


*/

// need to find a way to show a kill move

var can, cell_length,alive_pieces = [],g,selected_grid = [8,8,9,9], turn = "white",selected_piece,possible_route;
const VER = 8, HOR = 8;
var x_adjust// = window_width/2 - 4 * cell_length
var y_adjust// = window_height/2 - 4*cell_length

var gridX,gridY // testing

function preload(){
  bb = loadImage("assets/bb.png")
  bh = loadImage("assets/bh.png")
  bk = loadImage("assets/bk.png")
  bp = loadImage("assets/bp.png")
  bq = loadImage("assets/bq.png")
  br = loadImage("assets/br.png")
  wb = loadImage("assets/wb.png")
  wh = loadImage("assets/wh.png")
  wk = loadImage("assets/wk.png")
  wp = loadImage("assets/wp.png")
  wq = loadImage("assets/wq.png")
  wr = loadImage("assets/wr.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  a = new Grid(HOR,VER);
  g = a.createGrid()
  setup_board(alive_pieces,g)
}

function setup_board(piece_array,grid){
  color = "white";
  console.log(grid)
  for (let p = 0;p<16;p++){

    if (p<8){
      let t = new Pawn(p,6,color)
      grid[6][p] = t ;
      piece_array.push(t);

      if (p == 0 || p == 7){
        let t = new Rook(p,7,color)
        grid[7][p] = t;
        piece_array.push(t);
      }

      else if (p == 1 || p == 6){
        let t = new Horse(p,7,color)
        grid[7][p] = t;
        piece_array.push(t);
      }

      else if (p == 2 || p == 5){
        let t = new Bishop(p,7,color)
        grid[7][p] = t;
        piece_array.push(t)
      }

      else if (p == 3) {
        let t = new Queen(p,7,color);
        grid[7][p] = t;
        piece_array.push(t);
      }

      else{
        let t = new King(p,7,color);
        grid[7][p] = t;
        piece_array.push(t)
      }

    }
    else {
      color = "black"
      let t = new Pawn(p-8,1,color)
      grid[1][p-8] = t 
      piece_array.push(t)

      if (p == 8 || p == 15){
        let t = new Rook(p-8,0,color)
        grid[0][p-8] = t;
        piece_array.push(t);
      }

      else if (p == 9 || p == 14){
        let t = new Horse(p-8,0,color)
        grid[0][p-8] = t;
        piece_array.push(t);
      }

      else if (p == 10 || p == 13){
        let t = new Bishop(p-8,0,color)
        grid[0][p-8] = t;
        piece_array.push(t)
      }

      else if (p == 11) {
        let t = new King(p-8,0,color);
        grid[0][p-8] = t;
        piece_array.push(t);
      }

      else{
        let t = new Queen(p-8,0,color);
        grid[0][p-8] = t;
        piece_array.push(t)
      }
    }
  }
}

function draw() {
  display_board()

}

function mouseClicked(){
  select_piece(turn,alive_pieces)
}

function move_pieces(new_location,piece,alive_pieces){

  // 
  if (a.grid[new_location[1]][new_location[0]] == 0){

    // move piece to new location in the grid
    a.grid = piece.move([new_location[0],new_location[1]],a.grid);
 
  }


  else if (a.grid[new_location[1][new_location[0]]] != 0){
    var dead,index;
    dead = get_piece_info([new_location[0],new_location[1]],alive_pieces)
    dead.alive = false;
    index = alive_pieces.indexOf(dead);
    alive_pieces.splice(index,1);

    var old_loc = [piece.x,piece.y];
    a.grid = piece.move([new_location[0],new_location[1]],a.grid);
    a.grid[old_loc[1]][old_loc[0]] == 0;
  }
}

function select_piece(turn,alive_pieces){
  // for selecting grid
  //var gridX,gridY;
  
  //var possible_route;
  gridX = Math.floor(Math.abs(mouseX - x_adjust)/cell_length)
  gridY = Math.floor(Math.abs(mouseY - y_adjust)/cell_length)

  console.log(gridX,gridY)
  // if selected a grid, select it in the form of (x,y)
  if (gridX < 8 && gridX >= 0 && gridY < 8 && gridY >= 0){

    // if repeat, cancel, else, select
    if (gridX == selected_grid[0] && gridY == selected_grid[1]){
      selected_grid = [8,8,9,9]
      possible_route = []
    }

    else{

      /* first select: 
          must be on a piece
          if different color, always on first piece

        second select: 
          must be on a valid place
          restart first select if same color (refresh index 0,1 on selected grid)

      */

      // first select
      if (selected_grid[0] == 8 && a.grid[gridY][gridX] != 0){ // if nothing hightlighted yet and selected a piece
        //console.log(92)

        selected_grid = [gridX,gridY,9,9];
        selected_piece = get_piece_info([gridX,gridY],alive_pieces) // get piece info

        if (selected_piece.color == turn){
          possible_route = selected_piece.show_routes(a.grid)
        }
        
      }
      else if (selected_grid[0] != 8) { // if something is hightlighted
        old_selected_piece = selected_piece
        selected_piece = get_piece_info([gridX,gridY],alive_pieces)

        // move if the move is valid

        /* things to do here: since js compare reference instead of value when comparing arrays,
            I need to make a function that convers all elements in possible_route into string and compare to 
            the current location which will also be converted to the string using JSON.stringify
        */

        if (array_in_array(possible_route,[gridX,gridY])){

          selected_grid = [gridX,gridY,9,9];

          move_pieces(selected_grid,old_selected_piece, alive_pieces); // changes a.grid already
          
          selected_grid = [8,8,9,9];
          possible_route = [];
        }
        
        else if (a.grid[gridY][gridX] == 0){

          selected_grid = [8,8,9,9];
          possible_route = [];
          selected_piece = 0;
        }

        // if not valid: check for turn, if same turn, treate it as first select
        else if (selected_piece.color == turn){
          
          selected_grid = [gridX,gridY,9,9];
          selected_piece = get_piece_info([gridX,gridY],alive_pieces);
          possible_route = selected_piece.show_routes(a.grid);
        }

        // if not valid and color don't match
        else{

          selected_grid = [gridX,gridY,9,9];
          possible_route = [];
        }

      }

    }

    //console.log(selected_grid)
  }
}

function array_in_array(home_array,test_array){
  var a,b;
  for (let i=0;i<home_array.length;i++){
    a = JSON.stringify(test_array)
    b = JSON.stringify(home_array[i])
    if (a == b){
      return true;
    }
  }

  return false;
}

function get_piece_info(selected_grid,alive_pieces){

    var chosen_piece
    for (let i = 0; i < alive_pieces.length; i++){
    // if the piece is on the grid
      if (alive_pieces[i].x == selected_grid[0] && alive_pieces[i].y == selected_grid[1]){
        chosen_piece = alive_pieces[i];
      }
    }

    if (chosen_piece != undefined){
      return chosen_piece
    }
    else{
     // console.log("get piece info error", "selected_grid =", selected_grid)
      return ("error")
    }
}

function display_board(){
  cell_length = Math.min(windowWidth,windowHeight) / 10
  x_adjust = (windowWidth/2 - 4 * cell_length)
  y_adjust = windowHeight/2 - 4*cell_length
  background(220);
  a.draw_grid(x_adjust,y_adjust,cell_length,selected_grid);
  display_pieces(alive_pieces,x_adjust,y_adjust)
}

function display_pieces(all_pieces,x_adjust,y_adjust){
  //console.log(all_pieces);
  // implement so it shows all pieces alive on the grid
  // should be after draw grid
  var ima_x_adj,ima_y_adj;

  for (let i=0;i< all_pieces.length;i++){

    if (all_pieces[i].color == "white"){

      if (all_pieces[i].name == "pawn"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wp.width)/2)
        ima_y_adj = Math.abs((cell_length - wp.height)/2)
        image(wp, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "rook"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wr.width)/2)
        ima_y_adj = Math.abs((cell_length - wr.height)/2)
        image(wr, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "horse"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wh.width)/2)
        ima_y_adj = Math.abs((cell_length - wh.height)/2)
        image(wh, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "bishop"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wb.width)/2)
        ima_y_adj = Math.abs((cell_length - wb.height)/2)
        image(wb, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "queen"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wq.width)/2)
        ima_y_adj = Math.abs((cell_length - wq.height)/2)
        image(wq, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "king"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-wk.width)/2)
        ima_y_adj = Math.abs((cell_length - wk.height)/2)
        image(wk, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }
    }

    else if (all_pieces[i].color == "black"){

      if (all_pieces[i].name == "pawn"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-bp.width)/2)
        ima_y_adj = Math.abs((cell_length - bp.height)/2)
        image(bp, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "rook"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-br.width)/2)
        ima_y_adj = Math.abs((cell_length - br.height)/2)
        image(br, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "horse"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-bh.width)/2)
        ima_y_adj = Math.abs((cell_length - bh.height)/2)
        image(bh, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "bishop"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-bb.width)/2)
        ima_y_adj = Math.abs((cell_length - bb.height)/2)
        image(bb, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "queen"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-bq.width)/2)
        ima_y_adj = Math.abs((cell_length - bq.height)/2)
        image(bq, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "king"){
        //console.log(all_pieces[i].x *cell_length,x_adjust)
        ima_x_adj = Math.abs((cell_length-bk.width)/2)
        ima_y_adj = Math.abs((cell_length - bk.height)/2)
        image(bk, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }
    }
  }
}

class Grid {
    constructor (width,height){
        this.width = width;
        this.height = height;
        this.grid;
    }

    createGrid(){
        var return_grid = []
        for (let y = 0; y < this.width; y++){
            return_grid.push([])
            for (let x = 0; x < this.width; x++){
              if (y > 1 && y < 6){
                return_grid[y].push(0)
              }
                return_grid[y].push()
            }
        }
        this.grid = return_grid;
        return return_grid
    }

    draw_grid(x_adjust,y_adjust,cell_length,selected_grid){

      for (let y = 0; y < this.width; y++){
          for (let x = 0; x < this.width; x++){

            // draw basic grid
            if (y % 2 == 0 && x % 2 == 0){
              fill("white")
            }
            else if (y % 2 == 0 && x % 2 != 0){
              fill("black")
            }
            else if (y % 2 != 0 && x % 2 == 0){
              fill("black")
            }

            else{
              fill("white")
            }
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            

            if (this.grid[y][x] == 1){
              fill('pink')
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (this.grid[y][x] == 2){
              fill("blue")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (this.grid[y][x] == 3){
              fill("orange")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (this.grid[y][x] == 4){
              fill("green")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (this.grid[y][x] == 5){
              fill("purple")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (this.grid[y][x] == 6){
              fill("brown")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (x == selected_grid[0] && y == selected_grid[1] && this.grid[y][x] != 0){
              fill("grey")
              rect(x*cell_length + x_adjust, y*cell_length + y_adjust, cell_length)
            }

            if (selected_grid[0] != 8){
              for (let i=0;i<possible_route.length;i++){
                
                fill('grey')
                circle(possible_route[i][0]*cell_length + x_adjust + cell_length/2, possible_route[i][1]*cell_length + y_adjust + cell_length/2, cell_length/3)

              }

            }
          }
      }
    }

    get_grid(){
      return this.grid
    }
}

class Piece {

    constructor (x,y,color){

        this.x = x;
        this.y = y;
        this.color = color
        this.selected = false;
        this.alive = true;
        this.number = 1;
    }

    get_location(){
        return (this.x, this.y)
    }

    get_piece_name(){
        return (this.name)
    }

    select(){
        this.selected != this.selected
    }
}

class Pawn extends Piece {

    constructor (x,y,color){
      super(x,y,color)
      this.name = "pawn";
    }

    move(new_loc,grid){
        // new_loc is an array with x,y value of new location ex, [5,6]
        // returns the grid after the move action

        // this.x,this.y == new_loc[0],new_loc[1];

        var old_loc = [this.x,this.y];
        this.x = new_loc[0];
        this.y = new_loc[1];

        console.log(this.x,this.y)
        console.log([old_loc[0],old_loc[1]])
        // set old loc to 0
        grid[old_loc[1]][old_loc[0]] = 0;
        // set new loc to this piece
        grid[this.y][this.x] = this

        return grid

    }

    moveable(new_loc,grid){ // bonus implementation for 5 and 6

      // return an array containing all possible moves
        if (this.color == "white"){
            // finds what find of the move it is
            let loc_diff = [0,0]; // (x,y)
            loc_diff[0] = new_loc[0] - this.x
            loc_diff[1] = new_loc[1] - this.y

            /* there will be 6 senarios: 
                1. move 1 forward (y - 1) for white, plus for black, no piece at y-1
                2. move 2 forward (y - 2), y value must be the starting value, no piece in the way
                3. more 1 forward and 1 rightward (y - 1, x + 1), must be a piece at x+1,y-1
                4. more 1 forward and 1 leftward (y - 1, x -1), must be a piece at x-1,y-1
                5. more 1 forward and 1 rightward (y - 1, x + 1) with no piece at x +1, y-1
                6. more 1 forward and 1 leftward (y - 1, x -1) with no piece at x + 1, y-1
                    * restriction for 5 and 6: the last move my by enermy must be move 2 with the x value + - this.x
            */
              
            if (loc_diff == [0,1] && grid[this.y-loc_diff[1]][this.x] == 0){
                this.y --;
                return 1
            }

            else if (loc_diff == [0,2] && grid[this.y-loc_diff[1]][this.x] == 0){
                this.y -= 2;
                return 2
            }

            else if (loc_diff == [1,1] && grid[this.y-loc_diff[1]][this.x - loc_diff[0]] != 0) {
                this.y --;
                this.x ++;
                return 3
            }

            else if (loc_diff == [-1,1] && grid[this.y-loc_diff[1]][this.x + loc_diff[0]] != 0) {
                this.y --;
                this.x --;
                return 4
            }

            // reserved for situation 5 and 6

        }

    }

    show_routes(grid){
      /* shows all possible move which should not be case sensetive
          returns an array with the location of all possible moves
      */
      var route_array = [];
      var target_piece;
      if (this.color == "white"){


        if (this.y == 0){
          // change to other pieces
        }

        if (this.y == 6){ // could be easier if access grid directly
          target_piece = get_piece_info([this.x,this.y-1],alive_pieces)
          if (target_piece == "error" || target_piece.color != this.color){
            route_array.push([this.x,this.y-1]);
            
            target_piece = get_piece_info([this.x,this.y-2],alive_pieces)
            if (target_piece == "error" || target_piece.color != this.color){
              route_array.push([this.x,this.y-2]);
            }

          }

        }

        else{
          //                                        within the board for white, change value for black
          if (grid[this.y-1][this.x+1] != 0 && this.y-1 >= 0 && this.x+1 <8){
            if (grid[this.y-1][this.x+1].color != this.color){
              route_array.push([this.x+1,this.y-1]);
            }
          }
                                                  // same as above
          if (grid[this.y-1][this.x-1] != 0 && this.y-1 >=0 && this.x-1 >=0){
            if (grid[this.y-1][this.x-1].color != this.color){
              route_array.push([this.x-1,this.y-1]);
            }
          }

          if (grid[this.y-1][this.x] == 0) {
            route_array.push([this.x,this.y-1]);
          }
          
        }
      }

      return route_array
    }
}

class Horse extends Piece {
    constructor(x,y,color){
      super(x,y,color)
      this.name = "horse"
    }

    move(new_loc,grid){
      // new_loc is an array with x,y value of new location ex, [5,6]
      // returns the grid after the move action

      // this.x,this.y == new_loc[0],new_loc[1];

      var old_loc = [this.x,this.y];
      this.x = new_loc[0];
      this.y = new_loc[1];

      console.log(this.x,this.y)
      console.log([old_loc[0],old_loc[1]])
      // set old loc to 0
      grid[old_loc[1]][old_loc[0]] = 0;
      // set new loc to this piece
      grid[this.y][this.x] = this

      return grid

  }

  moveable(new_loc,grid){ // can't move when it maks king endangered

    // return an array containing all possible moves
      if (this.color == "white"){
          // finds what find of the move it is
          let loc_diff = [0,0]; // (x,y)
          loc_diff[0] = new_loc[0] - this.x
          loc_diff[1] = new_loc[1] - this.y
        
      }

  }

  show_routes(grid){
    /* shows all possible move which should not be case sensetive
        returns an array with the location of all possible moves
    */
    var route_array = [];
    var target_piece
    console.log(this.x,this.y)
    if (this.color == "white"){

      // this could also be much easier if access grid directly
      if (this.x+1 < 8 && this.y-2 >= 0){ // and make sure it is not a white piece
        target_piece = get_piece_info([this.x+1, this.y-2],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x+1,this.y-2])
        }

      }

      if (this.x+2 < 8 && this.y-1 >= 0){

        target_piece = get_piece_info([this.x+2, this.y-1],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x+2,this.y-1])
        }
        
      }
      
      if (this.x+1 < 8 && this.y+2 < 8){

        target_piece = get_piece_info([this.x+1, this.y+2],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x+1,this.y+2])
        }
        
      }

      if (this.x+2 < 8 && this.y+1 < 8){

        target_piece = get_piece_info([this.x+2, this.y+1],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x+2,this.y+1])
        }
        
        
      }

      if (this.x-1 >=0 && this.y+2 < 8){
        
        target_piece = get_piece_info([this.x-1, this.y+2],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x-1,this.y+2])
        }
        
      }

      if (this.x-2 >=0 && this.y+1 < 8){
        target_piece = get_piece_info([this.x-2, this.y+1],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x-2,this.y+1])
        }

      }

      if (this.x-1 >=0 && this.y-2 >=0){
        target_piece = get_piece_info([this.x-1, this.y-2],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x-1,this.y-2])
        }

      }

      if (this.x-2 >=0 && this.y-1 >= 0){
        target_piece = get_piece_info([this.x-2, this.y-1],alive_pieces)

        if (target_piece == "error" || target_piece.color != this.color ){
          route_array.push([this.x-2,this.y-1])
        }

      }
    }

    return route_array
  }
}

class Rook extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "rook"
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.x = new_loc[0];
    this.y = new_loc[1];

    console.log(this.x,this.y)
    console.log([old_loc[0],old_loc[1]])
    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    return grid

}

  moveable(grid,new_loc){
      let loc_diff = [0,0]; // (x,y)
      loc_diff[0] = new_loc[0] - this.x
      loc_diff[1] = new_loc[1] - this.y

      // 
  }

  show_routes(grid){
    /* shows all possible move which should not be case sensetive
        returns an array with the location of all possible moves
    */
    var route_array = [];
    var target_piece
    console.log(this.x,this.y)
    if (this.color == "white"){

      for (let i = this.x+1;i<8;i++){
        if (grid[this.y][i] instanceof Piece){
          if (grid[this.y][i].color != this.color){
            route_array.push([i,this.y]);
            break;
          }
          else{
            break;
          }
        }

        else{
          route_array.push([i,this.y])
        }
      }

      for (let i = this.x-1;i>-1;i--){
        if (grid[this.y][i] instanceof Piece){
          if (grid[this.y][i].color != this.color){
            route_array.push([i,this.y]);
            break;
          }
          else{
            break;
          }
        }

        else{
          route_array.push([i,this.y])
        }

      }

      for (let i = this.y+1;i<8;i++){

        if (grid[i][this.x] instanceof Piece){
          if (grid[i][this.x].color != this.color){
            route_array.push([this.x,i]);
            break;
          }
          else{
            break;
          }
        }

        else{
          route_array.push([this.x,i])
        }

      }

      for (let i = this.y-1;i>-1;i--){


        if (grid[i][this.x] instanceof Piece){
          if (grid[i][this.x].color != this.color){
            route_array.push([this.x,i]);
            break;
          }
          else{
            break;
          }
        }

        else{
          route_array.push([this.x,i])
        }
      }
      
    }

    return route_array
  }
}

class Bishop extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "bishop"
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.x = new_loc[0];
    this.y = new_loc[1];

    console.log(this.x,this.y)
    console.log([old_loc[0],old_loc[1]])
    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    return grid

}

  moveable(grid,new_loc){
      let loc_diff = [0,0]; // (x,y)
      loc_diff[0] = new_loc[0] - this.x
      loc_diff[1] = new_loc[1] - this.y

      // 
  }

  show_routes(grid){
    /* shows all possible move which should not be case sensetive
        returns an array with the location of all possible moves
    */
    var route_array = [];
    var target_piece
    console.log(this.x,this.y)
    if (this.color == "white"){

      for (let i = this.x+1;i<8;i++){
        console.log(this.y + i-this.x)
        if (this.y + i-this.x < 8){
          if (grid[this.y + i-this.x][i] instanceof Piece){
            if (grid[this.y + i-this.x][i].color == 'black'){
              route_array.push([i,this.y+i-this.x]);
              break;
            }
            else   {
              break;
            }
          }

          else{
            route_array.push([i,this.y+i-this.x]);
          }
        }
      }

      for (let i = this.x-1;i>-1;i--){
        if (this.y + i - this.x > -1){
          if (grid[this.y + i- this.x][i] instanceof Piece){
            if (grid[this.y + i - this.x][i].color == 'black'){
              route_array.push([i,this.y + i - this.x]);
              break;
            }
            else{
              break;
            }
          }

          else{
            route_array.push([i,this.y + i - this.x]);
          }
        }
      }

      // for (let i = this.y+1;i<8;i++){
      //   if (grid[i][this.x + i-this.y] instanceof Piece){
      //     if (grid[i][this.x + i-this.y].color == 'black'){
      //       route_array.push([this.x + i-this.y,i])
      //     }
      //     else{
      //       break;
      //     }
      //   }

      //   else{
      //     route_array.push([this.x + i-this.y,i]);
      //   }
      // }

      // for (let i = this.y-1;i>0;i--){
      //   if (grid[i][this.x + this.y+i] instanceof Piece){
      //     if (grid[i][this.x + this.y+i].color == 'black'){
      //       route_array.push([this.x + this.y+i,i])
      //     }
      //     else{
      //       break;
      //     }
      //   }

      //   else{
      //     route_array.push([this.x + this.y+i,i]);
      //   }
        
      // }
    }

    return route_array
  }
}

class King extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "king"
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.x = new_loc[0];
    this.y = new_loc[1];

    console.log(this.x,this.y)
    console.log([old_loc[0],old_loc[1]])
    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    return grid

}

  moveable(grid,new_loc){
      let loc_diff = [0,0]; // (x,y)
      loc_diff[0] = new_loc[0] - this.x
      loc_diff[1] = new_loc[1] - this.y

      // 
  }
}

class Queen extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "queen"
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.x = new_loc[0];
    this.y = new_loc[1];

    console.log(this.x,this.y)
    console.log([old_loc[0],old_loc[1]])
    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    return grid

}

  moveable(grid,new_loc){
      let loc_diff = [0,0]; // (x,y)
      loc_diff[0] = new_loc[0] - this.x
      loc_diff[1] = new_loc[1] - this.y

      // 
  }
}