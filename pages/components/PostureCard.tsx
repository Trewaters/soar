import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from '@mui/material/CardMedia';
import Paper from "@mui/material/Paper";

async function getData() {
    const res = await fetch('https://www.pocketyoga.com/poses.json')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function PostureCard() {

    const data = await getData()

    return (
        <Paper>
            {data.map((posture, index) => (

                <Card key={index}>
                    <CardHeader
                    title={posture.name}
                    subheader="posture name"
                    />
                          <CardMedia
        sx={{ height: 300, width: 200 }}
        image="yogaMat.jpg"
        title="green iguana"
      />
                    <CardContent>
                        <i>asana posture</i>
                        {/* 
                        <p>Pronunciation: {posture.sanskrit_names.latin }</p> 
                        <p>Duration: {posture duration }</p> 
                        <p>Meaning of Posture: {posture.sanskrit_names.translation.description }</p> 
                    */}
                    <p>Intent of Posture:</p>
                    <p>Breath: (Inhale/Exhale)</p>
                        <p>Dristi: optimal gaze for the position </p>
                        <p>Difficulty: {posture.difficulty}</p>
                        <p>Category: {posture.category}</p>
                        <p>Description: {posture.description}</p>
                        <p>Completed: (Done ✅) </p>
                    </CardContent>
                </Card>
            ))}
        </Paper>
    );
};