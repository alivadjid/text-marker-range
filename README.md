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

## Emit

| Emit               | Description |
| ------------------ | ----------- |
| handleNewHighlight | NewMarker   |

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
```

When ranges overlap, the last marker in `markers` has visual priority over the
shared text segment. Do not pass untrusted HTML without sanitizing it first.

## Usage

```javascript
<script setup lang="ts">
  import { ref } from "vue";
  import { TextKey } from "vue3-highlight-text-color";

  import type { Marker, NewMarker } from "vue3-highlight-text-color";

  import "vue3-highlight-text-color/style.css";

  const storageName = "texthighlight";

  const savedMarkers = ref<Marker[]>([]);

  import { loremThird } from "./fixture/index"; // any text

  function handleNewHighlight(createdRange: NewMarker) {
    savedMarkers.value = [
      ...savedMarkers.value,
      { ...createdRange, id: crypto.randomUUID() },
    ];
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
      @handleNewHighlight="handleNewHighlight"
    />
  </template>
```
