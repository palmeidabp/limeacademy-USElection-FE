import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { RINKEBY_ETHERSCAN_URL } from "../../constants";

import { LoaderContainer } from "./styles";

export default function Loader(props) {
  return (
    <LoaderContainer>
      <ClipLoader size={75} color="#8cc84b" loading={true} />
      <p>
        Tx :{" "}
        <a href={RINKEBY_ETHERSCAN_URL + "/tx/" + props.hash}>{props.hash}</a>
      </p>
    </LoaderContainer>
  );
}
