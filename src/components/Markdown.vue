<template>
  <div class="markdown" v-html="DOMPurify.sanitize(compiledMarkdown)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});

const compiledMarkdown = computed(() => marked(props.value));
</script>
