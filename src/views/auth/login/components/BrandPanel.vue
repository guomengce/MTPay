<template>
  <section class="brand-panel" aria-hidden="true">
    <div class="brand-panel__scene">
      <img
        class="brand-panel__globe-photo"
        src="/assets/login-globe-transparent.png?v=3"
        alt=""
        draggable="false"
      />
      <svg class="brand-panel__illustration" viewBox="0 0 660 560" role="presentation">
        <defs>
          <linearGradient id="platformBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e8fbff" stop-opacity="0.9" />
            <stop offset="56%" stop-color="#88c9ff" stop-opacity="0.72" />
            <stop offset="100%" stop-color="#4c99f0" stop-opacity="0.42" />
          </linearGradient>
          <linearGradient id="platformTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.94" />
            <stop offset="100%" stop-color="#a9ddff" stop-opacity="0.72" />
          </linearGradient>
          <linearGradient id="routeMain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#dfffff" stop-opacity="0.08" />
            <stop offset="38%" stop-color="#ffffff" stop-opacity="0.95" />
            <stop offset="62%" stop-color="#4ff0df" stop-opacity="0.96" />
            <stop offset="100%" stop-color="#3574e6" stop-opacity="0.82" />
          </linearGradient>
          <linearGradient id="routeSoft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#43d9f4" stop-opacity="0.12" />
            <stop offset="54%" stop-color="#52e8df" stop-opacity="0.44" />
            <stop offset="100%" stop-color="#3675e5" stop-opacity="0.68" />
          </linearGradient>
          <linearGradient id="coinCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6ff5e6" />
            <stop offset="100%" stop-color="#079aad" />
          </linearGradient>
          <linearGradient id="coinBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#77c4ff" />
            <stop offset="100%" stop-color="#386de1" />
          </linearGradient>
          <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="coinShadow" x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="7"
              flood-color="#1a79cb"
              flood-opacity="0.28"
            />
          </filter>
        </defs>
        <ellipse class="brand-panel__platform-shadow" cx="308" cy="489" rx="188" ry="35" />
        <ellipse
          class="brand-panel__platform brand-panel__platform--bottom"
          cx="308"
          cy="472"
          rx="166"
          ry="33"
        />
        <ellipse
          class="brand-panel__platform brand-panel__platform--middle"
          cx="308"
          cy="449"
          rx="134"
          ry="24"
        />
        <ellipse
          class="brand-panel__platform brand-panel__platform--top"
          cx="308"
          cy="431"
          rx="104"
          ry="17"
        />

        <ellipse
          class="brand-panel__orbit brand-panel__orbit--outer"
          cx="308"
          cy="260"
          rx="312"
          ry="188"
        />
        <ellipse
          class="brand-panel__orbit brand-panel__orbit--vertical"
          cx="308"
          cy="260"
          rx="184"
          ry="306"
        />
        <ellipse
          class="brand-panel__orbit brand-panel__orbit--wide"
          cx="308"
          cy="260"
          rx="294"
          ry="102"
        />
        <ellipse
          class="brand-panel__route brand-panel__route--ring-base"
          cx="326"
          cy="286"
          rx="248"
          ry="76"
          transform="rotate(-15 326 286)"
        />
        <ellipse
          class="brand-panel__route brand-panel__route--ring-front"
          cx="326"
          cy="286"
          rx="248"
          ry="76"
          transform="rotate(-15 326 286)"
        />
        <circle class="brand-panel__node brand-panel__node--hub" cx="304" cy="255" r="12" />

        <circle class="brand-panel__node brand-panel__node--small" cx="180" cy="360" r="10" />
        <circle class="brand-panel__node brand-panel__node--small" cx="185" cy="170" r="10" />
        <circle class="brand-panel__node brand-panel__node--tiny" cx="438" cy="104" r="8" />
        <circle class="brand-panel__node brand-panel__node--tiny" cx="560" cy="286" r="8" />
        <circle class="brand-panel__node brand-panel__node--tiny" cx="95" cy="228" r="7" />
        <circle class="brand-panel__node brand-panel__node--pale" cx="70" cy="305" r="9" />
        <circle class="brand-panel__node brand-panel__node--pale" cx="96" cy="430" r="12" />

        <g class="brand-panel__coin brand-panel__coin--dollar" transform="translate(148 86)">
          <circle r="32" fill="url(#coinCyan)" />
          <circle r="31" class="brand-panel__coin-rim" />
          <text>$</text>
        </g>
        <g class="brand-panel__coin brand-panel__coin--euro" transform="translate(525 213)">
          <circle r="34" fill="url(#coinBlue)" />
          <circle r="33" class="brand-panel__coin-rim" />
          <text>€</text>
        </g>
        <g class="brand-panel__coin brand-panel__coin--yuan" transform="translate(104 328)">
          <circle r="30" fill="url(#coinBlue)" />
          <circle r="29" class="brand-panel__coin-rim" />
          <text>¥</text>
        </g>
        <g class="brand-panel__coin brand-panel__coin--pound" transform="translate(486 407)">
          <circle r="32" fill="url(#coinCyan)" />
          <circle r="31" class="brand-panel__coin-rim" />
          <text>£</text>
        </g>
      </svg>
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
    radial-gradient(circle at 22% 36%, rgb(255 255 255 / 40%) 0 8%, transparent 34%),
    radial-gradient(circle at 18% 74%, rgb(111 207 255 / 34%), transparent 31%),
    radial-gradient(circle at 64% 18%, rgb(177 222 255 / 48%), transparent 42%),
    linear-gradient(135deg, #f2fbff 0%, #e7f5ff 48%, #dff1ff 100%);

  &::before,
  &::after {
    position: absolute;
    inset: 0;
    content: '';
  }

  &::before {
    opacity: 0.38;
    background-image: radial-gradient(circle, rgb(66 169 221 / 16%) 1px, transparent 1.5px);
    background-size: 22px 22px;
    mask-image: radial-gradient(ellipse at 31% 49%, #000 8%, transparent 64%);
  }

  &::after {
    background: linear-gradient(
      90deg,
      rgb(255 255 255 / 0%) 0%,
      rgb(255 255 255 / 7%) 56%,
      rgb(255 255 255 / 74%) 84%,
      #fff 100%
    );
  }

  &__scene {
    position: absolute;
    top: 52%;
    left: 29%;
    width: 660px;
    height: 560px;
    transform: translate(-50%, -50%);
  }

  &__globe-photo {
    position: absolute;
    z-index: 2;
    top: 72px;
    left: 126px;
    display: block;
    width: 364px;
    height: 364px;
    user-select: none;
    filter: drop-shadow(0 20px 22px rgb(30 121 204 / 18%));
  }

  &__illustration {
    position: absolute;
    inset: 0;
    z-index: 3;
    overflow: visible;
  }

  &__orbit {
    fill: none;
    stroke: rgb(45 158 214 / 38%);
    stroke-dasharray: 5 6;
    stroke-width: 1.15;
    transform-box: fill-box;
    transform-origin: center;
  }

  &__orbit--outer {
    transform: rotate(-15deg);
  }

  &__orbit--vertical {
    stroke: rgb(30 186 190 / 32%);
    transform: rotate(18deg);
  }

  &__orbit--wide {
    stroke: rgb(39 147 220 / 32%);
    transform: rotate(25deg);
  }

  &__platform-shadow {
    fill: rgb(79 151 224 / 21%);
    filter: url('#softGlow');
  }

  &__platform {
    stroke: rgb(255 255 255 / 84%);
    stroke-width: 1.2;
  }

  &__platform--bottom {
    fill: url('#platformBottom');
  }

  &__platform--middle {
    fill: rgb(154 207 255 / 76%);
  }

  &__platform--top {
    fill: url('#platformTop');
  }
  &__route {
    fill: none;
    stroke-linecap: round;
  }

  &__route--ring-base {
    stroke: url('#routeSoft');
    stroke-width: 2.2;
    opacity: 0.58;
    filter: url('#softGlow');
  }

  &__route--ring-front {
    stroke: url('#routeMain');
    stroke-dasharray: 330 1228;
    stroke-dashoffset: 735;
    stroke-width: 3.6;
    filter: url('#softGlow');
  }

  &__node {
    fill: #5ce5d9;
    stroke: rgb(222 252 255 / 88%);
    stroke-width: 2;
    filter: url('#softGlow');
  }

  &__node--hub {
    fill: #5ee7da;
    stroke-width: 2.4;
  }

  &__node--small {
    fill: #28d7ce;
  }

  &__node--tiny {
    fill: #5caeff;
    opacity: 0.9;
  }

  &__node--pale {
    fill: rgb(218 250 255 / 78%);
    stroke: rgb(255 255 255 / 86%);
    opacity: 0.82;
  }

  &__coin {
    filter: url('#coinShadow');

    text {
      fill: #fff;
      font-size: 32px;
      font-weight: 800;
      text-anchor: middle;
      dominant-baseline: central;
      alignment-baseline: central;
    }
  }

  &__coin-rim {
    fill: none;
    stroke: rgb(255 255 255 / 86%);
    stroke-width: 2;
  }

  @include narrow {
    &__scene {
      left: 28%;
      transform: translate(-50%, -50%) scale(0.92);
    }
  }

  @include mobile {
    &__scene {
      top: 32%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.58);
    }

    &::after {
      background: linear-gradient(180deg, rgb(255 255 255 / 0%), #fff 78%);
    }
  }
}
</style>
