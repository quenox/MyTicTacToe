//Archivo con la lógica del juego
//Se utiliza el algoritmo minimax para realizar las jugadas del ordenador
const coordenadasGanadoras = new CoordenadasGanadoras();

const EMPTY = 0;const PLAYER_X = 1;const PLAYER_O = -1;
var comienza_humano = true;
var audio_background = new Audio('audio/background-music.mp3');
var musica_activada = false;

var board = [
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY]
];

//MAIN
$(document).ready(function() {

  show_board_on_screen();
  listen_clicks_board();

});


//Zona de funciones

// Evalúa el estado actual del tablero
function evaluate(board) {
  // Verificar filas y columnas
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== EMPTY) {
      coordenadasGanadoras.setCoordenadas([i, 0], [i, i], [i, 2]);
      return board[i][0] === PLAYER_O ? 1 : -1; // La computadora gana o el jugador gana
    }
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== EMPTY) {
      coordenadasGanadoras.setCoordenadas([0, i], [1, i], [2, i]);
      return board[0][i] === PLAYER_O ? 1 : -1; // La computadora gana o el jugador gana
    }
  }
  // Verificar diagonales
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== EMPTY) {
    coordenadasGanadoras.setCoordenadas([0, 0], [1, 1], [2, 2]);
    return board[0][0] === PLAYER_O ? 1 : -1; // La computadora gana o el jugador gana
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== EMPTY) {
    coordenadasGanadoras.setCoordenadas([0, 2], [1, 1], [2, 0]);
    return board[0][2] === PLAYER_O ? 1 : -1; // La computadora gana o el jugador gana
  }
  // Empate si no hay espacios vacios del board
  if (!board.flat().includes(EMPTY)) {
    return 0; // Empate
  }

  // Si no hay ganador ni empate, el juego sigue
  return null;
}

// Función para implementar el algoritmo Minimax
function minimax(board, depth, isMaximizing) {
  const score = evaluate(board);

  // Si el juego ha terminado, retornar el puntaje
  if (score !== null) {
    return score;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Verificar si la celda está vacía
        if (board[i][j] === EMPTY) {
          // Intentar hacer un movimiento y llamar recursivamente a minimax
          board[i][j] = PLAYER_O;
          const score = minimax(board, depth + 1, false);
          board[i][j] = EMPTY; // Deshacer el movimiento

          // Actualizar el mejor puntaje
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Verificar si la celda está vacía
        if (board[i][j] === EMPTY) {
          // Intentar hacer un movimiento y llamar recursivamente a minimax
          board[i][j] = PLAYER_X;
          const score = minimax(board, depth + 1, true);
          board[i][j] = EMPTY; // Deshacer el movimiento

          // Actualizar el mejor puntaje
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

// Función para que la computadora realice su movimiento usando Minimax
function getBestMove(board) {
  let bestMove = null;
  let bestScore = -Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Verificar si la celda está vacía
      if (board[i][j] === EMPTY) {
        // Intentar hacer un movimiento y llamar a minimax
        board[i][j] = PLAYER_O;
        const score = minimax(board, 0, false);
        board[i][j] = EMPTY; // Deshacer el movimiento

        // Actualizar el mejor movimiento
        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: i, col: j };
        }
      }
    }
  }

  if ( bestMove == null ) return bestMove; //null significa que el juego terminó(tablero lleno)

  board[bestMove.row][bestMove.col] = PLAYER_O;
  console.table(board);
  return bestMove;
}

function listen_clicks_board()
{
  for ( let i=0;i<3;i++ )
  {
    for ( let j=0;j<3;j++ )
    {
      $("#"+i+"-"+j).click(function() {
        var btnAIStart = document.getElementById('btn-AI-start');
        btnAIStart.style.visibility = 'hidden';

        if ( musica_activada == false )
        {
          musica_activada = true;
          audio_background.volume -= 0.80;
          audio_background.play();
        }

        if ( evaluate(board) == 0 ) //no es posible realizar más jugadas
        {
          alert('Empate');
          audio_background.pause();
          audio_background.currentTime = 0;
          return;
        }

        if ( evaluate(board) == 1 )
        {
          alert("Ganador fue el PC");
          audio_background.pause();
          audio_background.currentTime = 0;
          return;
        }

        if ( evaluate(board) == -1 )
        {
          alert("Ganador fue el humano");
          audio_background.pause();
          audio_background.currentTime = 0;
          return;
        }

        if ( board[i][j] != EMPTY )
        {
          add_sound_wrong();
          return;
        }

        add_img_X_to_div(i, j);
        board[i][j] = 1;

        var jugada_IA = getBestMove(board);
        if ( jugada_IA == null )
        {
          alert("El juego ha finalizado en EMPATE");
          audio_background.pause();
          audio_background.currentTime = 0;
          location.reload();
          return;
        }
        board[jugada_IA.row][jugada_IA.col] = -1;
        setTimeout(function() {
          add_img_O_to_div(jugada_IA.row, jugada_IA.col);
          if ( evaluate(board) == 1 || evaluate(board) == -1 || evaluate(board) == 0 )
          {
            evaluate(board) == 1 ? alert("Perdiste :/") : evaluate(board) == -1 ? alert('Ganaste :D') : console.log('empate?');
            audio_background.pause();
            audio_background.currentTime = 0;
            resaltarTrioGanador(coordenadasGanadoras);
          }
        }, 1500);
      });
    }
  }
  
  $("#btn-AI-start").click(function() {
    comienza_humano = false;
    add_img_O_to_div(1, 1);
    board[1][1] = -1;

    var btn = document.getElementById("btn-AI-start");
    btn.style.visibility = 'hidden';
  });
}

function add_img_X_to_div(row, col)
{
  add_sound_human_move();
  var img = comienza_humano ? "<img src='X.png' >" : "<img src='O.png' >";
  $("#"+row+"-"+col).html(img);
}

function add_img_O_to_div(row, col)
{
  add_sound_AI_move();
  var img = comienza_humano ? "<img src='O.png' >" : "<img src='X.png' >";
  $("#"+row+"-"+col).html(img);
}

function add_sound_human_move()
{
  var audio = new Audio('audio/human_move.mp3');
  audio.playbackRate += 0.5;
  audio.play();
}

function add_sound_AI_move()
{
  var audio = new Audio('audio/AI_move.mp3');
  audio.playbackRate += 0.5;
  audio.play();
}

function add_sound_wrong()
{
  body_red_effect(8, 50);
  var audio = new Audio('audio/wrong.mp3');
  audio.playbackRate += 0.9;
  audio.play();
}


function body_red_effect(iterations, delay) {
  if (iterations <= 0) {
    $('body').css('background-color', 'white');
    return;
  }

  setTimeout(function() {
    $('body').css('background-color', iterations % 2 === 1 ? 'red' : 'white');
    body_red_effect(iterations - 1, delay);
  }, delay);
}


function show_board_on_screen()
{
  for ( let i=0 ; i<3 ;i++ )
  {
    for ( let j=0 ;j<3 ;j++ )
    {
      if ( board[i][j] == PLAYER_X )
        add_img_X_to_div(i, j);
      if ( board[i][j] == PLAYER_O )
        add_img_O_to_div(i, j);
    }
  }
}


function resaltarTrioGanador(coordenadasGanadoras)
{
  console.log(coordenadasGanadoras);
  if ( coordenadasGanadoras.getCoordenadas().length != 3 )
  {
    console.log('Sin jugada ganadora');
    return;
  }

  for ( let i=0 ; i<3 ; i++ )
  {
    for ( let j=0 ; j<3 ; j++ )
    {
      if (coordenadasGanadoras.getCoordenadas().some(coordenada => coordenada[0] === i && coordenada[1] === j) )
      {
        //continúo porque existe i, j como jugada ganadora
        iniciarTransicion(i+'-'+j);
        continue;
      }
      //si no es jugada ganadora
      var cuadricula = document.getElementById(i+'-' +j);
      var imagenHija = cuadricula.querySelector('img');
      
      if (imagenHija) {
        // Aplica la opacidad al elemento hijo (la imagen)
        imagenHija.style.opacity = 0.1;
      }
    }
  }
}


function iniciarTransicion(divId) {
  var miElemento = document.getElementById(divId).querySelector('img');
  var escala = 1;
  var repeticiones = 0;
  var repeticiones_limite = 10;

  var intervalID = setInterval(function() {
    miElemento.style.transition = 'transform 0.4s ease-in-out';
    
    // Cambia gradualmente la escala
    escala = escala === 1 ? 0.7 : 1;
    miElemento.style.transform = 'scale(' + escala + ')';
    
    repeticiones++;
    if ( repeticiones >= repeticiones_limite )
    {
      clearInterval(intervalID);
    }
  }, 400); //
}
