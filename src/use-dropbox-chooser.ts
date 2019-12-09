import { useContext, useEffect, useState } from 'react'
import { DropboxAppContext } from './dropbox-app-context'
import { isLoadingStarted, loadDropboxChooserScript } from './load-dropbox-chooser-script'
import { UseDropboxChooserOptions } from './types'

export function useDropboxChooser({
  lazy,
  appKey: appKeyFromOptions,
  chooserOptions = {},
  onSelected = () => {},
  onCanceled = () => {},
}: UseDropboxChooserOptions) {
  const [isOpen, setOpen] = useState(false)
  const appKeyFromContext = useContext(DropboxAppContext)

  const appKey = appKeyFromOptions || appKeyFromContext

  useEffect(() => {
    if (!lazy && appKey) {
      // noinspection JSIgnoredPromiseFromCall
      loadDropboxChooserScript(appKey)
    }
    if (!isLoadingStarted() && !appKey) {
      logError()
    }
  }, [lazy, appKey])

  // useCallback is a choice here
  const open = async (): Promise<ReadonlyArray<Dropbox.ChooserFile>> => {
    if (isOpen) {
      return Promise.reject('Already opened')
    }

    setOpen(true)

    // This is a no-op if it's already loaded. So no need to wrap it in
    // an if statement
    if (appKey) {
      await loadDropboxChooserScript(appKey)
    } else {
      logError()
    }

    if (window.Dropbox) {
      return new Promise((resolve, reject) => {
        window.Dropbox!.choose({
          success: files => {
            setOpen(false)
            onSelected(files)
            resolve(files)
          },
          cancel: () => {
            setOpen(false)
            onCanceled()
            reject()
          },
          ...chooserOptions,
        })
      })
    }
    return Promise.reject("window.Dropbox doesn't exist for some reason!")
  }

  return {
    open,
    isOpen,
  }
}

function logError() {
  console.error(
    new Error(
      'Dropbox app key is not provided. Please pass it to useDropboxChooser or provider it with DropboxAppProvider.',
    ),
  )
}
