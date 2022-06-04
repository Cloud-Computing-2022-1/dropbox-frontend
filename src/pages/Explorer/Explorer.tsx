import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Modal from "../../components/Modal/Modal"
import { FileMeta, FolderName } from "../../types/File.d"

interface Path {
  folders: FolderName[]
  files: FileMeta[]
}

const testPath: Path = {
  folders: ["TestFolder1", "TestFolder2"],
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

const Explorer = () => {
  const location = useLocation()
  const [path, setPath] = useState<Path>({ folders: [], files: [] })
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

  useEffect(() => {
    setPath(testPath)
    // If current path is not exists, go to /root folder
  }, [currentPath])

  return (
    <div>
      <header>Header (SearchBar, Userinfo, etc...)</header>
      <div>{currentPath()}</div>
      <div className="FolderBox">
        {path.folders.map((folderName, i) => (
          <Link key={folderName} to={currentPath() + "/" + folderName}>
            {folderName} (Folder)
          </Link>
        ))}
      </div>
      <div className="FileBox">
        {path.files.map((fileMeta, i) => (
          <button
            key={currentPath() + "/" + fileMeta.name}
            onClick={() => handleFileView(fileMeta)}
          >
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

export default Explorer
