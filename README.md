# vue3-highlight-text-color

A Vue 3 component for selecting text, assigning it a colour, and restoring the
saved highlights later. Highlight positions are stored as character offsets in
the source HTML's `textContent`, so the saved data is serializable and does not
depend on the rendered highlight spans.

## Installation

```sh
pnpm add vue3-highlight-text-color
```

Vue is a peer dependency; install Vue 3 in the consuming application as usual.

## Vue 3 usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  subtractMarkerRange,
  TextHighlighter,
  type Marker,
  type MarkerRange,
  type NewMarker,
} from "vue3-highlight-text-color";
import "vue3-highlight-text-color/style.css";

const article = "<p>Select any part of this <strong>HTML text</strong>.</p>";
const highlights = ref<Marker[]>([]);

function addHighlight(highlight: NewMarker) {
  highlights.value.push({ ...highlight, id: crypto.randomUUID() });
}

function removeHighlight(range: MarkerRange) {
  highlights.value = subtractMarkerRange(highlights.value, range);
}
</script>

<template>
  <TextHighlighter
    :text="article"
    :text-id="1"
    :markers="highlights"
    :colors="['#99f6e4', '#bae6fd', '#ddd6fe']"
    @handle-new-highlight="addHighlight"
    @handle-remove-highlight="removeHighlight"
  />
</template>
```

## API

### `TextHighlighter` props

| Prop | Type | Description |
| --- | --- | --- |
| `text` | `string` | Source HTML to display and annotate. |
| `textId` | `number` | Stable identifier of this document. |
| `markers` | `readonly Marker[]` | Persisted highlights for this and other documents. |
| `colors` | `readonly string[]` | Optional CSS colours shown in the picker. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `handle-new-highlight` | `NewMarker` | Emitted after a user chooses a colour for a selection. Persist it with an `id`. |
| `handle-remove-highlight` | `MarkerRange` | Emitted for the selected range to remove. |

### Data types

```ts
type TextRange = { start: number; end: number };

type NewMarker = {
  textId: number;
  color: string;
  range: TextRange;
};

type Marker = NewMarker & { id: string | number };
type MarkerRange = Pick<NewMarker, "textId" | "range">;
```

When highlights overlap, the last matching item in `markers` has visual
priority. `subtractMarkerRange(markers, range)` returns a new marker list and
does not mutate its inputs.

## Compatibility

This package is a **Vue 3 UI component**. It requires Vue 3 and a browser DOM;
it is not directly usable as a React component or as a vanilla JavaScript
widget. React and non-Vue applications would need a framework-specific adapter
or a separate headless package. The stored `Marker` format can still be shared
between such adapters.

The package ships ESM, CommonJS, TypeScript declarations, and a separate CSS
entry point. It targets modern browsers and requires Node.js 22.13.0+ for
development and build tooling.

## Security

`text` is assigned as HTML. Sanitize untrusted content before passing it to the
component.

## Development and release checks

```sh
pnpm install
pnpm dev
pnpm check
pnpm pack:check
```

`pnpm dev` starts the playground at `http://localhost:5173`. `pnpm check` runs
type checks for the library and playground, the test suite, and the production
build. `pnpm pack:check` previews the exact npm tarball.

## Project resources

- [Live playground](https://alivadjid.github.io/text-marker-range/)
- [Contributing guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security policy](./SECURITY.md)

## License

[MIT](./LICENSE)
