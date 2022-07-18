import Game from './game';
import './styles/style.css';
import Events from './events';

let g = new Game();
g.initGame();
Events(g);
