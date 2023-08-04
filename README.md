# Highlighting text and save range.

| Props   | Description    |
| ------- | -------------- |
| text    | any text       |
| textId  | unique text id |
| markers | saved markers  |

| Emit               | Description |
| ------------------ | ----------- |
| handleNewHighlight | NewMarker   |

## Usage

```javascript
<script setup lang="ts">
  import { ref } from "vue";
  import { TextKey } from "text-marker-range";

  import type { NewMarker } from "text-marker-range";

  import "text-marker-range/style.css";

  const storageName = "texthighlight";

  type savedHighlight = Required<NewMarker>;
  const savedMarkers = ref<savedHighlight[]>([]);

  import { loremThird } from "./fixture/index"; // any text

  function handleNewHighlight(createdRange: NewMarker) {
    const markers = getStorage();

    if (markers) {
      const parseHighlights = JSON.parse(markers);
      parseHighlights.push({ ...createdRange, id: Date.now() });
      setStorage(parseHighlights);
    } else {
      setStorage([{ ...createdRange, id: Date.now() }]);
    }
  }

  function setStorage(item: NewMarker[]) {
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
