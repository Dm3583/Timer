export default class Timer {
    constructor() {
        this.timerId = null;
        this.onClickMilliseconds = 0;
        this.currentSeconds = 0;
    }
    resetSeconds = () => {
        this.currentSeconds = 0;
    };

    pad(value) {
        return String(value).padStart(2, '0');
    };

    formatTime = (sec) => {
        const base = 60;
        if (sec >= (base * base * 24)) {
            // this.setState({ ...INIT_STATE });
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
    };


    timerStart = (currSec = 0, funcToRender) => {
        this.onClickMilliseconds = new Date().getTime() - currSec * 1000;
        this.timerId = setInterval(this.tick, 1000, funcToRender);
    };

};