import { inject } from 'vue';
import WfForm from './components/wf-form/wf-form.vue';
import WfFormItem from './components/wf-form-item/wf-form-item.vue';
import WfInput from './components/wf-input/wf-input.vue';
import WfSelect from './components/wf-select/wf-select.vue';
import WfRadio from './components/wf-radio/wf-radio.vue';
import WfCheckbox from './components/wf-checkbox/wf-checkbox.vue';
import WfSwitch from './components/wf-switch/wf-switch.vue';
import WfRate from './components/wf-rate/wf-rate.vue';
import WfSlider from './components/wf-slider/wf-slider.vue';
import WfDate from './components/wf-date/wf-date.vue';
import WfUpload from './components/wf-upload/wf-upload.vue';
import WfNumber from './components/wf-number/wf-number.vue';
import WfCascader from './components/wf-cascader/wf-cascader.vue';
import WfEmpty from './components/wf-empty/wf-empty.vue';
import { validateNull, validData, deepClone, findObject } from './util/index.js';

const WF_UTILS_KEY = Symbol('wf-utils');

const components = {
  WfForm,
  WfFormItem,
  WfInput,
  WfSelect,
  WfRadio,
  WfCheckbox,
  WfSwitch,
  WfRate,
  WfSlider,
  WfDate,
  WfUpload,
  WfNumber,
  WfCascader,
  WfEmpty,
};

export function install(app, options = {}) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });

  const utils = {
    validateNull,
    validData,
    deepClone,
    findObject,
    wfImage: options.wfImage || 'https://oss.nutflow.vip/rider',
  };

  app.config.globalProperties.$wfUtils = utils;
  app.provide(WF_UTILS_KEY, utils);
}

export function useWfUtils() {
  const utils = inject(WF_UTILS_KEY, null);
  if (!utils) {
    throw new Error('useWfUtils must be used after installing wf-ui plugin.');
  }
  return utils;
}

export default {
  install,
};
