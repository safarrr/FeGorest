import { useRouter } from "next/router";
import axiosInstance from "@/utils/api";
import { GetServerSideProps } from "next/types";
import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Select,
  Spin,
  theme,
} from "antd";
import { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}
type FieldType = {
  title?: string;
  body?: string;
  user_id?: number;
};
const getUser = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, search] = queryKey;
  const res = await axiosInstance.get<
    {
      id: number;
      name: string;
      email: string;
      gender: string;
      status: string;
    }[]
  >("users", {
    params: {
      name: search,
      per_page: 30,
    },
  });
  return res.data;
};
function PostCreate() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchUser, setSearchUser] = useState("");
  const listUserQ = useQuery({
    queryKey: ["user", searchUser || ""],
    queryFn: getUser,
  });
  const mutation = useMutation({
    mutationFn: async ({ data }: { data: FieldType }) => {
      const res = await axiosInstance.post(`posts`, data);
      return res.data;
    },
    onSuccess() {
      messageApi.success("berhasil");
      router.push("/post");
    },
    onError(error) {
      if (isAxiosError(error)) {
        messageApi.destroy();
        message.open({
          type: "error",
          content: error.response?.data.message,
        });
        return;
      }
    },
  });
  const {
    token: { colorBgContainer, colorPrimaryText, borderRadiusLG },
  } = theme.useToken();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    mutation.mutate({ data: values });
  };
  const getSelectFilter = (query = "") => {
    setSearchUser(query);
  };

  return (
    <>
      {contextHolder}
      <div className=" w-full h-full flex items-center justify-center ">
        <Form
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            padding: 24,
          }}
          disabled={mutation.isPending}
          layout="vertical"
          name="control-hooks"
          className="w-full md:w-1/2"
          onFinish={onFinish}
        >
          <h1 className=" font-semibold text-lg">Create</h1>
          <Form.Item<FieldType>
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input your body!" }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item<FieldType>
            label="User"
            name="user_id"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Select
              showSearch
              placeholder="Select user"
              filterOption={false}
              onSearch={getSelectFilter}
              notFoundContent={
                listUserQ.isLoading ? <Spin size="small" /> : "No data"
              }
            >
              {listUserQ.data?.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} {user.status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default PostCreate;
