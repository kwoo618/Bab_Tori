export interface Food {
  id?: string;
  name: string;
  category: string;
  ingredients: string;
  imageUrl?: string; // ✅ image_url이 아니라 imageUrl (카멜 케이스)로 수정
  description?: string;
  reason?: string;
  type?: string;
  emoji: string
  isRecommended: boolean
}