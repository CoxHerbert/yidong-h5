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
            :dynamic-index="normalizedOption.dynamicIndex"
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

<script>
import WfFormItem from '../wf-form-item/wf-form-item.vue';
import { formInitVal, initRules, calcCascader } from '../../util/dataformat.js';
import { deepClone, validateNull, getDeepData } from '../../util/index.js';
import { FORM_KEY } from '../../composables/useForm.js';

export default {
  name: 'WfForm',
  components: { WfFormItem },
  props: {
    modelValue: { type: Object, default: () => ({}) },
    option: {
      type: Object,
      default: () => ({ column: [] }),
    },
  },
  emits: ['update:modelValue', 'submit', 'reset', 'label-change'],
  data() {
    return {
      form: { ...deepClone(this.modelValue) },
      dictionaries: {},
      rules: {},
      resolvedColumns: [],
    };
  },
  computed: {
    normalizedOption() {
      return this.option || {};
    },
    menu() {
      const opt = this.normalizedOption || {};
      return {
        submitBtn: opt.submitBtn !== false,
        emptyBtn: opt.enptyBtn !== false,
        submitText: opt.submitText || '提交',
        emptyText: opt.emptyText || '清空',
      };
    },
    loading() {
      return this.normalizedOption.loading || false;
    },
    showActions() {
      const opt = this.normalizedOption || {};
      if (opt.menuBtn === false) return false;
      if (opt.detail || opt.readonly || opt.disabled) return false;
      return true;
    },
    visibleColumns() {
      return this.resolvedColumns.filter(
        (column) => column.display !== false && (!column.filter || column.filter(this.form))
      );
    },
  },
  watch: {
    option: {
      deep: true,
      immediate: true,
      handler() {
        this.initializeColumns();
      },
    },
    modelValue: {
      deep: true,
      immediate: true,
      handler(val) {
        this.syncFormValue(val);
      },
    },
    form: {
      deep: true,
      handler(val) {
        this.$emit('update:modelValue', deepClone(val));
      },
    },
  },
  provide() {
    const vm = this;
    return {
      [FORM_KEY]: {
        option: {
          get value() {
            return vm.normalizedOption;
          },
        },
        form: vm.form,
        rules: {
          get value() {
            return vm.rules;
          },
        },
        loading: {
          get value() {
            return vm.loading;
          },
        },
        emit(event, payload) {
          vm.$emit(event, payload);
        },
      },
    };
  },
  methods: {
    initializeColumns() {
      const option = this.normalizedOption || {};
      const base = option.column || [];
      const groups = option.group || [];
      const groupColumns = groups.flatMap((group) => group.column || []);
      const columns = [...base, ...groupColumns].filter(Boolean);
      const cascaded = calcCascader(deepClone(columns));
      this.resolvedColumns = cascaded;
      this.initializeFormDefaults();
      this.loadDictionaries();
    },
    initializeFormDefaults() {
      const defaults = formInitVal(this.resolvedColumns).tableForm;
      this.rules = initRules(this.resolvedColumns);
      Object.keys(defaults).forEach((key) => {
        if (validateNull(this.form[key])) {
          this.form[key] = defaults[key];
        }
      });
    },
    async requestDictionary(column) {
      const method = (column.dicMethod || 'get').toUpperCase();
      const payload = { url: column.dicUrl, method };
      if (method === 'POST') {
        payload.data = column.dicQuery;
      } else {
        payload.params = column.dicQuery;
      }
      const httpClient = this.normalizedOption.httpRequest;
      if (httpClient && typeof httpClient.request === 'function') {
        const response = await httpClient.request(payload);
        const formatter = column.dicFormatter;
        const data = formatter ? formatter(response) : response.data || response;
        return Array.isArray(data) ? data : getDeepData(data);
      }
      const response = await fetch(column.dicUrl, {
        method,
        body: method === 'POST' ? JSON.stringify(column.dicQuery || {}) : undefined,
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      return getDeepData(result);
    },
    async loadColumnDictionary(column) {
      const local = deepClone(column?.dicData || []);
      let remote = [];
      if (column?.dicUrl && !column.dicUrl.includes('{{')) {
        try {
          remote = await this.requestDictionary(column);
        } catch (error) {
          remote = [];
        }
      }
      const result = remote.length ? remote : local;
      if (column?.prop) {
        this.dictionaries = { ...this.dictionaries, [column.prop]: result };
      }
    },
    async loadDictionaries() {
      this.dictionaries = {};
      const columns = this.resolvedColumns;
      await Promise.all(columns.filter(Boolean).map((column) => this.loadColumnDictionary(column)));
    },
    syncFormValue(val) {
      const next = deepClone(val || {});
      const currentKeys = Object.keys(this.form);
      currentKeys.forEach((key) => {
        if (!(key in next)) {
          delete this.form[key];
        }
      });
      Object.keys(next).forEach((key) => {
        this.form[key] = next[key];
      });
      if (this.resolvedColumns.length) {
        this.initializeFormDefaults();
      }
    },
    handleSubmit() {
      this.$emit('submit', deepClone(this.form));
    },
    handleReset() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = undefined;
      });
      this.$emit('reset');
    },
    handleLabelChange(prop, value) {
      this.$emit('label-change', { prop, value });
    },
    isDisabled(column) {
      const opt = this.normalizedOption || {};
      return (
        opt.disabled ||
        opt.readonly ||
        opt.detail ||
        column.disabled ||
        column.readonly ||
        column.detail ||
        false
      );
    },
  },
};
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
