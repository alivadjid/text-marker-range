<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";

import { renderMarkers } from "../core/highlight";
import type { Marker } from "../interface";

const props = withDefaults(
  defineProps<{
    text: string;
    textId: number;
    markers?: readonly Marker[];
  }>(),
  { markers: () => [] }
);

const element = ref<HTMLElement>();

async function render() {
  await nextTick();
  if (!element.value) return;
  renderMarkers(element.value, props.text, props.markers, props.textId);
}

onMounted(render);
watch(() => [props.text, props.markers] as const, render, { deep: true });

defineExpose({ element });
</script>

<template>
  <div ref="element"></div>
</template>

<style></style>
