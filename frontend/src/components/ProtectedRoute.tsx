import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";
import { useEffect, ReactNode } from "react";

const publicRoutes = ["/", "/login", "/register"];

const routeRoleMap: { [prefix: string]: "employer" | "candidate" } = {
  "/employer": "employer",
  "/candidate": "candidate",
};

export default function ProtectedRoute({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    const isPublic = publicRoutes.includes(path);
    const requiredRole = Object.entries(routeRoleMap).find(([prefix]) =>
      path.startsWith(prefix)
    )?.[1];

    if (!loading) {
      if (!user && !isPublic) {
        router.replace("/login?redirect=" + encodeURIComponent(path));
      } else if (user && path === "/") {
        router.replace(`/${user.role}/dashboard`);
      } else if (user && requiredRole && user.role !== requiredRole) {
        router.replace("/401");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, path]);

  if (loading || (!user && !publicRoutes.includes(path))) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
