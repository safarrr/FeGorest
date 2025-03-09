import { useRouter } from "next/router";
import axiosInstance from "@/utils/api";
import { GetServerSideProps } from "next/types";
import { Button, Form, FormProps, Input, message, theme } from "antd";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}
type FieldType = {
  title?: string;
  body?: string;
};
function Post({ post }: { post: Post }) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const mutate = useMutation({
    mutationFn: async ({ data }: { data: FieldType }) => {
      const res = await axiosInstance.put("posts/" + post.id, data);
    },
    onSuccess() {
      messageApi.open({
        type: "success",
        content: "berhasil di save",
      });
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
      <div className=" w-full h-full flex items-center justify-center ">
        <Form
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            padding: 24,
          }}
          disabled={mutate.isPending}
          layout="vertical"
          initialValues={post}
          name="control-hooks"
          className="w-full md:w-1/2"
          onFinish={onFinish}
        >
          <h1 className=" font-semibold text-lg">Edit</h1>
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

    const res = await axiosInstance.get<Post>(("posts/" + params.id) as string);

    return {
      props: {
        post: res.data,
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
