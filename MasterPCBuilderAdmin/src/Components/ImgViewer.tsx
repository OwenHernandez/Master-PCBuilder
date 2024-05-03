import {useQuery} from "@apollo/client";
import {GET_FILE} from "../Querys/Querys";
import {useAppContext} from "../Context/AppContextProvider";
import {useEffect, useState} from "react";

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
    console.log("FILENAME: " + filename);
    const [fileBase64, setFileBase64] = useState("");
    const {data, loading, error, refetch} = useQuery<QueryData, QueryVars>(GET_FILE, {
        variables: {filename},
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setFileBase64(data.getImage.content);
        },
        onError: (error) => {
            console.log("Error: " + error);
        }
    });

    useEffect(() => {
        refetch();
    }, [refetch, filename]);

    if (loading) return <p>Loading...</p>;
    if (error) return <img src={"https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"}
                           className="image-style" alt={"default-profilePic"}/>;
    return (
        <>
            {
                fileBase64 && (
                    <img src={`data:image/jpeg;base64,${fileBase64}`} alt={filename}
                         className="image-style"/>
                )
            }
        </>
    );
};

export default ImgViewer;