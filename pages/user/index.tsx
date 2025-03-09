import axiosInstance from "@/utils/api";
import useDebounce from "@/utils/hooks/Debounce";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Input,
  message,
  Popconfirm,
  Tag,
  theme,
} from "antd";
import { Table } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { FilterDropdownProps, FilterValue } from "antd/es/table/interface";
import { useMemo, useState } from "react";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { isAxiosError } from "axios";
import Link from "next/link";
interface DataType {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

const getUser = async ({
  queryKey,
}: {
  queryKey: [
    string,
    {
      page: number;
      limit: number;
      filter?: {
        name?: string;
        email?: string;
        gender?: string;
        status?: string[];
      };
    }
  ];
}) => {
  const [_key, { page, limit, filter }] = queryKey;
  let params: { [key: string]: any } = {
    page: page,
    per_page: limit,
  };
  if (filter) {
    for (const key in filter) {
      if (filter[key as keyof typeof filter]) {
        if (Array.isArray(filter[key as keyof typeof filter])) {
          const data = filter[key as keyof typeof filter];
          params[key] = data ? data[0] : "";
        } else {
          params[key] = filter[key as keyof typeof filter];
        }
      }
    }
  }
  const res = await axiosInstance.get<
    {
      id: number;
      name: string;
      email: string;
      gender: string;
      status: string;
    }[]
  >("users", {
    params,
  });
  const pages = {
    total: Number(res.headers["x-pagination-total"] ?? 0),
    pages: Number(res.headers["x-pagination-pages"] ?? 0),
    page: Number(res.headers["x-pagination-page"] ?? page),
    limit: Number(res.headers["x-pagination-limit"] ?? limit),
  };
  return { data: res.data, pages };
};
function User() {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [filter, setFilter] = useState<{
    name?: string;
    email?: string;
    gender?: string;
    status?: string[];
  }>();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const debouncedFilter = useDebounce(filter, 500);

  const listUserQ = useQuery({
    queryKey: [
      "user",
      {
        page: pagination.page,
        limit: pagination.limit,
        filter: debouncedFilter,
      },
    ],
    queryFn: getUser,
  });
  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters
  ) => {
    const page = {
      page: Number(pagination.current),
      limit: Number(pagination.pageSize),
    };
    setPagination(page);
    setFilter(filters);
  };
  const confirmDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete("users/" + id);

      messageApi.success("berhasil dihapus");
      listUserQ.refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        messageApi.error(error.response?.data.message);
        return;
      }
    }
  };
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        width: 150,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div className="w-full flex flex-col items-end p-2">
            <Input
              placeholder="Search name"
              allowClear
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm({ closeDropdown: false })}
            />
            <div className="inline-flex p-2 items-center justify-between w-full">
              <Button
                onClick={() => {
                  if (clearFilters) {
                    clearFilters();
                  }
                  confirm({ closeDropdown: false });
                }}
                size="small"
                type="text"
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "Email",
        filtered: true,
        dataIndex: "email",
        width: 150,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div className="w-full flex flex-col items-end p-2">
            <Input
              placeholder="Search email"
              allowClear
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm({ closeDropdown: false })}
            />
            <div className="inline-flex p-2 items-center justify-between w-full">
              <Button
                onClick={() => {
                  if (clearFilters) {
                    clearFilters();
                  }
                  confirm({ closeDropdown: false });
                }}
                size="small"
                type="text"
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: "Gender",
        dataIndex: "gender",
        filterMultiple: false,

        filters: [
          { text: "Male", value: "male" },
          { text: "Female", value: "female" },
        ],
        width: 150,
      },
      {
        title: "Status",
        dataIndex: "status",
        filterMultiple: false,
        width: 150,
        filterSearch: true,
        filters: [
          { text: "Active", value: "active" },
          { text: "Inactive", value: "inactive" },
        ],
        render: (_, { status }) => (
          <>
            <Tag color={status.toUpperCase() == "INACTIVE" ? "error" : "green"}>
              {status.toUpperCase()}
            </Tag>
          </>
        ),
      },
      {
        title: "opsi",

        width: 150,

        render: (_, { id }) => (
          <div className="inline-flex gap-2 ">
            <Link className=" text-inherit" href={`user/edit/` + id}>
              <EditFilled key="edit" />
            </Link>
            <Popconfirm
              title="hapus"
              description="ingin menghapus ini?"
              onConfirm={() => confirmDelete(String(id))}
              okText="Yes"
              cancelText="No"
            >
              <DeleteFilled key="Delete" />
            </Popconfirm>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      {contextHolder}
      <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "user" }]} />
      <div
        className="flex mt-2 flex-col space-y-3 items-center justify-center"
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: 24,
        }}
      >
        <div className="flex justify-end w-full items-end">
          <Button href="/user/create" type="primary">
            buat baru
          </Button>
        </div>
        <Table<DataType>
          loading={listUserQ.isLoading}
          columns={columns}
          rowKey="id"
          style={{
            scrollbarWidth: "thin",
          }}
          onChange={handleTableChange}
          dataSource={listUserQ.data?.data}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: listUserQ.data?.pages.total || 0,
          }}
          scroll={{ y: 55 * 5 }}
        />
      </div>
    </>
  );
}

export default User;
