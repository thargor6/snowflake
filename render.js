import * as ctrl from 'controls.js';
import * as sf from 'snowflake.js';
import * as flt from 'imagefilter.js';

// initialize sizes
let SNOWFLAKE_SIZE = 0, SNOWFLAKE_WIDTH = 0, SNOWFLAKE_HEIGHT = 0, CELL_COUNT = 0;
let neighbours = Array(0);
let snowflake = Array(0);
let nonReceptivePart = Array(0);
let nonReceptiveTmpBuffer = Array(0);
let receptivePart = Array(0);
let imgfilterBuffer = new flt.FilterBuffer();

export let model = new sf.Snowflake();

export const initializeSnowFlake = () => {
  ctrl.updateModel(model);
  SNOWFLAKE_SIZE = model.snowFlakeWidth;
  SNOWFLAKE_WIDTH = SNOWFLAKE_SIZE;
  SNOWFLAKE_HEIGHT = SNOWFLAKE_SIZE + SNOWFLAKE_SIZE - 1;
  CELL_COUNT = SNOWFLAKE_WIDTH * SNOWFLAKE_HEIGHT + (SNOWFLAKE_WIDTH - 1) * (SNOWFLAKE_HEIGHT-1);
  neighbours = sf.createNeighbours(CELL_COUNT, SNOWFLAKE_WIDTH);
  snowflake = sf.createSnowFlakeWithBgValue(CELL_COUNT, model.bgFreezeLevel, model.rndBgNoise, model.rndSeed);
  nonReceptivePart = Array(CELL_COUNT);
  nonReceptiveTmpBuffer = Array(CELL_COUNT);
  receptivePart = Array(CELL_COUNT);
  sf.initializeStartingPoint(snowflake, CELL_COUNT);
}

let forceAbort = false;

const nextAnimStep = (snowflake, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry, iterationsPerStep) => {
  return new Promise((resolve, reject) => {
    setTimeout( () => {
    for(let iter = 0; (iter < iterationsPerStep) && !forceAbort; iter++) {
      sf.iterate(snowflake, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, CELL_COUNT, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry);
    }
    resolve(); 
    });
  });
}

let currAnimStep;

const animate = (iterationsPerStep, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry, animateSteps, transparentBackground) => {
  nextAnimStep(snowflake, neighbours, nonReceptivePart, receptivePart, nonReceptiveTmpBuffer, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry, iterationsPerStep).then( () => {
    setTimeout( () => {
    sf.renderSnowflake(ctrl.snowflakeCanvas, snowflake, SNOWFLAKE_WIDTH, SNOWFLAKE_HEIGHT, CELL_COUNT, imgfilterBuffer, transparentBackground);
    });
    currAnimStep++;
    if(currAnimStep < animateSteps && !forceAbort) {
      animate(iterationsPerStep, fgFreezeSpeed, diffusionSpeed, diffusionAsymmetry, animateSteps, transparentBackground); 
    }
  });
}

export const animateAsyncHandler = () => {
  let delay;
  if(!forceAbort) {
    forceAbort = true;
    delay = 50;
  }
  else {
    delay = 0;
  }
  setTimeout( () => {
    forceAbort = false;
    initializeSnowFlake();
    const animateSteps = 50;
    const iterationsPerStep = 25;
    currAnimStep = 0;
    animate(iterationsPerStep, model.fgFreezeSpeed, model.diffusionSpeed, model.diffusionAsymmetry, animateSteps, model.transparentBackground);
  }, delay);
}

export const cancelHandler = () => {
  forceAbort = true;
}

export const changeFgColor = (r, g, b) => {
  cancelHandler();
  sf.setFgColor(r, g, b);
  animateAsyncHandler();
}

export const changeBgColor = (r, g, b) => {
  cancelHandler();
  sf.setBgColor(r, g, b);
  animateAsyncHandler();
}

export const rerenderSnowflake = () => {
  cancelHandler(); 
  animateAsyncHandler();
}

export const newSnowFlake = () => {
  cancelHandler();
  // TODO better ID
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas' + Math.random().toString();
  canvas.width = 100;
  canvas.height = 100;
  ctrl.snowflakeContainer.insertAdjacentElement('afterbegin', canvas);

  ctrl.setCurrCanvas(canvas);
  forceAbort = false;  
  animateAsyncHandler();
}

export const randomizeSnowFlake = () => {
  cancelHandler();  
  model.randomizeValues();
  ctrl.updateControls(model);
  animateAsyncHandler(); 
}
