class Carousel {

    constructor(s) {
        // containerID = '#carousel', interval = 5000, slideID = '.slide'

        let settings = this._initConfig(s);
        this.container = document.querySelector(settings.containerID);
        this.slides = this.container.querySelectorAll(settings.slideID);
        this.interval = settings.interval;
    }

    _initConfig = (obj) => {
        const settings = {
            containerID: '#carousel',
            interval: 5000,
            slideID: '.slide'
        };

        if (obj !== undefined) {
            settings.containerID = obj.containerID || '#carousel';
            settings.interval = obj.interval || 5000;
            settings.slideID = obj.slideID || '.slide';
        }
        
        return settings;
    }

    _initProps() {
        this.slidesCount = this.slides.length;
        this.currentSlide = 0;
        this.isPlaying = true;
        this.FA_PLAY = '<i class="fas fa-play"></i>';
        this.FA_PAUSE = '<i class="fas fa-pause"></i>';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = ' ';
    }

    _initControls() {
        let controls = document.createElement('div');
        const PAUSE = `<div id="pause-btn" class="control control-pause"><i class="fas fa-pause"></i></div>`;
        const PREV = `<div id="prev-btn" class="control control-prev"><i class="fas fa-angle-left"></i></div>`;
        const NEXT = `<div id="next-btn" class="control control-next"><i class="fas fa-angle-right"></i></div>`;

        controls.setAttribute('class', 'controls');
        controls.setAttribute('id', 'controls-container');
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls);
        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    }

    _initIndicators() {
        let indicators = document.createElement('ol');
        indicators.setAttribute('class', 'indicators');
        indicators.setAttribute('id', 'indicators-container');

        for (let i = 0, n = this.slidesCount; i < n; i++) {
            let indicator = document.createElement('li');
            indicator.setAttribute('class', 'indicator');
            indicator.setAttribute('data-slide-to', `${i}`);
            i === 0 && indicator.classList.add('active');
            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);
        this.indicatorsContainer = this.container.querySelector('#indicators-container');
        this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
        document.addEventListener('keydown', this._pressKey.bind(this));
    }

    _gotoNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (this.slidesCount + n) % this.slidesCount;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    }

    _gotoNext() {
        this._gotoNth(this.currentSlide + 1);
    }

    _gotoPrev() {
        this._gotoNth(this.currentSlide - 1);
    }

    _pause() {
        if (this.isPlaying) {
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
            clearInterval(this.timerID);
        }
    }

    _play() {
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
        this.timerID = setInterval(() => this._gotoNext(), this.interval);
    }

    _pressKey(e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
    }

    _indicate(e) {
        let target = e.target;
        if (target.classList.contains('indicator')) {
            this._pause();
            this._gotoNth(+target.dataset.slideTo);
        }
    }

    pausePlay() {
        if (this.isPlaying) {
            this._pause();
        } else {
            this._play();
        }
    }

    prev() {
        this._pause();
        this._gotoPrev();
    }

    next() {
        this._pause();
        this._gotoNext();
    }

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        this.timerID = setInterval(() => this._gotoNext(), this.interval);
    }
}

class SwipeCarousel extends Carousel {
    _initListeners() {
        super._initListeners();
        this.container.addEventListener('touchstart', this._swipeStart.bind(this));
        this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    }

    _swipeStart(e) {
        this._swipeStartX = e.changedTouches[0].pageX;
    }

    _swipeEnd(e) {
        this._swipeEndX = e.changedTouches[0].pageX;
        this._swipeStartX - this._swipeEndX > 100 && this.next();
        this._swipeStartX - this._swipeEndX < -100 && this.prev();
    }
}