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

<script setup>
import { computed, ref, watch } from 'vue';
import { useFieldValue } from '../../composables/useFieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

const props = defineProps({
  modelValue: { type: [String, Array], default: undefined },
  column: { type: Object, default: () => ({}) },
  dic: { type: Array, default: () => [] },
  disabled: Boolean,
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change']);

const { value, textLabel, placeholder, click } = useFieldValue(props, emit);

const show = ref(false);
const innerValue = ref([]);

const fieldNames = computed(() => {
  const propsMap = { ...DIC_PROPS, ...(props.column.props || {}) };
  return {
    text: propsMap.label,
    value: propsMap.value,
    children: propsMap.children,
  };
});

const options = computed(() => props.dic || []);

const displayText = computed({
  get() {
    return textLabel.value || '';
  },
  set() {},
});

watch(
  () => value.value,
  (val) => {
    if (Array.isArray(val)) {
      innerValue.value = val;
    } else if (typeof val === 'string' && val) {
      innerValue.value = val.split(props.column.separator || ',');
    } else {
      innerValue.value = [];
    }
  },
  { immediate: true }
);

function open(event) {
  click(event);
  if (disabled) return;
  show.value = true;
}

function handleFinish({ selectedOptions }) {
  const values = selectedOptions.map((item) => item[fieldNames.value.value]);
  value.value = props.column.emitPath === false ? values[values.length - 1] : values;
  show.value = false;
}
</script>

<style scoped>
.wf-cascader {
  width: 100%;
}
</style>
