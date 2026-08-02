import { Outlet } from "react-router-dom";

export default function LayoutRoute({ layout: Layout }) {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
