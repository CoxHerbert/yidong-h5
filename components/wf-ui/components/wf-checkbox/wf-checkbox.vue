<template>
  <van-checkbox-group
    v-model="fieldValue"
    :disabled="disabled"
    direction="horizontal"
  >
    <van-checkbox
      v-for="item in options"
      :key="item.value"
      :name="item.value"
    >
      {{ item.label }}
    </van-checkbox>
  </van-checkbox-group>
</template>

<script>
import fieldValueMixin from '../../mixins/fieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

export default {
  name: 'WfCheckbox',
  mixins: [fieldValueMixin],
  props: {
    modelValue: { type: [Array, String], default: () => [] },
    column: { type: Object, required: true },
    dic: { type: Array, default: () => [] },
    disabled: Boolean,
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change'],
  computed: {
    propsMap() {
      return { ...DIC_PROPS, ...(this.column.props || {}) };
    },
    options() {
      const map = this.propsMap;
      return (this.dic || []).map((item) => ({
        value: item[map.value],
        label: item[map.label],
      }));
    },
  },
};
</script>
