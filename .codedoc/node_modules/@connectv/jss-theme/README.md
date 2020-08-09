# JSS Themes for CONNECTIVE HTML
Static themes for [CONNECTIVE HTML](https://github.com/CONNECT-platform/connective-html)-based frontends using [JSS](https://cssinjs.org/?v=v10.1.1).

## Installation

```
npm i @connectv/jss-theme
```

## Usage

### Client Side

```tsx
// index.tsx
import { theme } from '@connectv/jss-theme';
import { Renderer } from '@connectv/html';

import { MyComp, MyCompStyle } from './component';


const DarkTheme = theme({                          // --> define your theme
  bgcolor: 'black',
  textcolor: 'red'
});

const renderer = new Renderer().plug(DarkTheme);   // --> plug the theme into your renderer
renderer.render(<MyComp/>).on(document.body);      // --> render your content
```
In your component code:
```tsx
// component.tsx
import { themedStyle } from '@connectv/jss-theme';

export const MyCompStyle = themedStyle(theme => ({ // --> define your theme-based style
  div: {
    background: theme.bgcolor,
    color: theme.textcolor,
    padding: '8px',
    'border-radius': '3px'
  }
}));

export function MyComp(_, renderer) {
  const classes = this.theme.classes(MyCompStyle); // --> get the css classes for your style from the theme
  return <div class={classes.div}>Halo!</div>      // --> use those classes
}
```
[► TRY IT!](https://stackblitz.com/edit/connective-html-jss-theme?file=index.tsx)

In your component, you can also use `this.theme.styled()` rendering plugin to automatically
style any rendered element with css classes with the same tag name:

```component.tsx
...

export function MyComp(_, renderer) {
  renderer = renderer.plug(this.theme.styled(MyCompStyle)); // --> plug the auto-style plugin
  return <div>Halo!</div>                                   // --> class 'div' applied to <div>s automatically!
}
```

### Server Side

```tsx
// index.tsx
import { theme } from '@connectv/jss-theme';
import { compile } from '@connectv/sdh';

import { MyComp } from './component';


const DarkTheme = theme({                          // --> define your theme
  bgcolor: 'black',
  textcolor: 'red'
});

compile(renderer => <MyComp/>, DarkTheme)          // --> tell `compile()` to plug your theme
.save('dist/index.html');
```
[► TRY IT!](https://codesandbox.io/s/connective-jss-theme-example-n7znj)

### Prefetching Component Styles

In the client-side example, a particular style is attached to the document the first time it is requested by a component.
This can have performance implications since in the middle of your app running a never-rendered-before component might
cause a large stylesheet to be attached to the document. To avoid this situation, you can simply fetch all your styles and add them to your theme before hand so when the component requests the styles, the stylesheet is already attached to the document:

```tsx
// index.tsx
import { theme } from '@connectv/jss-theme';
import { MyCompStyle } from './component';

...

DarkTheme.add(MyCompStyle);   // --> ensure that the stylesheet is attached

...
```

### Strict Typing

You can also specify the type of the theme object that is to be passed around and/or to be expected by components:

```tsx
// theme.type.ts

export interface Theme {
  bgcolor: string;
  textcolor: string;
}
```
```tsx
// index.tsx
import { theme } from '@connectv/jss-theme';
import { Theme } from './theme.type';

const DarkTheme = theme<Theme>({
  bgcolor: 'black',
  textcolor: 'red',
});

...
```
```tsx
// component.tsx
import { Theme } from './theme.type';
import { themedStyle, ThemedComponentThis } from '@connectv/jss-theme';

export const MyCompStyle = themedStyle<Theme>(theme => ({
  ...
}));

export function MyComp(this: ThemedComponentThis<Theme>, _, renderer) {
  ...
}
```
