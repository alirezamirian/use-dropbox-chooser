import { useContext, useEffect, useState } from 'react'
import { DropboxAppContext } from './dropbox-app-context'
import { loadDropboxChooserScript } from './load-dropbox-chooser-script'
import { UseDropboxChooserOptions } from './types'

export function useDropboxChooser({
  lazy,
  appKey: appKeyFromOptions,
  chooserOptions = {},
  onSelected,
  onCanceled = () => {},
}: UseDropboxChooserOptions) {
  const [opening, setOpening] = useState(false)
  const appKeyFromContext = useContext(DropboxAppContext)

  const appKey = appKeyFromOptions || appKeyFromContext

  if (!appKey) {
    console.error(
      new Error(
        'Dropbox app key is not provided. Please pass it to useDropboxChooser or provider it with DropboxAppProvider.',
      ),
    )
  }

  useEffect(() => {
    if (!lazy && appKey) {
      // noinspection JSIgnoredPromiseFromCall
      loadDropboxChooserScript(appKey)
    }
  }, [lazy])

  let open = async () => {
    if (opening) {
      return
    }

    setOpening(true)

    // This is a no-op if it's already loaded. So no need to wrap it in
    // an if statement
    if (appKey) {
      await loadDropboxChooserScript(appKey)
    }

    if (window.Dropbox) {
      window.Dropbox.choose({
        success: files => {
          setOpening(false)
          onSelected(files)
        },
        cancel: () => {
          setOpening(false)
          onCanceled()
        },
        ...chooserOptions,
      })
    }
  }

  return [open, opening]
}
