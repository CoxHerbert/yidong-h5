<template>
  <div class="workflow-exam-form" data-testid="workflow-exam-form">
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
        @click="$emit('user-select', { type: 'copy', checkType: 'checkbox' })"
      />
      <van-field
        v-if="!state.hideExamine"
        v-model="examineForm.$assignee"
        label="指定审批人"
        placeholder="如不选择则使用默认处理人"
        readonly
        is-link
        @click="$emit('user-select', { type: 'assignee', checkType: 'checkbox' })"
      />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'WorkflowExamForm',
  props: {
    process: { type: Object, default: null },
    comment: { type: String, default: '' },
  },
  emits: ['user-select', 'update:comment'],
  data() {
    return {
      examineForm: {
        comment: this.comment || '',
        copyUser: undefined,
        $copyUser: undefined,
        assignee: undefined,
        $assignee: undefined,
        attachment: [],
      },
      state: {
        hideComment: false,
        hideAttachment: false,
        hideCopy: false,
        hideExamine: false,
      },
      fileList: [],
    };
  },
  watch: {
    comment(val) {
      if (typeof val === 'string') {
        this.examineForm.comment = val;
      }
    },
    process: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) return;
        this.state.hideComment = Boolean(val.hideComment);
        this.state.hideAttachment = Boolean(val.hideComment || val.hideAttachment);
        this.state.hideCopy = Boolean(val.hideCopy);
        this.state.hideExamine = Boolean(val.hideExamine);
        if (val.copyUser) {
          this.examineForm.copyUser = val.copyUser;
        }
        if (val.copyUserName) {
          this.examineForm.$copyUser = val.copyUserName;
        }
      },
    },
    fileList: {
      deep: true,
      handler(list) {
        this.examineForm.attachment = list.map((item) => ({ name: item.name || item.url || '附件', url: item.url }));
      },
    },
  },
  methods: {
    emitComment(value) {
      this.$emit('update:comment', value);
    },
    handleAfterRead(item) {
      const files = Array.isArray(item) ? item : [item];
      files.forEach((file) => {
        if (!file.url && file.content) {
          if (typeof file.content === 'string') {
            file.url = file.content;
          } else if (typeof Blob !== 'undefined' && file.content instanceof Blob) {
            file.url = URL.createObjectURL(file.content);
          }
        }
      });
    },
  },
};
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
