import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import WfForm from '../components/wf-ui/components/wf-form/wf-form.vue';

const stubs = {
  'van-form': { template: '<form><slot /></form>' },
  'van-field': {
    props: ['modelValue'],
    emits: ['update:modelValue', 'click'],
    template:
      '<input class="van-field" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @click="$emit(\'click\', $event)" />',
  },
  'van-button': { template: '<button><slot /></button>' },
  'van-popup': {
    props: ['show'],
    emits: ['update:show'],
    template: '<div v-if="show" class="van-popup"><slot /></div>',
  },
  'van-picker': { template: '<div class="van-picker"><slot /></div>' },
  'van-radio-group': { template: '<div class="van-radio-group"><slot /></div>' },
  'van-radio': { template: '<label class="van-radio"><slot /></label>' },
  'van-checkbox-group': { template: '<div class="van-checkbox-group"><slot /></div>' },
  'van-checkbox': { template: '<label class="van-checkbox"><slot /></label>' },
  'van-switch': {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<input class="van-switch" type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
  },
  'van-rate': { template: '<div class="van-rate"></div>' },
  'van-slider': { template: '<div class="van-slider"></div>' },
  'van-date-picker': { emits: ['confirm', 'cancel'], template: '<div class="van-date-picker"></div>' },
  'van-time-picker': { emits: ['confirm', 'cancel'], template: '<div class="van-time-picker"></div>' },
  'van-cascader': {
    props: ['modelValue'],
    emits: ['update:modelValue', 'close', 'finish'],
    template: '<div class="van-cascader"></div>',
  },
  'van-uploader': {
    props: ['fileList'],
    emits: ['update:file-list', 'delete'],
    template: '<div class="van-uploader"></div>',
  },
  'van-stepper': {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<input class="van-stepper" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
  'van-empty': {
    props: ['description'],
    template: '<div class="van-empty">{{ description }}</div>',
  },
};

describe('WfForm', () => {
  const option = {
    menuBtn: false,
    column: [
      { prop: 'name', label: '姓名', type: 'input' },
      { prop: 'age', label: '年龄', type: 'number' },
      { prop: 'category', label: '分类', type: 'select', dicData: [{ label: 'A', value: 'a' }] },
      { prop: 'area', label: '区域', type: 'cascader', dicData: [{ label: '中国', value: 'china', children: [{ label: '上海', value: 'shanghai' }] }] },
      { prop: 'gender', label: '性别', type: 'radio', dicData: [{ label: '男', value: 'male' }] },
      { prop: 'hobbies', label: '爱好', type: 'checkbox', dicData: [{ label: '运动', value: 'sport' }] },
      { prop: 'enable', label: '启用', type: 'switch' },
      { prop: 'score', label: '评分', type: 'rate' },
      { prop: 'progress', label: '进度', type: 'slider' },
      { prop: 'appointment', label: '预约时间', type: 'datetime' },
      { prop: 'attachments', label: '附件', type: 'upload' },
    ],
  };

  const model = {
    name: '',
    age: 0,
    category: '',
    area: [],
    gender: '',
    hobbies: [],
    enable: false,
    score: 0,
    progress: 0,
    appointment: '',
    attachments: [],
  };

  it('renders all configured form items', () => {
    const wrapper = mount(WfForm, {
      props: { modelValue: model, option },
      global: { stubs },
    });

    expect(wrapper.findAll('.wf-form-item').length).toBe(option.column.length);
    expect(wrapper.text()).toContain('姓名');
    expect(wrapper.text()).toContain('附件');
  });

  it('emits updated model value when input changes', async () => {
    const wrapper = mount(WfForm, {
      props: { modelValue: model, option },
      global: { stubs },
    });

    const input = wrapper.find('input.van-field');
    await input.setValue('测试');

    const updates = wrapper.emitted('update:modelValue');
    expect(updates).toBeTruthy();
    const lastUpdate = updates?.pop()?.[0];
    expect(lastUpdate?.name).toBe('测试');
  });

  it('supports dynamic subforms with events and mutations', async () => {
    const dynamicChange = vi.fn();
    const dynamicOption = {
      menuBtn: false,
      column: [
        {
          prop: 'items',
          label: '费用明细',
          type: 'dynamic',
          children: {
            title: '费用项',
            column: [
              {
                prop: 'item',
                label: '事项',
                type: 'input',
                change: ({ value, index }: any) => dynamicChange({ value, index }),
              },
              { prop: 'cost', label: '金额', type: 'number' },
            ],
          },
        },
      ],
    };

    const wrapper = mount(WfForm, {
      props: { modelValue: { items: [] }, option: dynamicOption },
      global: { stubs },
    });

    const addBtn = wrapper.findAll('button').find((btn) => btn.text() === '新增');
    expect(addBtn).toBeTruthy();
    await addBtn!.trigger('click');

    expect(wrapper.findAll('.wf-dynamic__item').length).toBe(1);

    const input = wrapper.findAll('input.van-field')[0];
    await input.setValue('机票');

    expect(dynamicChange).toHaveBeenCalledWith({ value: '机票', index: 0 });

    const removeBtn = wrapper.findAll('button').find((btn) => btn.text() === '移除');
    expect(removeBtn).toBeTruthy();
    await removeBtn!.trigger('click');
    expect(wrapper.findAll('.wf-dynamic__item').length).toBe(0);

    const updates = wrapper.emitted('update:modelValue');
    expect(updates).toBeTruthy();
    const latest = updates?.pop()?.[0];
    expect(Array.isArray(latest?.items)).toBe(true);
  });
});
