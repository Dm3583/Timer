import react, { Component } from 'react';
import './App.css';
import timer from './utility/Timer';


const INIT_STATE = {
  hours: '00',
  minutes: '00',
  seconds: '00'
}

const Timer = new timer();

console.log(Timer);

class App extends Component {
  state = {
    ...INIT_STATE,
    isTimerOn: true
  }







  timerId = null;
  onClickMilliseconds = 0;
  currentSeconds = 0;

  resetSeconds = () => {
    this.currentSeconds = 0;
  };

  pad(value) {
    return String(value).padStart(2, '0');
  };

  formatTime = (sec) => {
    const base = 60;
    if (sec >= (base * base * 24)) {
      this.setState({ ...INIT_STATE });
      this.resetSeconds();
      return;
    };
    const seconds = this.pad(sec % base);
    const minutes = this.pad(Math.floor((sec / base) % base));
    const hours = this.pad(Math.floor((sec / (base * base)) % (base * base)));

    return {
      seconds,
      minutes,
      hours
    };
  };

  tick = (toRender) => {
    const cdateObj = new Date();
    let t = (cdateObj.getTime() - this.onClickMilliseconds) - (this.currentSeconds * 1000);
    if (t > 999) {
      this.currentSeconds++;
    };
    toRender({
      ...this.formatTime(this.currentSeconds)
    });
  };

  timerStop = (toRender, objToReset) => {
    clearInterval(this.timerId);
    this.resetSeconds();
    toRender({ ...objToReset });
    // this.setState({ ...INIT_STATE });
  };


  timerStart = (currSec = 0, funcToRender) => {
    this.onClickMilliseconds = new Date().getTime() - currSec * 1000;
    this.timerId = setInterval(this.tick, 1000, funcToRender);
  };

  //запуск / остановка отсчета времени,
  //останавливает и обнуляет значение таймера.

  handleStartStop = () => {
    this.setState({ isTimerOn: !this.state.isTimerOn });
    const setStateForRender = this.setState.bind(this);
    if (this.state.isTimerOn && this.currentSeconds === 0) {
      this.timerStart(0, setStateForRender);
    } else if (this.state.isTimerOn && this.currentSeconds > 0) {
      this.timerStart(this.currentSeconds, setStateForRender);
    }
    else {
      this.timerStop(setStateForRender, INIT_STATE);
    };
  };


  //работает на двойной клик
  //(время между нажатиями не более 300 мс!)
  //таймер должен прекратить отсчет времени;
  //если после него нажать старт, то возобновляется отсчет.

  timerWait = () => {
    if (!this.timerId) {
      return;
    }
    this.setState({ isTimerOn: !this.state.isTimerOn });
    clearInterval(this.timerId);
  };


  // сброс секундомера  на 0.
  //Обнуляет секундомер и снова начинает отсчет.
  timerReset = () => {
    // console.log(this.formatTime(this.currentSeconds));
    const setStateForRender = this.setState.bind(this);
    this.timerStop(setStateForRender, INIT_STATE);
    this.timerStart(0, setStateForRender);
  };













  render() {
    const { hours, minutes, seconds } = this.state;
    const { handleStartStop, timerWait, timerReset } = this;
    return (
      <div className="App" >
        <p>
          <span>{hours} : </span>
          <span>{minutes} : </span>
          <span>{seconds}</span>
        </p>
        <div className="Controls">
          <button type="button" onClick={handleStartStop}>
            Start / Stop
          </button>
          <button type="button" onClick={timerWait}>
            Wait
          </button>
          <button type="button" onClick={timerReset}>
            Reset
          </button>
        </div>
      </div>
    );
  };
};

export default App;
