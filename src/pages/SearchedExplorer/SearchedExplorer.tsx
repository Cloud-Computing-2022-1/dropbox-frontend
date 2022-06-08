import { Button, Card, Input, Modal } from "antd"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import FileDetail from "../../components/FileDetail/FileDetail"
import useInterval from "../../hooks/useInterval"
import {
  FileMeta,
  PathData,
  SearchFileRequest,
  SearchFileResponse,
  SearchFolderWithNameResponse,
} from "../../types/path"

interface ReplaceRequest {
  file_ids: number[]
  search: string
  replace: string
}

interface ReplaceResponse {
  result: FileMeta[]
}

const SearchedExplorer = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState<string | null>(null)
  const [path, setPath] = useState<PathData>({ folders: [], files: [] })
  const [videos, setVideos] = useState<FileMeta[]>([])
  const [fileView, setFileView] = useState<FileMeta | null>(null)
  const [stringBeReplaced, setStringBeReplaced] = useState("")
  const [stringNew, setStringNew] = useState("")

  const handleFileView = useCallback(
    (fileMeta: FileMeta) => {
      if (!fileView) {
        setFileView(fileMeta)
      }
    },
    [fileView]
  )

  useEffect(() => {
    let newQuery: string | null = null
    for (const entry of searchParams) {
      const [param, value] = entry
      if (param === "q") {
        newQuery = value
        break
      }
    }
    // If search query is not exists, go to /root folder
    if (newQuery === null) {
      console.log("query string is not defined.")
      navigate("/explorer/", { replace: true })
    }
    // Some logic
    setQuery(newQuery)
  }, [navigate, searchParams])

  const refreshPath = useCallback(() => {
    if (query) {
      const reqFile: SearchFileRequest = { name: query, file_path: "" }
      axios
        .get("folders/search/" + query)
        .then((res: AxiosResponse<SearchFolderWithNameResponse | string>) => {
          if (typeof res.data !== "string") {
            setPath((pathData) => {
              return {
                ...pathData,
                folders: (res.data as SearchFolderWithNameResponse).result,
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
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
        })
      axios
        .get("searchscript/" + query)
        .then((res: AxiosResponse<SearchFileResponse | string>) => {
          if (typeof res.data !== "string") {
            setVideos(res.data.result)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [query])

  const handleStringBeReplaced = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStringBeReplaced(e.target.value)
    },
    []
  )

  const handleStringNew = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStringNew(e.target.value)
    },
    []
  )

  const onClickReplace = useCallback(() => {
    const req: ReplaceRequest = {
      file_ids: videos.map((vid) => vid.id),
      search: stringBeReplaced,
      replace: stringNew,
    }
    if (req.search && req.replace) {
      axios
        .patch("batch", req)
        .then((res: AxiosResponse<ReplaceResponse>) => {
          if (res.data.result) {
            setStringBeReplaced("")
            setStringNew("")
            refreshPath()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [refreshPath, stringBeReplaced, stringNew, videos])

  useEffect(refreshPath, [refreshPath])

  useInterval(refreshPath, 3000)

  return (
    <div>
      <ExplorerHeader currentPath={query ?? ""} searched />
      <div style={{ margin: "auto" }}>
        <div>
          <Card
            title="Folders"
            style={{ margin: "2em 0 0 0", textAlign: "start" }}
          >
            {path.folders.map((folderMeta, i) => (
              <Card.Grid
                key={folderMeta + i.toString()}
                style={{
                  width: `max(20%, 100%/${path.folders.length})`,
                  textAlign: "center",
                }}
              >
                <Link to={"/explorer" + folderMeta}>
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
        <div>
          <Card
            title="Videos"
            style={{
              margin: "2em 0 0 0",
              textAlign: "start",
            }}
            extra={
              <div style={{ width: "100%", textAlign: "end" }}>
                <Input
                  type="text"
                  placeholder="String be repladced"
                  value={stringBeReplaced}
                  onChange={handleStringBeReplaced}
                  style={{ width: "38%" }}
                />
                <Input
                  type="text"
                  placeholder="New string"
                  value={stringNew}
                  onChange={handleStringNew}
                  style={{ width: "38%", margin: "0 1em" }}
                />
                <Button
                  onClick={onClickReplace}
                  style={{ width: "calc(24% - 2em)" }}
                >
                  Replace
                </Button>
              </div>
            }
          >
            {videos.map((fileMeta, i) => (
              <Card.Grid
                key={fileMeta + i.toString()}
                style={{
                  width: `max(20%, 100%/${videos.length})`,
                  textAlign: "center",
                }}
              >
                <Button
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

export default SearchedExplorer
