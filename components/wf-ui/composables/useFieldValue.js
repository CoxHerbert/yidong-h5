import { computed, ref, watch } from 'vue';
import { getPlaceholder, initVal } from '../util/dataformat.js';
import { DIC_LIST, DIC_PROPS, DIC_SPLIT } from '../util/variable.js';
import { deepClone, validateNull } from '../util/index.js';

function extractHandler(column, name, context) {
    const handler = column && typeof column[name] === 'function' ? column[name] : undefined;
    if (!handler) return () => {};
    return (payload, event) => handler({ value: payload, column, index: context.dynamicIndex, event });
}

function resolveProps(column) {
    return { ...DIC_PROPS, ...(column?.props || {}) };
}

export function useFieldValue(props, emit) {
    const column = computed(() => props.column || {});
    const dic = computed(() => props.dic || []);
    const dynamicIndex = computed(() => props.dynamicIndex);

    const state = {
        value: ref(),
        textLabel: ref(''),
        stringMode: ref(false),
    };
    const initializing = ref(true);

    const valueKey = computed(() => resolveProps(column.value).value);
    const labelKey = computed(() => resolveProps(column.value).label);
    const childrenKey = computed(() => resolveProps(column.value).children);

    const placeholder = computed(() => getPlaceholder(column.value, column.value.type));

    const onFocus = (payload, event) =>
        extractHandler(column.value, 'focus', { dynamicIndex: dynamicIndex.value })(payload, event);
    const onBlur = (payload, event) =>
        extractHandler(column.value, 'blur', { dynamicIndex: dynamicIndex.value })(payload, event);
    const onClick = (payload, event) =>
        extractHandler(column.value, 'click', { dynamicIndex: dynamicIndex.value })(payload, event);
    const onChange = (payload, event) =>
        extractHandler(column.value, 'change', { dynamicIndex: dynamicIndex.value })(payload, event);

    function emitChange(value, event) {
        let result = value;
        const columnValue = column.value;
        const shouldJoin =
            columnValue?.dataType === 'string' ||
            columnValue?.dataType === 'number' ||
            state.stringMode.value ||
            columnValue?.listType === 'picture-img';
        if (Array.isArray(value) && shouldJoin) {
            result = value.join(columnValue?.separator || DIC_SPLIT);
        }
        onChange(result, event);
        emit('update:modelValue', result);
        emit('change', result);
    }

    function handleTextLabel() {
        const columnValue = column.value;
        if (!DIC_LIST.includes(columnValue.type)) {
            state.textLabel.value = '';
            return;
        }
        if (validateNull(state.value.value) || validateNull(dic.value)) {
            state.textLabel.value = '';
            emit('label-change', '');
            return;
        }
        const values = Array.isArray(state.value.value)
            ? state.value.value
            : (state.value.value + '').split(columnValue.separator || DIC_SPLIT);
        const labels = [];
        let source = deepClone(dic.value);
        values.forEach((itemValue) => {
            const { list, label } = traverseDictionary(source, itemValue);
            if (list) source = list;
            if (label) labels.push(label);
        });
        const labelString = state.stringMode.value ? labels.join('/') : labels;
        state.textLabel.value = Array.isArray(labelString) ? labelString.join('/') : labelString;
        emit('label-change', labelString);
    }

    function traverseDictionary(list, itemValue) {
        for (let i = 0; i < list.length; i += 1) {
            const item = list[i];
            if (item[valueKey.value] == itemValue) {
                return { label: item[labelKey.value], list: item[childrenKey.value] };
            }
            const children = item[childrenKey.value];
            if (!validateNull(children)) {
                const result = traverseDictionary(children, itemValue);
                if (result.label) return result;
            }
        }
        return { label: itemValue, list: list }; // fallback
    }

    watch(
        () => props.modelValue,
        (val) => {
            state.stringMode.value = typeof val === 'string';
            initializing.value = true;
            if (!column.value || validateNull(column.value)) {
                state.value.value = val;
            } else {
                state.value.value = initVal(val, column.value);
            }
        },
        { immediate: true }
    );

    watch(
        () => state.value.value,
        (val) => {
            handleTextLabel();
            if (initializing.value) {
                initializing.value = false;
                return;
            }
            emitChange(val);
        }
    );

    watch(dic, () => {
        handleTextLabel();
    });

    return {
        value: state.value,
        textLabel: state.textLabel,
        placeholder,
        focus(event) {
            onFocus(props.modelValue, event);
            emit('focus', props.modelValue, event);
        },
        blur(event) {
            onBlur(props.modelValue, event);
            emit('blur', props.modelValue, event);
        },
        click(event) {
            onClick(props.modelValue, event);
            emit('click', props.modelValue, event);
        },
    };
}
