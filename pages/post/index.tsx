import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Button,
  Card,
  Pagination,
  Input,
  theme,
  Popconfirm,
  message,
  Breadcrumb,
} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import axiosInstance from "@/utils/api";
import { SearchProps } from "antd/es/input";
import Link from "next/link";
interface Post {
  id: number;
  title: string;
  body: string;
}

const getPosts = async ({
  queryKey,
}: {
  queryKey: [string, { page: number; limit: number; search: string }];
}) => {
  const [_key, { page, limit, search }] = queryKey;
  const res = await axiosInstance.get<Post[]>("posts", {
    params: { page: page, per_page: limit, title: search },
  });
  const pages = {
    total: Number(res.headers["x-pagination-total"] ?? 0),
    pages: Number(res.headers["x-pagination-pages"] ?? 0),
    page: Number(res.headers["x-pagination-page"] ?? page),
    limit: Number(res.headers["x-pagination-limit"] ?? limit),
  };
  return { data: res.data, pages };
};
const { Search } = Input;
export default function HomePost() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["posts", { page, limit, search }],
    queryFn: getPosts,
  });
  const { Meta } = Card;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setSearch(value);
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete("posts/" + id);
      refetch();
      messageApi.success("berhasil dihapus");
    } catch (error) {
      if (isAxiosError(error)) {
        messageApi.error(error.response?.data.message);
        return;
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "post" }]} />
      <div
        className="flex flex-col space-y-3 items-center justify-center"
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: 24,
        }}
      >
        <div className="inline-flex justify-between w-full">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
          <Button href="/post/create" type="primary">
            buat baru
          </Button>
        </div>
        {isLoading && <h1>loading</h1>}
        {isError && <h1>error</h1>}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center justify-center gap-2">
          {data?.data?.map((post, i) => (
            // <Link href={"post/" + String(post.id)}>
            <Card
              key={i}
              actions={[
                <Link
                  key={`edit-${post.id}`}
                  href={"/post/edit/" + String(post.id)}
                >
                  <EditFilled key="edit" />
                </Link>,
                <Popconfirm
                  key={`edit-${post.id}`}
                  title="hapus"
                  description="ingin menghapus ini?"
                  onConfirm={() => confirmDelete(String(post.id))}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteFilled key="Delete" />
                </Popconfirm>,
              ]}
              className=" transition-transform hover:scale-95"
              variant="outlined"
            >
              <Link href={"post/" + String(post.id)}>
                <Meta title={post.title} className=" hover:underline" />
              </Link>
              {post.body.slice(0, 50)}
            </Card>
          ))}
        </div>

        <Pagination
          current={page}
          total={data?.pages.pages}
          pageSize={limit}
          onChange={(page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          }}
        />
      </div>
    </>
  );
}
