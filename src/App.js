import react, { useState, useEffect, useRef,createRef } from 'react';
import { interval, fromEvent } from 'rxjs';
import { map, buffer, filter, debounceTime } from 'rxjs/operators';
import './App.css';

const TIMER_STATUS = {
  START: 'start',
  STOP: 'stop',
  WAIT: 'wait'
};

const App = () => {

  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState(TIMER_STATUS.STOP);

  const waitBtn = useRef('#wait');


  useEffect(()=>{

    const timer = interval(1000);
    const subscription = timer.subscribe(()=>
      {
          if(status===TIMER_STATUS.START){
            setSeconds(sec=>sec+1000);
        };
      }
    );
      return ()=> subscription.unsubscribe();
  },
  [status]);

  //запуск / остановка отсчета времени,
  //останавливает и обнуляет значение таймера.
    const handleStartStop = () => {
      if(status === TIMER_STATUS.STOP||status === TIMER_STATUS.WAIT){
      setStatus(TIMER_STATUS.START);

      }else{
      setStatus(TIMER_STATUS.STOP);
      setSeconds(0);
      }
    };

  //работает на двойной клик
  //(время между нажатиями не более 300 мс!)
  //таймер должен прекратить отсчет времени;
  //если после него нажать старт, то возобновляется отсчет.
 
    useEffect(()=>{
      const click = fromEvent(waitBtn.current, 'click');
      const doubleClick = click
      .pipe(
        buffer(click.pipe(debounceTime(300))),
        map(clicks => clicks.length),
        filter(clicksLength => clicksLength === 2)
      );
      const subscription = doubleClick.subscribe(_ => {
        setStatus(TIMER_STATUS.WAIT);    
      });
      
      return () => subscription.unsubscribe();
    },[]);

  // сброс секундомера  на 0.
  //Обнуляет секундомер и снова начинает отсчет.
    const handleReset = () => {
      if(status === TIMER_STATUS.WAIT&&seconds>0){
        setStatus(TIMER_STATUS.START);
      }
      setSeconds(0);
    };
 
  return (
    <div className="App" >
      <p>
          {new Date(seconds).toISOString().slice(11,19)}
      </p>
      <div className="Controls">
        <button type="button" onClick={handleStartStop}>
          {status !== TIMER_STATUS.START ? "Start" : "Stop"}
        </button>
        <button id="wait" ref={waitBtn} type="button" >
          Wait
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;