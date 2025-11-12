<template>
  <van-radio-group
    v-model="fieldValue"
    :disabled="disabled"
    direction="horizontal"
  >
    <van-radio
      v-for="item in options"
      :key="item.value"
      :name="item.value"
    >
      {{ item.label }}
    </van-radio>
  </van-radio-group>
</template>

<script setup>
import { computed } from 'vue';
import { useFieldValue } from '../../composables/useFieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  column: { type: Object, required: true },
  dic: { type: Array, default: () => [] },
  disabled: Boolean,
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change']);

const { value } = useFieldValue(props, emit);

const propsMap = computed(() => ({ ...DIC_PROPS, ...(props.column.props || {}) }));

const options = computed(() => {
  const map = propsMap.value;
  return (props.dic || []).map((item) => ({
    value: item[map.value],
    label: item[map.label],
  }));
});

const fieldValue = value;
</script>
