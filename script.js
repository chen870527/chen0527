

//toMaster() 的用途，就如同先前在 Web Audio API 中透過 .connect(audioCtx.destination) 做的事，將音源連接到播放裝置上。
//如果要新增音效節點，也是同樣的透過 connect() 方法，將節點連接。













const warningOverlay = document.getElementById('warning-overlay');  //42
const startButton = document.getElementById('start-button');    //67
const whateverButton = document.getElementById('whatever-button');  //51
const bpmInput = document.getElementById('bpm-input');  //79
const drumPatternsSelect = document.getElementById('drum-patterns-select');     //418
const drumToggle = document.getElementById('drum-toggle');      //388
const chordsSelect = document.getElementById('chords-select');  //288
const chordsInstrumentSelect = document.getElementById('chords-instrument-select');     //297
const backgroundSoundsSelect = document.getElementById('background-samples-select');    //348
const firstMelodySelect = document.getElementById('first-melody-select');
const secondMelodySelect = document.getElementById('second-melody-select');





const melodyInstrumentSelect = document.getElementById('melody-instrument-select');


const backgroundVolumeSlider = document.getElementById('background-volume-slider');     //358
const backgroundToneSlider = document.getElementById('background-tone-slider');     //370
const canvasDiv = document.getElementById('canvas-div'); // 61
const canvasOverlay = document.getElementById('canvas-overlay'); //65
const melodyPanelDiv = document.getElementById('melody-panel-div');


const backgroundImage = document.getElementById('background-image');
const bassVolumeSlider = document.getElementById('bass-volume-slider');
const bassToneSlider = document.getElementById('bass-tone-slider');
const melodyVolumeSlider = document.getElementById('melody-volume-slider');
const chordsVolumeSlider = document.getElementById('chords-volume-slider');
const masterReverbSlider = document.getElementById('master-reverb-slider');
const masterToneSlider = document.getElementById('master-tone-slider');
const masterVolumeSlider = document.getElementById('master-volume-slider')
const melodySwingSlider = document.getElementById('melody-swing-slider');
const chordsSwingSlider = document.getElementById('chords-swing-slider');
const controlPanels = document.getElementsByClassName('panel');                         //所有class:panel 的控制面板






const bubbleDiv = document.getElementById('bubble-div');  //62 啊這三小
const drumVolumeSlider = document.getElementById('drum-volume-slider');
const drumToneSlider = document.getElementById('drum-tone-slider');






const TRIGGER_MELODY = 'trigger_melody';
const TRIGGER_CHORDS = 'trigger_chords';
const TRIGGER_DRUM = 'trigger_drum';
const TRIGGER_BASS = 'trigger_bass';

const CHANGE_CHORDS_INSTRUMENT = 'change_chords_instrument';

const CHANGE_CHORDS_PATTERN = 'change_chords_pattern';
const CHANGE_DRUM_PATTERN = 'change_drum_pattern';

const MAKE_CHORDS_SWING = 'make_chords_swing';


const INCREASE_BPM = 'increase_bpm';










const TICK_PER_BAR = 384;
const BEATS_PER_BAR = 4;





const SYNTHS = 0;
const PIANO = 1;
const ACOUSTIC_GUITAR = 2;
const ELETRIC_GUITAR = 3;

const NUM_PRESET_MELODIES = 4;

const NUM_DRUM_PATTERN = 3;



const DEFAULT_GUIDANCE_INTERVAL = 500;
const SAMPLE_BASE_URL = './samples';






const state = {
loading: true,
started: false,

loadEventsCount: 0,


backgroundSounds : {
    mute: false,
    samples: [],
    names: ['rain', 'waves', 'street', 'kids'],
    index: 0,
    tone: 1,
},
instruments: {},
melody: {
    mute: false,
    part: null,
    gain: 1,
    swing: 0,
    instrumentIndex: 1,
    waitingInterpolation: true,
    midis: [],
    toneNotes: [],
    index: 0,
    secondIndex: 1,
    interpolationToneNotes: [],
    interpolationData: [],
    interpolationIndex: 0,
},
chords: {
    mute: true,
    part: null,
    index: 0,
    gain: 1,
    swing: 0,
    midis: null,
    instrumentIndex: 0,
},
bass: {
    mute: true,
    toneSliderValue: 20,
    notes: [
        { time: '0:0:0', note: 'F2', duration: { '1m': 0.7 }, velocity: 1.0},          //velocity ??
        { time: '1:0:0', note: 'F2', duration: { '1m': 0.7 }, velocity: 1.0},           //duration 形式?
        { time: '2:0:0', note: 'C2', duration: { '1m': 0.7 }, velocity: 1.0},
        { time: '3:0:0', note: 'C2', duration: { '1m': 0.7 }, velocity: 1.0},
    ],
},
canvas: {},
seq: {}, // 鼓節奏?
drum : {
    mute: false,
    gain: 1,
    tone: 0.5,
    names: ['kk','sn','hh'],
    samples: [],
    auto: false,
    patternIndex: 0,
    scale: {
        kk: 1,
        sn: 1,
        hh: 1,
    },
},
master: {
    autoBreak: false,
    masterCompressor: new Tone.Compressor({             //compressor 把音量大的地方調小
        threshold: -15,
        ratio: 7,
    }),
    lpf: new Tone.Filter(20000,'lowpass'),
    reverb: new Tone.Reverb({                           //Reverb 回音
        decay: 1.0,
        preDelay: 0.01,
    }),
    bpm: 75,    
    gain: new Tone.Gain(0.3),
},

    assets:{},
}; //state 結束
const assets = {
    defaultBoardText: 'Fuck paper 2022.',
    catIndex: 0,
    windowUrls: ['./assets/window-0.png', './assets/window-1.png'],
    avatarUrls: [`./assets/avatar-1-0.png`,`./assets/avatar-1-1.png`,`./assets/avatar-1-2.png`],    //為啥這裡是用``
    catUrls: ['./assets/cat-75-purple.gif', './assets/cat-90.gif','./assets/dog-100.gif'],
};


addImages();

loadMidiFiles();

initSounds();
initCanvas();
initMessageCallbacks();


function initSounds() {                             //最初
    Tone.Transport.bpm.value = state.master.bpm;        // 75
    Tone.Transport.loop = true;         // 重複?
    Tone.Transport.loopStart = '0:0:0';
    Tone.Transport.loopEnd = '60:0:0';                   //時間?

    Tone.Master.chain(                              //串起來??
    state.master.masterCompressor,
    state.master.reverb,
    state.master.lpf,
    state.master.gain
);
state.master.reverb.generate().then(() => {                     //啊這個then 又是三小
    console.log('master reverb ready');
    //checkFinishLoading();  
}); 
state.master.reverb.wet.value = masterReverbSlider.value / 100 ;   //wet??

const drumUrls = {};
state.drum.names.forEach((n) => (drumUrls[n] = `${SAMPLE_BASE_URL}/drums/${n}.mp3`));        //$ what's that mean?  可以塞變數!
state.drum.gainNode = new Tone.Gain(1).toMaster();      //toMaster ?  將音源連接到播放裝置上
state.drum.lpf = new Tone.Filter(10000,'lowpass').connect(state.drum.gainNode);
state.drum.samples = new Tone.Players(drumUrls, () => {                     //這坨三小?
    console.log('drums loaded');
    checkFinishLoading();
}).connect(state.drum.lpf);         

state.backgroundSounds.gate = new Tone.Gain(state.backgroundSounds.mute ? 0 : 1).toMaster();        //background   mute:false
state.backgroundSounds.gainNode = new Tone.Gain(1).connect(state.backgroundSounds.gate);
    state.backgroundSounds.hpf = new Tone.Filter(20000,'lowpass').connect(
      state.backgroundSounds.gainNode  
    );
const sampleUrls = {};
state.backgroundSounds.names.forEach((n) => (sampleUrls[n] = `${SAMPLE_BASE_URL}/fx/${n}.mp3`));
state.backgroundSounds.samples = new Tone.Players(sampleUrls, () => {
    console.log('background sounds loaded');
    checkFinishLoading();
}).connect(state.backgroundSounds.hpf);





state.backgroundSounds.names.forEach((name) => {
    state.backgroundSounds.samples.get(name).loop = true;           //看無
});
state.seq = new Tone.Sequence(
    seqCallback,
    Array(128)              //這幹嘛?
        .fill(null)         //
        .map((_, i) => i),      //
        '16n'                   //
);
state.seq.start(0);

const reverb = new Tone.Reverb({            
    decay : 8.5,
    preDelay: 0.1,                  //predelay????
}).toMaster();              
reverb.generate().then(() => {
    console.log('reverb ready!');
    checkFinishLoading();
});
reverb.wet.value = 0.3 ;
const lpf = new Tone.Filter(1000, 'lowpass').connect(reverb);      //濾reverb?
const hpf = new Tone.Filter(1, 'highpass').connect(lpf);
const chorus = new Tone.Chorus(4, 2.5 ,0.1).connect(hpf);           //合唱?

state.instruments[SYNTHS] = new Tone.PolySynth(10, Tone.Synth,{
    envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
    },
}).connect(chorus);

state.instruments[PIANO] = SampleLibrary.load({
    instruments: 'piano',
});
state.instruments[ACOUSTIC_GUITAR] = SampleLibrary.load({
    instruments: 'guitar-acoustic',
});
state.instruments[ELETRIC_GUITAR] = SampleLibrary.load({
    instruments: 'guitar-electric',
});

const { bass } = state;
bass.gate = new Tone.Gain(0).connect(reverb);    //?? gate ? gain
bass.gain = new Tone.Gain(1).connect(bass.gate);
bass.lpf = new Tone.Filter(200, 'lowpass').connect(bass.gain);
bass.instrument = new Tone.Synth({
    oscillator: {
        type: 'square',                 // square?
    },
    envelope: {
        attack: 0.0,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8,
    },
}).connect(bass.lpf);
bass.part = new Tone.Part((time, note) => {
    bass.instrument.triggerAttackRelease(note.note, note.duration, time, note.velocity);    //velocity 音量?      這邊的note 是哪裡的?
}, bass.notes).start(0);                 //??
bass.part.loop = true;
bass.part.loopEnd = '4:0:0';

state.instruments[PIANO].connect(chorus);
state.instruments[ACOUSTIC_GUITAR].connect(chorus);
state.instruments[ELETRIC_GUITAR].connect(chorus);

state.melody.instrument = state.instruments[state.melody.instrumentIndex];          //1  piano






















}   // initSounds 結束






















































function initCanvas() {
    const canvas = document.getElementById('main-canvas');
    state.canvas.canvas = canvas;

    canvasDiv.style.height = `${backgroundImage.clientWidth * (435/885)}px`;            //backgroundImage.width = 885

    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;






































}       // initCanva 結束

function addImages() {
    assets.light = addImageToCanvasDiv('./assets/light-off.png',{
        class: 'large-on-hover',            //?? 
        width: '8%',
        left: '50%',
        top: '-2%',
        zIndex: '2',
    });
    /*dragElement(                //拖動元素      ??這幹嘛的
    assets.light,
    () => {
        toggleStart();
    },
    {horizontal: true, name: 'light', bounded: true}
    );*/
    
    assets.window = addImageToCanvasDiv(assets.windowUrls[state.backgroundSounds.mute ? 1 : 0],{
        class: 'large-on-hover-micro',
        width: '38%',
        left: '17%',
        zIndex: '0',
        top: '20.3%',
    });

const rainGif = addImageToCanvasDiv('./assets/background/rain-0.gif',{
    width: '35%',
    top: '20%',
    left: '20%',
    zIndex: '-2',
});

const wavesGif = addImageToCanvasDiv('./assets/background/waves.gif',{
    width: '35%',
    left: '18%',
    zIndex: '-2',
    top: '22%',
});

const streetGif = addImageToCanvasDiv('./assets/background/city.gif',{
    width: '33%',
    left: '20%',
    zIndex: '-2',
    top: '22%',
});

const kidsGif = addImageToCanvasDiv('./assets/background/city-sunset.gif',{
    width: '33%',
    left: '20%',
    zIndex: '-2',
    top: '14%',
});


streetGif.style.display = 'none';    //它可以將物件連同所在位置一起隱藏
wavesGif.style.display = 'none';
kidsGif.style.display = 'none';

assets.windowGifs = [rainGif, wavesGif, kidsGif, streetGif];    
/*
assets.catGroup = addImageToCanvasDiv(assets.catUrls[assets.catIndex],{
    class: 'large-on-hover',
    width: '6%',
    bottom: '33%',
    left: '43%',
    zIndex: '4',
    group: true,        //???  增加紫色的貓
});


assets.avatarGroup = addImageToCanvasDiv(assets.avatarUrls[0],{
    class: 'large-on-micro',
    width: '11%',
    left: '20%',
    zIndex: '4',
    group: true,
});
*/







assets.cactus = addImageToCanvasDiv('./assets/cactus.png', {        //仙人掌 調背景
    class: 'large-on-hover',
    width: '3%',
    bottom: '39%',
    left: '38%',
    group: true,            //group?
});
const cactusArrow = createCircleElement();
if(!state.backgroundSounds.mute) {
    cactusArrow.classList.add('hidden');
} else {
    assets.cactus.childNodes[0].classList.add('transparent');   // 增加一個class??   transparent: 透明
}
assets.cactus.appendChild(cactusArrow);             // 有circle blink 的class

assets.chair = addImageToCanvasDiv('./assets/chair-red.png', {
    width: '10%',
    left: '10%',
    zIndex: '3',
});

/*

assets.desk = addImageToCanvasDiv('./assets/desk.png', {
    class: 'large-on-hover-micro',
    width: '21%',
    left: '1%',
    zIndex: '3',
    group: true,
});

assets.lamp = addImageToCanvasDiv('./assets/lamp-on.png', {

    width: '20%',
    left: '20%',
    bottom: '100%',
    zIndex: '4',
});

assets.lampOn = true;

assets.pens = addImageToCanvasDiv('./assets/pens.png', {
    
    width: '12%',
    right: '40%',
    bottom: '100%',
    zIndex: '1',
});












assets.shelfWithBooks = addImageToCanvasDiv('./assets/shelf.png', {
    class: 'large-on-hover',
    width: '12%',
    left: '3%',
    bottom: '60%',
});

assets.board = addImageToCanvasDiv('./assets/board.png', {
    class: 'large-on-hover',
    width: '12%',
    right: '20%',
    top: '34%',
    zIndex: '1',
    group: true,
});











assets.shelf = addImageToCanvasDiv('./assets/shelf-blank-2.png', {
    class: 'large-on-hover',
    width: '12%',
    right: '20%',
    top: '22%',
    zIndex: '1',
    group: true,
  });
 /* assets.plant = addImageToCanvasDiv('./assets/vine-2.png', {
    width: '40%',
    right: '10%',
    bottom: '45%',
    zIndex: '4',
  });   
  assets.secondPlant = addImageToCanvasDiv('./assets/vine-4.png', {         // too big?
    width: '60%',
    left: '0%',
    bottom: '15%',
    zIndex: '4',
  });               























  assets.tvStand = addImageToCanvasDiv('./assets/tv-stand.png', {
    width: '20%',
    left: '35%',
    zIndex: '3',
    group: true,
  });
  assets.tvTable = addImageToCanvasDiv('./assets/tv-color.png', {
    class: 'large-on-hover',
    width: '50%',
    bottom: '95%',
    left: '15%',
    zIndex: '1',
    group: true,
  });
  assets.radio = addImageToCanvasDiv('./assets/radio.png', {
    class: 'large-on-hover',
    width: '18%',
    bottom: '95%',
    right: '10%',
    zIndex: '1',
  });


















  assets.sofa = addImageToCanvasDiv('./assets/sofa-1.png', {
    width: '35%',
    right: '3%',
    zIndex: '2',
    group: true,
  });






























  assets.cabinetRight = addImageToCanvasDiv('./assets/cabinet-2.png', {         //櫃子
    width: '10%',
    right: '30%',
    bottom: '9%',
    zIndex: '1',
    group: true,
  });








  assets.clock = addImageToCanvasDiv('./assets/clock-3.png', {          //drum
    class: 'large-on-hover',
    width: '78%',
    right: '10%',
    top: '-21%',
    // bottom: "100%",
    group: true,
  });













  assets.bassGroup = addImageToCanvasDiv('./assets/bass-wall.png', {
    class: 'large-on-hover',
    width: '6%',
    right: '10%',
    top: '10%',
    zIndex: '0',
    group: true,
  });






  assets.chordsInstruments = [
    addImageToCanvasDiv('./assets/synth.png', {
      class: 'large-on-hover',
      width: '30%',
      right: '30%',
      top: '-28%',
      zIndex: '2',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/piano.png', {
      class: 'large-on-hover',
      width: '30%',
      right: '30%',
      top: '-28%',
      zIndex: '2',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/acoustic-guitar.png', {
      class: 'large-on-hover',
      width: '19%',
      left: '40%',
      bottom: '-10%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/electric-guitar.png', {
      class: 'large-on-hover',
      width: '19%',
      left: '40%',
      bottom: '-10%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
  ];

  assets.melodyInstruments = [
    addImageToCanvasDiv('./assets/synth.png', {
      class: 'large-on-hover',
      width: '30%',
      right: '52%',
      bottom: '45%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/piano.png', {
      class: 'large-on-hover',
      width: '30%',
      right: '52%',
      bottom: '45%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/acoustic-guitar.png', {
      class: 'large-on-hover',
      width: '17%',
      left: '19%',
      bottom: '-10%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
    addImageToCanvasDiv('./assets/electric-guitar.png', {
      class: 'large-on-hover',
      width: '17%',
      left: '19%',
      bottom: '-10%',
      zIndex: '3',
      display: 'none',
      group: true,
    }),
  ];
































































































































































































































*/
assets.window.addEventListener('click', () => {                         
    if(checkStarted()) {                    // return Tone.Transport.state === 'started';
        const n = state.backgroundSounds.names.length;
        state.backgroundSounds.switch((state.backgroundSounds.index + 1) % n);
    } else {
        toggleStart();
    }
});

dragElement(
    assets.cactus,
    () => {
        switchPanel('background');
        togglePannel();
    },
    {
        horizontal: true,
        name: 'cactus',
    }
);

state.backgroundSounds.switch = function (index) {                      //切換背景音樂   //這段ok
    state.backgroundSounds.samples
    .get(state.backgroundSounds.names[state.backgroundSounds.index])
    .stop();
    state.backgroundSounds.index = index;
    backgroundSoundsSelect.value = index;
    if(checkStarted()) {
        state.backgroundSounds.samples
        .get(state.backgroundSounds.names[state.backgroundSounds.index])
        .start(0);                  // 0 ??
    }

    //change background
    for (let i = 0; i < assets.windowGifs.length; i++) {
        if(i === index || i.toString() === index) {
            assets.windowGifs[i].style.display = 'block';    //block:它將元素呈現為block-level元素
        } else {
            assets.windowGifs[i].style = 'none';
        }
    }
};


//switchPanel();
}       //addImages 結束

function togglePannel() {               // 關控制面板
    if(melodyPanelDiv.style.display === 'flex') {
        melodyPanelDiv.style.display = 'none';
    } else {
        melodyPanelDiv.style.display = 'flex';
    }
}

function switchPanel(name = 'interpolation') {                      //把所有控制面板藏起來
    for (let i = 0; i < controlPanels.length; i++) {
        const el = controlPanels[i];
        if(el.id === `${name}-div`) {
            el.style.display = 'flex';              // flex 重要
        } else {
            el.style.display = 'none';
        }
    }
}












function addImageToCanvasDiv(src, params) {
    let img = new Image();  //載入圖片
    img.src = src ;

    if(params.group){
        const div = document.createElement('DIV');
        div.style.position = 'absolute';

        img.style.width = '100%';
        img.style.top = '0';
        img.style.left = '0';
        img.style.margin = '0';
        div.appendChild(img);   //增加一項目img
        img=div;
    } else {
        img.style.position = 'absolute';
    }

    if(params.class) {
        if(params.class.includes(' ')) {
            img.classList.add(...params.class.split(' '));
        } else {
            img.classList.add(params.class);
        }
    }
    img.style.position = 'absolute';

    if (params.display) {
        img.style.display = params.display;
    } else {
        img.style.display = 'block';  // 區塊，元素會以區塊方式呈現，
    }

    if(!params.height) {
        img.style.width = params.width ? params.width : '25%';
        img.style.height = 'auto';
    } else {
        img.style.height = params.height;
        img.style.width = 'auto';
    }

    if(!params.right) {
        img.style.left = params.left ? params.left : '5%';
    } else {
        img.style.right =params.right;
    }

    if(!params.top){
        img.style.bottom = params.bottom ? params.bottom : '5%';
    } else {
        img.style.top = params.top;
    }

    if(!params.display) {
        img.style.display = 'block';
    } else {
        img.style.display = params.display;
    }

    img.style.zIndex = params.zIndex ? params.zIndex : '0';

    canvasDiv.appendChild(img);
    return img;
}





















































































































function seqCallback(time, b) {
    if(!state.drum.mute) {                  //true
        if(state.drum.patternIndex === 0 ) {
            if(b % 16 === 0) {                  //節奏?
                state.drum.scale.kk = 1;
                state.drum.samples.get('kk').start(time);
            }
            if(b % 16 === 8) {
                state.drum.scale.sn = 1;
                state.drum.samples.get('sn').start(time);
            }
            if(b % 2 === 0) {
                state.drum.scale.hh = 1;
                state.drum.samples.get('hh').start(time);
            }
        } else if (state.drum.patternIndex === 1) {
            if(b % 32 === 0 || b % 32 === 20 ) {
                state.drum.samples.get('kk').start(time);
            } 
            if(b % 16 === 8) {
                state.drum.samples.get('sn').start(time);
            }
            if(b % 2 === 0) {
                state.drum.samples.get('hh').start(time + 0.07);
            }
        } else if (state.drum.patternIndex === 2) {
            if(b % 16 === 0 || b % 16 === 10 || (b % 32 >= 16 && b % 16 === 11)) {
                state.drum.samples.get('kk').start(time);
            }
            if (b % 8 === 4) {
                state.drum.samples.get('sn').start(time);
            }
            if(b % 2 === 0) {
                state.drum.samples.get('hh').start(time + 0.07);
            }
        }

        






    }






























}           //seqCallback 結束

async function loadMidiFiles() {
    state.chords.midis = await Promise.all([
        Midi.fromUrl('./midi/IV_IV_I_I_IV_IV_I_I_C_1.mid'),
        Midi.fromUrl('./midi/IV_IV_I_I_IV_IV_I_I_C_2.mid'),
        Midi.fromUrl('./midi/IV_IV_I_I_IV_IV_I_I_C_3.mid'),


    ]);

    changeChords(state.chords.index);       //預設0

    state.melody.midis = await Promise.all([
        Midi.fromUrl('./midi/IV_IV_I_I/melody/Princess.mid'),
        Midi.fromUrl('./midi/IV_IV_I_I/melody/m_2_C.mid'),
        Midi.fromUrl('./midi/IV_IV_I_I/melody/m_3_C.mid'),
        Midi.fromUrl('./midi/IV_IV_I_I/melody/m_4_C.mid'),
    ]);
    state.melody.midis[NUM_PRESET_MELODIES] = state.melody.midis[0]; /// NUM = 4
    state.melody.toneNotes = state.melody.midis.map(midiToToneNotes);       // ??


    changeMelodyByIndex(state.melody.index);

    console.log('midi loaded');
    checkFinishLoading();
}

function checkFinishLoading() {
   //state.loadEventsCount += 1;
   //console.log(`${state.loadEventsCount}/${LOAD_EVENTS_COUNTS_THRESHOLD}`);
   if(state.loading){
       state.loading = false;
       console.log('Finish loading');
       onFinishLoading();
   }  // else if (state.loading)
} 








function toggleStart() {
    const ac = Tone.context._context;
    if(ac.state !== 'started'){
        ac.resume();   //阿這他嗎三小
    }

    if(checkStarted()) {            //Tone.transport.state === started   2175
        stopTransport();             
    }else {
        startTransport();
    }
}

function startTransport() {
    Tone.Transport.start();     //Transport開始撥放
    onTransportStart();     //幹你娘 這三小
    startButton.textContent = 'stop';
    assets.light.src = './assets/light-on.png';
    canvasOverlay.style.display = 'none';
}

function stopTransport() {
    Tone.Transport.stop();
    onTransportStop();  //???
    startButton.textContent = 'start';
    assets.light.src = './assets/light-off.png';
    canvasOverlay.style.display = 'flex';
}








function onFinishLoading() {
    canvasOverlay.style.backgroundColor= 'rgba(0,0,0,0.5)';
    startButton.textContent = 'start';
    startButton.classList.remove('disabled');  ///WTF??
    startButton.addEventListener('click', () => {
        if(!state.started) {
            state.started = true;
            onFirstTimeStarted();
        }
        toggleStart();
    });



state.drum.changeGain = function (v) {
    state.drum.gain = v;
    drumVolumeSlider.value = v * 100;
    state.drum.gainNode.gain.value = v;
};

state.drum.changeFilter = function (v) {
    state.drum.tone = v;
    const frq = v * 10000 + 200;
    state.drum.lpf.frequency.value = frq;
    drumToneSlider.value = v * 100;
};

state.melody.changeGain = function (v) {
    state.melody.gain = v;
    melodyVolumeSlider.value = v * 100;
};

state.melody.changeSwing = function (v) {
    state.melody.swing = v;
    melodySwingSlider.value = v * 100;
};

state.chords.changeGain = function (v) {
    state.chords.gain = v;
    chordsVolumeSlider.value = v * 100;
};

state.chords.changeSwing = function (v) {
    state.chords.swing = v;
    chordsSwingSlider.value = v * 100;
};

state.bass.changeFilter = function (v) {
    const frq = v * 4;                              //4-400
    state.bass.lpf.frequency.value = frq ;
    bassToneSlider.value = v;
};
state.bass.changeGain = function (v) {
    state.bass.gain.gain.value = v;         //gain.gain?
    bassVolumeSlider.value = v * 100;       
};

state.backgroundSounds.changVolume = function (v){
    state.backgroundSounds.gainNode.gain.value = v;
    backgroundVolumeSlider.value = v * 100;
};
state.backgroundSounds.changeFilter = function (v){
    const frq = v * 20000;
    state.backgroundSounds.hpf.frequency.value = frq;
    backgroundToneSlider.value = v * 100;
};

state.master.changeReverb = function (v) {
    masterReverbSlider.value = v * 100;
    state.master.reverb.wet.linearRampTo(v, 1, Tone.now());         //linearRampTo ?  Tone.now() 又是三小
};

state.master.changeFilter = function (v) {
    masterToneSlider.value = (v / 20000) * 100;
    state.master.lpf.frequency.linearRampTo(f , 1, Tone.now());
};



changeMasterBpm(state.master.bpm);
bpmInput.addEventListener('input', (e) => {                     //e 是三小?
    changeMasterBpm(bpmInput.value);
});

drumToggle.checked = !state.drum.mute;          // !false = true        
drumToggle.addEventListener('change',(e) => {
    toggleDrum(!drumToggle.checked);    //!true = false
});

if (state.drum.volumeSliderValue) {
    state.drum.changeGain(state.drum.volumeSliderValue / 100);
} else {
    state.drum.changeGain(state.drum.gain);
}
drumVolumeSlider.addEventListener('input', () => {
    state.drum.changeGain(drumVolumeSlider.value /100);
});

if(state.drum.toneSliderValue) {
    state.drum.changeFilter(state.drum.toneSliderValue / 100);
} else {
    state.drum.changeFilter(state.drum.tone);
}
drumToneSlider.addEventListener('input',() => {
    state.drum.changeFilter(drumToneSlider.value / 100);
});

changeDrumPattern(state.drum.patternIndex);
drumPatternsSelect.addEventListener('change', () => {
    changeDrumPattern(parseInt(drumPatternsSelect.value, 10));      //parseInt() 將字串轉換為以十進位表示的整數。parseInt() 接受兩個參數。
});

toggleChords(state.chords.mute);        // 靜音
chordsMuteCheckbox.addEventListener('change', () => {
    toggleChords(!chordsMuteCheckbox.checked);
});
chordsSelect.addEventListener('change', () => {
    changeChords(chordsSelect.value);
});

changeChordsInstrument(state.chords.instrumentIndex);
chordsInstrumentSelect.addEventListener('change', () => {
    changeChordsInstrument(chordsInstrumentSelect.value);
});










state.backgroundSounds.switch(state.backgroundSounds.index);
toggleBackgroundSounds(state.backgroundSounds.mute);   //??
backgroundSoundsMuteCheckbox.addEventListener('change', () => {
    toggleBackgroundSounds(!backgroundSoundsMuteCheckbox.checked);
});

backgroundSoundsSelect.addEventListener('change', () => {
    state.backgroundSounds.switch(Number(backgroundSoundsSelect.value));
});

toggleMelody(state.melody.mute);        //flase
melodyMuteCheckbox.addEventListener('change', () => {
    toggleMelody(!melodyMuteCheckbox.checked);
});

changeMelodyInstrument(state.melody.instrumentIndex);           // 1
melodyInstrumentSelect.addEventListener('change', () => {
    changeMelodyInstrument(melodyInstrumentSelect.value);
})
















/*if(state.melody.volumeSliderValue) {
    state.melody.changeGain(state.melody.volumeSliderValue / 100);
}*/
melodyVolumeSlider.addEventListener('input', () => {
    state.melody.changeGain(melodyVolumeSlider.value / 100);
});

toggleChords(state.chords.mute);                                            // chords mute 切換
if(state.chords.volumeSliderValue) {
    state.chords.changeGain(state.chords.volumeSliderValue / 100);
}
chordsVolumeSlider.addEventListener('input', () => {
    state.chords.changeGain(chordsVolumeSlider.value / 100);
})

toggleBass(state.bass.mute);                                            //  bass mute 切換
bassMuteCheckbox.addEventListener('change', () => {
    toggleBass(!bassMuteCheckbox.checked);
})

/*if (state.bass.volumeSliderValue) {                 // bass 音量
    state.bass.changeGain(state.bass.volumeSliderValue / 100);
}*/
bassVolumeSlider.addEventListener('input', () => {
    state.bass.changeGain(bassVolumeSlider.value / 100);
});

if (state.bass.toneSliderValue) {                   // bass tone
    state.bass.changeFilter(state.bass.toneSliderValue);
}
bassToneSlider.addEventListener('input', () => {
    state.bass.changeFilter(bassToneSlider.value);
})

if(state.backgroundSounds.volumeSliderValue) {                  //背景  音量
    state.backgroundSounds.changeVolume(state.backgroundSounds.volumeSliderValue / 100);
}

if(state.backgroundSounds.toneSliderValue) {            // 背景 tone
    state.backgroundSounds.changeFilter(state.backgroundSounds.toneSliderValue / 100);
}

backgroundVolumeSlider.addEventListener('input', () => {
    state.backgroundSounds.changVolume(backgroundVolumeSlider.value / 100);
});

backgroundToneSlider.addEventListener('input', () => {
    state.backgroundSounds.changeFilter(backgroundToneSlider.value / 100);
});

   












masterReverbSlider.addEventListener('input', () => {
    const wet = masterReverbSlider.value /100;
    state.master.reverb.wet.value = wet;
});

masterToneSlider.addEventListener('input', () => {
    const frq = masterToneSlider.value * 198 + 200;
    state.master.lpf.frequency.value = frq;
});

masterVolumeSlider.addEventListener('input', () => {
    changeMasterVolume(masterVolumeSlider.value /100);
});

state.melody.changeSwing(state.melody.swing);
melodySwingSlider.addEventListener('input', () => {
    state.melody.changeSwing(melodySwingSlider.value / 100);
});

state.chords.changeSwing(state.chords.swing);
chordsSwingSlider.addEventListener('input', () => {
    state.chords.changeSwing(chordsSwingSlider.value / 100);
});











































} //        onFinishLoading() 結束
















async function onFirstTimeStarted(){



    const interval = DEFAULT_GUIDANCE_INTERVAL;  //500
    await sleep(interval);
    bubbleDiv.style.display = 'block' ;

    await sleep(interval * 5);
    bubbleDiv.style.width = '10rem';
    bubbleDiv.textContent = `Can you hear the piano?`;  // ???

    await sleep(interval * 5);
    bubbleDiv.style.width = '12rem';
    bubbleDiv.textContent = `Tinker with the objects in this room and listen carefully.`;




    await sleep(interval * 15);
    //assets.catGroup.appendChild(bubbleDiv);  // WTF?
    bubbleDiv.style.width = '5rem';
    bubbleDiv.textContent = `meow...stfu`;

    await sleep(interval * 10);
    //assets.avatarGroup.appendChild(bubbleDiv);
    bubbleDiv.style.width = '8rem';
    bubbleDiv.textContent = 'Enjoy the magical room.';

    await sleep(interval * 10);
    bubbleDiv.style.width = '10rem';
    bubbleDiv.style.display = 'none';
}       //onFiristStarted

function onTransportStart(){
    if(state.backgroundSounds.mute){
        return;    // return what?
    }
    state.backgroundSounds.samples
     .get(state.backgroundSounds.names[state.backgroundSounds.index])
     .start();
}

function onTransportStop() {
    state.backgroundSounds.samples
      .get(state.backgroundSounds.names[state.backgroundSounds.index])
      .stop();
  }

function toggleBackgroundSounds(value) {                            //backgroundSoundsMuteCheckbox.checked = true ??
    if(value !== undefined) {
        state.backgroundSounds.mute  = value;
    } else {
        state.backgroundSounds.mute = !state.backgroundSounds.mute;
    }

    if(state.backgroundSounds.mute) {
        //
        //
        state.backgroundSounds.gate.gain.value = 0;
        //
    } else {
        //
        //
        state.backgroundSounds.gate.gain.value = 1;
        //

        if(checkStarted()) {
            state.backgroundSounds.samples
            .get(state.backgroundSounds.names[state.backgroundSounds.index])
            .start();
        }
    }

    backgroundSoundsMuteCheckbox.checked = !state.backgroundSounds.mute;
}

function toggleChords(value) {          // 餵 false  return false
    if (value !== undefined) {
        state.chords.mute = value;
    } else {
        state.chords.mute = !state.chords.mute;
    }











    chordsMuteCheckbox.checked = !state.chords.mute;
}

function toggleMelody(value) {              //開始false
    if(value !== undefined) {
        state.melody.mute = value;
    } else {
        state.melody.mute = !state.melody.mute; 
    }













    melodyMuteCheckbox.checked = !state.melody.mute;
}

 function toggleBass(value) {           //一開始 是  state.bass.mute = true   點擊後傳送 !true = false
    if (value !== undefined) {
        state.bass.mute = value;
    } else {
        state.bass.mute = !state.bass.mute;
    }

    if (state.bass.mute) {                  
        state.bass.gate.gain.value = 0;


    } else {
        state.bass.gate.gain.value = 1;


    }

    bassMuteCheckbox.checked = !state.bass.mute;
 }



















function toggleDrum(value , changeFilter = false, time = 0) {           //幹你娘這麼多變數是三小
    if (value === undefined) {
        state.drum.mute = !state.drum.mute;
    } else {
        state.drum.mute = value;                                    // 改靜音或有聲
    }











   /* if(changeFilter) {
        if(!state.drum.mute) {
            state.master.lpf.frequency.linearRampTo(20000 , 1 , time);
        }else {
            state.master.lpf.frequency.linearRampTo(200 , 0.5 , time);
        }
    }


    drumToggle.checked = !state.drum.mute; */

}

function changeChords(index = 0) {
    index = index % state.chords.midis.length;    // 3
    if(state.chords.part) {
        state.chords.part.cancel(0);                 // 取消三小?
    }
state.chords.index = index;
state.chords.part = new Tone.Part((time, note) => {             //Tone.Part is a collection Tone.Events which can be started/stopped and looped as a single unit.
    !state.chords.mute &&
        state.instruments[state.chords.instrumentIndex].triggerAttackRelease(                  //triggerAttackRelease() 這個方法還可以帶第三個參數 - 延遲時間；
        toFreq(note.pitch - (state.chords.instrumentIndex === 0 ? 0 : 12)),
        note.duration,
        time + state.chords.swing * (75 / state.master.bpm) * Math.random() * 0.1,          //JS本身的Math.random()函式，這個函數會隨機產生出0~1之間的小數
        note.velocity * state.chords.gain               //note.velocity?
    );
},midiToToneNotes(state.chords.midis[state.chords.index])).start(0);            //??  改變chords.vibe 

    //
    chordsSelect.value = index;
}

function changeMelodyByIndex(index = 0) {
    if(state.melody.part) {
        state.melody.part.cancel(0);                //取消ㄇ
    }
    state.melody.index = index;
    if(index === state.melody.toneNotes.length - 1){

        return;
    }

    state.melody.part = new Tone.Part((time, note) => {
        !state.melody.mute &&
            state.melody.instrument.triggerAttackRelease(
                toFreq(note.pitch - 12),
                note.duration,
                time + Math.random() * (75 / state.master.bpm) * 0.3 * state.melody.swing,
                note.velocity * state.melody.gain
            );
    }, state.melody.toneNotes[state.melody.index]).start(0);

    state.melody.part.loop = false;

    



}






function changeMelody(readyMidi) {
    if(state.melody.part) {
        state.melody.part.cancel(0);
    }
    state.melody.part = new Tone.Part((time, note) => {
        !state.melody.mute && 
            state.melody.instrument.triggerAttackRelease(
                toFreq(note.pitch - 12),                        //這note.pitch ??
                note.duration,
                time + Math.random() * (75 / state.master.bpm) * 0.3 * state.melody.swing,
                note.velocity * state.melody.gain
            );
    },readyMidi).start(0);
    state.melody.part.loop = true;
    //state.melody.part.loopEnd = '4:0:0';


}






























































function changeMelodyInstrument(index) {








    melodyInstrumentSelect.value = index;
    state.melody.instrumentIndex = index;
    state.melody.instrument = state.instruments[index];
}

























function changeChordsInstrument(index) {








    state.chords.instrumentIndex = index; 
}


















function changeMasterVolume(v) {
    masterVolumeSlider.value = v * 100;
    state.master.gain.gain.value = v;           // 2個gain? 
}

function changeMasterBpm(v) {
    v= Math.min(Math.max(60, v), 100);          // 抓60-100?
    bpmInput.value = v;
    state.master.bpm = v;
    Tone.Transport.bpm.value = v;
}

function changeMasterReverb(v) {
    masterReverbSlider.value = v * 100;
    state.master.reverb.wet.linearRampTo(v, 1, Tone.now());                  //Tone.now 是三小
}

function changeMasterFilter(v) {
    masterToneSlider.value = (v / 20000) * 100;
    state.master.lpf.frequency.linearRampTo(v, 1, Tone.now());
}

function changeDrumPattern(index) {
    state.drum.patternIndex = index;
    drumPatternsSelect.value = index;
}

























function checkStarted(){
    return Tone.Transport.state === 'started';
}

function midiToToneNotes(midi) {                        //輸入 state.chords.midis[state.chords.index]

    const ticksPerBeat = TICK_PER_BAR / BEATS_PER_BAR;      //384/4
    const ticksPerFourthNote = ticksPerBeat / 4 ;

    return midi.tracks[0].notes.map((note) => {
        return {
         time: `${Math.floor(note.ticks / ticksPerBeat)}:${
             Math.floor(note.ticks / ticksPerBeat) % BEATS_PER_BAR
         }:${(note.ticks / ticksPerFourthNote) % 4}`,
         pitch: note.midi,
         duration: note.duration,
         velocity: note.velocity,
        };
    });                         //林娘 這邊超難
}
















function toFreq(m) {                                    //const hertz = Tone.Frequency(38, "midi").toFrequency();console.log(hertz);
    return Tone.Frequency(m, 'midi');       //和弦頻率
}



function dragElement(el, onClickCallback = () => {}, params = {}) {
    let shiftX = 0;
    let shiftY = 0;
    let posX = 0;
    let posY = 0;
    let dragging = false;
    let draggingFrameCount = 0;
   // el.onmousedown = dragMouseDown;
    el.addEventListener('click', (e) => {
        if (!dragging) {
            onClickCallback(e);
        }
        dragging = false;
    });

    
}
















































































function createCircleElement() {
    const el = document.createElement('DIV');
    el.classList.add('circle', 'blink');
    return el;
}









/*








function dragElement(el, onClickCallback = () => {}, params = {}){
    let shiftX = 0;
    let shiftY = 0;
    let posX = 0;
    let posY = 0;
    let dragging = false;
    let draggingFrameCount = 0;
    el.onmousedown = dragMouseDown;
    el.addEventListener('click',(e) => {
        if(!dragging) {
            onClickCallback(e);
        }
        dragging = false;
    });

    function dragMouseDown(e) {
        draggingFrameCount = 0;
        e = e || window.event;   // ??
        e.preventDefault();
        e.stopPropagation();

        posX = e.clientX;
        posY = e.clientY;
        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        
    }
}




*/

















































































































































function sleep(m) {
    return new Promise((r) => setTimeout(r,m));  //??? 
}

































































































































































function initMessageCallbacks() {





































































/*callbacks[INCREASE_BPM] = () => {
    changeMasterBpm(Number(state.master.bpm) + 10);
};*/

















}       //initMessage 結束

