import { getPlaceholder, initVal } from '../util/dataformat.js';
import { DIC_LIST, DIC_PROPS, DIC_SPLIT } from '../util/variable.js';
import { deepClone, validateNull } from '../util/index.js';

function resolveProps(column) {
  return { ...DIC_PROPS, ...(column?.props || {}) };
}

export default {
  data() {
    return {
      fieldValue: undefined,
      textLabel: '',
      stringMode: false,
      initializingFieldValue: true,
    };
  },
  computed: {
    currentColumn() {
      return this.column || {};
    },
    dictionary() {
      return this.dic || [];
    },
    placeholder() {
      return getPlaceholder(this.currentColumn, this.currentColumn.type);
    },
    valueKey() {
      return resolveProps(this.currentColumn).value;
    },
    labelKey() {
      return resolveProps(this.currentColumn).label;
    },
    childrenKey() {
      return resolveProps(this.currentColumn).children;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.stringMode = typeof val === 'string';
        this.initializingFieldValue = true;
        if (!this.currentColumn || validateNull(this.currentColumn)) {
          this.fieldValue = val;
        } else {
          this.fieldValue = initVal(val, this.currentColumn);
        }
      },
    },
    fieldValue(val) {
      this.handleTextLabel();
      if (this.initializingFieldValue) {
        this.initializingFieldValue = false;
        return;
      }
      this.emitFieldChange(val);
    },
    dictionary: {
      handler() {
        this.handleTextLabel();
      },
      deep: true,
    },
    currentColumn: {
      handler() {
        this.handleTextLabel();
      },
      deep: true,
    },
  },
  methods: {
    resolveHandler(name) {
      const column = this.currentColumn;
      const handler = column && typeof column[name] === 'function' ? column[name] : null;
      if (!handler) return () => {};
      const index = this.dynamicIndex;
      return (payload, event) => handler({ value: payload, column, index, event });
    },
    emitFieldChange(value, event) {
      let result = value;
      const column = this.currentColumn;
      const shouldJoin =
        column?.dataType === 'string' ||
        column?.dataType === 'number' ||
        this.stringMode ||
        column?.listType === 'picture-img';
      if (Array.isArray(value) && shouldJoin) {
        result = value.join(column?.separator || DIC_SPLIT);
      }
      this.resolveHandler('change')(result, event);
      this.$emit('update:modelValue', result);
      this.$emit('change', result);
    },
    handleTextLabel() {
      const column = this.currentColumn;
      if (!DIC_LIST.includes(column.type)) {
        this.textLabel = '';
        return;
      }
      if (validateNull(this.fieldValue) || validateNull(this.dictionary)) {
        this.textLabel = '';
        this.$emit('label-change', '');
        return;
      }
      const values = Array.isArray(this.fieldValue)
        ? this.fieldValue
        : (this.fieldValue + '').split(column.separator || DIC_SPLIT);
      const labels = [];
      let source = deepClone(this.dictionary);
      values.forEach((itemValue) => {
        const { list, label } = this.traverseDictionary(source, itemValue);
        if (list) source = list;
        if (label) labels.push(label);
      });
      const labelString = this.stringMode ? labels.join('/') : labels;
      this.textLabel = Array.isArray(labelString) ? labelString.join('/') : labelString;
      this.$emit('label-change', labelString);
    },
    traverseDictionary(list, itemValue) {
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        if (item[this.valueKey] == itemValue) {
          return { label: item[this.labelKey], list: item[this.childrenKey] };
        }
        const children = item[this.childrenKey];
        if (!validateNull(children)) {
          const result = this.traverseDictionary(children, itemValue);
          if (result.label) return result;
        }
      }
      return { label: itemValue, list };
    },
    focus(event) {
      this.resolveHandler('focus')(this.modelValue, event);
      this.$emit('focus', this.modelValue, event);
    },
    blur(event) {
      this.resolveHandler('blur')(this.modelValue, event);
      this.$emit('blur', this.modelValue, event);
    },
    click(event) {
      this.resolveHandler('click')(this.modelValue, event);
      this.$emit('click', this.modelValue, event);
    },
  },
};
