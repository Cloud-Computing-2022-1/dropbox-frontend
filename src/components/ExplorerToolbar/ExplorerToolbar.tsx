import axios, { AxiosResponse } from "axios"
import React, { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileMeta } from "../../types/path"
import Modal from "../Modal/Modal"

type UploadRequest = FormData

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

interface RemoveFolderRequest {
  file_path: string
}

interface Props {
  currentPath: string
  refresher: () => void
}

const ExplorerToolbar = ({ currentPath, refresher }: Props) => {
  const navigate = useNavigate()
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
      const req: UploadRequest = new FormData()
      for (let i = 0; i < fileInputRef.current.files.length; i += 1) {
        req.append("files", fileInputRef.current.files[i])
      }
      req.append("file_path", currentPath)
      axios
        .post("files", req, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse<UploadResponse>) => {
          if (
            !res.data.uploaded_file_list ||
            res.data.uploaded_file_list.length === 0
          ) {
            console.log("uploading error occurs!")
          } else {
            refresher()
            setIsUploading(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
        .post("folders", req)
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
    }
  }, [currentPath, refresher, folderName])

  const onClickRemoveFolder = useCallback(() => {
    if (currentPath !== "/") {
      const req: RemoveFolderRequest = { file_path: currentPath }
      axios
        .post("deletefolders", req)
        .then(() => {
          navigate(-1)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [currentPath, navigate])

  return (
    <div className="Toolbar">
      <button onClick={onClickUpload}>Upload File</button>
      <button onClick={onClickCreateFolder}>New Folder</button>
      <button onClick={onClickRemoveFolder}>Remove Current Folder</button>
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
