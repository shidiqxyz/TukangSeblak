import { Web3 } from 'web3';
import axios from 'axios';

const web3 = new Web3('https://ethereum.publicnode.com');

async function resolveEns(name) {
    console.log(`Resolving ENS name: ${name}`);
    try {
        if (name.endsWith('.eth')) {
            const address = await web3.eth.ens.getAddress(name);
            if (!address) throw new Error(`ENS name ${name} not found`);
            return address;
        }
        return name;
    } catch (err) {
        console.error(`Error resolving ENS name ${name}: ${err.message}`);
        throw new Error(`Failed to resolve ENS name ${name}: ${err.message}`);
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const inputAddress = searchParams.get('address');

    console.log(`Processing address or ENS: ${inputAddress}`);
    let resolvedAddress;

    try {
        resolvedAddress = await resolveEns(inputAddress);
        console.log(`Resolved address: ${resolvedAddress}`);
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid ENS name', details: err.message }), { status: 400 });
    }

    try {
        // Fetch points data from the first API
        const pointsResponse = await axios.get('https://api.resolv.im/points', {
            params: { address: resolvedAddress, mock: 'false' },
            headers: { Accept: 'application/json' }
        });

        // Fetch leaderboard data from the second API
        const leaderboardResponse = await axios.get('https://api.resolv.im/points/leaderboard/slice', {
            params: { address: resolvedAddress },
            headers: { Accept: 'application/json' }
        });

        const { requestedAddressIndex, rows } = leaderboardResponse.data;

        // Check if the requested address exists in the leaderboard
        if (requestedAddressIndex === -1 || !rows || rows.length === 0) {
            return new Response(JSON.stringify({
                error: 'Address not found in leaderboard',
                pointsData: pointsResponse.data
            }), { status: 404 });
        }

        // Find the specific entry for the requested address in the leaderboard
        const userEntry = rows.find(row => row.address.toLowerCase() === resolvedAddress.toLowerCase());

        if (!userEntry) {
            return new Response(JSON.stringify({
                error: 'Address not found in leaderboard',
                pointsData: pointsResponse.data
            }), { status: 404 });
        }

        // Combine data from both APIs
        const combinedData = {
            points: pointsResponse.data,
            leaderboard: {
                rank: userEntry.rank,
                address: userEntry.address,
                points: userEntry.points
            }
        };

        return new Response(JSON.stringify(combinedData), { status: 200 });

    } catch (err) {
        console.error(`Error fetching data: ${err.message}`);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Resolv.im', details: err.message }), { status: 500 });
    }
}