import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import Loader from "../components/loader";

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP,
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usElectionContract = useUSElectionContract(contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>("Unknown");
  const [bidenseats, setBidenSeats] = useState<number>(0);
  const [trumpseats, setTrumpSeats] = useState<number>(0);
  const [electionisOpen, setElectionIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [txPendingLoader, setTxPendingLoader] = useState<boolean | false>();
  const [txPendingHash, setTxPendingHash] = useState<string | "">();
  useEffect(() => {
    getCurrentLeader();
    getCurrentSeats();
    getElectionIsOpen();
  }, []);

  const getCurrentLeader = async () => {
    const currentLeader = await usElectionContract.currentLeader();
    setCurrentLeader(
      currentLeader == Leader.UNKNOWN
        ? "Unknown"
        : currentLeader == Leader.BIDEN
        ? "Biden"
        : "Trump"
    );
  };

  const getCurrentSeats = async () => {
    const seats = await usElectionContract.currentSeats();
    setBidenSeats(seats[0].toNumber());
    setTrumpSeats(seats[1].toNumber());
  };

  const getElectionIsOpen = async () => {
    const isOpen = await usElectionContract.isElectionOpen();
    setElectionIsOpen(isOpen);
  };

  const stateInput = (input) => {
    setName(input.target.value);
  };

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value);
  };

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value);
  };

  const seatsInput = (input) => {
    setStateSeats(input.target.value);
  };

  const showTxPendingLoader = (hash) => {
    updateTxPendingHash(hash);
    setTxPendingLoader(true);
  };

  const hideTxPendinfLoader = () => {
    setTxPendingLoader(false);
  };

  const updateTxPendingHash = (hash) => {
    setTxPendingHash(hash);
  };

  usElectionContract.on("LogStateResult", (winner, stateSeats, state, tx) => {
    getCurrentLeader();
    getCurrentSeats();
  });

  usElectionContract.on("LogElectionEnded", (winner) => {
    getCurrentLeader();
    setElectionIsOpen(false);
  });

  const submitStateResults = async () => {
    const result: any = [name, votesBiden, votesTrump, stateSeats];
    const tx = await usElectionContract.submitStateResult(result);
    showTxPendingLoader(tx.hash);
    await tx.wait();
    hideTxPendinfLoader();
    resetForm();
  };

  const endElection = async () => {
    const tx = await usElectionContract.endElection();
    showTxPendingLoader(tx.hash);
    await tx.wait();
    hideTxPendinfLoader();
    resetForm();
  };

  const resetForm = async () => {
    setName("");
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  };

  return (
    <>
      {txPendingLoader ? (
        <Loader hash={txPendingHash} />
      ) : (
        <div className="results-form">
          <p>Current Leader is: {currentLeader}</p>
          <p>
            Seats
            <br />
            BIDEN : {bidenseats}
            <br />
            TRUMP : {trumpseats}
          </p>
          <p>Election Status : {electionisOpen ? "Open" : "Closed"}</p>
          <form>
            <label>
              State:
              <input
                onChange={stateInput}
                value={name}
                type="text"
                name="state"
              />
            </label>
            <label>
              BIDEN Votes:
              <input
                onChange={bideVotesInput}
                value={votesBiden}
                type="number"
                name="biden_votes"
              />
            </label>
            <label>
              TRUMP Votes:
              <input
                onChange={trumpVotesInput}
                value={votesTrump}
                type="number"
                name="trump_votes"
              />
            </label>
            <label>
              Seats:
              <input
                onChange={seatsInput}
                value={stateSeats}
                type="number"
                name="seats"
              />
            </label>
            {/* <input type="submit" value="Submit" /> */}
          </form>
          <div className="button-wrapper">
            <button disabled={!electionisOpen} onClick={submitStateResults}>
              Submit Results
            </button>
          </div>
          <div className="button-wrapper">
            <button disabled={!electionisOpen} onClick={endElection}>
              End Election
            </button>
          </div>
          <style jsx>{`
            .results-form {
              display: flex;
              flex-direction: column;
            }

            .button-wrapper {
              margin: 20px;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default USLibrary;
