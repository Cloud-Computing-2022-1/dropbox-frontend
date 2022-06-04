import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Modal from "../../components/Modal/Modal"
import { FileMeta, PathData } from "../../types/path"

const testPath: PathData = {
  folders: [
    { name: "TestFolder1", path: "root/Test1" },
    { name: "TestFolder2", path: "root" },
  ],
  files: [
    {
      name: "TestFile1",
      type: "Binary",
      lastModified: "2022-06-04",
      tag: "null",
    },
    {
      name: "TestFile2",
      type: "Binary",
      lastModified: "2022-06-04",
      tag: "blue",
    },
  ],
}

const SearchedExplorer = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState<string | null>(null)
  const [path, setPath] = useState<PathData>({ folders: [], files: [] })
  const [fileView, setFileView] = useState<FileMeta | null>(null)

  console.log(query)

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
      navigate("/explorer/root", { replace: true })
    }
    // Some logic
    setPath(testPath)
    setQuery(newQuery)
  }, [navigate, searchParams])

  return (
    <div>
      <header>Header (SearchBar, Userinfo, etc...)</header>
      <div>Search result of '{query}'</div>
      <div className="FolderBox">
        {path.folders.map((folderMeta) => (
          <Link
            key={folderMeta.name}
            to={"/explorer/" + folderMeta.path! + folderMeta.name}
          >
            {folderMeta.name} (Folder)
          </Link>
        ))}
      </div>
      <div className="FileBox">
        {path.files.map((fileMeta) => (
          <button key={fileMeta.name} onClick={() => handleFileView(fileMeta)}>
            {fileMeta.name} (File)
          </button>
        ))}
      </div>
      <Modal isOpened={fileView !== null} close={() => setFileView(null)}>
        <div className="FileName">{fileView?.name}</div>
        <div className="FileDate">{fileView?.lastModified}</div>
        <div className="FileType">{fileView?.type}</div>
        <div className="FileTag">{fileView?.tag}</div>
      </Modal>
    </div>
  )
}

export default SearchedExplorer
