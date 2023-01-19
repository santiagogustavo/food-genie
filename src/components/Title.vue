<template>
  <h1 class="title"><slot></slot></h1>
</template>

<style lang="scss">
.title {
  font-family: 'Alice in Wonderland';
  color: $color-yellow;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  font-size: 64px;
}
</style>
