import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { diary } = await req.json();

    console.log("Analyzing diary with Gemini API...");

    // 1.5 Flash 8B 버전을 가장 먼저 시도 (API 버전 안정성 측면에서 가장 유리)
    // 8B 모델은 빠르고 구조화된 응답을 잘 반환하며 지역 제한이 적습니다.
    const result = await generateObject({
      model: google('gemini-3.1-flash-lite-preview'),
      schema: z.object({
        emotionId: z.enum(['joy', 'sadness', 'anger', 'surprise', 'calm']),
        feedback: z.string().describe('사용자에게 들려줄 따뜻하고 공감되는 피드백 한 문장'),
      }),
      system: `당신은 일기 분석 전문가입니다. 사용자의 일기를 보고 다음 5가지 감정 중 하나를 선택하고 공감되는 피드백을 작성하세요.
      반드시 지정된 JSON 형식을 지켜야 하며, 다른 텍스트는 포함하지 마십시오.`,
      prompt: diary,
    });

    console.log("AI Analysis Success:", result.object);

    return Response.json(result.object);
    
  } catch (error) {
    console.error("Gemini API Runtime Error:", error);
    
    // 에러 발생 시 구체적인 디버깅 로그
    let errorMessage = "AI 분석 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      
      // 모델 이름 관련 404 오류 대응
      if (error.message.includes('not found')) {
        errorMessage = "지정된 Gemini AI 모델을 찾을 수 없습니다. (지역 제한 또는 사용 가능한 모델 목록을 확인해주세요)";
      }
    }

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
