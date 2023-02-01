<template>
  <input class="text-field" type="text" />
</template>

<style lang="scss">
.text-field {
  display: inline-block;
  background: $color-white;
  border-radius: 8px;
  border: 1px solid $color-gray-darkest;
  color: $color-black;
  padding: 16px 8px;
  outline: none;
  font-weight: bold;
  font-size: 1.05rem;

  &::placeholder {
    color: $color-gray-darkest;
  }

  &:focus {
    border: 1px solid $color-black;
  }

  &:disabled {
    opacity: 0.6;
  }

  &--error {
    border: 1px solid $color-card-red;

    &:focus {
      border: 1px solid $color-card-red;
    }
  }
}
</style>
