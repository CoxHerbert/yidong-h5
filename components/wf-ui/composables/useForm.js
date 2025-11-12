import { provide, inject, ref, watch, computed } from 'vue';
import { formInitVal, initRules, calcCascader } from '../util/dataformat.js';
import { validateNull, deepClone } from '../util/index.js';

const FORM_KEY = Symbol('wf-form');

export function provideForm(optionRef, formValue, emit) {
    const rules = ref({});
    const loading = ref(false);

    const columns = computed(() => {
        const option = optionRef.value || {};
        const base = option.column || [];
        const groups = option.group || [];
        let result = [...base];
        groups.forEach((group) => {
            if (group?.column?.length) {
                result = result.concat(group.column);
            }
        });
        return calcCascader(result);
    });

    function initForm() {
        const currentColumns = columns.value;
        rules.value = initRules(currentColumns);
        const defaults = formInitVal(currentColumns).tableForm;
        Object.keys(defaults).forEach((key) => {
            if (validateNull(formValue[key])) {
                formValue[key] = defaults[key];
            }
        });
    }

    watch(() => deepClone(optionRef.value?.column || []), initForm);

    provide(FORM_KEY, {
        option: optionRef,
        form: formValue,
        rules,
        loading,
        emit,
    });

    initForm();
}

export function useForm() {
    return inject(FORM_KEY, null);
}
