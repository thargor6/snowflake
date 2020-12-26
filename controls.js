export const snowflakeTextArea = document.querySelector("#snowflake");
export const nonReceptivePartTextArea =  document.querySelector("#non_receptive_part");
export const receptivePartTextArea =  document.querySelector("#receptive_part");
export const animateButton = document.querySelector("#animate");
export const cancelButton = document.querySelector("#cancel");
export const newSnowflakeButton = document.querySelector("#new_snowflake");
export const randomizeButton = document.querySelector("#randomize");

export let snowflakeCanvas = document.querySelector("#canvas");

export const bgFreezeLevelText = document.querySelector("#bg_freeze_level");
export const fgFreezeSpeedText = document.querySelector("#fg_freeze_speeed");
export const rndBgNoiseText = document.querySelector("#rnd_bg_noise");
export const diffusionSpeedText = document.querySelector("#diffusion_speed");
export const diffusionAsymmetryText = document.querySelector("#diffusion_asymmetry");
export const rndSeedText = document.querySelector("#rnd_seed");

export const snowflakeContainer = document.querySelector("#snowflake_container");
export const snowflakeContainerRefElement = document.querySelector("#snowflake_container_ref");

// TODO remove
export const getIterCount = () => {
  return 500; //parseInt(iterCountText.value);
}

const COLOR_PICKER_WIDTH = 240;
const COLOR_PICKER_HANDLE_RADIUS = 10;

export const fgColorPicker = new iro.ColorPicker("#fgColor", {
  color: "#ffffff",
  layout: [
    { 
      component: iro.ui.Slider,
      options: {
        width: COLOR_PICKER_WIDTH,
        handleRadius: COLOR_PICKER_HANDLE_RADIUS,
        // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
        sliderType: 'hue',
        sliderDirection: 'vertical'
      }
    },
    { 
      component: iro.ui.Box,
      options: {
        width: COLOR_PICKER_WIDTH,
        boxHeight: COLOR_PICKER_WIDTH / 2,
        handleRadius: COLOR_PICKER_HANDLE_RADIUS
      }
    }
  ]
});
export const bgColorPicker = new iro.ColorPicker("#bgColor", {
  color: "#000000",
  layout: [
    { 
      component: iro.ui.Slider,
      options: {
        width: COLOR_PICKER_WIDTH,
        handleRadius: COLOR_PICKER_HANDLE_RADIUS,
        // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
        sliderType: 'hue',
        sliderDirection: 'vertical'
      }
    },
    { 
      component: iro.ui.Box,
      options: {
        width: COLOR_PICKER_WIDTH,
        boxHeight: COLOR_PICKER_WIDTH / 2,
        handleRadius: COLOR_PICKER_HANDLE_RADIUS
      }
    }
  ]
});

export const setCurrCanvas = (canvas) => {
  snowflakeCanvas = canvas;
}

export const bgFreezeLevelSlider = document.querySelector('#bg_freeze_level_range');
export const fgFreezeSpeedSlider = document.querySelector('#fg_freeze_speeed_range');

export const rndBgNoiseSlider = document.querySelector('#rnd_bg_noise_range');
export const diffusionSpeedSlider = document.querySelector('#diffusion_speed_range');
export const diffusionAsymmetrySlider = document.querySelector('#diffusion_asymmetry_range');
export const rndSeedSlider = document.querySelector('#rnd_seed_range');

export const initSlider = (slider, onSlide, onSlideEnd, minValue, maxValue, valueStep, initialValue) => {
  rangeSlider.create(slider, {
      polyfill: true,     // Boolean, if true, custom markup will be created
      root: document,
      rangeClass: 'rangeSlider',
      disabledClass: 'rangeSlider--disabled',
      fillClass: 'rangeSlider__fill',
      bufferClass: 'rangeSlider__buffer',
      handleClass: 'rangeSlider__handle',
      startEvent: ['mousedown', 'touchstart', 'pointerdown'],
      moveEvent: ['mousemove', 'touchmove', 'pointermove'],
      endEvent: ['mouseup', 'touchend', 'pointerup'],
      vertical: false,    // Boolean, if true slider will be displayed in vertical orientation
      min: minValue,
      max: maxValue,
      step: valueStep, 
      value: initialValue,
      buffer: null,       // Number, in percent, 0 by default
      stick: null,        // [Number stickTo, Number stickRadius] : use it if handle should stick to ${stickTo}-th value in ${stickRadius}
      borderRadius: 10,   // Number, if you're using buffer + border-radius in css
      onSlide: onSlide,
      onSlideEnd: onSlideEnd     
  });
}

export const updateModel = (model) => {
  model.snowFlakeWidth = 128;
  model.bgFreezeLevel = parseFloat(bgFreezeLevelText.value);
  model.fgFreezeSpeed = parseFloat(fgFreezeSpeedText.value);
  model.diffusionSpeed = parseFloat(diffusionSpeedText.value);

  model.diffusionAsymmetry = parseFloat(diffusionAsymmetryText.value);
  model.rndBgNoise = parseFloat(rndBgNoiseText.value);
  model.rndSeed = parseInt(rndSeedText.value);
}

export const updateControls = (model) => {
  // model.snowFlakeWidth
  bgFreezeLevelText.value = model.bgFreezeLevel;
  if(bgFreezeLevelSlider.rangeSlider) {
    bgFreezeLevelSlider.rangeSlider.update({value : model.bgFreezeLevel}, false);
  }

  fgFreezeSpeedText.value = model.fgFreezeSpeed;
  if(fgFreezeSpeedSlider.rangeSlider) {
    fgFreezeSpeedSlider.rangeSlider.update({value : model.fgFreezeSpeed}, false);
  }

  diffusionSpeedText.value = model.diffusionSpeed;
  if(diffusionSpeedSlider.rangeSlider) {
    diffusionSpeedSlider.rangeSlider.update({value : model.diffusionSpeed}, false);
  }

  diffusionAsymmetryText.value = model.diffusionAsymmetry;
  if(diffusionAsymmetrySlider.rangeSlider) {
    diffusionAsymmetrySlider.rangeSlider.update({value : model.diffusionAsymmetry}, false);
  }
  
  rndBgNoiseText.value = model.rndBgNoise;
  if(rndBgNoiseSlider.rangeSlider) {
    rndBgNoiseSlider.rangeSlider.update({value : model.rndBgNoise}, false);
  }

  rndSeedText.value = model.rndSeed;
  if(rndSeedSlider.rangeSlider) {
    rndSeedSlider.rangeSlider.update({value : model.rndSeed}, false);
  }
}

