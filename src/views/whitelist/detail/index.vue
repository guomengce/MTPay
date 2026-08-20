<template>
  <main class="whitelist-detail">
    <button class="whitelist-detail__back" type="button" @click="goBack">
      <i class="ri-arrow-left-line" />返回白名单列表
    </button>

    <div v-loading="loading" class="whitelist-detail__content">
      <template v-if="detail">
        <DetailOrderHero
          :eyebrow="`白名单 ${detail.whitelist_no}`"
          :order-no="detail.subject_name"
          :status="detail.status_name"
          :status-type="statusMeta.type"
          :status-effect="statusMeta.effect"
        >
          <div class="whitelist-detail__identity">
            <span
              ><i :class="detail.entity_type === 1 ? 'ri-building-2-line' : 'ri-user-3-line'"
            /></span>
            <div>
              <small>主体身份</small>
              <strong>{{ detail.role_name }} · {{ detail.entity_type_name }}</strong>
            </div>
            <div>
              <small>国家／地区</small>
              <strong>{{ getCountryLabel(detail.country) }}</strong>
            </div>
          </div>

          <template #meta>
            <div class="detail-meta-item">
              <i class="ri-calendar-event-line" />
              <span
                ><small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong></span
              >
            </div>
            <div v-if="detail.updated_at" class="detail-meta-item">
              <i class="ri-refresh-line" />
              <span
                ><small>最后更新</small><strong>{{ detail.updated_at }}</strong></span
              >
            </div>
          </template>
        </DetailOrderHero>

        <section v-if="statusNotice" class="status-notice" :class="`is-${statusNotice.tone}`">
          <i :class="statusNotice.icon" />
          <div>
            <strong>{{ statusNotice.title }}</strong>
            <p>{{ statusNotice.description }}</p>
          </div>
          <el-button
            v-if="detail.status === 1"
            size="small"
            type="warning"
            plain
            @click="supplementDialogVisible = true"
          >
            补充文件
          </el-button>
        </section>

        <div class="whitelist-detail__grid">
          <div class="whitelist-detail__main">
            <DetailCard
              v-if="identityItems.length"
              title="身份与登记资料"
              description="主体的身份识别和登记信息"
              icon="ri-profile-line"
            >
              <DetailFieldGrid :items="identityItems" />
            </DetailCard>

            <DetailCard
              v-if="locationItems.length"
              title="地址资料"
              description="主体登记、经营或居住所在地"
              icon="ri-map-pin-line"
            >
              <DetailFieldGrid :items="locationItems" />
            </DetailCard>

            <DetailCard
              v-if="bankItems.length"
              title="银行与汇款资料"
              description="收款账户及汇款用途"
              icon="ri-bank-line"
            >
              <DetailFieldGrid :items="bankItems" />
            </DetailCard>
          </div>

          <aside class="whitelist-detail__aside">
            <DetailCard
              v-if="reviewItems.length"
              :title="detail.status === 3 ? '驳回信息' : '审核信息'"
              description="管理员对本次申请的处理结果"
              :icon="detail.status === 3 ? 'ri-close-circle-line' : 'ri-shield-check-line'"
            >
              <DetailFieldGrid :items="reviewItems" />
            </DetailCard>

            <DetailCard
              v-if="detail.records.length"
              title="完整处理记录"
              description="后端返回的真实操作节点与关联文件"
              icon="ri-time-line"
            >
              <ol class="record-list">
                <li v-for="record in detail.records" :key="record.id">
                  <span class="record-list__dot" />
                  <article>
                    <header>
                      <strong>{{ record.action_name }}</strong>
                      <time>{{ record.created_at || '—' }}</time>
                    </header>
                    <p>{{ record.actor_name || record.actor_type_name }}</p>
                    <blockquote v-if="record.message">{{ record.message }}</blockquote>
                    <div v-if="record.files.length" class="record-files">
                      <div v-for="file in record.files" :key="file.file_id" class="record-file">
                        <span
                          ><i class="ri-file-line" /><b>{{ file.original_name }}</b></span
                        >
                        <div>
                          <el-button
                            text
                            type="primary"
                            :loading="fileLoading"
                            @click="openFilePreview(file.file_id)"
                            >预览</el-button
                          >
                          <el-button text :loading="fileLoading" @click="downloadFile(file.file_id)"
                            >下载</el-button
                          >
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </ol>
            </DetailCard>
          </aside>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="未找到该白名单记录">
        <el-button type="primary" @click="goBack">返回白名单列表</el-button>
      </el-empty>
    </div>

    <SupplementDialog
      v-model="supplementDialogVisible"
      :item="detail"
      :supplement-requirement="detail?.review.note || undefined"
      :submitting="supplementSubmitting"
      :uploading="supplementUploading"
      @submit="handleSupplement"
    />
  </main>
</template>

<script setup lang="ts">
/** 代理端白名单详情：展示真实 business_data、审核信息、处理记录与补件入口。 */
import { computed, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid from '@/components/detail/DetailFieldGrid.vue';
import type { DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';
import SupplementDialog from '@/views/whitelist/components/SupplementDialog.vue';
import { useWhitelistDetail } from '@/views/whitelist/composables/useWhitelistDetail';
import { useWhitelistPreview } from '@/views/whitelist/composables/useWhitelistPreview';
import { useWhitelistSupplement } from '@/views/whitelist/composables/useWhitelistSupplement';
import {
  WHITELIST_STATUS_MAP,
  type WhitelistStatus,
} from '@/views/whitelist/composables/useWhitelistList';

interface StatusNotice {
  title: string;
  description: string;
  tone: 'warning' | 'success' | 'danger' | 'primary';
  icon: string;
}

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));
const { loading, detail, fetchDetail } = useWhitelistDetail();
const {
  submitting: supplementSubmitting,
  uploading: supplementUploading,
  submit: submitSupplement,
} = useWhitelistSupplement();
const {
  loading: fileLoading,
  openPreview: openFilePreview,
  triggerDownload: downloadFile,
} = useWhitelistPreview();

const supplementDialogVisible = ref(false);

const statusMeta = computed(
  () => WHITELIST_STATUS_MAP[(detail.value?.status ?? 0) as WhitelistStatus],
);

const statusNotice = computed<StatusNotice | null>(() => {
  if (!detail.value) return null;
  if (detail.value.status === 0) {
    return {
      title: '等待平台审核',
      description: '资料已经提交，请等待管理员处理。',
      tone: 'primary',
      icon: 'ri-time-line',
    };
  }
  if (detail.value.status === 1) {
    return {
      title: '需要补充文件',
      description: detail.value.review.note || '平台已提出补充要求，请在本页上传文件。',
      tone: 'warning',
      icon: 'ri-error-warning-line',
    };
  }
  if (detail.value.status === 2) {
    return {
      title: '白名单已通过',
      description: '该主体现在可以用于符合条件的出金申请。',
      tone: 'success',
      icon: 'ri-checkbox-circle-line',
    };
  }
  return {
    title: '白名单已驳回',
    description: detail.value.review.note || '本次申请未通过审核。',
    tone: 'danger',
    icon: 'ri-close-circle-line',
  };
});

const COMPANY_TYPE_NAME: Record<number, string> = { 1: '非金融机构', 2: '金融机构' };
const DOCUMENT_TYPE_NAME: Record<number, string> = { 1: '身份证件', 2: '护照' };
const COUNTRY_KEYS = new Set([
  'registration_country',
  'operating_country',
  'nationality',
  'residence_country',
]);

function businessItem(key: string, label: string, options: Partial<DetailFieldItem> = {}) {
  const raw = detail.value?.business_data?.[key];
  if (raw === undefined || raw === null || raw === '') return null;
  let value = String(raw);
  if (COUNTRY_KEYS.has(key)) value = getCountryLabel(raw);
  if (key === 'company_type') value = COMPANY_TYPE_NAME[Number(raw)] || value;
  if (key === 'document_type') value = DOCUMENT_TYPE_NAME[Number(raw)] || value;
  if (key === 'remittance_purpose') value = getRemittancePurposeLabel(raw);
  return { label, value, ...options } as DetailFieldItem;
}

function compactItems(items: Array<DetailFieldItem | null>) {
  return items.filter((item): item is DetailFieldItem => Boolean(item));
}

const identityItems = computed(() =>
  compactItems([
    businessItem('registration_date', '注册日期'),
    businessItem('company_type', '公司类型'),
    businessItem('birth_date', '出生日期'),
    businessItem('document_type', '证件类型'),
    businessItem('document_no', '证件编号', { mono: true }),
  ]),
);

const locationItems = computed(() =>
  compactItems([
    businessItem('registration_country', '注册国家／地区'),
    businessItem('operating_country', '经营国家／地区'),
    businessItem('nationality', '国籍'),
    businessItem('residence_country', '居住国家／地区'),
    businessItem('city', '城市'),
    businessItem('address', '详细地址', { wide: true }),
  ]),
);

const bankItems = computed(() =>
  compactItems([
    businessItem('bank_name', '银行名称'),
    businessItem('bank_account', '银行账号', { mono: true }),
    businessItem('swift', 'SWIFT', { mono: true }),
    businessItem('intermediary_swift', '中间行 SWIFT', { mono: true }),
    businessItem('remittance_purpose', '汇款目的', { wide: true }),
    businessItem('remark', '备注', { wide: true }),
  ]),
);

const reviewItems = computed<DetailFieldItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];
  const review = detail.value.review;
  const items: DetailFieldItem[] = [];
  if (review.admin_name) items.push({ label: '处理人', value: review.admin_name });
  if (review.reviewed_at) items.push({ label: '处理时间', value: review.reviewed_at });
  if (review.note) {
    items.push({
      label:
        detail.value.status === 3
          ? '驳回原因'
          : detail.value.status === 1
            ? '补件要求'
            : '审核备注',
      value: review.note,
      wide: true,
    });
  }
  return items;
});

async function reload() {
  if (!Number.isInteger(id.value) || id.value <= 0) return;
  await fetchDetail(id.value);
}

function goBack() {
  void router.push({ name: 'Whitelist' });
}

async function handleSupplement(payload: { files: File[]; message?: string }) {
  if (!detail.value) return;
  try {
    detail.value = await submitSupplement(detail.value.id, payload.files, payload.message);
    supplementDialogVisible.value = false;
    ElMessage.success('补件已提交，白名单已重新进入审核');
  } catch {
    /* 请求层已显示后端错误 */
  }
}

onMounted(reload);
watch(id, reload);
</script>

<style scoped lang="scss">
.whitelist-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px 40px;

  &__back {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 7px;
    padding: 0;
    border: 0;
    color: #56708d;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
  }

  &__content,
  &__main,
  &__aside {
    display: grid;
    min-width: 0;
    gap: 18px;
  }

  &__content {
    min-height: 300px;
  }

  &__identity {
    display: grid;
    align-items: center;
    grid-template-columns: 54px minmax(0, 1fr) minmax(0, 1fr);
    gap: 18px;

    > span {
      display: inline-flex;
      width: 54px;
      height: 54px;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      color: #078f89;
      background: #e6f8f5;
      font-size: 25px;
    }

    div {
      display: grid;
      min-width: 0;
      gap: 5px;
    }

    small {
      color: #7a8a9d;
      font-size: 12px;
    }

    strong {
      color: #17324f;
      font-size: 15px;
      font-weight: 650;
    }
  }

  &__grid {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.72fr);
    gap: 18px;
  }
}

.detail-meta-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #5f7892;

  > i {
    color: #0a9b92;
    font-size: 18px;
  }

  span {
    display: grid;
    gap: 2px;
  }

  small {
    font-size: 11px;
  }

  strong {
    color: #2d425a;
    font-size: 13px;
    font-weight: 600;
  }
}

.status-notice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  border: 1px solid;
  border-radius: 14px;

  > i {
    margin-top: 1px;
    font-size: 21px;
  }

  > div {
    min-width: 0;
    flex: 1;
  }

  strong {
    color: #243a54;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0;
    color: #65788e;
    font-size: 13px;
    line-height: 1.55;
  }

  &.is-warning {
    border-color: #f0d49a;
    background: #fff8e8;
    color: #c27a0b;
  }
  &.is-success {
    border-color: #bce6d7;
    background: #effaf6;
    color: #07966f;
  }
  &.is-danger {
    border-color: #f1c8ce;
    background: #fff3f4;
    color: #dc3d49;
  }
  &.is-primary {
    border-color: #c9ddf6;
    background: #f2f7fe;
    color: #2674d9;
  }
}

.record-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    position: relative;
    grid-template-columns: 16px minmax(0, 1fr);
    gap: 14px;
    padding-bottom: 22px;

    &::before {
      position: absolute;
      top: 14px;
      bottom: 0;
      left: 6px;
      width: 2px;
      content: '';
      background: #dbe8eb;
    }

    &:last-child {
      padding-bottom: 0;
    }
    &:last-child::before {
      display: none;
    }
  }

  &__dot {
    width: 14px;
    height: 14px;
    margin-top: 4px;
    border: 3px solid #d9f3ef;
    border-radius: 50%;
    background: #12a79f;
    z-index: 1;
  }

  article {
    min-width: 0;
  }
  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 14px;
  }
  header strong {
    color: #223a55;
    font-size: 14px;
  }
  time {
    color: #8492a3;
    font-size: 12px;
    white-space: nowrap;
  }
  p {
    margin: 5px 0 0;
    color: #718298;
    font-size: 12px;
  }
  blockquote {
    margin: 10px 0 0;
    padding: 10px 12px;
    border-left: 3px solid #efbd62;
    border-radius: 7px;
    color: #695631;
    background: #fff9ec;
    font-size: 13px;
  }
}

.record-files {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.record-file {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 9px;
  background: #f5f8fb;

  > span {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 7px;
  }
  i {
    color: #168f91;
  }
  b {
    overflow: hidden;
    color: #40566f;
    font-size: 12px;
    font-weight: 550;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.whitelist-detail__aside :deep(.detail-field-grid) {
  grid-template-columns: minmax(0, 1fr);
}

.whitelist-detail__aside :deep(.detail-field-grid__item),
.whitelist-detail__aside :deep(.detail-field-grid__item.is-wide) {
  grid-column: auto;
  grid-template-columns: minmax(84px, 0.42fr) minmax(0, 1fr);
}

@include narrow {
  .whitelist-detail {
    padding: 22px 24px 36px;

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@include mobile {
  .whitelist-detail {
    padding: 18px 14px 30px;

    &__identity {
      grid-template-columns: 48px minmax(0, 1fr);

      > span {
        width: 48px;
        height: 48px;
      }
      > div:last-child {
        grid-column: 2;
      }
    }
  }

  .record-list header {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
  .record-file {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
