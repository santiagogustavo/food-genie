<template>
  <div class="cards-table">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.cards-table {
  display: flex;

  & > .playing-card {
    margin: 16px;
  }
}
</style>
