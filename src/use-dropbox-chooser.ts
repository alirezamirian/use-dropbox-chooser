import { useContext, useEffect, useState } from 'react'
import { DropboxAppContext } from './dropbox-app-context'
import { isLoadingStarted, loadDropboxChooserScript } from './load-dropbox-chooser-script'

export interface UseDropboxChooserOptions {
  /**
   * if passed, will be called with the selected files whenever files are selected.
   * You can also use the promise which is returned from the `open` function.
   * @param files
   */
  onSelected?: (files: ReadonlyArray<Dropbox.ChooserFile>) => void
  onCanceled?: () => void
  /**
   * if true, will not load dropbox script until `open` function is called.
   * otherwise, it will load the script (if not loaded yet) as a side effect
   * of first invocation. If lazy is changed to false across renders,
   * it will immediately load the script.
   */
  lazy?: boolean

  /**
   * Dropbox app key to be used in the script tag which loads dropbox chooser.
   * Note that it's not supposed to have different values in different usages
   * as there will be one global script for dropbox chooser.
   * App key can either be provided by this prop or by
   * {@link DropboxAppProvider}. That's why it's optional
   */
  appKey?: string

  chooserOptions?: Omit<Dropbox.ChooserOptions, 'cancel' | 'success'>
}

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

export default useDropboxChooser

function logError() {
  console.error(
    new Error(
      'Dropbox app key is not provided. Please pass it to useDropboxChooser or provider it with DropboxAppProvider.',
    ),
  )
}
