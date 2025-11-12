<template>
  <div class="workflow-timeline" data-testid="workflow-timeline">
    <van-steps direction="vertical" :active="activeStep">
      <van-step v-for="(item, index) in filteredFlow" :key="index">
        <template #title>
          <div class="workflow-timeline__title">
            <span class="workflow-timeline__actor">{{ item.assigneeName || '未指定' }}</span>
            <span class="workflow-timeline__time">{{ item.createTime }}</span>
          </div>
        </template>
        <template #description>
          <div class="workflow-timeline__content">
            <div class="workflow-timeline__row">
              {{ renderNodeName(item) }}
            </div>
            <div v-if="item.historyActivityDurationTime" class="workflow-timeline__row">
              任务历时：{{ item.historyActivityDurationTime }}
            </div>
            <template v-if="item.comments && item.comments.length">
              <div
                v-for="(comment, cIndex) in visibleComments(item.comments, index)"
                :key="cIndex"
                class="workflow-timeline__comment"
              >
                <div class="workflow-timeline__row">{{ formatComment(comment) }}</div>
                <div v-if="comment.time" class="workflow-timeline__extra">{{ comment.time }}</div>
              </div>
              <div
                v-if="item.comments.filter((c) => c.action === 'AddComment').length > defaultCommentCount"
                class="workflow-timeline__toggle"
                @click="toggleExpand(index)"
              >
                <span>{{ expandedIndex === index ? '收起' : '展开' }}</span>
                <van-icon :name="expandedIndex === index ? 'arrow-up' : 'arrow-down'" size="14" />
              </div>
            </template>
            <div v-if="item.attachments && item.attachments.length" class="workflow-timeline__attachments">
              <span class="workflow-timeline__label">附件：</span>
              <div class="workflow-timeline__attachment-list">
                <a
                  v-for="(attachment, aIndex) in item.attachments"
                  :key="aIndex"
                  class="workflow-timeline__attachment"
                  :href="attachment.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ attachment.name }}
                </a>
              </div>
            </div>
            <div v-if="item.endTime" class="workflow-timeline__row">结束时间：{{ item.endTime }}</div>
          </div>
        </template>
      </van-step>
    </van-steps>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface FlowRecord {
  historyActivityType?: string;
  assigneeName?: string;
  createTime?: string;
  historyActivityDurationTime?: string;
  historyActivityName?: string;
  comments?: Array<Record<string, any>>;
  attachments?: Array<{ name: string; url: string }>;
  endTime?: string;
}

const props = defineProps<{ flow: FlowRecord[] }>();

const commentMap: Record<string, string> = {
  assigneeComment: '变更审核人',
  dispatchComment: '调度意见',
  transferComment: '转办意见',
  delegateComment: '委托意见',
  rollbackComment: '驳回意见',
  terminateComment: '终止意见',
  addMultiInstanceComment: '加签',
  deleteMultiInstanceComment: '减签',
  withdrawComment: '撤销',
  recallComment: '撤回',
  comment: '审批意见',
};

const expandedIndex = ref<number | null>(null);
const defaultCommentCount = 1;

const filteredFlow = computed(() =>
  (props.flow || []).filter((item) => !['candidate', 'sequenceFlow'].includes(item.historyActivityType || ''))
);

const activeStep = computed(() => Math.max(filteredFlow.value.length - 1, 0));

function renderNodeName(item: FlowRecord) {
  if (item.historyActivityType === 'endEvent') {
    return `在 [${item.createTime}] 完成流程`;
  }
  return `${item.assigneeName || '未指定'} 在 [${item.createTime}] 处理 [${item.historyActivityName || '未命名'}]`;
}

function visibleComments(comments: Array<Record<string, any>>, index: number) {
  const addComments = comments.filter((c) => c.action === 'AddComment');
  if (expandedIndex.value === index) {
    return addComments;
  }
  return addComments.slice(0, defaultCommentCount);
}

function formatComment(comment: Record<string, any>) {
  const label = commentMap[comment.type] || '审批意见';
  return `${label}：${comment.fullMessage ?? ''}`;
}

function toggleExpand(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index;
}
</script>

<style scoped>
.workflow-timeline {
  padding: 12px 0;
}

.workflow-timeline__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 4px;
}

.workflow-timeline__actor {
  font-weight: 600;
}

.workflow-timeline__time {
  color: #646566;
  font-size: 12px;
}

.workflow-timeline__content {
  font-size: 13px;
  color: #323233;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workflow-timeline__row {
  line-height: 20px;
}

.workflow-timeline__comment {
  padding-left: 8px;
  border-left: 2px solid #d9d9d9;
}

.workflow-timeline__extra {
  font-size: 12px;
  color: #969799;
}

.workflow-timeline__attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: baseline;
}

.workflow-timeline__label {
  color: #646566;
}

.workflow-timeline__attachment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.workflow-timeline__attachment {
  color: #1989fa;
  text-decoration: none;
  font-size: 13px;
}

.workflow-timeline__toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1989fa;
  font-size: 13px;
  cursor: pointer;
}
</style>
