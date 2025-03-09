import axiosInstance from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
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
import { useRouter } from "next/router";
type FieldType = {
  email: string;
  name: string;
  gender: "male" | "female";
  status: "active" | "inactive";
};
function UserCreate() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const {
    token: { colorBgContainer, colorPrimaryText, borderRadiusLG },
  } = theme.useToken();

  const mutation = useMutation({
    mutationFn: async ({ data }: { data: FieldType }) => {
      const res = await axiosInstance.post(`users`, data);
      return res.data;
    },
    onSuccess() {
      messageApi.success("berhasil");
      router.push("/user");
    },
    onError(error, variables, context) {
      if (isAxiosError(error)) {
        let msg = "";
        if (Array.isArray(error.response?.data)) {
          let r: string[] = [];
          error.response?.data.map((v) => {
            r.push(`${v.field} : ${v.message}`);
          });
          msg = r.join("\n");
        } else {
          msg = error.response?.data.message;
        }
        messageApi.open({
          type: "error",
          content: msg,
        });
      }
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    mutation.mutate({ data: values });
  };
  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: "user", href: "/user" },
          { title: "create" },
        ]}
      />
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

export default UserCreate;

// curl -i -H "Accept:application/json" -H "Content-Type:application/json" -H "Authorization: Bearer 5f80664d199e4c833f5653c600d976d39c2ebdf1631e1551e19e5c3054dfe729" -XPOST "https://gorest.co.in/public/v2/users" -d '{"name":"Tenali Ramakrishna", "gender":"male", "email":"tenali.ramakrishna@15ce.com", "status":"active"}'
