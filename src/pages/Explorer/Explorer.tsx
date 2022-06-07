import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import ExplorerToolbar from "../../components/ExplorerToolbar/ExplorerToolbar"
import FileDetail from "../../components/FileDetail/FileDetail"
import Modal from "../../components/Modal/Modal"
import useInterval from "../../hooks/useInterval"
import {
  FileMeta,
  PathData,
  SearchFileRequest,
  SearchFileResponse,
  SearchFolderRequest,
  SearchFolderResponse,
} from "../../types/path"

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
    // Manual parsing; /explorer <- 9 chars
    return location.pathname.substring(9)
  }, [location.pathname])

  const refreshPath = useCallback(() => {
    // Check if the path url is valid first
    if (
      !currentPath() ||
      currentPath()[0] !== "/" ||
      currentPath()[currentPath().length - 1] !== "/"
    ) {
      navigate("/explorer/", { replace: true })
      return
    }

    const reqFolder: SearchFolderRequest = { file_path: currentPath() }
    const reqFile: SearchFileRequest = { name: "", ...reqFolder }
    axios
      .post("searchfolderpath", reqFolder)
      .then((res: AxiosResponse<SearchFolderResponse | string>) => {
        if (typeof res.data !== "string") {
          setPath((pathData) => {
            return { ...pathData, folders: res.data as SearchFolderResponse }
          })
        }
      })
      .catch((err) => {
        console.log(err)
        // If current path is not exists, go to /root folder
        navigate("/explorer/", { replace: true })
      })
    axios
      .post("search", reqFile)
      .then((res: AxiosResponse<SearchFileResponse | string>) => {
        if (typeof res.data !== "string") {
          setPath((pathData) => {
            return {
              ...pathData,
              files: (res.data as SearchFileResponse).result,
            }
          })
        }
      })
      .catch((err) => {
        console.log(err)
        // Same above
        navigate("/explorer/", { replace: true })
      })
  }, [currentPath, navigate])

  useEffect(refreshPath, [refreshPath])

  useInterval(refreshPath, 3000)

  return (
    <div>
      <ExplorerHeader />
      <ExplorerToolbar currentPath={currentPath()} refresher={refreshPath} />
      <div>{currentPath()}</div>
      <div className="FolderBox">
        <div>Folders</div>
        {path.folders.map((folderMeta, i) => (
          <Link
            key={folderMeta + i.toString()}
            to={"/explorer" + currentPath() + folderMeta + "/"}
          >
            {folderMeta}
          </Link>
        ))}
      </div>
      <div className="FileBox">
        <div>Files</div>
        {path.files.map((fileMeta, i) => (
          <button
            key={fileMeta.title + i.toString()}
            onClick={() => handleFileView(fileMeta)}
          >
            {fileMeta.title}
          </button>
        ))}
      </div>
      <Modal isOpened={fileView !== null} close={() => setFileView(null)}>
        <FileDetail
          file={fileView}
          close={() => setFileView(null)}
          refresher={refreshPath}
        />
      </Modal>
    </div>
  )
}

export default Explorer
