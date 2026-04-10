# PixelCheck — AI-Assisted UI Review

Compare Figma designs vs live implementations. OpenCV detects pixel diffs, Claude AI explains them.

## Folder Structure

```
ui-reviewer/
├── frontend/        ← React + Tailwind (Vite)
│   └── src/
│       ├── features/
│       │   ├── upload/          ← Upload screens
│       │   │   ├── components/  (DropZone, ImagePreview)
│       │   │   ├── hooks/       (useUpload)
│       │   │   ├── pages/       (UploadPage)
│       │   │   └── context/     (UploadContext)
│       │   ├── review/          ← Compare view
│       │   │   ├── components/  (ReviewCanvas, SideBySide, SliderOverlay)
│       │   │   ├── hooks/       (useReview)
│       │   │   ├── pages/       (ReviewPage)
│       │   │   └── context/     (ReviewContext)
│       │   └── inspector/       ← Issue panel
│       │       ├── components/  (IssueInspector, IssueCard, SeverityBadge)
│       │       ├── hooks/       (useIssues)
│       │       └── context/     (InspectorContext)
│       └── shared/
│           ├── components/      (Sidebar)
│           └── hooks/           (useLocalStorage)
└── backend/         ← Node.js + Express + OpenCV + Claude
    ├── server.js
    ├── diff.py
    └── package.json
```

## Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- OpenCV for Python

### Install Python deps
```bash
pip install opencv-python numpy
```

### Backend
```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

1. Upload Figma export + live screenshot on the Upload page
2. Click **Run AI Scan** on the Review page
3. Express receives both images via multer
4. `diff.py` uses OpenCV `absdiff` + `findContours` to detect changed regions
5. Claude Vision analyses both images + diff regions → returns structured JSON issues
6. Issues are merged with bounding boxes and shown as annotations on the live screen
7. Each issue shows: label, severity, expected vs actual value, CSS fix with copy button

## API

`POST /api/analyze`
- Body: `multipart/form-data` with `figma` and `live` image files
- Returns: `{ issues: [...], total: N }`

`GET /api/health`
- Returns: `{ status: "ok" }`
