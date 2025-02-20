import React from "react";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { Typography, Container } from "@mui/material";

import { DashboardContent } from "@/layouts/dashboard";
import { fetchUserInfo } from "@/services/userService";
import { User } from "@/types/userInfo";
import UserProfile from "./UserProfile";

const getUserInfo = (setUser: React.Dispatch<React.SetStateAction<any>>) => {
  fetchUserInfo().then(res => {
    if (res.status >= 300) {
      console.log('error fetching user info: ' + res.data);
    }
    if (res.data) {
      setUser(res.data);
    }
  }).catch((error) => {
    if (isAxiosError(error)) {
      error.response?.data.msg.map((str: string) => {
        toast.error(str);
      });
    }
    else
      toast.error("Error occured. Please try again");
  })
}

export default function ProfileView() {
  const [user, setUser] = React.useState<User>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    college: ""
  })

  const handleChangeResult = () => {
    getUserInfo(setUser)
  }

  React.useEffect(() => {
    getUserInfo(setUser)
  }, [])

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Profile
      </Typography>

      <Container className="bg-white border-solid border rounded border-stone-100 p-6">
        <UserProfile user={user} onChangeSuccess={handleChangeResult} ></UserProfile>
      </Container>
    </DashboardContent>
  );
}
