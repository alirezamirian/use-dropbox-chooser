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

  chooserOptions?: Pick<Dropbox.ChooserOptions, 'linkType' | 'multiselect' | 'extensions'>
}
