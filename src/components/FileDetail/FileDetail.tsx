import {
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons"
import { Button, Input, Modal, Slider, Typography } from "antd"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
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
  const [isSharing, setIsSharing] = useState(false)
  const [isDelayed, setIsDelayed] = useState(false)
  const [duration, setDuration] = useState(1.0) // 1 hour
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleDuration = useCallback((value: number) => {
    setDuration(value)
  }, [])

  const handleFocusUrl = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    },
    []
  )

  const onClickShare = useCallback(() => {
    if (!isSharing) {
      setIsSharing(true)
    }
  }, [isSharing])

  const onClickRemove = useCallback(() => {
    if (file) {
      axios.delete("files/" + file.id.toString()).then(() => {
        close()
        refresher()
      })
    }
  }, [close, file, refresher])

  useEffect(() => {
    if (file && !isDelayed) {
      setIsDelayed(true)
      setTimeout(() => setIsDelayed(false), 2000)
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
            console.log("T")
          }
        })
    }
  }, [duration, file, isDelayed])

  return (
    <div>
      {file ? (
        <div>
          <Typography.Title
            level={3}
            style={{ overflow: "hidden", margin: "auto" }}
          >
            {file.title}
          </Typography.Title>
          <Typography.Text
            style={{
              display: "block",
              overflow: "hidden",
              margin: "0.5em 0 1em 0",
            }}
          >
            {file.upload_date.split("T")[0]}
          </Typography.Text>
          {file.script ? (
            <Typography.Text
              italic
              style={{ display: "block", margin: "1em 0" }}
            >
              "
              {file.script.length > 93
                ? file.script.substring(0, 93) + "..."
                : file.script}
              "
            </Typography.Text>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Button
                href={file.url}
                rel="noopener noreferrer"
                target="_blank"
                icon={<DownloadOutlined />}
                style={{ margin: "0 1em 0 0" }}
              >
                Download
              </Button>
              <Button onClick={onClickShare} icon={<ShareAltOutlined />}>
                Share
              </Button>
            </div>
            <Button
              type="primary"
              onClick={onClickRemove}
              icon={<DeleteOutlined />}
            >
              Remove
            </Button>
          </div>

          <Modal
            title="Share the File"
            visible={isSharing}
            onCancel={() => setIsSharing(false)}
            footer={null}
          >
            <Slider
              min={1}
              max={240}
              value={duration}
              onChange={handleDuration}
            />

            <Typography.Text
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "end",
                margin: "0 0 0.5em 0",
              }}
            >
              {"hours "}
              <ClockCircleOutlined />
            </Typography.Text>
            {shareUrl ? (
              <div>
                <Input
                  readOnly
                  defaultValue={shareUrl}
                  onFocus={handleFocusUrl}
                />
              </div>
            ) : null}
          </Modal>
        </div>
      ) : null}
    </div>
  )
}

export default FileDetail
