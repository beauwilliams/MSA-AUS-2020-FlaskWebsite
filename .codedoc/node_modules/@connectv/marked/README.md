# @connectv/marked

[![Build Status](https://badgen.net/travis/CONNECT-platform/marked?label=build&cache=300&icon=travis)](https://travis-ci.org/CONNECT-platform/marked)
[![Code Coverage](https://badgen.net/codecov/c/github/CONNECT-platform/marked?cache=300&icon=codecov)](https://codecov.io/gh/CONNECT-platform/marked)
[![NPM Version](https://badgen.net/npm/v/@connectv/marked?cache=300&icon=npm)](https://www.npmjs.com/package/@connectv/marked)
[![License](https://badgen.net/github/license/CONNECT-platform/marked?icon=github)](LICENSE)

Component-based markdown renderer for [CONNECTIVE HTML](https://github.com/CONNECT-platform/connective-html). The component-based approach allows you to provide your own custom (possibly interactive) components for the markdown conversion:

```tsx
// my-header.tsx

function MyHeader({ depth, slug }, renderer, content) {
  return <div class={'title title-' + depth} id={'header-' + slug}>{content}</div>;
}
```
```tsx
// index.tsx

import { marked } from '@connectv/marked';
import { Renderer } from '@connectv/html';

import { MyHeader } from './my-header';

const renderer = new Renderer();

renderer.render(marked('## Hellow World!', {
  Heading: MyHeader
})).on(document.body);

//
// Result:
// <div class="title title-2" id="header-hellow-world">Hellow World!</div>
//
```

## Installation

`npm i @connectv/marked`

For providing your own custom components in JSX/TSX, you need to configure your transpiler accordingly. [Here is how to do it for Typescript](https://github.com/CONNECT-platform/connective-html#for-typescript) and [here you can see how to do it for Babel](https://github.com/CONNECT-platform/connective-html#for-typescript).


## Usage

### Basic

```typescript
import { Renderer } from '@connectv/html';
import { marked } from '@connectv/marked';

const renderer = new Renderer();
const md = `
# Hellow!

So this is some markdown text with **some features** and stuff.
`;

renderer.render(marked(md)).on(document.body);
```

Server-side rendering (using [CONNECTIVE SDH](https://github.com/CONNECT-platform/connective-sdh)):

```typescript
import { compile } from '@connectv/sdh';
import { marked } from '@connectv/marked';

compile(marked(`
# Hellow Again!

Some other [markdown](https://en.wikipedia.org/wiki/Markdown) for you.
`))
.save('dist/index.html');
```

### Overriding Components

As mentioned above, the main point of this library is to provide your own custom components for generating DOM from the markdown:

```tsx
// my-code.tsx

export function MyCode({ lang }, renderer, content) {
  return <pre onclick={() => copyToClipboard(content)}>
    <code class={'code ' + lang}>{content}</code>
  </pre>;
}
```
```tsx
// index.tsx

import { marked } from '@connectv/marked';
import { Renderer } from '@connect/html';

import { MyCode } from './my-code';

const renderer = new Renderer();
const md = `
# Example Code:
\`\`\`typescript
export function something() {
  console.log('Halo!');
}
\`\`\`
`;

renderer.render(marked(md, {
  Code: MyCode
})).on(document.body);
```

The following components can be overriden, alongside the properties that the markdown parser would pass to each component:

- `Space`: used for empty spaces. No props passed to this component.
- `Hr`: used for horizontal lines (`---`). No props passed to this component.
- `Heading`: used for headings (`# Heading`). Props:
  - `depth`: depth of the heading, i.e. `# Heading 1`, `## Heading 2`, `### Heading 3`, etc.
  - `slug`: a slug associated with this heading. Can be used to set the content's id so that it is linkable.
- `Code`: used for code blocks (not inline codes). Props:
  - `lang`: the language set for this code block, e.g. \`\`\`typescript.
- `BlockQuote`: used for block quotes `> something`. No props passed to this component.
- `List`: used for lists. Props:
  - `ordered`: whether the list is ordered or unordered.
- `ListItem`: used for items of a list. No props passed to this component.
- `Html`: used for inline HTML code. Props:
  - `content`: the string representation of the HTML code.
- `Paragraph`: used for plain text. No props passed to this component.
- `Table`: used for tables. Props:
  - `header`: HTML element representing the header of the table.
  - `body`: HTML element representing body of the table.
- `TableRow`: used for each row of a table. No props passed to this component.
- `TableCell`: used for body cells of a table (not header cells). Props:
  - `align`: the alignment of the cell.
- `TableHeaderCell`: used for header cells of a table (not body cells). Props:
  - `align`: the alignment of the cell.
- `Link`: used for links, e.g. `[content](href "title")`. Props:
  - `href`: the URL of the link
  - `title`: the "title" attribute of the link
- `Em`: used for emphasized text, e.g. `_hellow_`. No props passed to this component.
- `Strong`: used for strong text, e.g. `**hellow**`. No props passed to this component.
- `Del`: used for deleted text, e.g. `~~hellow~~`. No props passed to this component.
- `Image`: used for images, e.g. `![alt](src)`. Props:
  - `alt`: the alt text passed for the image,
  - `src`: the source URL of the image.
- `CodeSpan`: used for inline code-spans, e.g. <code>\`content\`</code>. No props passed to this component.
- `Text`: used for normal text. No props passed to this component.
  
### Custom Quoted Components

You can also use custom components (i.e. components that represent custom structural elements):

```tsx
// tabs.tsx

export function Tabs(_, renderer, content) {
  return <div class="tabs">{content}</div>;
}

export function Tab({ name, default }, renderer, content) {
  return <div class="tab" data-tab-name={name} data-default-tab={default==='true'}>{content}</div>;
}
```
```tsx
// index.tsx

import { compile } from '@connectv/sdh';
import { marked, quotedComponents } from '@connectv/marked';

import { Tabs, Tab } from './tabs';

const markdown = `
# Some markdown content

> :Tabs
> > :Tab name=first tab, default=true
> >
> > content of the first tab
>
> > :Tab name=second tab
> >
> > content of the second tab
`

compile(marked(markdown, {
  BlockQuote: quotedComponents({ Tabs, Tab })
}))
.save('dist/index.html');
```
Result (`dist/index.html`):
```html
<html>
  <head></head>
  <body>
    <h1 id="some-markdown-content">Some markdown content</h1>
    <div class="tabs">
      <div class="tab" data-tab-name="first tab" data-default-tab>
        <p>content of the first tab</p>
      </div>
      <div class="tab" data-tab-name="second tab">
        <p>content of the second tab</p>
      </div>
    </div>
  </body>
</html>
```

The `quotedComponents()` method basically provides an override for `BlockQuote`. It will look at each block-quote and check if the first line starts with `:`, in that case it will find corresponding component from given map, parse its props, and pass the rest of the content of the block-quote as the component's content.

### Custom Linked Components

Similar to custom quoted components, you can utilize custom linked components for custom structural elements that
are inline (i.e. appear within other text):

```tsx
// tag.tsx

export function Tag(_, renderer, content) {
  return <span class="tag">#{content}</div>;
}
```
```tsx
// index.tsx

import { compile } from '@connectv/sdh';
import { marked, linkedComponents } from '@connectv/marked';

import { Tag } from './tag';

const markdown = `
# Some markdown content

Hellow [world](:Tag)
`

compile(marked(markdown, {
  Link: linkedComponents({ Tag })
}))
.save('dist/index.html');
```
Result (`dist/index.html`):
```html
<html>
  <head></head>
  <body>
    <h1 id="some-markdown-content">Some markdown content</h1>
    <p>
      Hellow <span class="tag">#world</span>
    </p>
  </body>
</html>
```

### Markdown Features

[marked](https://marked.js.org/#/README.md#README.md) is used under the hood, so all features supported by marked are supported here.

