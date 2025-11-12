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

<script setup>
import { computed, ref } from 'vue';
import { useFieldValue } from '../../composables/useFieldValue.js';
import { DIC_PROPS } from '../../util/variable.js';

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: undefined },
  column: { type: Object, required: true },
  dic: { type: Array, default: () => [] },
  disabled: Boolean,
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change']);

const { value, textLabel, placeholder, click } = useFieldValue(props, emit);

const showPicker = ref(false);

const dicProps = computed(() => ({ ...DIC_PROPS, ...(props.column.props || {}) }));

const pickerColumns = computed(() => {
  const propsMap = dicProps.value;
  const valueKey = propsMap.value;
  const labelKey = propsMap.label;
  return (props.dic || []).map((item) => ({
    text: item[labelKey],
    value: item[valueKey],
  }));
});

const displayText = computed({
  get() {
    return textLabel.value || '';
  },
  set() {},
});

function openPicker(event) {
  click(event);
  if (disabled) return;
  showPicker.value = true;
}

function handleConfirm({ selectedOptions }) {
  const option = Array.isArray(selectedOptions) ? selectedOptions[0] : selectedOptions;
  if (!option) {
    showPicker.value = false;
    return;
  }
  value.value = option.value;
  showPicker.value = false;
}
</script>

<style scoped>
.wf-select {
  width: 100%;
}
</style>
