// Chess
// Zusheng Lu
// Aug 25


var can, cell_length,alive_pieces = [],g,selected_grid = [8,8,9,9], turn = "white",selected_piece,possible_route=[];
var w_k_loc = [4,7],b_k_loc = [3,0], last_pawn_move = ["none"];

var w_k,b_k,threat, block_check, check_warning = false, threat_pieces;

var gamestarted = false, gameended = false, score_count = [0,0];

const VER = 8, HOR = 8;
var x_adjust
var y_adjust

var gridX,gridY

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
  a.createGrid()
  setup_board(alive_pieces,a.grid)
}

function setup_board(piece_array,grid){
  color = "white";

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

function clear_threat_move(turn){

  for (let i=0;i<alive_pieces.length;i++){
    if (alive_pieces[i].color == turn){
      if (alive_pieces[i].is_check){
        alive_pieces[i].is_check = false;
      }
      if (alive_pieces[i].possible_move != []){
        alive_pieces[i].possible_move = [];
      }
    }
  }
}

function stalemateCheck(turn,all_pieces) {
  var all_move = []
  for (let i=0;i<all_pieces.length;i++){
    if (all_pieces[i].color == turn){
      all_move = all_move.concat(all_pieces[i].show_routes(a.grid))
    }
  }

  return all_move.length == 0
}

function start_or_end_game(){

  if (!gamestarted){
    w_k = a.grid[7][4]
    b_k = a.grid[0][3]
    turn = "white"
    check_warning = false;
    gamestarted = true
  }

  else{
    if (gameended){

        // maybe add something so it stops letting you select piece

    }

    else{ // if game started and did not end

      clear_threat_move(turn)

      if (turn == "white"){
        threat = king_threat_locations([w_k.x,w_k.y],turn)
        var tt = w_k.show_routes(a.grid)
      }
      else{
        threat = king_threat_locations([b_k.x,b_k.y],turn)
        var tt = b_k.show_routes(a.grid)
      }

      if (threat.length >1){ // if king in threat from more than 1 place
        check_warning = true
        if (tt.length == 0){ // if nowhere to go, also change king showroute so it dodge dangerous grid
          
          gameended = true;
        }
      }

      else if (threat.length == 1){ // only 1 threat
        check_warning = true
        if (tt.length == 0 && god_save_the_king(turn,threat)){ // if nowhere to go and no other piece can block. write block check to check all friendly piece for their move
          gameended = true
        }
      }

      else{
        check_warning = false;
      }

      if (stalemateCheck(turn,alive_pieces)){
        gameended = true
      }


      if (gameended){
        var winner

        if (turn == "white"){
          winner = "black"
          score_count[1]++
        }
        else{
          winner = "white"
          score_count[0]++
        }

        console.log("___________________________")
        console.log(winner,"wins the game")
        console.log("the current score is:")
        console.log("white:",score_count[0],"black:",score_count[1])
        console.log('press "R" to restart the game')
      }

    }


  }
}

function god_save_the_king(turn,threat){
  var protect = [];
  for (let i=0;i<alive_pieces.length;i++){
    if (alive_pieces[i].color == turn){
      var temp;
      temp = alive_pieces[i].show_routes(a.grid)
      for (let z=0;z<temp.length;z++){
        for (let r=0;r<threat.length;r++){
          if (array_in_array(threat[r],temp[z])){
            protect.push(temp[z])
          }
        }
      }
    }
  }

  return protect.length == 0;
}

function mouseClicked(){
  //start_or_end_game()
  select_piece(alive_pieces)
  start_or_end_game()
}

function keyPressed() {
  if (keyCode == 82){
    alive_pieces = [];
    a.createGrid();
    setup_board(alive_pieces,a.grid);
    turn = "white"
    gameended = false
    w_k = a.grid[7][4]
    b_k = a.grid[0][3]
  }
}

function move_pieces(new_location,piece,alive_pieces){

  // 
  if (a.grid[new_location[1]][new_location[0]] == 0){

    if (piece.name == "pawn" && (new_location[0] == piece.x - 1 || new_location[0] == piece.x + 1)){
    // move piece to new location in the grid
      a.grid = piece.move([new_location[0],new_location[1]],a.grid);
      
      var dead,index;

      if (piece.color == "white"){
        dead = get_piece_info([new_location[0],new_location[1]+1],alive_pieces)
      }
      else {
        dead = get_piece_info([new_location[0],new_location[1]-1],alive_pieces)
      }

      dead.alive = false;
      index = alive_pieces.indexOf(dead);
      alive_pieces.splice(index,1);
      a.grid[dead.y][dead.x] = 0;
      
    }

    // come back to it later
    else if (piece.name == "king"){
      // if the x value is -2 away from its current location:
          // move the x=0 rook to king's new x + 1
      
      if (new_location[0] == piece.x-2){
        piece.move([new_location[0],new_location[1]],a.grid)
        var rk = a.grid[piece.y][0]
        rk.move([new_location[0]+1,new_location[1]],a.grid)
      }

      // if the x value is +2 away from its current location:
          // move the x=7 rook to king's new x - - 1

      else if (new_location[0] == piece.x+2){
        piece.move([new_location[0],new_location[1]],a.grid)
        var rk = a.grid[piece.y][7]
        rk.move([new_location[0]-1,new_location[1]],a.grid)
      }

      else{
        a.grid = piece.move([new_location[0],new_location[1]],a.grid);
      }

    }
    

    else{
      a.grid = piece.move([new_location[0],new_location[1]],a.grid);
    }
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

function select_piece(alive_pieces){
  // for selecting grid
  //var gridX,gridY;
  
  //var possible_route;
  gridX = Math.floor(Math.abs(mouseX - x_adjust)/cell_length)
  gridY = Math.floor(Math.abs(mouseY - y_adjust)/cell_length)


  // console.log(a.grid[gridY][gridX])

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
          
          if (turn == "white"){
            turn = "black"
          }
          else{
            turn = "white"
          }

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

function array_in_arrayThreat(home_array,test_array){
  var a,b;
  
  for (let i=0;i<home_array.length;i++){
    a = JSON.stringify(test_array)
    b = JSON.stringify(home_array[i][0])
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

  // implement so it shows all pieces alive on the grid
  // should be after draw grid
  var ima_x_adj,ima_y_adj;

  for (let i=0;i< all_pieces.length;i++){

    if (all_pieces[i].color == "white"){

      if (all_pieces[i].name == "pawn"){
        ima_x_adj = Math.abs((cell_length-wp.width)/2)
        ima_y_adj = Math.abs((cell_length - wp.height)/2)
        image(wp, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "rook"){
        ima_x_adj = Math.abs((cell_length-wr.width)/2)
        ima_y_adj = Math.abs((cell_length - wr.height)/2)
        image(wr, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "horse"){
        ima_x_adj = Math.abs((cell_length-wh.width)/2)
        ima_y_adj = Math.abs((cell_length - wh.height)/2)
        image(wh, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "bishop"){
        ima_x_adj = Math.abs((cell_length-wb.width)/2)
        ima_y_adj = Math.abs((cell_length - wb.height)/2)
        image(wb, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "queen"){
        ima_x_adj = Math.abs((cell_length-wq.width)/2)
        ima_y_adj = Math.abs((cell_length - wq.height)/2)
        image(wq, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "king"){
        ima_x_adj = Math.abs((cell_length-wk.width)/2)
        ima_y_adj = Math.abs((cell_length - wk.height)/2)
        image(wk, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }
    }

    else if (all_pieces[i].color == "black"){

      if (all_pieces[i].name == "pawn"){
        ima_x_adj = Math.abs((cell_length-bp.width)/2)
        ima_y_adj = Math.abs((cell_length - bp.height)/2)
        image(bp, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "rook"){
        ima_x_adj = Math.abs((cell_length-br.width)/2)
        ima_y_adj = Math.abs((cell_length - br.height)/2)
        image(br, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "horse"){
        ima_x_adj = Math.abs((cell_length-bh.width)/2)
        ima_y_adj = Math.abs((cell_length - bh.height)/2)
        image(bh, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "bishop"){
        ima_x_adj = Math.abs((cell_length-bb.width)/2)
        ima_y_adj = Math.abs((cell_length - bb.height)/2)
        image(bb, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "queen"){
        ima_x_adj = Math.abs((cell_length-bq.width)/2)
        ima_y_adj = Math.abs((cell_length - bq.height)/2)
        image(bq, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }

      if (all_pieces[i].name == "king"){
        ima_x_adj = Math.abs((cell_length-bk.width)/2)
        ima_y_adj = Math.abs((cell_length - bk.height)/2)
        image(bk, all_pieces[i].x *cell_length + x_adjust + ima_x_adj, all_pieces[i].y *cell_length + y_adjust + ima_y_adj)
      }
    }
  }
}

function horse_threat_loc(x,y,turn){ 

  var a0 = ['horse'], target_piece;

  if (x+1 < 8 && y-2 >= 0){ 
    target_piece = get_piece_info([x+1, y-2],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x+1,y-2])
    }

  }

  if (x+2 < 8 && y-1 >= 0){

    target_piece = get_piece_info([x+2, y-1],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x+2,y-1])
    }
    
  }
  
  if (x+1 < 8 && y+2 < 8){

    target_piece = get_piece_info([x+1, y+2],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x+1,y+2])
    }
    
  }

  if (x+2 < 8 && y+1 < 8){

    target_piece = get_piece_info([x+2, y+1],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x+2,y+1])
    }
    
    
  }

  if (x-1 >=0 && y+2 < 8){
    
    target_piece = get_piece_info([x-1, y+2],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x-1,y+2])
    }
    
  }

  if (x-2 >=0 && y+1 < 8){
    target_piece = get_piece_info([x-2, y+1],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x-2,y+1])
    }

  }

  if (x-1 >=0 && y-2 >=0){
    target_piece = get_piece_info([x-1, y-2],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x-1,y-2])
    }

  }

  if (x-2 >=0 && y-1 >= 0){
    target_piece = get_piece_info([x-2, y-1],alive_pieces)

    if (target_piece != "error" && target_piece.color != turn && target_piece.name == "horse"){
      a0.push([x-2,y-1])
    }

  }


  return a0

}

function other_threat_loc(x,y,turn){ // change shits here so i wont kill myself

  var threat_pieces = [] // put it over here for now, its not supposed to be here but i put it here for futher update. it needs to appear in horse threat loc too and all should be put in the father array in is_loc_danger

  var grid = a.grid,threat_grid = [];

  var a1 = ["x+,y+"], a1p = [], first_friendly1 = false;
  var a2 = ["x+,y-"], a2p = [], first_friendly2 = false;


  var bf,tf;
  for (let i = x+1;i<8;i++){ 


    // diagnonal 
    // x+, y+
    if (y + i-x < 8 && !bf){

      if (grid[y + i-x][i] instanceof Piece){

        if (grid[y+i-x][i].color != turn && (grid[y+i-x][i].name == "bishop" || grid[y+i-x][i].name == "king" && Math.abs(i-x == 1)|| grid[y+i-x][i].name == "queen" || grid[y+i-x][i].name == "pawn" && grid[y+i-x][i].color == "white" && i-x == 1)){

          bf = true;
          a1.push([i,y+i-x]);
          if (a1p.length != 0){
            a.grid[a1p[0][1]][a1p[0][0]].is_check = true;
            a.grid[a1p[0][1]][a1p[0][0]].possible_move = a1p.concat(a1)
          }

          else{
            threat_pieces.push(grid[y+i-x][i])
            threat_grid.push(a1)
          }

        }
        else{
          if (!first_friendly1){
            a1p.push([i,y+i-x])
            first_friendly1 = true
          }
          else{
            bf = true
          }

        }
      }

      else if (!bf){
        if (a1p.length == 0){
          a1.push([i,y+i-x]);
        }
        else{
          a1p.push([i,y+i-x]);
        }
      }
    }

    // x+, y-

    if (y-i+x > -1 && !tf){

      //if grid is piece
      if (grid[y-i+x][i] instanceof Piece){

        // if the piece is enermy:
        if (grid[y-i+x][i].color != turn && (grid[y-i+x][i].name == "bishop" || grid[y-i+x][i].name == "king" && Math.abs(i-x == 1)|| grid[y-i+x][i].name == "queen" || grid[y-i+x][i].name == "pawn" && grid[y-i+x][i].color == "black" && i-x == 1)){

          tf = true;
          a2.push([i,y-i+x])
          //if friendly piece in between
          if (a2p.length != 0){
            a.grid[a2p[0][1]][a2p[0][0]].is_check = true;
            a.grid[a2p[0][1]][a2p[0][0]].possible_move = a2p.concat(a2)
          }

          // if just enermy piece
          else{ 

            threat_pieces.push(grid[y-i+x][i])
            threat_grid.push(a2);
          }
        }

        //if friendly piece
        else   {

          if (! first_friendly2){
            //  if 1 friendly piece
            a2p.push([i,y-i+x]);
            first_friendly2 = true
          }

          else{
            // if 2nd friendly piece
            tf = true;
          }
        }
      }

      else if (!tf){
        if (a2p.length == 0){
          a2.push([i,y-i+x]);
        }
        else{
          a2p.push([i,y-i+x]);
        }

      }
    }
  }

  tf = false, bf = false
  var a3 = ["x-,y-"], a3p = [], first_friendly3 = false;
  var a4 = ["x-,y+"], a4p = [], first_friendly4 = false;

  for (let i = x-1;i>-1;i--){

    // x-, y-
    if (y+i-x > -1 && !tf){
      if (grid[y+i-x][i] instanceof Piece){
        if (grid[y+i-x][i].color != turn && (grid[y+i-x][i].name == "bishop" || grid[y+i-x][i].name == "king" && Math.abs(i-x == 1) || grid[y+i-x][i].name == "queen" || grid[y+i-x][i].name == "pawn" && grid[y+i-x][i].color == "black" && x - i == 1)){

          tf = true;
          a3.push([i,y+i-x])
          //if friendly piece in between
          if (a3p.length != 0){
            a.grid[a3p[0][1]][a3p[0][0]].is_check = true;
            a.grid[a3p[0][1]][a3p[0][0]].possible_move = a3p.concat(a3)
          }

          // if just enermy piece
          else{ 

            threat_pieces.push(grid[y+i-x][i])
            threat_grid.push(a3);
          }
        }

        //if friendly piece
        else   {

          if (! first_friendly3){
            //  if 1 friendly piece
            a3p.push([i,y+i-x]);
            first_friendly3 = true
          }

          else{
            // if 2nd friendly piece
            tf = true;
          }
        }
      }

      else if (!tf){
        if (a3p.length == 0){
          a3.push([i,y+i-x]);
        }
        else{
          a3p.push([i,y+i-x]);
        }

      }
    }

    // x-, y+
    if (y-i+x < 8 && !bf){
      if (grid[y-i+x][i] instanceof Piece){
        if (grid[y-i+x][i].color != turn && (grid[y-i+x][i].name == "bishop" || grid[y][i].name == "king" && Math.abs(i-x == 1) || grid[y-i+x][i].name == "queen" || grid[y-i+x][i].name == "pawn" && grid[y-i+x][i].color == "white" && x-i == 1)){
            
            bf = true
            a4.push([i,y+i-x])
          //if friendly piece in between
            if (a4p.length != 0){
              a.grid[a4p[0][1]][a4p[0][0]].is_check = true;
              a.grid[a4p[0][1]][a4p[0][0]].possible_move = a4p.concat(a4)
            }
            // if just enermy piece
            else{ 

              threat_pieces.push(grid[y-i+x][i])
              threat_grid.push(a4);
            }
          }
          //if friendly piece
          else   {
            if (! first_friendly4){
              //  if 1 friendly piece
              a4p.push([i,y-i+x]);
              first_friendly4 = true
            }
            else{
              // if 2nd friendly piece
              tf = true;
            }
          }
        }
        else if (!tf){
          if (a4p.length == 0){
            a4.push([i,y-i+x]);
          }
          else{
            a4p.push([i,y-i+x]);
          }
        }
      }
  }

  // hor,ver

  var a5 = ["x+,y="], a5p = [], first_friendly5 = false;

  for (let i = x+1;i<8;i++){
    if (grid[y][i] instanceof Piece){
      if (grid[y][i].color != turn && (grid[y][i].name == "rook" || grid[y][i].name == "queen" || grid[y][i].name == "king" && Math.abs(i-x == 1))){ // order precedence matter here

        a5.push([i,y])
        //if friendly piece in between
          if (a5p.length != 0){
            a.grid[a5p[0][1]][a5p[0][0]].is_check = true;
            a.grid[a5p[0][1]][a5p[0][0]].possible_move = a5p.concat(a5)
          }
          // if just enermy piece
          else{ 

            threat_pieces.push(grid[y][i])
            threat_grid.push(a5);
          }
          break
        }
        //if friendly piece
        else   {
          if (! first_friendly5){
            //  if 1 friendly piece
            a5p.push([i,y]);
            first_friendly5 = true
          }
          else{
            // if 2nd friendly piece
            break
          }
        }
    }
    else if (!tf){
      if (a5p.length == 0){
        a5.push([i,y]);
      }
      else{
        a5p.push([i,y]);
      }
      
    }
  }

  var a6 = ["x-,y="], a6p = [], first_friendly6 = false;
  for (let i = x-1;i>-1;i--){
    if (grid[y][i] instanceof Piece){

      if (grid[y][i].color != turn && (grid[y][i].name == "rook" || grid[y][i].name == "queen" || grid[y][i].name == "king" && Math.abs(i-x == 1))){

        a6.push([i,y])
       //if friendly piece in between
       if (a6p.length != 0){
        a.grid[a6p[0][1]][a6p[0][0]].is_check = true;
        a.grid[a6p[0][1]][a6p[0][0]].possible_move = a6p.concat(a6)
      }
      // if just enermy piece
      else{ 

        threat_pieces.push(grid[y][i])
        threat_grid.push(a6);
      }
      break
    }
      //if friendly piece
      else   {
        if (! first_friendly6){
          //  if 1 friendly piece
          a6p.push([i,y]);
          first_friendly6 = true
        }
        else{
          // if 2nd friendly piece
          break
        }
      }
    }
  
    else if (!tf){
      if (a6p.length == 0){
        a6.push([i,y]);
      }
      else{
        a6p.push([i,y]);
      }
  
    }
}

  var a7 = ["x=,y+"],a7p = [], first_friendly7 = false;
  for (let i = y+1;i<8;i++){

    if (grid[i][x] instanceof Piece){
      if (grid[i][x].color != turn && (grid[i][x].name == "rook" || grid[i][x].name == "queen" || grid[i][x].name == "king" && Math.abs(i-y == 1))){
        a7.push([x,i])
        //if friendly piece in between
        if (a7p.length != 0){
          a.grid[a7p[0][1]][a7p[0][0]].is_check = true;
          a.grid[a7p[0][1]][a7p[0][0]].possible_move = a7p.concat(a7)
        }
        // if just enermy piece
        else{ 

          threat_pieces.push(grid[i][x])
          threat_grid.push(a7);
        }
        break
      }
        //if friendly piece
        else   {
          if (! first_friendly7){
            //  if 1 friendly piece
            a7p.push([x,i]);
            first_friendly7 = true
          }
          else{
            // if 2nd friendly piece
            break
          }
        }
      }
    
      else if (!tf){
        if (a7p.length == 0){
          a7.push([x,i]);
        }
        else{
          a7p.push([x,i]);
        }
      }
  }

  var a8 = ["x=,y-"],a8p = [], first_friendly8 = false;
  for (let i = y-1;i>-1;i--){


    if (grid[i][x] instanceof Piece){
      if (grid[i][x].color != turn && (grid[i][x].name == "rook" || grid[i][x].name == "queen" || grid[i][x].name == "king" && Math.abs(i-y == 1))){
        a8.push([x,i])
        //if friendly piece in between
        if (a8p.length != 0){
          a.grid[a8p[0][1]][a8p[0][0]].is_check = true;
          a.grid[a8p[0][1]][a8p[0][0]].possible_move = a8p.concat(a8)
        }
        // if just enermy piece
        else{ 

          threat_pieces.push(grid[i][x])
          threat_grid.push(a8);
        }
        break
      }
        //if friendly piece
        else   {
          if (! first_friendly8){
            //  if 1 friendly piece
            a8p.push([x,i]);
            first_friendly8 = true
          }
          else{
            // if 2nd friendly piece
            break
          }
        }
      }
    
      else if (!tf){
        if (a8p.length == 0){
          a8.push([x,i]);
        }
        else{
          a8p.push([x,i]);
        }
      }
  }
  
  
  if (threat_grid.length ==0){
    return []
  }
  else{
    return threat_grid
  }
}

function isKingAround(grid,turn,x,y) {
  if (x + 1 < 8){
    if (grid[y][x+1].name == "king" && grid[y][x+1].color != turn){
      return true
    }
    if(y+1 < 8){
      if (grid[y+1][x+1].name == "king" && grid[y+1][x+1].color != turn){
        return true
      }
    }
    if (y-1 > -1){
      if (grid[y-1][x+1].name == "king" && grid[y-1][x+1].color != turn){
        return true
      }
    }
  }

  if (x-1 > -1){
    if (grid[y][x-1].name == "king" && grid[y][x-1].color != turn){
      return true
    }
    if(y+1<8){
      if (grid[y+1][x-1].name == "king" && grid[y+1][x-1].color != turn){
        return true
      }
    }
    if(y-1>-1){
      if (grid[y-1][x-1].name == "king" && grid[y-1][x-1].color != turn){
        return true
      }
    }
  }

  if(y+1<8){
    if (grid[y+1][x].name == "king" && grid[y+1][x].color != turn){
      return true
    }
  }

  if(y-1>-1){
    if (grid[y-1][x].name == "king" && grid[y-1][x].color != turn){
      return true
    }
  }

  return false
}

function other_threat_loc_king(x,y,turn){ // change shits here so i wont kill myself

  var threat_pieces = [] // goal here is to make sure this grid is not in danger and does not have king around it

  var grid = a.grid,threat_grid = [];

  var a1 = ["x+,y+"]
  var a2 = ["x+,y-"]

  var bf,tf;
  for (let i = x+1;i<8;i++){ 


    // diagnonal 
    // x+, y+
    if (y + i-x < 8 && !bf){

      if (grid[y + i-x][i] instanceof Piece){

        if (grid[y+i-x][i].color != turn && (grid[y+i-x][i].name == "bishop" || grid[y+i-x][i].name == "king" && Math.abs(i-x == 1)|| grid[y+i-x][i].name == "queen" || grid[y+i-x][i].name == "pawn" && grid[y+i-x][i].color == "white" && i-x == 1)){

          a1.push([i,y+i-x]);
          threat_pieces.push(grid[y+i-x][i])
          threat_grid.push(a1)
          bf = true;
        }
        else   {
          bf = true;
        }
      }

      else if (!bf){

        if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
          if (isKingAround(grid,turn,i,y+i-x)){
            a1.push([i,y+i-x]);
            threat_pieces.push(grid[y+i-x][i])
            threat_grid.push(a1)
          }
        }
        else{
          a1.push([i,y+i-x]);
        }
      }
    }

    // x+, y-
    if (y-i+x > -1 && !tf){
      if (grid[y-i+x][i] instanceof Piece){
        if (grid[y-i+x][i].color != turn && (grid[y-i+x][i].name == "bishop" || grid[y-i+x][i].name == "king" && Math.abs(i-x == 1)|| grid[y-i+x][i].name == "queen" || grid[y-i+x][i].name == "pawn" && grid[y-i+x][i].color == "black" && i-x == 1)){
          a2.push([y-i+x])
          threat_pieces.push(grid[y-i+x][i])
          threat_grid.push(a2);
          tf = true;
        }
        else   {
          tf = true;
        }
      }

      else if (!tf){
        if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
          if (isKingAround(grid,turn,i,y-i+x)){
            a2.push([i,y-i+x]);
            threat_pieces.push(grid[y-i+x][i])
            threat_grid.push(a2);
          }
        }
        else{
          a2.push([i,y-i+x]);
        }
      }
    }
  }

  tf = false, bf = false
  var a3 = ["x-,y-"]
  var a4 = ["x-,y+"]

  for (let i = x-1;i>-1;i--){

    // x-, y-
    if (y+i-x > -1 && !tf){
      if (grid[y+i-x][i] instanceof Piece){
        if (grid[y+i-x][i].color != turn && (grid[y+i-x][i].name == "bishop" || grid[y+i-x][i].name == "king" && Math.abs(i-x == 1) || grid[y+i-x][i].name == "queen" || grid[y+i-x][i].name == "pawn" && grid[y+i-x][i].color == "black" && x - i == 1)){
          a3.push([i,y+i-x]);
          threat_grid.push(a3);
          threat_pieces.push(grid[y+i-x][i]);
          tf = true;
        }
        else{
          tf = true;
        }
      }

      else if (!tf){
        if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
          if (isKingAround(grid,turn,i,y+i-x)){
            a3.push([i,y+i-x]);
            threat_grid.push(a3);
            threat_pieces.push(grid[y+i-x][i]);
          }
        }
        else{
          a3.push([i,y+i-x]);
        }
      
      }
    }

    // x-, y+
    if (y-i+x < 8 && !bf){
      if (grid[y-i+x][i] instanceof Piece){
        if (grid[y-i+x][i].color != turn && (grid[y-i+x][i].name == "bishop" || grid[y][i].name == "king" && Math.abs(i-x == 1) || grid[y-i+x][i].name == "queen" || grid[y-i+x][i].name == "pawn" && grid[y-i+x][i].color == "white" && x-i == 1)){
          a4.push([i,y-i+x])
          threat_pieces.push(grid[y-i+x][i])
          threat_grid.push(a4);
          bf = true;
        }
        else{
          bf = true;
        }
      }

      else if (!bf){
        if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
          if (isKingAround(grid,turn,i,y-i+x)){
            a4.push([i,y-i+x]);
            threat_pieces.push(grid[y-i+x][i])
            threat_grid.push(a4);
          }
        }
        else{
          a4.push([i,y-i+x]);
        }
      }
    }
  }

  // hor,ver

  var a5 = ["x+,y="];

  for (let i = x+1;i<8;i++){
    if (grid[y][i] instanceof Piece){
      if (grid[y][i].color != turn && (grid[y][i].name == "rook" || grid[y][i].name == "queen" || grid[y][i].name == "king" && Math.abs(i-x == 1))){ // order precedence matter here
        a5.push([i,y]);
        threat_grid.push(a5)
        threat_pieces.push(grid[y][i])
        break;
      }
      else{
        break;
      }
    }

    else{
      if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
        if (isKingAround(grid,turn,i,y)){
          a5.push([i,y]);
          threat_grid.push(a5)
          threat_pieces.push(grid[y][i])
        }
      }
      else{
        a5.push([i,y]);
      }
    }
  }

  var a6 = ["x-,y="];
  for (let i = x-1;i>-1;i--){
    if (grid[y][i] instanceof Piece){

      if (grid[y][i].color != turn && (grid[y][i].name == "rook" || grid[y][i].name == "queen" || grid[y][i].name == "king" && Math.abs(i-x == 1))){
        a6.push([i,y]);
        threat_grid.push(a6);
        threat_pieces.push(grid[y][i])
        break;
      }
      else{
        break;
      }
    }

    else{
      if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
        if (isKingAround(grid,turn,i,y)){
          a6.push([i,y]);
          threat_grid.push(a6);
          threat_pieces.push(grid[y][i])
        }
      }
      else{
        a6.push([i,y]);
      }
    }

  }

  var a7 = ["x=,y+"]
  for (let i = y+1;i<8;i++){

    if (grid[i][x] instanceof Piece){
      if (grid[i][x].color != turn && (grid[i][x].name == "rook" || grid[i][x].name == "queen" || grid[i][x].name == "king" && Math.abs(i-y == 1))){
        a7.push([x,i]);
        threat_grid.push(a7);
        threat_pieces.push(grid[i][x]);
        break;
      }
      else{
        break;
      }
    }

    else{
      if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
        if (isKingAround(grid,turn,x,i)){
          a7.push([x,i]);
          threat_grid.push(a7);
          threat_pieces.push(grid[i][x]);
        }
      }
      else{
        a7.push([x,i]);
      }
    }

  }

  var a8 = ["x=,y-"];
  for (let i = y-1;i>-1;i--){


    if (grid[i][x] instanceof Piece){
      if (grid[i][x].color != turn && (grid[i][x].name == "rook" || grid[i][x].name == "queen" || grid[i][x].name == "king" && Math.abs(i-y == 1))){
        a8.push([x,i]);
        threat_grid.push(a8);
        threat_pieces.push(grid[i][x]);
        break;
      }
      else{
        break;
      }
    }

    else{
      if (Math.abs(i-x == 1)){// make sure enermy king is not around this grid
        if (isKingAround(grid,turn,i,y)){
          a8.push([x,i]);
          threat_grid.push(a8);
          threat_pieces.push(grid[i][x]);
        }
      }
      else{
        a8.push([x,i]);
      }
    }
  }
  
  if (threat_grid.length ==0){
    return []
  }
  else{
    return threat_grid
  }
}

function is_grid_in_danger(grid_loc,turn,is_king){

  // location takes in [x,y] and finds if that grid is in danger
  // potential_danger_loc: each element is 1 direction. first subelement is direction, rest are grid location


  var threat_grid = [], threat_pieces; // need to make sure both funcion recoreds threat piece - may not need it depending on how my original algorithem work
  var x = grid_loc[0], y = grid_loc[1];

  if (is_king){
    threat_grid = other_threat_loc_king(x,y,turn)
  }
  else{
    threat_grid = other_threat_loc(x,y,turn)
  }

  var horse_threat;
  horse_threat = horse_threat_loc(x,y,turn)

  if (horse_threat.length > 1){
    threat_grid.push(horse_threat)
  }

  return (threat_grid.length != 0);
}

function king_threat_locations(grid_loc,turn) {
  
  var threat_grid = [], threat_pieces;
  var x = grid_loc[0], y = grid_loc[1];

  threat_grid = other_threat_loc(x,y,turn)

  var horse_threat;
  horse_threat = horse_threat_loc(x,y,turn)

  if (horse_threat.length > 1){
    threat_grid.push(horse_threat)
  }

  return threat_grid
}

function skip_threat_pieces(grid_loc,turn) {

}

class Grid {
    constructor (width,height){
        this.width = width;
        this.height = height;
        this.grid = [];
    }

    createGrid(){

      this.grid = []
        for (let y = 0; y < this.width; y++){
            this.grid.push([])
            for (let x = 0; x < this.width; x++){
              if (y > 1 && y < 6){
                this.grid[y].push(0)
              }
              else{
                this.grid[y].push(1)
              }
            }
        }
    }

    draw_grid(x_adjust,y_adjust,cell_length,selected_grid){

      for (let y = 0; y < this.height; y++){
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
        this.is_check = false;
        this.possible_move = []
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

        if (this.color == "white"){
          if (new_loc[1] == this.y-2){
            last_pawn_move = [this.x] 
          }
          else{
            last_pawn_move = ["none"];
          }
        }

        else {
            if (new_loc[1] == this.y+2){
              last_pawn_move = [this.x] 
            }
            else{
              last_pawn_move = ["none"];
            }
        }


        this.x = new_loc[0];
        this.y = new_loc[1];



        // set old loc to 0
        grid[old_loc[1]][old_loc[0]] = 0;
        // set new loc to this piece


        grid[this.y][this.x] = this


        return grid

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
          if (target_piece == "error"){
            route_array.push([this.x,this.y-1]);
            
            target_piece = get_piece_info([this.x,this.y-2],alive_pieces)
            if (target_piece == "error"){
              route_array.push([this.x,this.y-2]);
            }

          }
        }

        if (last_pawn_move[0] == this.x+1 || last_pawn_move[0] == this.x-1){
          if (this.y == 3){
            route_array.push([last_pawn_move[0],this.y-1]);
          }
        }

          //  within the board for white, change value for black
          if (this.y-1 >= 0 && this.x+1 <8){
            if (grid[this.y-1][this.x+1] != 0){
              if (grid[this.y-1][this.x+1].color != this.color){
                route_array.push([this.x+1,this.y-1]);
              }
            }
          }
                                                  // same as above
          if (this.y-1 >=0 && this.x-1 >=0){
            if (grid[this.y-1][this.x-1] != 0 ){
              if (grid[this.y-1][this.x-1].color != this.color){
                route_array.push([this.x-1,this.y-1]);
              }
            }
          }

          if (grid[this.y-1][this.x] == 0) {
            route_array.push([this.x,this.y-1]);
          }
          
      }

      else{

        if (this.y == 7){
          // change to other pieces
        }

        if (this.y == 1){ // could be easier if access grid directly
          target_piece = get_piece_info([this.x,this.y+1],alive_pieces)
          if (target_piece == "error"){
            route_array.push([this.x,this.y+1]);
            
            target_piece = get_piece_info([this.x,this.y+2],alive_pieces)
            if (target_piece == "error"){
              route_array.push([this.x,this.y+2]);
            }

          }

        }

        if (last_pawn_move[0] == this.x+1 || last_pawn_move[0] == this.x-1){
          if (this.y == 4){
            route_array.push([last_pawn_move[0],this.y+1]);
          }
        }

        //     within the board for white, change value for black
        if (this.y+1 >= 0 && this.x+1 <8){
          if (grid[this.y+1][this.x+1] != 0){
            if (grid[this.y+1][this.x+1].color != this.color){
              route_array.push([this.x+1,this.y+1]);
            }
          }
        }
                                                // same as above
        if (this.y+1 >=0 && this.x-1 >=0){
          if (grid[this.y+1][this.x-1] != 0){
            if (grid[this.y+1][this.x-1].color != this.color){
              route_array.push([this.x-1,this.y+1]);
            }
          }
        }

        if (grid[this.y+1][this.x] == 0) {
          route_array.push([this.x,this.y+1]);
        }
        
        
      }


      if (check_warning){
        var temp = []
        for (let i=0;i<route_array.length;i++){
          for (let u=0;u<threat.length;u++){

            if (array_in_array(threat[u],route_array[i])){
              temp.push(route_array[i])
            }
          }
        }
        return temp;
      }

      else{
        var temp = []
        if (this.is_check){
          for (let i=0;i<route_array.length;i++){

            if (array_in_array(this.possible_move,route_array[i])){
              temp.push(route_array[i])
            }
          }
          this.is_check = false;
          this.possible_move = []
          return temp
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


      // set old loc to 0
      grid[old_loc[1]][old_loc[0]] = 0;
      // set new loc to this piece
      grid[this.y][this.x] = this

      return grid

  }

  show_routes(grid){
    /* shows all possible move which should not be case sensetive
        returns an array with the location of all possible moves
    */
    var route_array = [];
    var target_piece



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

      if (check_warning){
        var temp = []
        for (let i=0;i<route_array.length;i++){
          for (let u=0;u<threat.length;u++){

            if (array_in_array(threat[u],route_array[i])){
              temp.push(route_array[i])
            }
          }
        }
        return temp;
      }
      else{
        var temp = []
        if (this.is_check){
          for (let i=0;i<route_array.length;i++){

            if (array_in_array(this.possible_move,route_array[i])){
              temp.push(route_array[i])
            }
          }
          this.is_check = false;
          this.possible_move = []
          return temp
        }
      }

    return route_array
  }
}

class Rook extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "rook"
    this.first_move = true;
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.x = new_loc[0];
    this.y = new_loc[1];

    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    this.first_move = false; 
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
      
      if (check_warning){
        var temp = []
        for (let i=0;i<route_array.length;i++){
          for (let u=0;u<threat.length;u++){

            if (array_in_array(threat[u],route_array[i])){
              temp.push(route_array[i])
            }
          }
        }
        return temp;
      }
      else{
        var temp = []
        if (this.is_check){
          for (let i=0;i<route_array.length;i++){

            if (array_in_array(this.possible_move,route_array[i])){
              temp.push(route_array[i])
            }
          }
          this.is_check = false;
          this.possible_move = []
          return temp
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
    var tf = false, bf = false;

      for (let i = this.x+1;i<8;i++){ 

        // x+, y+
        if (this.y + i-this.x < 8 && !bf){

          if (grid[this.y + i-this.x][i] instanceof Piece){
            if (grid[this.y + i-this.x][i].color != this.color){
              route_array.push([i,this.y+i-this.x]);
              bf = true;
            }
            else   {
              bf = true;
            }
          }

          else if (!bf){
            route_array.push([i,this.y+i-this.x]);
          }
        }

        

        // x+, y-
        if (this.y - i+this.x > -1 && !tf){
          if (grid[this.y - i+this.x][i] instanceof Piece){
            if (grid[this.y - i+this.x][i].color != this.color){
              route_array.push([i,this.y - i + this.x]);
              tf = true;
            }
            else   {
              tf = true;
            }
          }

          else if (!tf){
            route_array.push([i,this.y - i+this.x]);
          }
        }
        
      }

      tf = false, bf = false

      for (let i = this.x-1;i>-1;i--){

        // x-, y-
        if (this.y + i - this.x > -1 && !tf){
          if (grid[this.y + i- this.x][i] instanceof Piece){
            if (grid[this.y + i - this.x][i].color != this.color){
              route_array.push([i,this.y + i - this.x]);
              tf = true;
            }
            else{
              tf = true;
            }
          }

          else if (!tf){
            route_array.push([i,this.y + i - this.x]);
          }
        }

        // x-, y+
        if (this.y - i + this.x < 8 && !bf){
          if (grid[this.y - i + this.x][i] instanceof Piece){
            if (grid[this.y - i + this.x][i].color != this.color){
              route_array.push([i,this.y - i + this.x]);
              bf = true;
            }
            else{
              bf = true;
            }
          }

          else if (!bf){
            route_array.push([i,this.y - i + this.x]);
          }
        }
      }

      if (check_warning){
        var temp = []
        for (let i=0;i<route_array.length;i++){
          for (let u=0;u<threat.length;u++){

            if (array_in_array(threat[u],route_array[i])){
              temp.push(route_array[i])
            }
          }
        }
        return temp;
      }
      else{
        var temp = []
        if (this.is_check){
          for (let i=0;i<route_array.length;i++){

            if (array_in_array(this.possible_move,route_array[i])){
              temp.push(route_array[i])
            }
          }
          this.is_check = false;
          this.possible_move = []
          return temp
        }
      }

    return route_array // make adjustment when route_array is empty
  }
}

class King extends Piece {
  constructor(x,y,color){
    super(x,y,color)
    this.name = "king"
    this.first_move = true
  }

  move(new_loc,grid){
    // new_loc is an array with x,y value of new location ex, [5,6]
    // returns the grid after the move action

    // this.x,this.y == new_loc[0],new_loc[1];

    var old_loc = [this.x,this.y];
    this.first_move = false
    this.x = new_loc[0];
    this.y = new_loc[1];

    // set old loc to 0
    grid[old_loc[1]][old_loc[0]] = 0;
    // set new loc to this piece
    grid[this.y][this.x] = this

    this.first_move = false;

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

 
      if (this.x + 1 < 8){
        // x+1, y no change
        if (!array_in_arrayThreat(threat,"x-,y=")){ // if threat from that side

          if (!is_grid_in_danger([this.x+1,this.y],this.color,true)){
            if (grid[this.y][this.x+1] instanceof Piece){
              if (grid[this.y][this.x+1].color != this.color){
                route_array.push([this.x+1,this.y])
              }
            }
            else{
                route_array.push([this.x+1,this.y])  
            }
          }
        }

        // x + 1, y + 1
        if (this.y+1 < 8){
          if (!array_in_arrayThreat(threat,"x-,y-")){
            if (!is_grid_in_danger([this.x+1,this.y+1],this.color,true)){
              if (grid[this.y+1][this.x+1] instanceof Piece ){
                if (grid[this.y+1][this.x+1].color != this.color){
                  route_array.push([this.x+1,this.y+1])
                }
              }
              else{route_array.push([this.x+1,this.y+1])}
            }
          }
        }

        // x + 1, y - 1
        if (this.y-1 > -1){
          if (!array_in_arrayThreat(threat,"x-,y+")){
            if (!is_grid_in_danger([this.x+1,this.y-1],this.color,true)){
              if (grid[this.y-1][this.x+1] instanceof Piece){
                if (grid[this.y-1][this.x+1].color != this.color){
                  route_array.push([this.x+1,this.y-1])
                }
              }
              else{route_array.push([this.x+1,this.y-1])}
            }
          }
        }
      }

      if (this.x - 1 > -1){

        if (!array_in_arrayThreat(threat,"x+,y=")){
        // x - 1 , y no change
          if (!is_grid_in_danger([this.x-1,this.y],this.color,true)){
            if (grid[this.y][this.x-1] instanceof Piece){
              if (grid[this.y][this.x-1].color != this.color){
                route_array.push([this.x-1,this.y])
              }
            }
            else{route_array.push([this.x-1,this.y])}
          }
        }

        // x - 1, y + 1
        if (this.y+1 < 8){
          if (!array_in_arrayThreat(threat,"x+,y-")){
            if (!is_grid_in_danger([this.x-1,this.y+1],this.color,true)){
              if (grid[this.y+1][this.x-1] instanceof Piece){
                if (grid[this.y+1][this.x-1].color != this.color){
                  route_array.push([this.x-1,this.y+1])
                }
              }
              else{route_array.push([this.x-1,this.y+1])}
            }
          }
        }

        // x - 1, y - 1
        if (this.y - 1 > -1){
          if (!array_in_arrayThreat(threat,"x+,y+")){
            if (!is_grid_in_danger([this.x-1,this.y-1],this.color,true)){
              if (grid[this.y-1][this.x-1] instanceof Piece){
                if (grid[this.y-1][this.x-1].color != this.color){
                  route_array.push([this.x-1,this.y-1])
                }
              }
              else{route_array.push([this.x-1,this.y-1])}
            }
          }
        }
      }

      // x no change, y - 1
      if (this.y - 1 > -1){
        if (!array_in_arrayThreat(threat,"x=,y+")){
          if (!is_grid_in_danger([this.x,this.y-1],this.color,true)){
            if (grid[this.y-1][this.x] instanceof Piece){
              if (grid[this.y-1][this.x].color != this.color){
                route_array.push([this.x,this.y-1])
              }
            }
            else{route_array.push([this.x,this.y-1])}
          }
        }
      }
      

      if (this.y + 1 < 8){ // x no change, y + 1
        if (!array_in_arrayThreat(threat,"x=,y-")){
          if (!is_grid_in_danger([this.x,this.y+1],this.color,true)){
            if (grid[this.y+1][this.x] instanceof Piece){
              if (grid[this.y+1][this.x].color != this.color){
                route_array.push([this.x,this.y+1])
              }
            }
            else{route_array.push([this.x,this.y+1])}
          }
        }
      }


    if (this.first_move && this.x == 4){ // white king castle

      if (! is_grid_in_danger([this.x,this.y],this.color,true) && ! is_grid_in_danger([this.x+1,this.y],this.color,true) && grid[this.y][this.x+1] == 0 && ! is_grid_in_danger([this.x+2,this.y],this.color,true) && grid[this.y][this.x+2] == 0 && grid[this.y][this.x+3].name == "rook" && grid[this.y][this.x+3].color == this.color && grid[this.y][this.x+3].first_move) {
        route_array.push([this.x+2,this.y])

      }


      if (! is_grid_in_danger([this.x,this.y],this.color,true) && ! is_grid_in_danger([this.x-1,this.y],this.color,true) && grid[this.y][this.x-1] == 0 && ! is_grid_in_danger([this.x-2,this.y],this.color,true) && grid[this.y][this.x-2] == 0 && ! is_grid_in_danger([this.x-3,this.y],this.color,true) && grid[this.y][this.x-3] == 0 && grid[this.y][this.x-4].name == "rook" && grid[this.y][this.x-4].color == this.color && grid[this.y][this.x-4].first_move){
        route_array.push([this.x-2,this.y])
      }
    }


    if (this.first_move && this.x == 3){ // black king castle


      if (! is_grid_in_danger([this.x,this.y],this.color) && ! is_grid_in_danger([this.x-1,this.y],this.color,true) && grid[this.y][this.x-1] == 0 && ! is_grid_in_danger([this.x-2,this.y],this.color,true) && grid[this.y][this.x-2] == 0 && grid[this.y][this.x-3].name == "rook" && grid[this.y][this.x-3].color == this.color && grid[this.y][this.x-3].first_move) {
        route_array.push([this.x-2,this.y])

      }


      if (! is_grid_in_danger([this.x,this.y],this.color,true) && ! is_grid_in_danger([this.x+1,this.y],this.color,true) && grid[this.y][this.x+1] == 0 && ! is_grid_in_danger([this.x+2,this.y],this.color,true) && grid[this.y][this.x+2] == 0 && ! is_grid_in_danger([this.x+3,this.y],this.color,true) && grid[this.y][this.x+3] == 0 && grid[this.y][this.x+4].name == "rook" && grid[this.y][this.x+4].color == this.color && grid[this.y][this.x+4].first_move){
        route_array.push([this.x+2,this.y])
      }
    }

    return route_array;
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
    var tf = false, bf = false;




      for (let i = this.x+1;i<8;i++){ 

        // x+, y+
        if (this.y + i-this.x < 8 && !bf){

          if (grid[this.y + i-this.x][i] instanceof Piece){
            if (grid[this.y + i-this.x][i].color != this.color){
              route_array.push([i,this.y+i-this.x]);
              bf = true;
            }
            else   {
              bf = true;
            }
          }

          else if (!bf){
            route_array.push([i,this.y+i-this.x]);
          }
        }

        

        // x+, y-
        if (this.y - i+this.x > -1 && !tf){
          if (grid[this.y - i+this.x][i] instanceof Piece){
            if (grid[this.y - i+this.x][i].color != this.color){
              route_array.push([i,this.y - i + this.x]);
              tf = true;
            }
            else   {
              tf = true;
            }
          }

          else if (!tf){
            route_array.push([i,this.y - i+this.x]);
          }
        }
      }

      tf = false, bf = false

      for (let i = this.x-1;i>-1;i--){

        // x-, y-
        if (this.y + i - this.x > -1 && !tf){
          if (grid[this.y + i- this.x][i] instanceof Piece){
            if (grid[this.y + i - this.x][i].color != this.color){
              route_array.push([i,this.y + i - this.x]);
              tf = true;
            }
            else{
              tf = true;
            }
          }

          else if (!tf){
            route_array.push([i,this.y + i - this.x]);
          }
        }

        // x-, y+
        if (this.y - i + this.x < 8 && !bf){
          if (grid[this.y - i + this.x][i] instanceof Piece){
            if (grid[this.y - i + this.x][i].color != this.color){
              route_array.push([i,this.y - i + this.x]);
              bf = true;
            }
            else{
              bf = true;
            }
          }

          else if (!bf){
            route_array.push([i,this.y - i + this.x]);
          }
        }
      }

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
      
      if (check_warning){
        var temp = []
        for (let i=0;i<route_array.length;i++){
          for (let u=0;u<threat.length;u++){

            if (array_in_array(threat[u],route_array[i])){
              temp.push(route_array[i])
            }
          }
        }
        return temp;
      }

      else{
        var temp = []
        if (this.is_check){
          for (let i=0;i<route_array.length;i++){

            if (array_in_array(this.possible_move,route_array[i])){
              temp.push(route_array[i])
            }
          }
          this.is_check = false;
          this.possible_move = []
          return temp
        }
      }

    return route_array
  }

}