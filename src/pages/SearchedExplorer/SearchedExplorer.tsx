import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ExplorerHeader from "../../components/ExplorerHeader/ExplorerHeader"
import FileDetail from "../../components/FileDetail/FileDetail"
import Modal from "../../components/Modal/Modal"
import { SERVER_URL } from "../../constants"
import {
  FileMeta,
  PathData,
  SearchFileRequest,
  SearchFileResponse,
  SearchFolderWithNameRequest,
  SearchFolderWithNameResponse,
} from "../../types/path"

const testPath: PathData = {
  folders: ["/root/Test1/TestFolder1", "/root/Test2"],
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
      let pathData: PathData = { folders: [], files: [] }
      const reqFolder: SearchFolderWithNameRequest = { keyword: query }
      const reqFile: SearchFileRequest = { name: query, file_path: "" }
      axios
        .post(SERVER_URL + "searchfolderpath", reqFolder)
        .then((res: AxiosResponse<SearchFolderWithNameResponse>) => {
          pathData.folders = res.data.result
          setPath(pathData)
        })
        .catch((err) => {
          console.log(err)
        })
      axios
        .post(SERVER_URL + "search", reqFile)
        .then((res: AxiosResponse<SearchFileResponse>) => {
          pathData.files = res.data.result
          setPath(pathData)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [query])

  useEffect(() => {
    setPath(testPath) // FIXME: remove
    refreshPath()
  }, [refreshPath])

  return (
    <div>
      <ExplorerHeader />
      <div>Search result of '{query}'</div>
      <div className="FolderBox">
        {path.folders.map((folderMeta) => (
          <Link key={folderMeta} to={"/explorer" + folderMeta}>
            {folderMeta}
          </Link>
        ))}
      </div>
      <div className="FileBox">
        {path.files.map((fileMeta) => (
          <button key={fileMeta.title} onClick={() => handleFileView(fileMeta)}>
            {fileMeta.title}
          </button>
        ))}
      </div>
      <Modal isOpened={fileView !== null} close={() => setFileView(null)}>
        <FileDetail file={fileView} refresher={refreshPath} />
      </Modal>
    </div>
  )
}

export default SearchedExplorer
