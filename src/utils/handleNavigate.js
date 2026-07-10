export  const handleNavigate = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };