export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Читаем заголовки, которые прислал наш Python
    const provider = req.headers['x-provider'];
    const authHeader = req.headers['authorization'];

    let targetUrl = '';
    
    // Направляем запрос на нужный API
    if (provider === 'groq') {
        targetUrl = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (provider === 'cerebras') {
        targetUrl = 'https://api.cerebras.ai/v1/chat/completions';
    } else {
        return res.status(400).json({ error: 'Unknown provider' });
    }

    try {
        const fetchResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await fetchResponse.json();
        return res.status(fetchResponse.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
