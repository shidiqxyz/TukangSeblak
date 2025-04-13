import { ethers } from 'ethers';

export async function POST(req) {
  const body = await req.json();
  const { address, peerId } = body;

  if (!address && !peerId) {
    return new Response(JSON.stringify({ message: 'Address atau Peer ID harus diisi.' }), {
      status: 400,
    });
  }

  const contractAddress = "0x2fC68a233EF9E9509f034DD551FF90A79a0B8F82";
  const alchemyRpc = process.env.ALCHEMY_RPC;

  const iface = new ethers.utils.Interface([
    "function getVoterVoteCount(address voter) view returns (uint256)",
    "function getPeerId(address voter) view returns (string)",
    "function getTotalWins(string peerId) view returns (uint256)"
  ]);

  try {
    const result = {};

    if (address) {
      const addressChecksum = ethers.utils.getAddress(address); // Ensures checksum format

      // getVoterVoteCount(address)
      const voteData = iface.encodeFunctionData("getVoterVoteCount", [addressChecksum]);
      const voteRes = await fetch(alchemyRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: voteData,
            },
            'latest',
          ],
        }),
      });
      const voteJson = await voteRes.json();
      result.voteCount = parseInt(voteJson.result || '0x0', 16);

      // getPeerId(address)
      const peerData = iface.encodeFunctionData("getPeerId", [addressChecksum]);
      const peerRes = await fetch(alchemyRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: peerData,
            },
            'latest',
          ],
        }),
      });
      const peerJson = await peerRes.json();
      const peerHex = peerJson.result || '0x';
      const rawHex = peerHex.replace(/^0x/, '');
      result.peerId = rawHex ? Buffer.from(rawHex, 'hex').toString('utf8').replace(/\u0000/g, '') : '';
    }

    if (peerId) {
      // getTotalWins(string peerId)
      const winsData = iface.encodeFunctionData("getTotalWins", [peerId]);
      const winsRes = await fetch(alchemyRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: winsData,
            },
            'latest',
          ],
        }),
      });
      const winsJson = await winsRes.json();
      result.totalWins = parseInt(winsJson.result || '0x0', 16);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Vote Fetch Error:", error);
    return new Response(JSON.stringify({ message: 'Error fetching data', error: error.message }), {
      status: 500,
    });
  }
}
