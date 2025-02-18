import { Helmet } from 'react-helmet-async';

import { CONFIG } from '@/config-global';

import Chart from '@/components/chart';

// ----------------------------------------------------------------------

export default function Page() {
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

      {/* <Box
        sx={{
          width: "80%",
          height: "90%",
        }}
      > */}
      
        <Chart />
      {/* </Box> */}
    </>
  );
}
