import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
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
            {data.map((posture,index) => (

                <Card key={index}>
            <h1>{posture.name}</h1>
            <CardHeader>
                <h1></h1>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
            ))}
        </Paper>
    );
};