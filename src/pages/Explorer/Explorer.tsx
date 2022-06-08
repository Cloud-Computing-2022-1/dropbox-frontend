import { Button, Card, Modal } from "antd"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import ExplorerToolbar from "../../components/ExplorerToolbar/ExplorerToolbar"
import FileDetail from "../../components/FileDetail/FileDetail"
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

    const reqFolder: SearchFolderRequest = {
      file_path: decodeURI(currentPath()),
    }
    const reqFile: SearchFileRequest = { name: "", ...reqFolder }
    axios
      .post("searchfolderpath", reqFolder)
      .then((res: AxiosResponse<SearchFolderResponse | string>) => {
        console.log(res)
        if (typeof res.data !== "string") {
          setPath((pathData) => {
            return { ...pathData, folders: res.data as SearchFolderResponse }
          })
        } else {
          setPath((pathData) => {
            return { ...pathData, folders: [] }
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
        } else {
          setPath((pathData) => {
            return { ...pathData, files: [] }
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
      <ExplorerHeader currentPath={currentPath()} />
      <ExplorerToolbar currentPath={currentPath()} refresher={refreshPath} />
      <div style={{ margin: "auto" }}>
        <div>
          <Card
            title="Folders"
            style={{ margin: "2em 0 0 0", textAlign: "start" }}
          >
            {path.folders.map((folderMeta, i) => (
              <Card.Grid
                key={folderMeta + i.toString() + currentPath()}
                style={{
                  width: `max(20%, 100%/${path.folders.length})`,
                  textAlign: "center",
                }}
              >
                <Link to={"/explorer" + currentPath() + folderMeta + "/"}>
                  <div
                    style={{
                      width: "100%",
                      margin: "auto",
                      overflow: "hidden",
                      color: "black",
                    }}
                  >
                    {folderMeta}
                  </div>
                </Link>
              </Card.Grid>
            ))}
          </Card>
        </div>
        <div>
          <Card
            title="Files"
            style={{ margin: "2em 0 0 0", textAlign: "start" }}
          >
            {path.files.map((fileMeta, i) => (
              <Card.Grid
                key={fileMeta + i.toString()}
                style={{
                  width: `max(20%, 100%/${path.files.length})`,
                  textAlign: "center",
                }}
              >
                <Button
                  key={fileMeta.title + i.toString()}
                  onClick={() => handleFileView(fileMeta)}
                  type="text"
                  style={{
                    width: "100%",
                    margin: "auto",
                    background: "transparent",
                    overflow: "hidden",
                  }}
                >
                  {fileMeta.title}
                </Button>
              </Card.Grid>
            ))}
          </Card>
        </div>
        <Modal
          title="File Detail"
          visible={fileView !== null}
          onCancel={() => setFileView(null)}
          footer={null}
        >
          <FileDetail
            file={fileView}
            close={() => setFileView(null)}
            refresher={refreshPath}
          />
        </Modal>
      </div>
    </div>
  )
}

export default Explorer
