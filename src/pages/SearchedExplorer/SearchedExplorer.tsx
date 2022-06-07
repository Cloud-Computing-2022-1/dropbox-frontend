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

const SearchedExplorer = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState<string | null>(null)
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
        .get("folders/search/" + query.toString())
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
    }
  }, [query])

  useEffect(refreshPath, [refreshPath])

  useInterval(refreshPath, 3000)

  return (
    <div>
      <ExplorerHeader />
      <div>Search result of '{query}'</div>
      <div className="FolderBox">
        {path.folders.map((folderMeta, i) => (
          <Link key={folderMeta + i.toString()} to={"/explorer" + folderMeta}>
            {folderMeta}
          </Link>
        ))}
      </div>
      <div className="FileBox">
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

export default SearchedExplorer
