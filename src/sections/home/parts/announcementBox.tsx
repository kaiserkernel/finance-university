import { useEffect, useState } from "react";
import ShowMoreText from "react-show-more-text";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import {
  Button,
  CardContent,
  CardMedia,
  Grid2,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useRouter } from "@/routes/hooks";
import { Announcement } from "@/types/announcement";
import { currencyTypes } from "@/constants/currencyType";
import { getCurrentUser } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRequestData } from "@/redux/slices/requestSlice";

// ----------------------------------------------------------------------

const TruncatedTextBox = styled(Box)({
  "--lh": "1.5rem",
  "--max-lines": 8,
  position: "relative",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 8,
  lineHeight: "var(--lh)",
  maxHeight: "calc(var(--lh) * var(--max-lines))",
  textOverflow: "ellipsis",
});

export function AnnouncementBox({
  announcement,
}: {
  announcement: Announcement;
}) {
  const user = getCurrentUser();
  const navigate = useNavigate();

  // Check if user is empty object
  const isUserEmpty = Object.keys(user).length === 0;

  const {
    _id,
    title,
    imageUrl,
    from,
    until,
    content,
    budget,
    currencyType,
    invoice,
    applyState,
    maxMilestone,
  } = announcement;
  const timestampOfUntil = new Date(until).getTime();
  const timestampOfNow = new Date(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  ).getTime();

  const [showMore, setShowMore] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const requestState = useAppSelector((state) => state.request.data);
  const dispatch = useAppDispatch();

  const handleShowMore = (value: boolean) => {
    setShowMore(value);
  };

  const checkApplied = () => {
    return !requestState.filter(
      (request: any) =>
        (request.announcement._id === _id && request.milestone === 3) ||
        (request.announcement._id === _id && request.finance !== "reviewed")
    ).length;
  };

  const applyForAnnouncement = () => {
    if (!checkApplied()) return;
    router.push("/apply/" + _id);
  };

  const handleClickInvioce = (id?: string) => {
    navigate(`/invoice`, { state: { id } }); // Send id as state
  };

  useEffect(() => {
    if (!isUserEmpty) {
      dispatch(fetchRequestData());
    }
  }, []);

  return (
    <Card
      className="mb-5"
      sx={{
        display: upMd && showMore ? "block" : "flex",
        justifyContent: "center",
        [theme.breakpoints.down("md")]: {
          display: "block",
        },
      }}
      elevation={4}
    >
      {upMd && showMore ? (
        <Box
          minWidth={300}
          maxHeight={300}
          width={"full"}
          display={"flex"}
          justifyContent={"center"}
        >
          <img
            src={`${import.meta.env.VITE_BASE_URL}/${imageUrl}`}
            alt={title}
            style={{
              objectFit: "contain",
            }}
          />
        </Box>
      ) : (
        <CardMedia
          component="img"
          sx={{
            width: {
              xs: "100%",
              md: "50%",
              lg: "40%",
              xl: "35%",
            },
            maxHeight: "300px",
          }}
          image={`${import.meta.env.VITE_BASE_URL}/${imageUrl}`}
          alt={title}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ...(!showMore && {
            width: {
              md: "50%",
              lg: "60%",
              xl: "65%",
            },
          }),
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "10px",
            }}
          >
            <Typography className="w-full text-xl font-semibold" variant="h4">
              {title}
            </Typography>
            {invoice && (
              <Button
                variant="outlined"
                color="error"
                onClick={(_) => handleClickInvioce(_id)}
              >
                Settlement
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Grid2 container className="w-full text-slate-900">
              <Grid2 size={{ md: 12, lg: 7, xl: 5 }}>
                <span className="text-sky-600">Period : </span>{" "}
                <span className="whitespace-nowrap">{from}</span> ~{" "}
                <span className="whitespace-nowrap">{until}</span>
              </Grid2>
              <Grid2 size={{ md: 12, lg: 5, xl: 5 }}>
                <span className="text-sky-600">Budget : </span>{" "}
                {budget?.toLocaleString()}{" "}
                {
                  currencyTypes.filter((cur) => cur.value == currencyType)[0]
                    ?.label
                }
              </Grid2>
            </Grid2>

            {timestampOfUntil < timestampOfNow && (
              <Box className="w-full text-red-700" color={"error"}>
                Expired
              </Box>
            )}
            <ShowMoreText
              lines={5}
              more={<Button>Show more</Button>}
              less={<Button>Show less</Button>}
              className="w-full"
              anchorClass="show-more-less-clickable"
              onClick={handleShowMore}
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {content}
            </ShowMoreText>
          </Box>
          {!!maxMilestone && (
            <Box>
              <Typography variant="h6" className="text-sky-600 pt-4">
                Milestone: {maxMilestone}
              </Typography>
            </Box>
          )}
        </CardContent>
        {timestampOfUntil > timestampOfNow && user.role === "user" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pl: 1,
              pb: 1,
            }}
          >
            <Button
              size="large"
              onClick={applyForAnnouncement}
              disabled={!checkApplied()}
            >
              {!checkApplied() ? "Applied" : "Apply"}
            </Button>
          </Box>
        )}
      </Box>
    </Card>

    // <Card
    //   sx={{
    //     ...bgGradient({
    //       color: `135deg, ${varAlpha(
    //         theme.vars.palette[color].lighterChannel,
    //         0.48
    //       )}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
    //     }),
    //     p: 3,
    //     boxShadow: "none",
    //     position: "relative",
    //     color: `${color}.darker`,
    //     backgroundColor: "common.white",
    //     ...sx,
    //   }}
    //   {...other}
    // >
    //   <Grid2 container spacing={2} justifyContent={"center"}>
    //     {/* <Grid2 size={{ lg: 4, xs: 12 }}>
    //       <Box sx={{ width: "100%", height: "100%", mb: 3 }}>
    //         <img src={img} alt={title} loading="lazy" className="" />
    //       </Box>
    //     </Grid2>

    //     <Grid2 size={{ lg: 8, xs: 12 }}>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexWrap: "wrap",
    //           alignItems: "flex-end",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <Box>{title}</Box>
    //         <Box sx={{ flexGrow: 1, minWidth: 112 }}>{text}</Box>
    //       </Box>
    //       <Box>{date}</Box>
    //     </Grid2> */}

    //     <Stack spacing={2} className="items-center">
    //       {img ? (
    //         <Box
    //           sx={{
    //             width: { xs: "100%", sm: "70%", md: "40%" },
    //             height: "100%",
    //             mb: 3,
    //           }}
    //         >
    //           <img
    //             src={`${import.meta.env.VITE_BASE_URL}/${img}`}
    //             alt={title}
    //             loading="lazy"
    //             className=""
    //           />
    //         </Box>
    //       ) : (
    //         <></>
    //       )}

    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexWrap: "wrap",
    //           alignItems: "flex-end",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <Box className="w-full text-xl font-semibold">{title}</Box>
    //         {timestampOfUntil < Date.now() ? (
    //           <Box className="w-full text-red-700" color={"error"}>
    //             Expired
    //           </Box>
    //         ) : (
    //           <Box className="w-full text-slate-900">
    //             From: <span>{`${from} Until: ${until}`}</span>
    //           </Box>
    //         )}

    //         <Box sx={{ flexGrow: 1, minWidth: 112 }}>{text}</Box>
    //       </Box>
    //     </Stack>
    //   </Grid2>
    // </Card>
  );
}
