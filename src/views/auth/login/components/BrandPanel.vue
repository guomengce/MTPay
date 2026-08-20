<template>
  <section class="brand-panel" aria-hidden="true">
    <div class="brand-panel__scene">
      <div class="brand-panel__halo" />
      <div class="brand-panel__globe" />
      <div class="brand-panel__orbit brand-panel__orbit--outer" />
      <div class="brand-panel__orbit brand-panel__orbit--middle" />
      <div class="brand-panel__orbit brand-panel__orbit--tilted" />

      <i
        v-for="spark in 11"
        :key="spark"
        :class="`brand-panel__spark brand-panel__spark--${spark}`"
      />

      <div class="brand-panel__coin brand-panel__coin--yuan"><span>¥</span></div>
      <div class="brand-panel__coin brand-panel__coin--dollar"><span>$</span></div>
      <div class="brand-panel__coin brand-panel__coin--euro"><span>€</span></div>
      <div class="brand-panel__coin brand-panel__coin--bitcoin"><span>₿</span></div>

      <div class="brand-panel__platform">
        <div class="brand-panel__platform-ring brand-panel__platform-ring--top" />
        <div class="brand-panel__platform-ring brand-panel__platform-ring--middle" />
        <div class="brand-panel__platform-ring brand-panel__platform-ring--bottom" />
      </div>

      <div class="brand-panel__cards">
        <div class="brand-panel__card brand-panel__card--back">
          <div class="brand-panel__chart-grid" />
          <div class="brand-panel__chart-line"><i /><i /><i /><i /><i /></div>
          <span class="brand-panel__chip" />
        </div>
        <div class="brand-panel__card brand-panel__card--middle" />
        <div class="brand-panel__card brand-panel__card--front">
          <div class="brand-panel__map" />
          <div class="brand-panel__card-shine" />
          <span class="brand-panel__card-label">Available Balance</span>
          <div class="brand-panel__card-balance">******.**</div>
          <div class="brand-panel__card-number">**** &nbsp;**** &nbsp;**** &nbsp;1234</div>
          <div class="brand-panel__security"><span>✓</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.brand-panel {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 29% 46%, rgb(255 255 255 / 96%) 0 5%, transparent 41%),
    radial-gradient(circle at 22% 70%, rgb(165 222 255 / 42%), transparent 35%),
    radial-gradient(circle at 75% 12%, rgb(178 218 255 / 55%), transparent 48%),
    linear-gradient(135deg, #edf7ff 0%, #f8fbff 48%, #e8f5ff 100%);

  &::before,
  &::after {
    position: absolute;
    inset: 0;
    content: '';
  }
  &::before {
    opacity: 0.55;
    background-image: radial-gradient(circle, rgb(92 158 220 / 18%) 1px, transparent 1.4px);
    background-size: 21px 21px;
    mask-image: radial-gradient(ellipse at 35% 50%, #000 5%, transparent 68%);
  }
  &::after {
    background: repeating-linear-gradient(
      160deg,
      transparent 0 18px,
      rgb(120 184 245 / 4%) 19px 20px
    );
    mask-image: linear-gradient(90deg, transparent 2%, #000 25%, transparent 66%);
  }

  &__scene {
    position: absolute;
    top: 50%;
    left: 29%;
    width: 660px;
    height: 660px;
    transform: translate(-50%, -50%);
  }
  &__halo {
    position: absolute;
    inset: 70px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgb(255 255 255 / 88%) 0 28%,
      rgb(125 204 255 / 10%) 55%,
      transparent 72%
    );
    filter: blur(2px);
  }
  &__globe {
    position: absolute;
    top: 205px;
    left: 210px;
    width: 245px;
    height: 245px;
    border-radius: 50%;
    opacity: 0.38;
    background:
      repeating-linear-gradient(90deg, transparent 0 23px, rgb(82 164 229 / 18%) 24px 25px),
      repeating-linear-gradient(0deg, transparent 0 23px, rgb(82 164 229 / 15%) 24px 25px);
    mask-image: radial-gradient(circle, #000, transparent 70%);
  }

  &__orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgb(118 181 239 / 30%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px rgb(255 255 255 / 90%);
  }
  &__orbit::before {
    position: absolute;
    top: 20%;
    left: 2%;
    width: 8px;
    height: 8px;
    border: 4px solid rgb(255 255 255 / 80%);
    border-radius: 50%;
    content: '';
    background: #8fc7fb;
    box-shadow: 0 0 16px #61b1fa;
  }
  &__orbit--outer {
    width: 565px;
    height: 565px;
    border-style: dashed;
  }
  &__orbit--middle {
    width: 445px;
    height: 445px;
    border-style: dotted;
  }
  &__orbit--tilted {
    width: 570px;
    height: 245px;
    transform: translate(-50%, -50%) rotate(-13deg);
    border-color: rgb(255 255 255 / 90%);
    box-shadow: 0 0 10px rgb(74 155 237 / 18%);
  }

  &__spark {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 9px 3px rgb(100 179 255 / 65%);
  }

  &__spark--2,
  &__spark--4,
  &__spark--6,
  &__spark--9,
  &__spark--11 {
    animation: spark-breathe 2.8s ease-in-out infinite;
  }

  &__spark--4,
  &__spark--11 {
    animation-delay: -0.9s;
  }

  &__spark--6 {
    animation-delay: -1.8s;
  }

  &__spark--9 {
    animation-delay: -2.3s;
  }
  @for $i from 1 through 11 {
    &__spark--#{$i} {
      top: 8% + (($i * 13) % 78);
      left: 7% + (($i * 23) % 84);
      transform: scale(0.45 + (($i % 3) * 0.35));
    }
  }

  &__coin {
    position: absolute;
    z-index: 6;
    display: grid;
    place-items: center;
    border: 2px solid rgb(255 255 255 / 80%);
    border-radius: 50%;
    color: #fff;
    font-weight: 700;
    background: linear-gradient(145deg, #55cfce, #249ac5);
    box-shadow: 0 9px 20px rgb(35 116 193 / 22%);
  }
  &__coin--yuan {
    top: 72px;
    left: 112px;
    width: 58px;
    height: 58px;
    font-size: 28px;
  }
  &__coin--dollar {
    top: 70px;
    right: 104px;
    width: 54px;
    height: 54px;
    font-size: 27px;
    background: linear-gradient(145deg, #76b5f5, #5688e6);
  }
  &__coin--euro {
    top: 297px;
    right: 40px;
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  &__coin--bitcoin {
    bottom: 70px;
    left: 105px;
    width: 59px;
    height: 59px;
    font-size: 29px;
    background: linear-gradient(145deg, #6db7f4, #4b79df);
  }

  &__platform {
    position: absolute;
    z-index: 1;
    bottom: 58px;
    left: 50%;
    width: 410px;
    height: 128px;
    transform: translateX(-50%);
    filter: drop-shadow(0 24px 20px rgb(58 132 218 / 20%));
  }
  &__platform::after {
    position: absolute;
    bottom: -13px;
    left: 3%;
    width: 94%;
    height: 50px;
    border-radius: 50%;
    content: '';
    background: radial-gradient(ellipse, rgb(64 139 234 / 34%), transparent 69%);
    filter: blur(7px);
  }
  &__platform-ring {
    position: absolute;
    left: 50%;
    border: 1px solid rgb(255 255 255 / 95%);
    border-radius: 50%;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgb(255 255 255 / 94%), rgb(154 200 255 / 54%));
    box-shadow:
      inset 0 -8px 12px rgb(62 132 238 / 18%),
      0 3px 9px rgb(57 127 219 / 24%);
  }
  &__platform-ring--bottom {
    bottom: 3px;
    width: 100%;
    height: 83px;
  }
  &__platform-ring--middle {
    z-index: 2;
    bottom: 30px;
    width: 86%;
    height: 71px;
  }
  &__platform-ring--top {
    z-index: 3;
    bottom: 57px;
    width: 64%;
    height: 55px;
    background: linear-gradient(180deg, #fafdff, #bcd9ff);
  }

  &__cards {
    position: absolute;
    z-index: 4;
    top: 46%;
    left: 50%;
    width: 380px;
    height: 240px;
    transform: translate(-50%, -50%) perspective(900px) rotateX(3deg);
  }
  &__card {
    position: absolute;
    width: 350px;
    height: 218px;
    border-radius: 18px;
  }
  &__card--back {
    top: -62px;
    left: 64px;
    overflow: hidden;
    border: 1px solid rgb(82 157 239 / 52%);
    background: linear-gradient(135deg, rgb(220 239 255 / 72%), rgb(179 220 255 / 45%));
    transform: rotate(9deg);
    box-shadow: 0 14px 30px rgb(64 127 203 / 14%);
    backdrop-filter: blur(4px);
  }
  &__card--middle {
    top: -4px;
    left: 76px;
    background: linear-gradient(125deg, #77e6dc, #2eb8c8);
    transform: rotate(10deg);
    box-shadow: 0 15px 30px rgb(34 152 182 / 22%);
  }
  &__card--front {
    overflow: hidden;
    padding: 25px 27px;
    color: #fff;
    background: linear-gradient(132deg, #063c92 0%, #007bad 47%, #16b4cc 100%);
    transform: translate(-14px, 8px) rotate(3deg);
    box-shadow:
      0 25px 45px rgb(12 75 148 / 35%),
      inset 0 1px 1px rgb(255 255 255 / 36%);
  }
  &__card--front::after {
    position: absolute;
    inset: 0;
    content: '';
    background:
      radial-gradient(circle at 22% 5%, rgb(67 229 227 / 38%), transparent 45%),
      linear-gradient(120deg, transparent 52%, rgb(71 224 223 / 15%));
  }
  &__chart-grid {
    position: absolute;
    inset: 0;
    opacity: 0.45;
    background-image:
      linear-gradient(rgb(89 160 224 / 24%) 1px, transparent 1px),
      linear-gradient(90deg, rgb(89 160 224 / 24%) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  &__chart-line {
    position: absolute;
    right: 24px;
    bottom: 54px;
    display: flex;
    align-items: flex-end;
    gap: 17px;
    height: 55px;
  }
  &__chart-line i {
    display: block;
    width: 2px;
    border-radius: 2px;
    background: #40d7db;
    box-shadow: 0 0 9px #37d3d8;
    transform: rotate(35deg);
  }
  &__chart-line i:nth-child(1) {
    height: 17px;
  }
  &__chart-line i:nth-child(2) {
    height: 43px;
  }
  &__chart-line i:nth-child(3) {
    height: 25px;
  }
  &__chart-line i:nth-child(4) {
    height: 54px;
  }
  &__chart-line i:nth-child(5) {
    height: 42px;
  }
  &__chip {
    position: absolute;
    top: 22px;
    left: 22px;
    width: 20px;
    height: 20px;
    border: 2px solid #43d4d1;
    border-radius: 50%;
    box-shadow: 0 0 8px rgb(44 214 210 / 45%);
  }
  &__map {
    position: absolute;
    right: 18px;
    bottom: 13px;
    width: 190px;
    height: 122px;
    opacity: 0.17;
    background-image: radial-gradient(circle, #b9ffff 1.2px, transparent 1.6px);
    background-size: 6px 6px;
    mask-image:
      radial-gradient(ellipse at 30% 45%, #000 0 28%, transparent 55%),
      radial-gradient(ellipse at 75% 54%, #000 0 22%, transparent 53%);
  }
  &__card-shine {
    position: absolute;
    top: -70px;
    left: 80px;
    width: 65px;
    height: 360px;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 10%), transparent);
    transform: rotate(25deg);
  }
  &__card-label,
  &__card-balance,
  &__card-number {
    position: relative;
    z-index: 2;
    display: block;
    text-shadow: 0 2px 5px rgb(0 45 104 / 28%);
  }
  &__card-label {
    font-size: 15px;
    font-weight: 500;
  }
  &__card-balance {
    margin-top: 29px;
    font-family: 'Courier New', monospace;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: 3px;
  }
  &__card-number {
    margin-top: 29px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    letter-spacing: 1.7px;
  }
  &__security {
    position: absolute;
    z-index: 3;
    right: 21px;
    bottom: 17px;
    display: grid;
    width: 31px;
    height: 35px;
    place-items: center;
    color: #d9ffff;
    font-size: 18px;
    font-weight: 800;
    border: 3px solid #92f4f1;
    border-radius: 5px 5px 12px 12px;
    filter: drop-shadow(0 0 5px rgb(100 244 241 / 55%));
  }

  @include narrow {
    &__scene {
      left: 27%;
      transform: translate(-50%, -50%) scale(0.88);
    }
  }
  @include mobile {
    &__scene {
      top: 32%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.58);
    }
  }
}

@keyframes spark-breathe {
  0%,
  100% {
    opacity: 0.38;
    box-shadow: 0 0 5px 1px rgb(100 179 255 / 36%);
  }

  50% {
    opacity: 1;
    box-shadow: 0 0 13px 5px rgb(76 170 255 / 72%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-panel__spark {
    animation: none;
  }
}
</style>
