<template>
  <section class="chain-transaction-card">
    <header>
      <span><el-icon><Link /></el-icon></span>
      <h3>{{ t('deposit.chainTransactionData') }}</h3>
    </header>

    <div class="chain-transaction-card__body">
      <div class="chain-transaction-card__flow">
        <article>
          <small>{{ t('deposit.from') }}</small>
          <strong>{{ t('deposit.sourceAddress') }}</strong>
          <AddressValue :value="sourceAddress" :label="t('deposit.sourceAddress')" />
        </article>
        <span class="chain-transaction-card__arrow"><el-icon><Right /></el-icon></span>
        <article>
          <small>{{ t('deposit.to') }}</small>
          <strong>{{ t('deposit.agentDedicatedAddress') }}</strong>
          <AddressValue :value="receivingAddress" :label="t('deposit.agentDedicatedAddress')" />
        </article>
      </div>

      <dl class="chain-transaction-card__fields">
        <div>
          <dt>{{ t('deposit.platformTransactionNo') }}</dt>
          <dd><AddressValue :value="platformTransactionNo" :label="t('deposit.platformTransactionNo')" /></dd>
        </div>
        <div>
          <dt>{{ t('deposit.txid') }}</dt>
          <dd><AddressValue :value="txid" :label="t('deposit.txid')" /></dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { ElButton, ElIcon, ElMessage } from 'element-plus';
import { DocumentCopy, Link, Right } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  sourceAddress: string;
  receivingAddress: string;
  platformTransactionNo: string;
  txid: string;
}>();

const { t } = useI18n();

const AddressValue = defineComponent({
  props: { value: { type: String, default: '' }, label: { type: String, required: true } },
  setup(props) {
    async function copy() {
      try {
        await navigator.clipboard.writeText(props.value);
        ElMessage.success(t('deposit.copiedField', { field: props.label }));
      } catch {
        ElMessage.error(t('deposit.copyFieldFailed'));
      }
    }
    return () => h('div', { class: 'chain-transaction-card__value' }, [
      h('code', props.value || '—'),
      props.value ? h(ElButton, { text: true, circle: true, icon: DocumentCopy, ariaLabel: `${t('common.actions.copy')} ${props.label}`, onClick: copy }) : null,
    ]);
  },
});
</script>

<style scoped lang="scss">
.chain-transaction-card {
  overflow: hidden;
  border: 1px solid #dce5ef;
  border-radius: 18px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 12px 28px rgb(16 42 80 / 6%);

  > header { display:flex;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid #e4eaf2; }
  > header > span { display:inline-flex;width:38px;height:38px;flex:0 0 38px;align-items:center;justify-content:center;border-radius:10px;color:#1f73f2;background:linear-gradient(135deg,#e9f4ff,#eef0ff);font-size:20px; }
  h3 { margin:0;color:var(--app-text-heading);font-size:18px;font-weight:700; }

  &__body { display:grid;gap:18px;padding:20px 24px 24px; }
  &__flow { display:grid;grid-template-columns:minmax(0,1fr) 38px minmax(0,1fr);align-items:center;gap:14px;padding:18px;border-radius:14px;background:#f5f8fc; }
  &__flow article { display:grid;min-width:0;gap:8px; }
  &__flow small { color:var(--app-text-label);font-size:13px; }
  &__flow strong { color:var(--app-text-heading);font-size:14px; }
  &__arrow { display:inline-flex;width:36px;height:36px;align-items:center;justify-content:center;border:1px solid #a9ded9;border-radius:50%;color:#099e95;background:#fff; }
  &__value { display:flex;min-width:0;align-items:center;gap:6px; }
  &__value code { min-width:0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere;word-break:break-all; }
  &__value :deep(.el-button) { width:28px;height:28px;min-width:28px;min-height:28px;flex:none;color:#079b92; }
  &__fields { display:grid;margin:0; }
  &__fields > div { display:grid;min-width:0;grid-template-columns:150px minmax(0,1fr);align-items:center;gap:16px;padding:15px 4px;border-bottom:1px solid #e8edf3; }
  &__fields > div:last-child { border-bottom:0; }
  dt { color:var(--app-text-label);font-size:13px; }
  dd { margin:0;color:var(--app-text-body);font-size:14px;font-weight:600; }
}

@include mobile {
  .chain-transaction-card {
    > header, &__body { padding-right:18px;padding-left:18px; }
    &__flow { grid-template-columns:1fr; }
    &__arrow { justify-self:center;transform:rotate(90deg); }
    &__fields > div { grid-template-columns:1fr;gap:8px; }
  }
}
</style>
