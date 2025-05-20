import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { errorMessage } = await request.json();
    
    if (!errorMessage) {
      return NextResponse.json({ error: 'Error message is required' }, { status: 400 });
    }

    // Construct the prompt
    const prompt = `Your an AI expert to solve this error and give solution from starting of the code to the ending of the code. Error:${errorMessage}\n\nAI Response:`;
    
    // Make the request to your original API using axios
    const apiResponse = await axios.get(
      `${process.env.API_URL}/${encodeURIComponent(prompt)}`,
    );
    
    return NextResponse.json({ data : apiResponse.data });
  } catch (error) {
    console.error('Error in AI API:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}