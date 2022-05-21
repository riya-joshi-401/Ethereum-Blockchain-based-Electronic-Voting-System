// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Voting {
    uint256 public candidateIdTracker;
    struct Candidate {
        uint256 id;
        string name;
        uint256 votes;
    }

    mapping(uint256 => Candidate) public candidateList;

    function createCandidate(string memory name) private {
        Candidate memory candidate;
        candidate.id = candidateIdTracker;
        candidate.name = name;
        candidate.votes = 0;
        candidateList[candidateIdTracker] = candidate;
        candidateIdTracker++;
    }

    constructor(string[] memory candidates) {
        candidateIdTracker = 0;
        // ["Candidate A", "Candidate B", "Candidate C"]
        for (uint256 i = 0; i < candidates.length; i++) {
            createCandidate(candidates[i]);
        }
    }

    mapping(uint40 => bool) public hasVoted;

    function voteCandidate(uint40 aadhaarId, uint256 candidateId) public {
        require(hasVoted[aadhaarId] == false, "ALREADY VOTED");
        hasVoted[aadhaarId] = true;
        candidateList[candidateId].votes++;
    }
}
