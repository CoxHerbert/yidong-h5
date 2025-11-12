<template>
  <div class="wf-input">
    <van-field
      v-model="fieldValue"
      :type="fieldType"
      :maxlength="column.maxlength ?? 350"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="column.readonly"
      :formatter="column.formatter"
      :clearable="column.clearable !== false"
      :rows="column.rows"
      :autosize="column.type === 'textarea' ? column.autosize ?? true : undefined"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFieldValue } from '../../composables/useFieldValue.js';

const props = defineProps({
  modelValue: { type: [String, Number, Array, Object], default: undefined },
  column: { type: Object, required: true },
  disabled: Boolean,
  dic: { type: Array, default: () => [] },
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change']);

const { value, placeholder, focus, blur, click } = useFieldValue(props, emit);

const typeMap = {
  input: 'text',
  password: 'password',
  textarea: 'textarea',
  number: 'digit',
};

const fieldType = computed(() => typeMap[props.column.type] || 'text');

const fieldValue = value;

function handleFocus(event) {
  focus(event);
}

function handleBlur(event) {
  blur(event);
}

function handleClick(event) {
  click(event);
}
</script>

<style scoped>
.wf-input {
  width: 100%;
}
</style>
