import axios, { AxiosResponse } from "axios"
import React, { useCallback, useState } from "react"
import { FileMeta } from "../../types/path"

interface ShareResponse {
  url: string
  expireDatetime: string
}

interface Props {
  file: FileMeta | null
  close: () => void
  refresher: () => void
}

const FileDetail = ({ close, file, refresher }: Props) => {
  const [duration, setDuration] = useState(1.0) // 1 hour
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDuration(parseFloat(e.target.value))
    },
    []
  )

  const handleFocusUrl = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    },
    []
  )

  const onClickShare = useCallback(() => {
    if (file) {
      axios
        .get(
          "files/" +
            file.id.toString() +
            "/share/" +
            (duration * 60 * 60).toString()
        )
        .then((res: AxiosResponse<ShareResponse>) => {
          if (res.data.url) {
            setShareUrl(res.data.url)
          }
        })
    }
  }, [duration, file])

  const onClickRemove = useCallback(() => {
    if (file) {
      axios.delete("files/" + file.id.toString()).then(() => {
        close()
        refresher()
      })
    }
  }, [close, file, refresher])

  return (
    <div>
      {file ? (
        <div>
          <div className="FileName">{file.title}</div>
          <div className="FileDate">{file.upload_date}</div>
          <a href={file.url} rel="noopener noreferrer" target="_blank">
            Download
          </a>
          <div>
            <button onClick={onClickShare}>Share</button>
            <input type="number" onChange={handleDuration} defaultValue={1} />
            <span>hours</span>
            {shareUrl ? (
              <div>
                <input
                  readOnly
                  defaultValue={shareUrl}
                  onFocus={handleFocusUrl}
                />
              </div>
            ) : null}
          </div>
          <button onClick={onClickRemove}>Remove</button>
        </div>
      ) : null}
    </div>
  )
}

export default FileDetail
