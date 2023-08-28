import { Card, CardContent, CardHeader, Stack } from "@mui/material";

export default function Page(){

    return(
        <>
        <h1>Series Practice</h1>
        <h2>"Series Name"</h2>
        <Stack direction="row" spacing={2}>
        <Card>
            <CardHeader title="Pose name 1" />
            <CardContent>
                Breath (inhale/exhale)<br/>
            </CardContent>
        </Card>
        +<br/>
        <Card>
            <CardHeader title="Pose name 2" />
            <CardContent>
                Breath (inhale/exhale)<br/>
            </CardContent>
        </Card>
        +<br/>
        <Card>
            <CardHeader title="Pose name 3" />
            <CardContent>
                Breath (inhale/exhale)<br/>
            </CardContent>
        </Card>
        </Stack>
        </>
    )
}