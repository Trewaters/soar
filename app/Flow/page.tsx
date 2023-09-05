import PostureSearch from "../../components/PosturesSearch";
import postureData from "@/interfaces/postureData";

export default function page(props: {postureProps: postureData[]}){
    return(
        <>
        <h1>Asana Postures</h1>
            <PostureSearch postures={props.postureProps}/>
        </>
    )
}