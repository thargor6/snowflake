import * as ctrl from 'controls.js';
import * as render from 'render.js';

const refreshSnowflake = () => {
  ctrl.updateSnowflakeParamStr(render.model);
  render.rerenderSnowflake(); 
}

const newSnowFlake = () => {
  render.newSnowFlake();  
  ctrl.updateSnowflakeParamStr(render.model);
}

const randomizeSnowFlake = () => {
  render.randomizeSnowFlake();
  ctrl.updateSnowflakeParamStr(render.model);
}

const importSnowflakeParams = () => {
  const json = ctrl.snowflakeParamTextArea.value;
  const model = JSON.parse(json);
  render.setModel(model);
  ctrl.updateControls(render.model);
  render.rerenderSnowflake(); 
  ctrl.updateSnowflakeParamStr(render.model);
}

ctrl.animateButton.addEventListener('click', render.animateAsyncHandler);
ctrl.cancelButton.addEventListener('click', render.cancelHandler);
ctrl.newSnowflakeButton.addEventListener('click', newSnowFlake);
ctrl.randomizeButton.addEventListener('click', randomizeSnowFlake);
ctrl.importSnowflakeParamsButton.addEventListener('click', importSnowflakeParams);

ctrl.fgColorPicker.on('input:end', function(color) {
  render.cancelHandler();
  refreshSnowflake();
});

ctrl.bgColorPicker.on('input:end', function(color) {
  render.cancelHandler();
  refreshSnowflake();
});

const onBgFreezeLevelSlide = (position, value) => {
  render.cancelHandler();
  ctrl.bgFreezeLevelText.value = position.toFixed(4);
}

const onBgFreezeLevelSlideEnd = (position, value) => {
  onBgFreezeLevelSlide(position, value);
  refreshSnowflake();
}

const onFgFreezeSpeedSlide = (position, value) => {
  render.cancelHandler();
  ctrl.fgFreezeSpeedText.value = position.toFixed(4);
}

const onFgFreezeSpeedSlideEnd = (position, value) => {
  onFgFreezeSpeedSlide(position, value);
  refreshSnowflake();
}

const onRndBgNoiseSlide = (position, value) => {
  render.cancelHandler();
  ctrl.rndBgNoiseText.value = position.toFixed(4);
}

const onRndBgNoiseSlideEnd = (position, value) => {
  onRndBgNoiseSlide(position, value);
  refreshSnowflake();
}

const onRndSeedSlide = (position, value) => {
  render.cancelHandler();
  ctrl.rndSeedText.value = position;
}

const onRndSeedSlideEnd = (position, value) => {
  onRndSeedSlide(position, value);
  refreshSnowflake();
}

const onDiffusionSpeedSlide = (position, value) => {
  render.cancelHandler();
  ctrl.diffusionSpeedText.value = position.toFixed(4);
}

const onDiffusionSpeedSlideEnd = (position, value) => {
  onDiffusionSpeedSlide(position, value);
  refreshSnowflake();
}

const onDiffusionAsymmetrySlide = (position, value) => {
  render.cancelHandler();
  ctrl.diffusionAsymmetryText.value = position.toFixed(4);
}

const onDiffusionAsymmetrySlideEnd = (position, value) => {
  onDiffusionAsymmetrySlide(position, value);
  refreshSnowflake();
}

ctrl.updateControls(render.model);

ctrl.initSlider(ctrl.bgFreezeLevelSlider, onBgFreezeLevelSlide, onBgFreezeLevelSlideEnd, 0.3, 0.6, 0.001, 0.3);

ctrl.initSlider(ctrl.fgFreezeSpeedSlider, onFgFreezeSpeedSlide, onFgFreezeSpeedSlideEnd, 0.001, 3.0, 0.0001, 0.001);

ctrl.initSlider(ctrl.diffusionSpeedSlider, onDiffusionSpeedSlide, onDiffusionSpeedSlideEnd, -0.25, 0.25, 0.01, 0.0);

ctrl.initSlider(ctrl.diffusionAsymmetrySlider, onDiffusionAsymmetrySlide, onDiffusionAsymmetrySlideEnd, 0.5, 1.5, 0.01, 0.0);

ctrl.initSlider(ctrl.rndBgNoiseSlider, onRndBgNoiseSlide, onRndBgNoiseSlideEnd, 0.0, 0.6, 0.01, 0.0);

ctrl.initSlider(ctrl.rndSeedSlider, onRndSeedSlide, onRndSeedSlideEnd, 1, 1000000, 1, 0.0);

ctrl.updateControls(render.model); // update again, now with sliders initialized
ctrl.updateSnowflakeParamStr(render.model);


render.initializeSnowFlake();

// TODO uncomment this in production mode
render.newSnowFlake();