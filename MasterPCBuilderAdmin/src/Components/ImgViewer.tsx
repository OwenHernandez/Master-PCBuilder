import {useQuery} from "@apollo/client";
import {GET_FILE} from "../Querys/Querys";
import {useAppContext} from "../Contexts/AppContextProvider";
import {useEffect, useState} from "react";
import {Globals} from "./Globals";

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
    category: string;
}

const ImgViewer = (props: Props) => {
    const {filename, category} = props;
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
    if (error) {
        if (category === Globals.CATEGORY_GAMING) {
            return <img src={"https://regeneration.co.nz/cdn/shop/files/ullr-gaming-pc-regen-computers.webp?v=1696907011"}
                        className="image-style" alt={"default-profilePic"}/>;
        } else if (category === Globals.CATEGORY_BUDGET) {
            return <img src={"https://pcbuildsonabudget.com/wp-content/uploads/2022/10/1200-Dollar-PC-Build-Case.jpg"}
                        className="image-style" alt={"default-profilePic"}/>;
        } else if (category === Globals.CATEGORY_WORK) {
            return <img src={"https://www.pcspecialist.co.uk/images/cases/12030/h.png?1602846384"}
                        className="image-style" alt={"default-profilePic"}/>;
        } else if (category === "groupChat") {
            return <img src={"https://www.tenniscall.com/images/chat.jpg"}
                        className="image-style" alt={"default-profilePic"}/>;
        } else {
            return <img src={"https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"}
                        className="image-style" alt={"default-profilePic"}/>;
        }
    }
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