# Highlighting text and save range.

![package-example](https://github.com/alivadjid/text-marker-range/assets/52418132/b79fbd46-fa56-474b-8ecc-4f010a8723c5)

## Install

```
pnpm add vue3-highlight-text-color
```

## Props

| Props   | Description    |
| ------- | -------------- |
| text    | HTML string with arbitrary DOM content |
| textId  | unique text id |
| markers | saved markers  |
| colors  | optional array of CSS colors for the picker |

## Emit

| Emit               | Description |
| ------------------ | ----------- |
| handleNewHighlight    | NewMarker   |
| handleRemoveHighlight | MarkerRange, которую потребитель вычитает из своих маркеров |

## Marker format

`NewMarker` is emitted with the selected range expressed as offsets in the
source HTML's `textContent`:

```ts
type NewMarker = {
  textId: number;
  color: string;
  range: { start: number; end: number };
};

type Marker = NewMarker & { id: string | number };
type MarkerRange = Pick<NewMarker, "textId" | "range">;
```

When ranges overlap, the last marker in `markers` has visual priority over the
shared text segment. Do not pass untrusted HTML without sanitizing it first.

## Usage

```javascript
<script setup lang="ts">
  import { ref } from "vue";
  import { subtractMarkerRange, TextKey } from "vue3-highlight-text-color";

  import type {
    Marker,
    MarkerRange,
    NewMarker,
  } from "vue3-highlight-text-color";

  import "vue3-highlight-text-color/style.css";

  const storageName = "texthighlight";

  const savedMarkers = ref<Marker[]>([]);
  const colors = ["#0F766E", "#0EA5E9", "#7C3AED", "#DB2777"];

  import { loremThird } from "./fixture/index"; // any text

  function handleNewHighlight(createdRange: NewMarker) {
    savedMarkers.value = [
      ...savedMarkers.value,
      { ...createdRange, id: crypto.randomUUID() },
    ];
    setStorage(savedMarkers.value);
  }

  function handleRemoveHighlight(removedRange: MarkerRange) {
    savedMarkers.value = subtractMarkerRange(savedMarkers.value, removedRange);
    setStorage(savedMarkers.value);
  }

  function setStorage(item: Marker[]) {
    localStorage.setItem(storageName, JSON.stringify(item));
  }

  function getStorage() {
    return localStorage.getItem(storageName);
  }

  const markers = getStorage();

  if (markers) {
    savedMarkers.value = JSON.parse(markers);
  }
  </script>

  <template>
    <TextKey
      :text="loremThird"
      :textId="1"
      :markers="savedMarkers"
      :colors="colors"
      @handle-new-highlight="handleNewHighlight"
      @handle-remove-highlight="handleRemoveHighlight"
    />
  </template>
```
