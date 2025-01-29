export const getRole = (key: string) => {
  const roles = [
    { user: "User" },
    { reviewer: "Reviewer" },
    { col_dean: "College Dean" },
    { grant_dep: "Research and Extension Officer" },
    { grant_dir: "Research and Publication Directorate" },
    { finance: "Finance Director" },
  ];

  const value = roles.find((role) => Object.keys(role)[0] === key) as any;
  if (!value || !key) {
    return '';
  }
  const role = value[key];

  return role;
};
