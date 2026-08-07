import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearAdminSession, isAdminLoggedIn } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    const loggedIn = isAdminLoggedIn();
    if (!isLogin && !loggedIn) {
      navigate({ to: "/admin/login" });
    } else if (isLogin && loggedIn) {
      navigate({ to: "/admin" });
    }
    setReady(true);
  }, [isLogin, navigate, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
              Seller tools
            </p>
            <h1 className="font-display text-2xl font-medium text-foreground">
              Leavora Admin
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/">
              <Button variant="outline">View main site</Button>
            </Link>
            {!isLogin && (
              <>
                <Link to="/admin/new">
                  <Button>Add product</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    clearAdminSession();
                    navigate({ to: "/admin/login" });
                  }}
                >
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:px-6">
        <Outlet />
      </div>
    </div>
  );
}
