<template>
  <div class="wf-form-item" :data-testid="`wf-field-${column.prop}`">
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

<script>
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
import WfDynamic from '../wf-dynamic/wf-dynamic.vue';

export default {
  name: 'WfFormItem',
  components: {
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
    WfDynamic,
  },
  props: {
    modelValue: { type: [String, Number, Array, Object, Boolean], default: undefined },
    column: { type: Object, required: true },
    dic: { type: Array, default: () => [] },
    disabled: Boolean,
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'label-change'],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
        this.$emit('change', val);
      },
    },
    componentName() {
      const type = this.column.type || 'input';
      const map = {
        input: 'WfInput',
        textarea: 'WfInput',
        password: 'WfInput',
        number: 'WfNumber',
        select: 'WfSelect',
        cascader: 'WfCascader',
        tree: 'WfCascader',
        radio: 'WfRadio',
        checkbox: 'WfCheckbox',
        switch: 'WfSwitch',
        rate: 'WfRate',
        slider: 'WfSlider',
        date: 'WfDate',
        dates: 'WfDate',
        datetime: 'WfDate',
        datetimerange: 'WfDate',
        daterange: 'WfDate',
        time: 'WfDate',
        timerange: 'WfDate',
        upload: 'WfUpload',
        dynamic: 'WfDynamic',
      };
      return map[type] || 'WfInput';
    },
    required() {
      const rules = this.column.rules || [];
      return rules.some((rule) => rule.required);
    },
  },
  methods: {
    emitLabelChange(value) {
      this.$emit('label-change', value);
    },
  },
};
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
