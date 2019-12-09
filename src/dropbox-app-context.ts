import { createContext } from 'react'

export const DropboxAppContext = createContext<string | null>(null)
/**
 * A context provider for {@link UseDropboxChooserOptions.appKey}.
 */
export const DropboxAppProvider = DropboxAppContext.Provider
