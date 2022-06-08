import {
  DeleteOutlined,
  FolderAddOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileMeta } from "../../types/path"

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

  const onClickUpload = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isUploading && fileInputRef.current) {
        setIsUploading(true)
        fileInputRef.current.click()
        e.currentTarget.blur()
      }
    },
    [isUploading, fileInputRef]
  )

  const handleFileInput = useCallback(() => {
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
          setIsUploading(false)
        })
    }
  }, [currentPath, refresher])

  const onClickCreateFolder = useCallback(() => {
    if (!isCreatingFolder) {
      setIsCreatingFolder(true)
    }
  }, [isCreatingFolder])

  const onClickSubmitCreate = useCallback(async () => {
    if (folderName !== "") {
      const req: CreateFolderRequest = {
        file_path: currentPath,
        name: folderName,
      }
      await axios
        .post("folders", req)
        .then((res: AxiosResponse<CreateFolderResponse>) => {
          if (!res.data?.id) {
            console.log("creating error occurs!")
          } else {
            refresher()
            setFolderName("")
            setIsCreatingFolder(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      return false
    }
  }, [currentPath, refresher, folderName])

  const onClickRemoveFolder = useCallback(() => {
    if (currentPath !== "/") {
      const req: RemoveFolderRequest = { file_path: currentPath }
      axios
        .post("deletefolders", req)
        .then(() => {
          navigate(-1)
          refresher()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [currentPath, navigate, refresher])

  return (
    <div style={{ margin: "auto" }}>
      <div style={{ width: "max-content", margin: "0em 0em 0em auto" }}>
        <Button onClick={onClickUpload} icon={<UploadOutlined />}>
          Upload
        </Button>
        <Button
          onClick={onClickCreateFolder}
          icon={<FolderAddOutlined />}
          style={{ margin: "0 1.25em" }}
        >
          New Folder
        </Button>
        <Button onClick={onClickRemoveFolder} icon={<DeleteOutlined />}>
          Remove Current Folder
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          multiple
          style={{ display: "none" }}
        />
        <Modal
          title="New Folder"
          visible={isCreatingFolder}
          onOk={onClickSubmitCreate}
          onCancel={() => setIsCreatingFolder(false)}
          okText="Submit"
        >
          <Input
            type="text"
            value={folderName}
            onChange={handleChangeFolderName}
            placeholder="New folder's name"
          />
        </Modal>
      </div>
    </div>
  )
}

export default ExplorerToolbar
