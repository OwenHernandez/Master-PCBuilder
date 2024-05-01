import {useQuery} from "@apollo/client";
import {GET_FILE} from "../Querys/Querys";
import {useAppContext} from "../Context/AppContextProvider";

interface FileResponse {
    contentType: string;
    content: string;
}

interface QueryData {
    getImage: FileResponse;
}

interface QueryVars {
    filename: string;
}

type Props = {
    filename: string;
}

const ImgViewer = (props: Props) => {
    const {filename} = props;
    const {data, loading, error} = useQuery<QueryData, QueryVars>(GET_FILE, {
        variables: {filename}
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <img src={"https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"}
                           className="image-style" alt={"default-profilePic"}/>;
    return (
        <>
            {
                data && data.getImage && (
                    <img src={`data:image/jpeg;base64,${data.getImage.content}`} alt={filename}
                         className="image-style"/>
                )
            }
        </>
    );
};

export default ImgViewer;