export declare interface FileMeta {
  id: number
  title: string
  url: string
  owner: number
  key: string
  upload_date: string
  file_path: string
}

export declare type FolderMeta = string

export declare interface PathData {
  folders: FolderMeta[]
  files: FileMeta[]
}

export declare interface SearchFolderRequest {
  file_path: string
}

export declare type SearchFolderResponse = string[]

export declare interface SearchFileRequest {
  file_path: string
  name: string
}

export declare interface SearchFileResponse {
  result: FileMeta[]
}

export declare interface SearchFolderWithNameResponse {
  result: FolderMeta[]
}
