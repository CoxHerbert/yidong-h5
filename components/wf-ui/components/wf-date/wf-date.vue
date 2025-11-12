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

<script>
import fieldValueMixin from '../../mixins/fieldValue.js';

export default {
  name: 'WfDate',
  mixins: [fieldValueMixin],
  props: {
    modelValue: { type: [String, Number, Array], default: undefined },
    column: { type: Object, default: () => ({}) },
    disabled: Boolean,
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change'],
  data() {
    return {
      showPicker: false,
      currentValues: [],
    };
  },
  computed: {
    pickerType() {
      return this.column.type || 'date';
    },
    pickerComponent() {
      return this.pickerType.includes('time') && !this.pickerType.includes('date')
        ? 'van-time-picker'
        : 'van-date-picker';
    },
    columnsType() {
      if (this.pickerType.includes('time') && !this.pickerType.includes('date')) {
        return ['hour', 'minute', 'second'];
      }
      if (this.pickerType.includes('datetime')) {
        return ['year', 'month', 'day', 'hour', 'minute'];
      }
      return ['year', 'month', 'day'];
    },
    displayText: {
      get() {
        return this.fieldValue ? String(this.fieldValue) : '';
      },
      set() {},
    },
  },
  watch: {
    fieldValue: {
      immediate: true,
      handler(val) {
        this.currentValues = this.parseValue(val);
      },
    },
  },
  methods: {
    openPicker(event) {
      this.click(event);
      if (this.disabled) return;
      this.showPicker = true;
    },
    parseValue(val) {
      if (!val) return [];
      const stringVal = Array.isArray(val) ? val.join('-') : String(val);
      if (this.pickerType.includes('time') && !this.pickerType.includes('date')) {
        return stringVal.split(':');
      }
      if (this.pickerType.includes('datetime')) {
        const [datePart, timePart] = stringVal.split(' ');
        const [hour = '00', minute = '00'] = (timePart || '00:00').split(':');
        return [...(datePart || '').split('-'), hour, minute];
      }
      return stringVal.split('-');
    },
    formatValue(values) {
      if (this.pickerType.includes('time') && !this.pickerType.includes('date')) {
        return values.slice(0, 3).join(':');
      }
      if (this.pickerType.includes('datetime')) {
        const [year, month, day, hour = '00', minute = '00'] = values;
        return `${year}-${month}-${day} ${hour}:${minute}`;
      }
      const [year, month, day] = values;
      return [year, month, day].filter(Boolean).join('-');
    },
    handleConfirm({ selectedValues }) {
      this.fieldValue = this.formatValue(selectedValues);
      this.showPicker = false;
    },
  },
};
</script>

<style scoped>
.wf-date {
  width: 100%;
}
</style>
