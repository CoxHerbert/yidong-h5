<template>
  <div class="workflow-exam-form">
    <van-cell-group inset>
      <van-field
        v-if="!state.hideComment"
        v-model="examineForm.comment"
        type="textarea"
        rows="3"
        label="批复意见"
        placeholder="请输入批复意见"
        autosize
        @update:model-value="emitComment"
      />
      <div v-if="!state.hideAttachment" class="workflow-exam-form__attachments">
        <div class="workflow-exam-form__label">附件</div>
        <van-uploader
          v-model:file-list="fileList"
          multiple
          :after-read="handleAfterRead"
          :max-count="5"
        />
      </div>
      <van-field
        v-if="!state.hideCopy"
        v-model="examineForm.$copyUser"
        label="抄送人"
        placeholder="请选择抄送人"
        readonly
        is-link
        @click="emit('user-select', { type: 'copy', checkType: 'checkbox' })"
      />
      <van-field
        v-if="!state.hideExamine"
        v-model="examineForm.$assignee"
        label="指定审批人"
        placeholder="如不选择则使用默认处理人"
        readonly
        is-link
        @click="emit('user-select', { type: 'assignee', checkType: 'checkbox' })"
      />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { UploaderFileListItem } from 'vant';

interface ProcessInfo {
  hideComment?: boolean;
  hideAttachment?: boolean;
  hideCopy?: boolean;
  hideExamine?: boolean;
  copyUser?: string | string[];
  copyUserName?: string | string[];
}

const props = defineProps<{ process: ProcessInfo | null; comment?: string }>();
const emit = defineEmits(['user-select', 'update:comment']);

const examineForm = reactive({
  comment: props.comment || '',
  copyUser: undefined as string | string[] | undefined,
  $copyUser: undefined as string | string[] | undefined,
  assignee: undefined as string | string[] | undefined,
  $assignee: undefined as string | string[] | undefined,
  attachment: [] as { name: string; url?: string }[],
});

const state = reactive({
  hideComment: false,
  hideAttachment: false,
  hideCopy: false,
  hideExamine: false,
});

const fileList = ref<UploaderFileListItem[]>([]);

watch(
  () => props.comment,
  (val) => {
    if (typeof val === 'string') {
      examineForm.comment = val;
    }
  }
);

watch(
  () => props.process,
  (val) => {
    if (!val) return;
    state.hideComment = Boolean(val.hideComment);
    state.hideAttachment = Boolean(val.hideComment || val.hideAttachment);
    state.hideCopy = Boolean(val.hideCopy);
    state.hideExamine = Boolean(val.hideExamine);
    if (val.copyUser) {
      examineForm.copyUser = val.copyUser;
    }
    if (val.copyUserName) {
      examineForm.$copyUser = val.copyUserName;
    }
  },
  { immediate: true, deep: true }
);

watch(
  fileList,
  (list) => {
    examineForm.attachment = list.map((item) => ({ name: item.name || item.url || '附件', url: item.url }));
  },
  { deep: true }
);

function emitComment(value: string) {
  emit('update:comment', value);
}

function handleAfterRead(item: UploaderFileListItem | UploaderFileListItem[]) {
  const files = Array.isArray(item) ? item : [item];
  files.forEach((file) => {
    if (!file.url && file.content) {
      file.url = typeof file.content === 'string' ? file.content : URL.createObjectURL(file.content as Blob);
    }
  });
}

defineExpose({ examineForm });
</script>

<style scoped>
.workflow-exam-form {
  padding: 0 16px 16px;
}

.workflow-exam-form__attachments {
  padding: 12px 16px;
}

.workflow-exam-form__label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #646566;
}
</style>
