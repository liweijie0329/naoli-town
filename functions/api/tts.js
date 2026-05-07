import { json, readJson } from "../_lib/http.js";
import { base64ChunksToUint8Array, serializeTtsError, synthesizeDoubaoSpeech } from "../_lib/doubao-tts.js";

export async function onRequestPost({ request, env }) {
  try {
    const payload = await readJson(request);
    const result = await synthesizeDoubaoSpeech(payload, env);
    const bytes = base64ChunksToUint8Array(result.audioBase64Chunks);

    return new Response(bytes, {
      status: 200,
      headers: {
        "content-type": result.mimeType,
        "cache-control": "no-store",
        "x-tts-provider": result.provider,
        "x-tts-request-id": result.requestId,
        "x-tts-voice-type": result.voiceType
      }
    });
  } catch (error) {
    const { status, payload } = serializeTtsError(error);
    return json(payload, status);
  }
}
