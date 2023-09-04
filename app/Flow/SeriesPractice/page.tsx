'use client'
import React from "react";
import { Breadcrumbs, Card, CardContent, CardHeader, Link, Stack, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default async function page(e){
  
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      event.preventDefault();
      console.info('You clicked a breadcrumb.');
    }
  
    const [introPose, setIntroPose] = React.useState('Star Pose');
    const [focusPose, setFocusPose] = React.useState('Forward Fold');
    const [outroPose, setOutroPose] = React.useState('Triangle Pose');
    const [error, setError] = React.useState();
  
    const res = await fetch('https://api.github.com/repos/vercel/next.js', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify
  ({introPose, focusPose, outroPose}),
})

const {msg} = await res.json()
setError(msg);
console.log('error', error)

    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
          MUI
        </Link>,
        <Link
          underline="hover"
          key="2"
          color="inherit"
          href="/material-ui/getting-started/installation/"
          onClick={handleClick}
        >
          Core
        </Link>,
        <Typography key="3" color="text.primary">
          Breadcrumb
        </Typography>,
      ];

      
    return(
        <>
        <h1>Practice Series</h1>
        <h2>"Series Name"</h2>
        <Stack direction="row" spacing={2}>
        <Card>
            <CardHeader title="Pose name 1" />
            <CardContent>
                Breath (inhale/exhale)<br/>
                {introPose}<br/>
            </CardContent>
        </Card>
        +<br/>
        <Card>
            <CardHeader title="Pose name 2" />
            <CardContent>
                Breath (inhale/exhale)<br/>
                {focusPose}<br/>
            </CardContent>
        </Card>
        +<br/>
        <Card>
            <CardHeader title="Pose name 3" />
            <CardContent>
                Breath (inhale/exhale)<br/>
                {outroPose}<br/>
            </CardContent>
        </Card>
        </Stack>

        <div role="presentation" onClick={handleClick}>
        <Stack spacing={2}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
    </div>
        </>
    )
}
