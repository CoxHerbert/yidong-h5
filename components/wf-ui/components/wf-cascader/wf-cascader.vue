<template>
  <div class="wf-cascader">
    <van-field
      v-model="displayText"
      is-link
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      @click="open"
    />
    <van-popup v-model:show="show" position="bottom">
      <van-cascader
        v-model="innerValue"
        :options="options"
        :field-names="fieldNames"
        title="选择"
        @close="show = false"
        @finish="handleFinish"
      />
    </van-popup>
  </div>
</template>

<script>
import fieldValueMixin from '../../mixins/fieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

export default {
  name: 'WfCascader',
  mixins: [fieldValueMixin],
  props: {
    modelValue: { type: [String, Array], default: undefined },
    column: { type: Object, default: () => ({}) },
    dic: { type: Array, default: () => [] },
    disabled: Boolean,
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change'],
  data() {
    return {
      show: false,
      innerValue: [],
    };
  },
  computed: {
    fieldNames() {
      const propsMap = { ...DIC_PROPS, ...(this.column.props || {}) };
      return {
        text: propsMap.label,
        value: propsMap.value,
        children: propsMap.children,
      };
    },
    options() {
      return this.dic || [];
    },
    displayText: {
      get() {
        return this.textLabel || '';
      },
      set() {},
    },
  },
  watch: {
    fieldValue: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.innerValue = [...val];
        } else if (typeof val === 'string' && val) {
          const separator = this.column.separator || ',';
          this.innerValue = val.split(separator);
        } else {
          this.innerValue = [];
        }
      },
    },
  },
  methods: {
    open(event) {
      this.click(event);
      if (this.disabled) return;
      this.show = true;
    },
    handleFinish({ selectedOptions }) {
      const values = selectedOptions.map((item) => item[this.fieldNames.value]);
      this.fieldValue = this.column.emitPath === false ? values[values.length - 1] : values;
      this.show = false;
    },
  },
};
</script>

<style scoped>
.wf-cascader {
  width: 100%;
}
</style>
