import { useRouter } from "next/router";
import axiosInstance from "@/utils/api";
import { GetServerSideProps } from "next/types";
import {
  Breadcrumb,
  Button,
  Form,
  FormProps,
  Input,
  message,
  Select,
  theme,
} from "antd";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
interface User {
  id: number;
  email: string;
  name: string;
  gender: "male" | "female";
  status: "active" | "inactive";
}
type FieldType = {
  email: string;
  name: string;
  gender: "male" | "female";
  status: "active" | "inactive";
};
function Post({ user }: { user: User }) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const mutate = useMutation({
    mutationFn: async ({ data }: { data: FieldType }) => {
      const res = await axiosInstance.put("users/" + user.id, data);
    },
    onSuccess() {
      messageApi.open({
        type: "success",
        content: "berhasil di save",
      });
      router.push("/user");
    },
    onError(error, variables, context) {
      if (isAxiosError(error)) {
        messageApi.open({
          type: "error",
          content: error.response?.data.message,
        });
      }
    },
  });
  const {
    token: { colorBgContainer, colorPrimaryText, borderRadiusLG },
  } = theme.useToken();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    mutate.mutate({ data: values });
  };

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: "user", href: "/user" },
          { title: "edit" },
        ]}
      />
      <div className=" w-full h-full flex items-center justify-center ">
        <Form
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            padding: 24,
          }}
          disabled={mutate.isPending}
          layout="vertical"
          initialValues={user}
          name="control-hooks"
          className="w-full md:w-1/2"
          onFinish={onFinish}
        >
          <h1 className=" font-semibold text-lg">Edit</h1>
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your name!" },
              { type: "email", message: "Please input valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="gender"
            name="gender"
            rules={[{ required: true, message: "Please input your gender!" }]}
          >
            <Select showSearch placeholder="Select user" filterOption={false}>
              <Select.Option value="male">male</Select.Option>
              <Select.Option value="female">female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item<FieldType>
            label="status"
            name="status"
            rules={[{ required: true, message: "Please input your status!" }]}
          >
            <Select showSearch placeholder="Select user" filterOption={false}>
              <Select.Option value="active">active</Select.Option>
              <Select.Option value="inactive">inactive</Select.Option>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.id) {
      return { notFound: true };
    }

    const res = await axiosInstance.get<User>(("users/" + params.id) as string);

    return {
      props: {
        user: res.data,
      },
    };
  } catch (error) {
    console.error("Error", error);
    return {
      notFound: true,
    };
  }
};
export default Post;
