<template>
  <svg xmlns="http://www.w3.org/2000/svg" height="12px" width="56px" viewBox="0 0 1 100">
    <circle class="dot dot1" cx="-140" cy="50" r="32"></circle>
    <circle class="dot dot2" cx="0" cy="50" r="32"></circle>
    <circle class="dot dot3" cx="140" cy="50" r="32"></circle>
  </svg>
</template>
<style lang="scss" scoped>
.dot {
  fill: #fff;
  animation: loading-icon 1.2s linear infinite;
  transform-origin: center;
}

.dot2 {
  animation-delay: 0.1s;
}

.dot3 {
  animation-delay: 0.2s;
}

@keyframes loading-icon {
  0% {
    animation-timing-function: cubic-bezier(1, 0, 0.7, 1);
    opacity: 0.5;
    transform: scale(1);
  }

  40% {
    animation-timing-function: cubic-bezier(0.3, 0, 0, 1);
    opacity: 0.75;
    transform: scale(1.3);
  }
  72.5% {
    animation-timing-function: linear;
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}
</style>
