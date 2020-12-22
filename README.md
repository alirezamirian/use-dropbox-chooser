# use-dropbox-chooser

[![NPM version](https://badgen.net/npm/v/use-dropbox-chooser)](https://npmjs.com/package/use-dropbox-chooser)
[![NPM downloads](https://badgen.net/npm/dm/use-dropbox-chooser)](https://npmjs.com/package/use-dropbox-chooser)

react hook for dropbox file chooser

## Install

with yarn:

```bash
yarn add use-dropbox-chooser
```

with npm:

```bash
npm i use-dropbox-chooser
```

## Usage

```typescript jsx
import { useDropboxChooser } from 'use-dropbox-chooser'

function YourComponent() {
  const { open, isOpen } = useDropboxChooser({
    appKey: 'YOUR_DROPBOX_APP_KEY',
    chooserOptions: { multiple: true, linkType: 'direct' },
    onSelected: files => {
      console.log(files)
    },
  })

  return (
    <button onClick={open} disabled={isOpen}>
      Choose from Dropbox
    </button>
  )
}
```

OR:

```typescript jsx
import { useDropboxChooser } from 'use-dropbox-chooser'

function YourComponent() {
  const { open, isOpen } = useDropboxChooser({
    appKey: 'YOUR_DROPBOX_APP_KEY',
    chooserOptions: { multiple: true, linkType: 'direct' },
  })

  return (
    <button
      onClick={async () => {
        try {
          const files = await open()
          console.log(files)
        } catch (e) {
          // if closed: e === undefined
        }
      }}
      disabled={isOpen}
    >
      Choose from Dropbox
    </button>
  )
}
```

You can also use `DropboxAppProvider` to avoid passing `appKey` on each usage:

```typescript jsx
import { useDropboxChooser } from 'use-dropbox-chooser'

function AppComponent() {

  return (
    <DropboxAppProvider value="YOUR_DROPBOX_APP_KEY">
      <YourComponent />
    </DropboxAppProvider>
  )
}

function YourComponent() {
  const { open, isOpen } = useDropboxChooser({
    // no need for `appKey`.
    chooserOptions: { multiple: true, linkType: 'direct' },
  })

  // ... similar to other examples
}
```
