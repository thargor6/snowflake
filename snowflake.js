import * as mt from 'lib/mersenne-twister.js';

export class Snowflake {
  constructor() {
    this.snowFlakeWidth = 128;
    this.bgFreezeLevel = 0.5;
    this.fgFreezeSpeed = 0.0005;
    this.diffusionSpeed = 0.01;
    this.diffusionAsymmetry = 1.0;
    this.rndBgNoise = 0.25;
    this.rndSeed = 12345;
    this.transparentBackground = true;
  }

  randomizeValues() {
    const randGen = new MersenneTwister();
    this.bgFreezeLevel = 0.3 + 0.3 * randGen.random();
    this.fgFreezeSpeed = 0.001 + 2.0 * randGen.random();
    this.diffusionSpeed = -0.25 + 0.5 * randGen.random();
    this.diffusionAsymmetry = 0.5 + randGen.random();
    this.rndBgNoise = randGen.random() * 0.5;
    this.rndSeed = randGen.random() * 1000000 | 0;
  }  
}

export const createNeighbours = (cellCount, snowFlakeWidth) => {
  const neighbours = Array(6);
  for(let i = 0; i < neighbours.length; i++) {
    neighbours[i] = Array(cellCount);
  }
  for(let n = 0; n < cellCount; n++) {
    neighbours[0][n] = n - snowFlakeWidth - ( snowFlakeWidth - 1 );
    neighbours[1][n] = n - ( snowFlakeWidth - 1 );
    neighbours[2][n] = n + snowFlakeWidth;
    neighbours[3][n] = n + snowFlakeWidth + ( snowFlakeWidth - 1 );
    neighbours[4][n] = n + ( snowFlakeWidth - 1 );
    neighbours[5][n] = n - snowFlakeWidth;
  }
  return neighbours;
}

export const createSnowFlakeWithBgValue = (cellCount, bgValue, rndNoise, rndSeed) => {
  const randGen = new MersenneTwister(rndSeed);
  const snowflake = Array(cellCount);
  for(let i = 0; i < cellCount; i++) {
    snowflake[i] = bgValue +  (rndNoise - 2.0 * rndNoise * randGen.random());
  }
  return snowflake;
}

export const initializeStartingPoint = (snowflake, cellCount) => {
  snowflake[  Math.floor( cellCount / 2 ) ] = 1.0;
}

export const getSnowFlakeAsHtml = (data, width, height) => {
  let snowflakeText = '';
  for(let i=0;i<height;i++) {
    for(let j=0;j<width;j++) {
      const idx = ( width + width - 1 ) * i + j;
      snowflakeText += data[idx].toFixed(2) + (j<width-1 ?  ' | ' : '');
    }
    if(i<height -1) {
      snowflakeText +=  "\n &nbsp; ";
      for(let j=0;j<width-1;j++) {
        const idx = ( width + width - 1 ) * i + j + width;
        snowflakeText += data[idx].toFixed(2) + (j<width-2 ?  ' | ' : '');
      }
    }
    snowflakeText += "\n";
  }
  return snowflakeText;
}

export const isIceCell = (cellValue) => {
  return cellValue < 1.0 ? false : true;
}

export const splitIntoNonReceptiveAndReceptivePart = (data, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, cellCount, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry) => {


  const tFreezeSpeed = fgFreezeSpeed / 1000.0;
  const tDiffusionSpeed = diffusionSpeed / 1000.0 + 1;

  for(let i = 0; i < cellCount; i++) {
    nonReceptiveTmpBuffer[i] = data[i];
    receptivePart[i] = 0.0;
  }  
  for(let i = 0; i < cellCount; i++) {
    let centreIsIce = isIceCell(data[i]);
    if(centreIsIce) {
      nonReceptivePart[i] = 0.0;
      receptivePart[i] = data[i];
      for(let j = 0; j < neighbours.length; j++) {
        let nb = neighbours[j][i];
        if( nb >= 0 && nb < cellCount) {
          nonReceptiveTmpBuffer[nb] = 0.0;
          receptivePart[nb] = data[nb] > 0 ? data[nb] + tFreezeSpeed: data[nb];
        }
      }
    }
  }
  const cWeight = 0.5 * diffusionAsymmetry / tDiffusionSpeed;
  const nbWeight = (1.0 * tDiffusionSpeed - cWeight) / 6.0;

  for(let i = 0; i < cellCount; i++) {
    nonReceptivePart[i] = nonReceptiveTmpBuffer[i] * cWeight;
    for(let j = 0; j < neighbours.length; j++) {
      let nb = neighbours[j][i];
      if(nb>=0 && nb<cellCount) {
        nonReceptivePart[i] += nonReceptiveTmpBuffer[nb] * nbWeight;
      }
    }
  }
}

export const iterate = (snowflake, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, cellCount, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry) => {
  splitIntoNonReceptiveAndReceptivePart(snowflake, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, cellCount, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry);
  for(let i = 0; i < cellCount; i++) {
    snowflake[i] = nonReceptivePart[i] + receptivePart[i];
  }
}

let BG_COLOR_R = 52;
let BG_COLOR_G = 63;
let BG_COLOR_B = 77;


let SNOWFLAKE_COLOR_R = 215;
let SNOWFLAKE_COLOR_G = 235;
let SNOWFLAKE_COLOR_B = 255;

const THRESHOLD = 0.65;

export const setFgColor = (r, g, b) => {
  SNOWFLAKE_COLOR_R = r;
  SNOWFLAKE_COLOR_G = g;
  SNOWFLAKE_COLOR_B = b;
}

export const setBgColor = (r, g, b) => {
  BG_COLOR_R = r;
  BG_COLOR_G = g;
  BG_COLOR_B = b;
}

const renderVal = (imageData, val, x, y, transparentBackground) => {
  let r, g, b, a;
  if(val>THRESHOLD) {
    const rawIntensity = Math.min(1.0, Math.log((val - THRESHOLD + 1.0) * 2.0));
    const intensity = rawIntensity * rawIntensity * rawIntensity;
    const invIntensity = 1.0 - intensity;

    r = intensity * SNOWFLAKE_COLOR_R + invIntensity * BG_COLOR_R | 0;
    g = intensity * SNOWFLAKE_COLOR_G + invIntensity * BG_COLOR_G | 0;
    b = intensity * SNOWFLAKE_COLOR_B + invIntensity * BG_COLOR_B | 0;
    a = transparentBackground ? (intensity * 256 | 0) : 255;
  }
  else {
    r = BG_COLOR_R;
    g = BG_COLOR_G;
    b = BG_COLOR_B;
    a = transparentBackground ? 0 : 255;
  }

  let index = (x + y * imageData.width) * 4;
  imageData.data[index+0] = r;
  imageData.data[index+1] = g;
  imageData.data[index+2] = b;
  imageData.data[index+3] = a;
}

const setVal = (imgfilterBuffer, val, x, y, width) => {
  const idx = (x + y * width);
  imgfilterBuffer.buffer[idx] = val;
}

const drawFilteredImage = (imgfilterBuffer, imageData, canvasWidth, canvasHeight, transparentBackground) => {
  const buffer =  imgfilterBuffer.buffer;
  for(let y = 0; y < canvasHeight; y++) {
    for(let x = 0; x < canvasWidth; x++) {   
      const idx = (x + y * canvasWidth);
      renderVal(imageData, buffer[idx], x, y, transparentBackground);
    }
  }  
}

export const renderSnowflake = (canvas, snowflake, snowFlakeWidth, snowFlakeHeight, cellCount, imgfilterBuffer, transparentBackground) => {

  let stretchFactor = 1.5 / 1.7321;

  let ctx = canvas.getContext("2d");
  if(canvas.width < Math.floor(2 * snowFlakeWidth * stretchFactor)) {
    canvas.width = Math.floor(2 * snowFlakeWidth * stretchFactor);
  }
  if(canvas.height<snowFlakeHeight) {
    canvas.height = snowFlakeHeight;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  imgfilterBuffer.setBufferSize(canvasWidth * canvasHeight);


  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  // c0   c1   c2    |  c0   (0+c3)/2   c1   (0+c4)/2   c2
  //    c3   c4      |  c5   (c3+c8)/2  c6   (c4+c9)/2  c7
  // c5   c6   c7    |  c10  (c8+0)/2   c11  (c9+0)/2   c12
  //   c8    c9      |
  // c10  c11 c12    |

  for(let i = 0; i < snowFlakeHeight; i++) {
    for(let j = 0; j < snowFlakeWidth; j++) {   
      const baseIdx = ( snowFlakeWidth + snowFlakeWidth - 1 ) * i + j;
      let x = Math.trunc((2*j) * stretchFactor);  
      //renderVal(imageData, snowflake[baseIdx], x, i);
      setVal(imgfilterBuffer, snowflake[baseIdx], x, i, canvasWidth);

      x = Math.trunc((2*j+1) * stretchFactor);  
      const idx1 = baseIdx - snowFlakeWidth + 1;
      const idx2 = baseIdx + snowFlakeWidth;
      //renderVal(imageData, (snowflake[idx1] + snowflake[idx2]) * 0.5, x, i);
      setVal(imgfilterBuffer, (snowflake[idx1] + snowflake[idx2]) * 0.5, x, i, canvasWidth);
    }
  }
  drawFilteredImage(imgfilterBuffer, imageData, canvasWidth, canvasHeight, transparentBackground);

  ctx.putImageData(imageData, 0, 0);
}
