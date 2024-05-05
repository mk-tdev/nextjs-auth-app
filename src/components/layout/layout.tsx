import MainNavigation from "./main-navigation";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <MainNavigation />
      {props.children}
    </>
  );
};

export default Layout;
