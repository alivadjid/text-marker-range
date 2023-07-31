<template>
  <div v-for="(item, i) in MARKER_COLOR_LIST" :key="i">
    <button
      v-if="item.includes('#')"
      :style="{ backgroundColor: item }"
      :class="$style.snackbarButton"
      @click="colorChoose(item)"
    />
  </div>
</template>

<script setup lang="ts">
import { MARKER_COLOR_LIST } from "@/constants";

const { chosenTextId = null } = defineProps(["chosenTextId"]);

const emit = defineEmits(["colorChoose"]);

function colorChoose(item: string) {
  emit("colorChoose", item, chosenTextId);
}
</script>

<style module lang="scss">
.snackbarButton {
  height: 16px;

  min-width: 16px;
  padding: 0;
}
</style>
