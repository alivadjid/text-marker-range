<script setup lang="ts">
import { MARKER_COLOR_LIST } from "@/constants";

const props = withDefaults(
  defineProps<{
    colors?: readonly string[];
  }>(),
  { colors: () => MARKER_COLOR_LIST }
);

const emit = defineEmits<{
  colorChoose: [color: string];
  remove: [];
}>();
</script>

<template>
  <div :class="$style.palette" role="list" aria-label="Цвет выделения">
    <button
      v-for="color in props.colors"
      :key="color"
      type="button"
      :class="$style.colorTile"
      :style="{ backgroundColor: color }"
      :aria-label="`Выбрать цвет ${color}`"
      :title="color"
      role="listitem"
      @click="emit('colorChoose', color)"
    />
    <button
      type="button"
      :class="[$style.colorTile, $style.removeTile]"
      aria-label="Убрать выделение"
      title="Убрать выделение"
      role="listitem"
      @click="emit('remove')"
    />
  </div>
</template>

<style module lang="scss">
.palette {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.colorTile {
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
  border: 2px solid rgb(255 255 255 / 80%);
  border-radius: 50%;
  box-shadow: 0 1px 2px rgb(15 23 42 / 20%);
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.colorTile:hover {
  box-shadow: 0 3px 8px rgb(15 23 42 / 28%);
  transform: scale(1.12);
}

.colorTile:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.removeTile {
  background: linear-gradient(
    135deg,
    #fff 0 45%,
    #dc2626 45% 55%,
    #fff 55% 100%
  );
  border-color: #cbd5e1;
}
</style>
