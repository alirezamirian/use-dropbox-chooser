// @ts-ignore
import loadScript from 'load-script'
import { DROPBOX_SDK_URL, SCRIPT_ID } from './constants'

let scriptPromise: null | Promise<HTMLScriptElement> = null

/**
 * loads the dropbox sdk if it's not loaded yet. It's a no-op for second and later invocations.
 *
 * @param appKey: [dropbox appKey](https://www.dropbox.com/developers/apps/create)
 * @returns Promise of the dropbox script tag which is resolved when the script is added and
 * window.Dropbox is available
 */
export async function loadDropboxChooserScript(appKey: string) {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      loadScript(
        DROPBOX_SDK_URL,
        {
          attrs: {
            id: SCRIPT_ID,
            'data-app-key': appKey,
          },
        },
        (error: Error, script: HTMLScriptElement) => {
          if (error) {
            reject(error)
          } else {
            resolve(script)
          }
        },
      )
    })
  }

  return scriptPromise
}

export function isLoadingStarted() {
  return scriptPromise !== null
}
