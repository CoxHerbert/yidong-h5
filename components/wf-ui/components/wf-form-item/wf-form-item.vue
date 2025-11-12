<template>
  <div class="wf-form-item">
    <div class="wf-form-item__label" v-if="column.label">
      <span class="wf-form-item__label-text">{{ column.label }}</span>
      <span v-if="required" class="wf-form-item__required">*</span>
    </div>
    <div class="wf-form-item__control">
      <component
        :is="componentName"
        v-model="value"
        :column="column"
        :dic="dic"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
        @label-change="emitLabelChange"
      />
    </div>
    <div v-if="column.tips" class="wf-form-item__tips">{{ column.tips }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WfInput from '../wf-input/wf-input.vue';
import WfSelect from '../wf-select/wf-select.vue';
import WfRadio from '../wf-radio/wf-radio.vue';
import WfCheckbox from '../wf-checkbox/wf-checkbox.vue';
import WfSwitch from '../wf-switch/wf-switch.vue';
import WfRate from '../wf-rate/wf-rate.vue';
import WfSlider from '../wf-slider/wf-slider.vue';
import WfDate from '../wf-date/wf-date.vue';
import WfUpload from '../wf-upload/wf-upload.vue';
import WfNumber from '../wf-number/wf-number.vue';
import WfCascader from '../wf-cascader/wf-cascader.vue';

const props = defineProps({
  modelValue: { type: [String, Number, Array, Object, Boolean], default: undefined },
  column: { type: Object, required: true },
  dic: { type: Array, default: () => [] },
  disabled: Boolean,
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'label-change']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('change', val);
  },
});

const componentName = computed(() => {
  const type = props.column.type || 'input';
  const map = {
    input: WfInput,
    textarea: WfInput,
    password: WfInput,
    number: WfNumber,
    select: WfSelect,
    cascader: WfCascader,
    tree: WfCascader,
    radio: WfRadio,
    checkbox: WfCheckbox,
    switch: WfSwitch,
    rate: WfRate,
    slider: WfSlider,
    date: WfDate,
    dates: WfDate,
    datetime: WfDate,
    datetimerange: WfDate,
    daterange: WfDate,
    time: WfDate,
    timerange: WfDate,
    upload: WfUpload,
  };
  return map[type] || WfInput;
});

const required = computed(() => {
  const rules = props.column.rules || [];
  return rules.some((rule) => rule.required);
});

function emitLabelChange(value) {
  emit('label-change', value);
}
</script>

<style scoped>
.wf-form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wf-form-item__label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #646566;
}

.wf-form-item__label-text {
  flex: 0 0 auto;
}

.wf-form-item__required {
  color: #ee0a24;
}

.wf-form-item__control {
  width: 100%;
}

.wf-form-item__tips {
  font-size: 12px;
  color: #969799;
}
</style>
