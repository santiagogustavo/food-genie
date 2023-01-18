<template>
  <div class="cards-table">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.cards-table {
  position: relative;
  height: $cards-height;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transform-origin: bottom center;
  transform: rotateX(15deg);

  & > .playing-card {
    margin: 16px;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
