import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch the install script from GitHub
        const response = await fetch(
            'https://raw.githubusercontent.com/ewgenius/extt/main/install.sh',
            {
                // Cache for 5 minutes to reduce GitHub API calls
                next: { revalidate: 300 },
            }
        );

        if (!response.ok) {
            return new NextResponse('Install script not found', { status: 404 });
        }

        const script = await response.text();

        // Return the script with appropriate headers
        return new NextResponse(script, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                // Allow caching on CDN/browser for 5 minutes
                'Cache-Control': 'public, max-age=300, s-maxage=300',
            },
        });
    } catch (error) {
        console.error('Error fetching install script:', error);
        return new NextResponse('Error fetching install script', { status: 500 });
    }
}
