<template>
  <div class="wf-select">
    <van-field
      v-model="displayText"
      is-link
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      @click="openPicker"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="pickerColumns"
        @confirm="handleConfirm"
        @cancel="() => (showPicker = false)"
      />
    </van-popup>
  </div>
</template>

<script>
import fieldValueMixin from '../../mixins/fieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

export default {
  name: 'WfSelect',
  mixins: [fieldValueMixin],
  props: {
    modelValue: { type: [String, Number, Array], default: undefined },
    column: { type: Object, required: true },
    dic: { type: Array, default: () => [] },
    disabled: Boolean,
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change'],
  data() {
    return {
      showPicker: false,
    };
  },
  computed: {
    dicProps() {
      return { ...DIC_PROPS, ...(this.column.props || {}) };
    },
    pickerColumns() {
      const propsMap = this.dicProps;
      const valueKey = propsMap.value;
      const labelKey = propsMap.label;
      return (this.dic || []).map((item) => ({
        text: item[labelKey],
        value: item[valueKey],
      }));
    },
    displayText: {
      get() {
        return this.textLabel || '';
      },
      set() {},
    },
  },
  methods: {
    openPicker(event) {
      this.click(event);
      if (this.disabled) return;
      this.showPicker = true;
    },
    handleConfirm({ selectedOptions }) {
      const option = Array.isArray(selectedOptions) ? selectedOptions[0] : selectedOptions;
      if (!option) {
        this.showPicker = false;
        return;
      }
      this.fieldValue = option.value;
      this.showPicker = false;
    },
  },
};
</script>

<style scoped>
.wf-select {
  width: 100%;
}
</style>
