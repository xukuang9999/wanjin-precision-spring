<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1S61T2YLAoLx8o80shVMQ3qu1Ldr1bz1G

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Set `VITE_API_BASE_URL` in `.env.local` if your API runs on a different origin.
3. Provide backend endpoints for AI features:
   - `POST /api/chat` -> `{ text: string }`
   - `POST /api/image` -> `{ image: string }` (base64 data URL)
4. Run the app:
   `npm run dev`
