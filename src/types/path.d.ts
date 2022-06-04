export declare interface FileMeta {
  name: string
  type: string
  lastModified: string
  tag: string
}

export declare interface FolderMeta {
  name: string
  path?: string
}

export declare interface PathData {
  folders: FolderMeta[]
  files: FileMeta[]
}
