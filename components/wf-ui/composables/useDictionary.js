import { ref, watch } from 'vue';
import { deepClone } from '../util/index.js';
import { getDeepData } from '../util/index.js';

async function requestDictionary(column, httpClient) {
    if (!column?.dicUrl) return [];
    const method = (column.dicMethod || 'get').toUpperCase();
    const payload = {
        url: column.dicUrl,
        method,
    };
    if (method === 'POST') {
        payload.data = column.dicQuery;
    } else {
        payload.params = column.dicQuery;
    }
    if (!httpClient) {
        const response = await fetch(column.dicUrl, {
            method,
            body: method === 'POST' ? JSON.stringify(column.dicQuery || {}) : undefined,
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        return getDeepData(result);
    }
    const response = await httpClient.request(payload);
    const formatter = column.dicFormatter;
    const data = formatter ? formatter(response) : response.data || response;
    return Array.isArray(data) ? data : getDeepData(data);
}

export function useDictionary(optionRef, formRef, httpClient) {
    const dictionaries = ref({});

    async function loadColumnDic(column) {
        const localeDic = deepClone(column?.dicData || []);
        let remoteDic = [];
        if (column?.dicUrl && !column.dicUrl.includes('{{')) {
            remoteDic = await requestDictionary(column, httpClient);
        }
        const result = remoteDic.length ? remoteDic : localeDic;
        dictionaries.value[column.prop] = result;
    }

    async function init() {
        dictionaries.value = {};
        const option = optionRef.value || {};
        const columns = (option.column || []).concat(
            ...((option.group || []).map((group) => group.column || []))
        );
        await Promise.all(columns.filter(Boolean).map((column) => loadColumnDic(column)));
    }

    watch(
        () => optionRef.value,
        () => {
            init();
        },
        { deep: true, immediate: true }
    );

    return {
        dictionaries,
        reload: init,
    };
}
