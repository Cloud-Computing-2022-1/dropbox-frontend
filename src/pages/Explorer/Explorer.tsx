import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import ExplorerToolbar from "../../components/ExplorerToolbar/ExplorerToolbar"
import Modal from "../../components/Modal/Modal"
import { SERVER_URL } from "../../constants"
import {
  FileMeta,
  PathData,
  SearchFileRequest,
  SearchFileResponse,
  SearchFolderRequest,
  SearchFolderResponse,
} from "../../types/path"

const testPath: PathData = {
  folders: ["TestFolder1", "TestFolder2"],
  files: [
    {
      id: 53,
      title: "forestWatch.jpg",
      url: "https://dropbox-s3-jeon.s3.ap-northeast-2.amazonaws.com/0b9fac69-fb44-421a-bd9b-42758bd40b3d",
      owner: 20,
      key: "0b9fac69-fb44-421a-bd9b-42758bd40b3d",
      upload_date: "2022-06-05T01:00:46.625080",
      file_path: "/image/wallpaper/",
    },
    {
      id: 54,
      title: "forestWatch.jpg",
      url: "https://dropbox-s3-jeon.s3.ap-northeast-2.amazonaws.com/6beaa8e4-f3c7-466b-a6d0-eae0f13d40f3",
      owner: 20,
      key: "6beaa8e4-f3c7-466b-a6d0-eae0f13d40f3",
      upload_date: "2022-06-05T01:08:24.487904",
      file_path: "/image/wallpaper/",
    },
  ],
}

const Explorer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [path, setPath] = useState<PathData>({ folders: [], files: [] })
  const [fileView, setFileView] = useState<FileMeta | null>(null)

  const handleFileView = useCallback(
    (fileMeta: FileMeta) => {
      if (!fileView) {
        setFileView(fileMeta)
      }
    },
    [fileView]
  )

  const currentPath = useCallback(() => {
    // Manual parsing; /explorer/ <- 10 chars
    return location.pathname.substring(10)
  }, [location.pathname])

  const refreshPath = useCallback(() => {
    let pathData: PathData = { folders: [], files: [] }
    const reqFolder: SearchFolderRequest = { file_path: currentPath() }
    const reqFile: SearchFileRequest = { name: "", ...reqFolder }
    axios
      .post(SERVER_URL + "searchfolderpath", reqFolder)
      .then((res: AxiosResponse<SearchFolderResponse>) => {
        pathData.folders = res.data
        setPath(pathData)
      })
      .catch((err) => {
        console.log(err)
        // If current path is not exists, go to /root folder
        navigate("root", { replace: true })
      })
    axios
      .post(SERVER_URL + "search", reqFile)
      .then((res: AxiosResponse<SearchFileResponse>) => {
        pathData.files = res.data.result
        setPath(pathData)
      })
      .catch((err) => {
        console.log(err)
        // Same above
        navigate("root", { replace: true })
      })
  }, [currentPath, navigate])

  useEffect(() => {
    setPath(testPath) // FIXME: remove
    refreshPath()
  }, [refreshPath])

  return (
    <div>
      <ExplorerHeader />
      <ExplorerToolbar currentPath={currentPath()} refresher={refreshPath} />
      <div>{currentPath()}</div>
      <div className="FolderBox">
        {path.folders.map((folderMeta, i) => (
          <Link
            key={folderMeta + i.toString()}
            to={currentPath() + "/" + folderMeta}
          >
            {folderMeta} (Folder)
          </Link>
        ))}
      </div>
      <div className="FileBox">
        {path.files.map((fileMeta, i) => (
          <button
            key={fileMeta.title + i.toString()}
            onClick={() => handleFileView(fileMeta)}
          >
            {fileMeta.title} (File)
          </button>
        ))}
      </div>
      <Modal isOpened={fileView !== null} close={() => setFileView(null)}>
        <div className="FileName">{fileView?.title}</div>
        <div className="FileDate">{fileView?.upload_date}</div>
        <div className="FileUrl">{fileView?.url}</div>
      </Modal>
    </div>
  )
}

export default Explorer
