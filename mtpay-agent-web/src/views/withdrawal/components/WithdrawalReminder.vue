<template>
  <el-card class="withdrawal-reminder" shadow="never">
    <h2>出金条件与提醒</h2>
    <div class="withdrawal-reminder__content">
      <div class="withdrawal-reminder__stats">
        <section>
          <span>USD可用余额</span>
          <strong>184,350.00 USD</strong>
          <p>冻结 5,050.00 USD</p>
        </section>
        <section>
          <span>固定费用（每笔）</span>
          <strong>50.00 USD / 笔</strong>
        </section>
      </div>
      <div class="withdrawal-reminder__notices">
        <el-alert
          title="只有同名企业向同名企业付款，或同一姓名及姓氏的个人向同一个人付款时不需要附件；其他组合均须上传合同及Invoice。"
          type="info"
          :closable="false"
          show-icon
        />
        <el-alert
          title="外部汇款显示为所选付款人向所选收款人付款；平台内部仍保留代理和订单记录。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.withdrawal-reminder {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 16px 42px rgb(16 30 54 / 7%);

  :deep(.el-card__body) {
    padding: 24px 28px;
  }

  h2 {
    margin: 0 0 20px;
    color: #071833;
    font-size: 22px;
    font-weight: 850;
    letter-spacing: 0;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(360px, 0.78fr) 1fr;
    gap: 24px;
  }

  &__stats {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 24px;

    section {
      display: grid;
      align-content: center;
      min-height: 118px;
      padding: 22px 24px;
      background: linear-gradient(135deg, #f4fffc, #ffffff);
      border: 1px solid #cfe9e4;
      border-radius: 8px;

      &:last-child {
        background: #fbfcfe;
        border-color: #dfe7ef;
      }
    }

    span {
      color: #56677f;
      font-weight: 750;
    }

    strong {
      margin-top: 12px;
      color: #071833;
      font-size: 27px;
      font-weight: 850;
      letter-spacing: 0;
    }

    p {
      margin: 10px 0 0;
      color: #75849a;
      font-weight: 650;
    }
  }

  &__notices {
    display: grid;
    gap: 14px;

    :deep(.el-alert) {
      min-height: 52px;
      border-color: #cfe2ff;
      border-radius: 8px;
    }

    :deep(.el-alert__title) {
      color: #2264bd;
      font-weight: 750;
      line-height: 1.6;
    }
  }

  @include narrow {
    &__content,
    &__stats {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    :deep(.el-card__body) {
      padding: 18px;
    }

    &__content,
    &__stats {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__stats strong {
      font-size: 23px;
    }
  }
}
</style>
