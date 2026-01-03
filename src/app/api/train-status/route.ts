import { NextResponse } from 'next/server';

// Mock Data Source - In a real app, this would be replaced by a DB call or External API
const MOCK_TRAINS: Record<string, any> = {
    '12301': {
        number: '12301',
        name: 'RAJDHANI EXPRESS',
        from: 'NEW DELHI',
        to: 'HOWRAH JN',
        status: 'ON TIME',
        delay: 0,
        currentLocation: { lat: 26.8467, lon: 80.9462, name: 'LUCKNOW NR' },
        lastUpdated: '2 mins ago',
        route: [
            { code: 'NDLS', name: 'NEW DELHI', time: '16:50', status: 'DEPARTED' },
            { code: 'CNB', name: 'KANPUR CENTRAL', time: '21:32', status: 'DEPARTED' },
            { code: 'LKO', name: 'LUCKNOW NR', time: '22:45', status: 'ARRIVED' },
            { code: 'BSB', name: 'VARANASI JN', time: '02:00', status: 'UPCOMING' },
            { code: 'HWH', name: 'HOWRAH JN', time: '09:55', status: 'UPCOMING' }
        ]
    },
    '12423': {
        number: '12423',
        name: 'DIBRUGARH RAJDHANI',
        from: 'DIBRUGARH',
        to: 'NEW DELHI',
        status: 'DELAYED',
        delay: 45,
        currentLocation: { lat: 26.1445, lon: 91.7362, name: 'GUWAHATI' },
        lastUpdated: '10 mins ago',
        route: [
            { code: 'DBRG', name: 'DIBRUGARH', time: '20:55', status: 'DEPARTED' },
            { code: 'GHY', name: 'GUWAHATI', time: '05:30', status: 'DELAYED' },
            { code: 'NDLS', name: 'NEW DELHI', time: '10:30', status: 'UPCOMING' }
        ]
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const trainNo = searchParams.get('trainNo');

    if (!trainNo) {
        return NextResponse.json({ error: 'Train number is required' }, { status: 400 });
    }

    // 1. Try Real API if Key exists
    const apiKey = process.env.RAPID_API_KEY;
    if (apiKey) {
        try {
            // Example implementation for a future API integration (e.g., IRCTC via RapidAPI)
            // const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/getTrainStatus?trainNo=${trainNo}`, {
            //     headers: { 'X-RapidAPI-Key': apiKey }
            // });
            // const data = await response.json();
            // return NextResponse.json(transformRealData(data));
            console.log('API Key present but not configured for live endpoint yet.');
        } catch (error) {
            console.error('API Fetch Error:', error);
            // Fallback to mock on error
        }
    }

    // 2. Return Mock Data
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = MOCK_TRAINS[trainNo];
    if (data) {
        return NextResponse.json(data);
    } else {
        return NextResponse.json({ error: 'Train not found in mock database. Try 12301 or 12423.' }, { status: 404 });
    }
}
