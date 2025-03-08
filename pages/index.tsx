import { theme } from "antd";

function Home() {
  const {
    token: { colorBgContainer, colorPrimaryText, borderRadiusLG },
  } = theme.useToken();
  return (
    <div
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        padding: 24,
      }}
      className="flex flex-col items-center justify-center"
    >
      <h1
        style={{ color: colorPrimaryText }}
        className="text-xl font-bold text-center"
      >
        FeGorest
      </h1>
      <p>
        all data from{" "}
        <a
          href="http://gorest.co.in"
          className=" text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          gorest.co.in
        </a>
      </p>
      <div className="inline-flex gap-2 items-center">
        <a
          href="https://safarudin.my.id/"
          className=" text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          safarudin.my.id
        </a>
        ,
        <a
          href="https://github.com/safarrr"
          className=" text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/safarrr
        </a>
      </div>
    </div>
  );
}

export default Home;
