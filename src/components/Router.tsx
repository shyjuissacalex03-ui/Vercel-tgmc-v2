import React, { createContext, useContext, useEffect, useState } from "react";

interface RouterContextType {
  pathname: string;
  navigate: (href: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: "/",
  navigate: () => {},
});

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  return {
    pathname: ctx.pathname,
    push: ctx.navigate,
  };
};

export const usePathname = () => {
  const ctx = useContext(RouterContext);
  return ctx.pathname;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname || "/";
    }
    return "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (href: string) => {
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.location.href = href;
      return;
    }
    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", href);
    setPathname(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = "", onClick, ...props }) => {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
