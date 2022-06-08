import { LeftOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Input } from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface LogoutResponse {
  Status: string
  Username: string
}

interface RouteInfo {
  path: string
  breadcrumbName: string
}

interface Props {
  currentPath: string
  searched?: boolean | undefined
}

const ExplorerHeader = (props: Props) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [routes, setRoutes] = useState<RouteInfo[]>([])

  const handleInputQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onClickSearch = useCallback(() => {
    if (query !== "") {
      navigate("/search?q=" + query)
    }
  }, [query, navigate])

  const onClickLogout = useCallback(() => {
    axios.post("logout").then((res: AxiosResponse<LogoutResponse>) => {
      if (res.data.Status && res.data.Status === "Success") {
        navigate("/login")
      }
    })
    // logout anyway
    navigate("/login")
  }, [navigate])

  useEffect(() => {
    const newRoutes: RouteInfo[] = []
    if (props.searched) {
      // Searched Explorer
      newRoutes.push({ path: "/search/", breadcrumbName: "search" })
      newRoutes.push({
        path: "/search?q=" + props.currentPath,
        breadcrumbName: `Result of '${props.currentPath}'`,
      })
    } else {
      // Common Explorer
      const splited = props.currentPath.split("/")
      newRoutes.push({ path: "/explorer/", breadcrumbName: "root" })

      for (let i = 1; i < splited.length - 1; i += 1) {
        newRoutes.push({
          path: newRoutes[i - 1].path + splited[i] + "/",
          breadcrumbName: decodeURI(splited[i]),
        })
      }
    }

    setRoutes(newRoutes)
  }, [props])

  return (
    <div style={{ margin: "2em auto" }}>
      <div style={{ margin: "2em auto" }}>
        <Button
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
          size="large"
          shape="circle"
          style={{ margin: "0 0 0 1em" }}
        />
        <Input
          type="text"
          value={query}
          onChange={handleInputQuery}
          placeholder="Enter the keyword to search"
          size="large"
          style={{ width: "60%", margin: "0 1.5em" }}
        />
        <Button
          type="primary"
          onClick={onClickSearch}
          icon={<SearchOutlined />}
          size="large"
          shape="circle"
        />
        <Button
          onClick={onClickLogout}
          icon={<LogoutOutlined />}
          size="large"
          shape="circle"
          style={{ margin: "0 0 0 1em" }}
        />
      </div>
      <Breadcrumb>
        {routes.map((route) => (
          <BreadcrumbItem key={route.path}>
            <Link to={route.path}>{route.breadcrumbName}</Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  )
}

export default ExplorerHeader
