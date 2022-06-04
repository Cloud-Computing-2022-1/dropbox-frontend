import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

type File = string
type Folder = string

interface Path {
  folders: Folder[]
  files: File[]
}

const testPath: Path = {
  folders: ["TestFolder1", "TestFolder2"],
  files: ["TestFile1", "TestFile2"],
}

const Explorer = () => {
  const location = useLocation()
  const [path, setPath] = useState<Path>({ folders: [], files: [] })

  const currentPath = useCallback(() => {
    // Manual parsing; /explorer/ <- 9 chars
    return location.pathname.substring(10)
  }, [location.pathname])

  useEffect(() => {
    setPath(testPath)
    // If current path is not exists, go to /root folder
    console.log(currentPath())
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
        {path.files.map((v, i) => (
          <button key={currentPath() + "/" + v}>{v} (File)</button>
        ))}
      </div>
    </div>
  )
}

export default Explorer
