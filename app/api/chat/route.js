import { dbConnect } from '@/lib/mongodb';
import { Conversation, Message } from '@/lib/models';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    try {
        await dbConnect();
        if (conversationId) {
            const conversation = await Conversation.findById(conversationId);
            const messages = await Message.find({ conversationId }).lean();
            return new Response(JSON.stringify({ conversation, messages }), { status: 200 });
        } else {
            const conversations = await Conversation.find().lean();
            return new Response(JSON.stringify({ conversations }), { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
    }
}

export async function POST(request) {
    const { message, conversationId } = await request.json();
    try {
        await dbConnect();
        let convId = conversationId;

        if (!convId) {
            const conv = await Conversation.create({
                title: message.slice(0, 50),
                createdAt: new Date(),
            });
            convId = conv._id.toString();
        }

        await Message.create({
            conversationId: convId,
            role: 'user',
            content: message,
            timestamp: new Date(),
        });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }],
                }),
            }
        );

        const data = await response.json();
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
        }
        const aiResponse = data.candidates[0].content.parts[0].text;

        await Message.create({
            conversationId: convId,
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        });

        return new Response(JSON.stringify({ conversationId: convId, response: aiResponse }), { status: 200 });
    } catch (error) {
        console.error('Error processing message:', error);
        return new Response(JSON.stringify({ error: 'Error processing message' }), { status: 500 });
    }
}

export async function PUT(request) {
    const { conversationId, title } = await request.json();
    try {
        await dbConnect();
        await Conversation.findByIdAndUpdate(conversationId, { title });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error updating conversation:', error);
        return new Response(JSON.stringify({ error: 'Error updating conversation' }), { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    try {
        await dbConnect();
        await Conversation.findByIdAndDelete(conversationId);
        await Message.deleteMany({ conversationId });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return new Response(JSON.stringify({ error: 'Error deleting conversation' }), { status: 500 });
    }
}