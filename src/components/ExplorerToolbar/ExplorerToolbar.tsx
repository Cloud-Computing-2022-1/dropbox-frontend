import axios, { AxiosResponse } from "axios"
import React, { useCallback, useRef, useState } from "react"
import { SERVER_URL } from "../../constants"
import { FileMeta } from "../../types/path"
import Modal from "../Modal/Modal"

interface UploadRequest {
  files: FileList
  file_path: string
}

interface UploadResponse {
  uploaded_file_list: FileMeta[]
}

interface CreateFolderRequest {
  file_path: string
  name: string
}

interface CreateFolderResponse {
  id: number
  owner: number
  tree: object
}

interface Props {
  currentPath: string
  refresher: () => void
}

const ExplorerToolbar = ({ currentPath, refresher }: Props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleChangeFolderName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFolderName(e.target.value)
    },
    []
  )

  const onClickUpload = useCallback(() => {
    if (!isUploading) {
      setIsUploading(true)
    }
  }, [isUploading])

  const onClickSubmitUpload = useCallback(() => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const req: UploadRequest = {
        files: fileInputRef.current.files,
        file_path: currentPath,
      }
      axios
        .post(SERVER_URL + "files", req)
        .then((res: AxiosResponse<UploadResponse>) => {
          if (!res.data.uploaded_file_list) {
            console.log("uploading error occurs!")
          } else {
            refresher()
            setIsUploading(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      setIsUploading(false) // FIXME: remove
    }
  }, [currentPath, refresher])

  const onClickCreateFolder = useCallback(() => {
    if (!isCreatingFolder) {
      setIsCreatingFolder(true)
    }
  }, [isCreatingFolder])

  const onClickSubmitCreate = useCallback(() => {
    if (folderName !== "") {
      const req: CreateFolderRequest = {
        file_path: currentPath,
        name: folderName,
      }
      axios
        .post(SERVER_URL + "folders", req)
        .then((res: AxiosResponse<CreateFolderResponse>) => {
          if (!res.data?.id) {
            console.log("uploading error occurs!")
          } else {
            refresher()
            setIsCreatingFolder(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      setIsCreatingFolder(false) // FIXME: remove
    }
  }, [currentPath, refresher, folderName])

  return (
    <div className="Toolbar">
      <button onClick={onClickUpload}>Upload File</button>
      <button onClick={onClickCreateFolder}>New Folder</button>
      <Modal isOpened={isUploading} close={() => setIsUploading(false)}>
        <input type="file" ref={fileInputRef} multiple />
        <button onClick={onClickSubmitUpload}>Submit</button>
      </Modal>
      <Modal
        isOpened={isCreatingFolder}
        close={() => setIsCreatingFolder(false)}
      >
        <input
          type="text"
          onChange={handleChangeFolderName}
          placeholder="New folder's name"
        />
        <button onClick={onClickSubmitCreate}>Submit</button>
      </Modal>
    </div>
  )
}

export default ExplorerToolbar
