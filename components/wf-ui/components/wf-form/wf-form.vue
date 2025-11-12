<template>
  <div class="wf-form">
    <van-form @submit.prevent="handleSubmit">
      <div class="wf-form__body">
        <template v-for="column in visibleColumns" :key="column.prop">
          <wf-form-item
            v-model="form[column.prop]"
            :column="column"
            :dic="dictionaries[column.prop]"
            :disabled="isDisabled(column)"
            :dynamic-index="option.dynamicIndex"
            @label-change="handleLabelChange(column.prop, $event)"
          />
        </template>
      </div>
      <div v-if="showActions" class="wf-form__actions">
        <van-button
          v-if="menu.submitBtn"
          type="primary"
          block
          :loading="loading"
          native-type="submit"
        >
          {{ menu.submitText }}
        </van-button>
        <slot name="menu" />
        <van-button
          v-if="menu.emptyBtn"
          type="default"
          block
          :disabled="loading"
          @click="handleReset"
        >
          {{ menu.emptyText }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { provideForm } from '../../composables/useForm.js';
import { useDictionary } from '../../composables/useDictionary.js';
import { deepClone } from '../../util/index.js';

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  option: {
    type: Object,
    default: () => ({ column: [] }),
  },
});

const emit = defineEmits(['update:modelValue', 'submit', 'reset', 'label-change']);

const option = computed(() => props.option || {});
const form = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(form, val || {});
  },
  { deep: true }
);

watch(
  form,
  (val) => {
    emit('update:modelValue', deepClone(val));
  },
  { deep: true }
);

provideForm(option, form, emit);

const { dictionaries } = useDictionary(option, form, null);

const columns = computed(() => {
  const list = option.value?.column || [];
  const groups = option.value?.group || [];
  const flatGroups = groups.flatMap((group) => group.column || []);
  return [...list, ...flatGroups].filter(Boolean);
});

const visibleColumns = computed(() =>
  columns.value.filter((column) => column.display !== false && (!column.filter || column.filter(form)))
);

const loading = computed(() => option.value?.loading || false);

const menu = computed(() => {
  const opt = option.value || {};
  return {
    submitBtn: opt.submitBtn !== false,
    emptyBtn: opt.enptyBtn !== false,
    submitText: opt.submitText || '提交',
    emptyText: opt.emptyText || '清空',
  };
});

const showActions = computed(() => {
  const opt = option.value || {};
  if (opt.menuBtn === false) return false;
  if (opt.detail || opt.readonly || opt.disabled) return false;
  return true;
});

function handleSubmit() {
  emit('submit', deepClone(form));
}

function handleReset() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  emit('reset');
}

function handleLabelChange(prop, value) {
  emit('label-change', { prop, value });
}

function isDisabled(column) {
  return (
    option.value?.disabled ||
    option.value?.readonly ||
    option.value?.detail ||
    column.disabled ||
    column.readonly ||
    column.detail ||
    false
  );
}
</script>

<style scoped>
.wf-form {
  width: 100%;
}

.wf-form__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-form__actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
