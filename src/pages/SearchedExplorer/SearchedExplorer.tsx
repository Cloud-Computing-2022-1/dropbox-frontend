import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import FileDetail from "../../components/FileDetail/FileDetail"
import Modal from "../../components/Modal/Modal"
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
  }, [refreshPath, stringBeReplaced, stringNew, videos])

  useEffect(refreshPath, [refreshPath])

  useInterval(refreshPath, 3000)

  return (
    <div>
      <ExplorerHeader />
      <div>Search result of '{query}'</div>
      <div className="FolderBox">
        <div>Folders</div>
        {path.folders.map((folderMeta, i) => (
          <Link key={folderMeta + i.toString()} to={"/explorer" + folderMeta}>
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
      <div className="VideoBox">
        <div>Videos</div>
        <div>
          <input
            type="text"
            placeholder="String be repladced"
            value={stringBeReplaced}
            onChange={handleStringBeReplaced}
          />
          <input
            type="text"
            placeholder="New string"
            value={stringNew}
            onChange={handleStringNew}
          />
          <button onClick={onClickReplace}>Replace</button>
        </div>
        {videos.map((fileMeta, i) => (
          <button
            key={fileMeta.title + i.toString() + "video"}
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

export default SearchedExplorer
