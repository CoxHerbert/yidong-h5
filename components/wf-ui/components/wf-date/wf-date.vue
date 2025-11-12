<template>
  <div class="wf-date">
    <van-field
      v-model="displayText"
      readonly
      is-link
      :placeholder="placeholder"
      :disabled="disabled"
      @click="openPicker"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <component
        :is="pickerComponent"
        v-model="currentValues"
        :columns-type="columnsType"
        :title="column.label"
        @confirm="handleConfirm"
        @cancel="() => (showPicker = false)"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useFieldValue } from '../../composables/useFieldValue.js';

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: undefined },
  column: { type: Object, default: () => ({}) },
  disabled: Boolean,
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change']);

const { value, placeholder, click } = useFieldValue(props, emit);

const showPicker = ref(false);
const currentValues = ref([]);

const pickerType = computed(() => props.column.type || 'date');

const pickerComponent = computed(() =>
  pickerType.value.includes('time') && !pickerType.value.includes('date') ? 'van-time-picker' : 'van-date-picker'
);

const columnsType = computed(() => {
  if (pickerType.value.includes('time') && !pickerType.value.includes('date')) {
    return ['hour', 'minute', 'second'];
  }
  if (pickerType.value.includes('datetime')) {
    return ['year', 'month', 'day', 'hour', 'minute'];
  }
  return ['year', 'month', 'day'];
});

const displayText = computed({
  get() {
    return value.value ? String(value.value) : '';
  },
  set() {},
});

watch(
  () => value.value,
  (val) => {
    currentValues.value = parseValue(val);
  },
  { immediate: true }
);

function openPicker(event) {
  click(event);
  if (disabled) return;
  showPicker.value = true;
}

function parseValue(val) {
  if (!val) return [];
  const stringVal = Array.isArray(val) ? val.join('-') : String(val);
  if (pickerType.value.includes('time') && !pickerType.value.includes('date')) {
    return stringVal.split(':');
  }
  if (pickerType.value.includes('datetime')) {
    const [datePart, timePart] = stringVal.split(' ');
    const [hour = '00', minute = '00'] = (timePart || '00:00').split(':');
    return [...(datePart || '').split('-'), hour, minute];
  }
  return stringVal.split('-');
}

function formatValue(values) {
  if (pickerType.value.includes('time') && !pickerType.value.includes('date')) {
    return values.slice(0, 3).join(':');
  }
  if (pickerType.value.includes('datetime')) {
    const [year, month, day, hour = '00', minute = '00'] = values;
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  const [year, month, day] = values;
  return [year, month, day].filter(Boolean).join('-');
}

function handleConfirm({ selectedValues }) {
  value.value = formatValue(selectedValues);
  showPicker.value = false;
}
</script>

<style scoped>
.wf-date {
  width: 100%;
}
</style>
