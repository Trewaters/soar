import Head from 'next/head';
import LandingPage from '../components/LandingPage'
import { Box, Paper } from '@mui/material';
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import postureData from "@/interfaces/postureData";

export const getStaticProps: GetStaticProps = async () => {
  const postureProps = await getData()
  console.log(`getStaticProps fetched ${postureProps.length} postures`);

  return {
    props: {
      postureProps,
    },
    revalidate: 1, // In seconds
  }
};

async function getData(): Promise<postureData[]> {
  try {
      const res = await fetch('https://www.pocketyoga.com/poses.json');
      if (!res.ok) throw new Error("Error fetching data");
      const postureProps: postureData[] = await res.json();
      console.log(`Fetched ${postureProps.length} postures`);
      return postureProps;
  } catch {
      console.log("Error fetching data");
      return [];
  }
};

export default function Home({ postureProps }: InferGetStaticPropsType<typeof getStaticProps>) {

  console.log("Posture Props:", postureProps);

  return (
    <>
      <Head>
        <title>Happy Yoga &quot;Soar&quot;</title>
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>

    </>
  )
}
