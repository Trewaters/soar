import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from '@mui/material/CardMedia';
import Paper from "@mui/material/Paper";

export default async function PostureCard(props: any) {

    return (
        <Paper>
            {/* {data.map((posture, index) => (

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
                        <p>Pronunciation: {posture.sanskrit_names.latin }</p> 
                        <p>Duration: {posture duration }</p> 
                        <p>Meaning of Posture: {posture.sanskrit_names.translation.description }</p> 
                    <p>Intent of Posture:</p>
                    <p>Breath: (Inhale/Exhale)</p>
                        <p>Dristi: optimal gaze for the position </p>
                        <p>Difficulty: {posture.difficulty}</p>
                        <p>Category: {posture.category}</p>
                        <p>Description: {posture.description}</p>
                        <p>Completed: (Done ✅) </p>
                    </CardContent>
                </Card>
            ))} */}
        </Paper>
    );
};