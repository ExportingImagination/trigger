let mic, playbutton;
let fft; let smoothing = 0.6; let bins = 512;
let hiPass = 150; let loPass = 1500;
let eqLow = Math.ceil(hiPass * bins / 44100)*2;
let eqHi = Math.ceil(loPass * bins / 44100*2);
var start = 0;

/*   song.disconnect();
  compressor.process(song);
  song.connect(filter);
  fft.setInput(filter.chain(compressor));
      //compressor.threshold = -60;
      compressor.input.gain.value = 1;

      compressor.output.gain.value = 20;
      compressor.release = 0.1;  */


function setup() {
  background(200);
  createCanvas(bins, 400);
  playbutton = createButton("play");
  playbutton.mousePressed(startMic);
 

  mic = new p5.AudioIn();
  

  
  filter = new p5.LowPass();
  filter.biquad.frequency.value = loPass;
  filter.biquad.Q.value = 0.01;  
  filter2 = new p5.HighPass();
  filter2.biquad.frequency.value = hiPass;
  filter2.biquad.Q.value = 0.01;

  filter.process(mic);
  filter2.process(filter);
 

  
  fft = new p5.FFT(smoothing,bins); 
  compressor = new p5.Compressor();  
  
  compressor.process(filter2);

  

 
 
  compressor.threshold = -12;
  compressor.input.gain.value = 1;
  compressor.release = 0.003;
  compressor.attack = 0.001;
  fft.setInput(compressor);
}

function startMic (){

 
  mic = new p5.AudioIn();
  mic.start();
  

  
  filter = new p5.LowPass();
  filter.biquad.frequency.value = loPass;
  filter.biquad.Q.value = 0.01;  
  filter2 = new p5.HighPass();
  filter2.biquad.frequency.value = hiPass;
  filter2.biquad.Q.value = 0.01;

  filter.process(mic);
  filter2.process(filter);
 

  
  fft = new p5.FFT(smoothing,bins); 
  compressor = new p5.Compressor();  
  
  compressor.process(filter2);

  

 
 
  compressor.threshold = -12;
  compressor.input.gain.value = 1;
  compressor.release = 0.003;
  compressor.attack = 0.001;
  fft.setInput(compressor);

  start = 1;

}



var w = (eqHi-eqLow)/bins*200;
//console.log(w);

function draw() {
  if (start == 0){
    return
  }else{
  background(100);
  var spectrum = fft.analyze();
  var eqspectrum = spectrum.slice(eqLow, eqHi);
  //console.log(eqspectrum)
 //for (var i = 0; i < spectrum.length; i++) {
 
 for (var i = eqLow; i < eqHi; i++) {
    var y = map(spectrum[i], 0, bins, height, 0);   
   /*  if (i >= eqLow && i <= eqHi){
        stroke(255,0,0) }else 
              {stroke(0,255,0)        } 
                  //   vertex(i, y);
              */
    stroke(255,0,0)
    line(i*w, height, i*w, y);
  } 

  fftCurve(eqspectrum);
  

  }

}


//get left high , left low, left low 2, r high, r gith 2

// loop list if % from prev val is more or less

//var amptrigger = [0,0];
var PrevAmp = 0;
//var HitDelay = true;
var lii = [];


//var TimeDelay = 0;

var liiOn = 1;
function fftCurve(list){

  maxAmp = Math.max(...list.slice(0,2));
  PercentAmp = Math.abs(PrevAmp-maxAmp);
  PrevAmp = maxAmp;
 // amptrigger.splice(0,1);
  //amptrigger.push(maxAmp);

    if (PercentAmp >= 50 && liiOn == 1){
        lii = list;
        liiOn = 0;
        setTimeout(() => {liiOn = 1; }, 200);
    }    

        
      beginShape();
      //console.log(deltaTime)
      for (var i = 0; i < lii.length; i++) {
  
        var y = map(lii[i], 0, bins, height, 0); 
        noFill()
        stroke(0,0,255)
        vertex((i+eqLow)*w, y);
  
      }
    
      endShape();
  
    }  
  

  //console.log(PercentAmp);
  



/* function TimeDelay(list){  
  if (TimeDelay >= 500){
    TimeDelay = 0;
    return true
  }else{
    TimeDelay += deltaTime;
    return false
  }

} */


