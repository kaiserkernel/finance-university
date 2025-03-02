import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Box,
  Button,
  Divider
} from "@mui/material"
import { isAxiosError } from 'axios';

import { DashboardContent } from "@/layouts/dashboard";
import { CONFIG } from '@/config-global';
import { InitialApplication } from '@/types/invoice';
import { addInvoice, getInvoiceList } from '@/services/invoiceService';
import { InputFileUpload } from '@/components/fileUpload';

// ----------------------------------------------------------------------

export default function Page() {
  const location = useLocation();
  const announcementId = location.state?.id; // Retrieve the id from state

  const [initialInvoiceList, setInitialInvoiceList] = useState<InitialApplication[]>([]);
  const [doc, setDoc] = useState<File | null>();

  const uploadFile = (file: File | null) => {
    if (!file) return;
    setDoc(file);
  };

  const handleSubmitInvoice = (applicationId: string) => {
    if (!doc) return;
    addInvoice(applicationId, doc)
      .then(() => {
        toast.success("Submitted successfully");
        setInitialInvoiceList(prev => prev.map((log) => {
          if (log._id === applicationId) {
            log._id = "";
          }
          return log;
        }))
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      });
  }

  useEffect(() => {
    const getInitialData = async () => {
      if (!announcementId) {
        console.error('Announcement ID is missing');
        return;
      }

      try {
        const { data } = await getInvoiceList(announcementId);
        setInitialInvoiceList(data.data);
      } catch (error) {
        if (isAxiosError(error)) {
          error.response?.data.msg.map((str: string) => {
            toast.error(str);
          });
        }
        else
          toast.error("Error occured. Please try again");
      }
    }

    getInitialData();
  },[]);

  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Grant Website"
        />
        <meta name="keywords" content="grant,university,college" />
      </Helmet>
      
      <DashboardContent maxWidth="xl">
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Settlement
        </Typography>
        <Grid container spacing={3}>
          <Grid size={12}>
          {
            initialInvoiceList.map((log:InitialApplication, idx:number) => (
              <Card 
                key={idx}
                sx={{
                  padding: "10px"
                }}
              >
                <CardContent
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Budget: {log.budget}</Typography>
                    <Typography variant='h6'>Milestone: {log.milestone}</Typography>
                  </Box>
                  <Typography>Created: {log.createdAt}</Typography>
                  <Divider sx={{ marginTop: "20px", marginBottom: "20px" }}/>
                  {
                    log._id && (
                      <Box display={"flex"}>
                        {doc ? (
                          <Button
                              component="label"
                              onClick={() => {
                                  setDoc(null);
                              }}
                              variant="text"
                              color="error"
                          >
                              Remove:
                          </Button>
                        ) : (
                          <InputFileUpload onUploadFile={uploadFile}></InputFileUpload>
                        )}
                        {doc && (
                            <Typography lineHeight={2}>{doc.name}</Typography>
                        )}
                        {doc && (
                          <Button 
                            sx={{marginLeft: "50px"}} 
                            variant='outlined'
                            onClick={(_evt) => handleSubmitInvoice(log._id)}
                          >
                            Submit
                          </Button>
                        )}
                      </Box>
                    )
                  }
                </CardContent>
              </Card>
            ))
          }
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
