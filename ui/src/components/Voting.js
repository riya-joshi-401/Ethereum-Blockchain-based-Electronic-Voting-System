import React, { Component } from "react";
import { connect } from "react-redux";
import Web3 from "web3";
import contract from "@truffle/contract";
import contractMeta from "../contracts/Voting.json";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { logout } from "../redux";
import Auth from "./Auth";

export class Voting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      account: null,
      candidates: [],
      hasVoted: null,
    };

    this.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER
    );
    this.contract = contract(contractMeta);
    this.contract.setProvider(this.web3.currentProvider);
  }

  connectBlockchain = async () => {
    const accounts = await this.web3.eth.requestAccounts();
    this.setState({ account: accounts[0] });
  };

  getCandidateDetails = async () => {
    const contractInstance = await this.contract.deployed();
    const candidateCount = await contractInstance
      .candidateIdTracker()
      .then((count) => count.toNumber());

    let hasVoted = await contractInstance.hasVoted(this.props.aadhaar);

    let candidates = [];
    let candidate;

    for (let i = 0; i < candidateCount; i++) {
      candidate = await contractInstance.candidateList(i).then((c) => ({
        id: c.id.toNumber(),
        name: c.name,
        votes: c.votes.toNumber(),
      }));
      candidates.push(candidate);
    }
    this.setState({ candidates, hasVoted });
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.aadhaar && this.props.aadhaar) this.getCandidateDetails();
  }

  componentDidMount() {
    this.connectBlockchain()
      .then(() => toast.success("Blockchain connected"))
      .catch((err) => toast.error(err.message))
      .finally(() => this.setState({ loading: false }));
  }

  vote = (candidateName, candidateId) => {
    this.setState({ loading: true }, async () => {
      const contractInstance = await this.contract.deployed();
      await contractInstance
        .voteCandidate(this.props.aadhaar, candidateId, {
          from: this.state.account,
        })
        .then(() => {
          toast.info(`Voted ${candidateName}`, {
            onClose: () => window.location.reload(),
          });
        })
        .catch((err) =>
          toast.error(err.message, {
            onClose: () => window.location.reload(),
          })
        );
    });
  };

  render() {
    if (this.state.loading) return <Loading />;
    if (!this.props.aadhaar) return <Auth />;
    return (
      <div className="d-flex flex-column container">
        <header className="col py-3 d-flex justify-content-between align-items-center">
          <h1 id="app-title">E-Voting System</h1>
          <div className="d-flex flex-column align-items-end">
            <span className="">
              <b>Aadhaar number:</b> <code>{this.props.aadhaar}</code>
            </span>
            <span
              role="button"
              className="btn-link text-danger"
              onClick={() => {
                this.props.logout();
              }}
            >
              Logout
            </span>
          </div>
        </header>
        {this.state.candidates.length ? (
          <table className="col table table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Vote</th>
              </tr>
            </thead>
            <tbody>
              {this.state.candidates.length &&
                this.state.candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <th scope="row">{candidate.id}</th>
                    <td>{candidate.name}</td>
                    <td>
                      {!this.state.hasVoted ? (
                        <span
                          role="button"
                          className="btn-link"
                          onClick={() =>
                            this.vote(candidate.name, candidate.id)
                          }
                        >
                          Vote
                        </span>
                      ) : (
                        candidate.votes
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ aadhaar }) => ({ aadhaar });

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Voting);
