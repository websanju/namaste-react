import { useRouteError } from "react-router-dom";

const Error = () => {

const err = useRouteError();
console.log(err);

    return <div>
       {err.status} : {err.statusText}
    </div>
}

export default Error;