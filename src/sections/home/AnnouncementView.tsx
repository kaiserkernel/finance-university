import React, { useRef } from "react";

import { Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

import { DashboardContent } from "@/layouts/dashboard";
import { AnnouncementBox } from "./parts/announcementBox";

import { getAnnouncements } from "@/services/announcementServices";
import { Announcement } from "@/types/announcement";
import { getCurrentUser } from "@/services/authService";

// ----------------------------------------------------------------------

export default function AnnouncementView() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>();
  const viewRef = useRef<HTMLDivElement | null>(null)

  let userEmail = "";
  const user = getCurrentUser();
  if (user && user.role === "user") {
    userEmail = user.email;
  }

  React.useEffect(() => {
    getAnnouncements(userEmail)
      .then((res) => {
        setAnnouncements(res.data)})
      .catch((error) => {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      });
  }, []);

  React.useEffect(() => {
    if(viewRef?.current) {
      viewRef.current.lastElementChild?.scrollIntoView();
    }
  }, [announcements])

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
        <div ref={viewRef}>
          {
            !announcements?.length? (
              <Typography color="primary" variant="h5">No announcements.</Typography>
            ) : (
              announcements?.map((ann: Announcement) => (
                <AnnouncementBox
                  key={ann._id}
                  announcement={ann}
                />
              ))
            )
          }
          </div>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
