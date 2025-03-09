import axiosInstance from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Breadcrumb,
  Button,
  Drawer,
  Form,
  FormProps,
  Input,
  List,
  message,
  theme,
} from "antd";
import { isAxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}
type FieldType = {
  name?: string;
  email?: string;
  body?: string;
};
const getComment = async ({
  queryKey,
}: {
  queryKey: [string, { id: number }];
}) => {
  const [_key, { id }] = queryKey;
  const res = await axiosInstance.get<
    {
      id: number;
      post_id: number;
      name: string;
      email: string;
      body: string;
    }[]
  >(`posts/${id}/comments`, {
    params: { post_id: id },
  });
  return res.data;
};
function DetailPost({ post }: { post: Post }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [openAddComment, setOpenAddComment] = useState<boolean>();
  const commentQuery = useQuery({
    queryKey: ["comments", { id: post.id }],
    queryFn: getComment,
  });
  const mutation = useMutation({
    mutationFn: async ({ data }: { data: FieldType }) => {
      const res = await axiosInstance.post(`posts/${post.id}/comments`, data);
      return res.data;
    },
    onSuccess() {
      commentQuery.refetch();
      messageApi.success("berhasil");
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

  const onFinishComments: FormProps<FieldType>["onFinish"] = async (values) => {
    mutation.mutate({ data: values });
  };

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: "post", href: "/post" },
          { title: post.title },
        ]}
      />
      <div
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: 24,
        }}
        className="w-full mt-2 flex flex-col "
      >
        <h1 className="text-xl font-bold">{post.title}</h1>
        <div>
          <p>{post.body}</p>
        </div>
        <div className="inline-flex mt-3 justify-between w-full items-center">
          <h1 className=" font-semibold text-lg">Comments</h1>
          <Button type="primary" onClick={() => setOpenAddComment(true)}>
            add Comments
          </Button>
        </div>
        <div className="flex flex-col w-full"></div>

        <Drawer
          title="add Comments"
          onClose={() => setOpenAddComment(false)}
          open={openAddComment}
        >
          <Form
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              padding: 24,
            }}
            layout="vertical"
            name="control-hooks"
            className="w-full"
            onFinish={onFinishComments}
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "email not valid" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Comments"
              name="body"
              rules={[
                { required: true, message: "Please input your Comments!" },
              ]}
            >
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item label={null}>
              <Button
                disabled={commentQuery.isPending}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <List
          itemLayout="horizontal"
          dataSource={commentQuery.data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                }
                title={item.name}
                description={item.body}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default DetailPost;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.id) {
      return { notFound: true };
    }

    const resPost = await axiosInstance.get<Post>(
      ("posts/" + params.id) as string
    );
    return {
      props: {
        post: resPost.data,
      },
    };
  } catch (error) {
    console.error("Error", error);
    return {
      notFound: true,
    };
  }
};
