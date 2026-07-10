const imageRequestPattern =
  /\b(?:buat(?:kan)?|bikin|generate|create|draw|render)\s+(?:gambar|image|picture|photo|foto|ilustrasi|illustration)\b|\b(?:gambar|image|picture|photo|foto|ilustrasi|illustration)\b/i;
const imageAnalysisPattern = /\b(?:apa|what|describe|jelaskan|analisis|analyze|identify|lihat)\b/i;

export function isImageGenerationRequest(question: string, hasInputImages = false): boolean {
  const normalized = question.trim();
  if (!normalized) return false;
  if (hasInputImages && imageAnalysisPattern.test(normalized)) return false;
  return imageRequestPattern.test(normalized);
}
