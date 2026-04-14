# PixelCheck — AI-Assisted UI Review

Compare Figma designs vs live implementations. OpenCV detects pixel diffs, Claude AI explains them.

## Folder Structure

```
Newgen/
├── backend/                  ← Node.js + Express API orchestrator
│   ├── package.json          ← Backend dependencies
│   ├── server.js             ← Main application entry point
│   ├── tmp/
│   │   └── uploads/          ← Temporary storage for uploaded images
│   └── src/
│       ├── config/           ← Configuration files
│       │   ├── claude.js
│       │   ├── db.js
│       │   └── passport.js
│       ├── controllers/      ← Request handlers
│       │   ├── auth.controller.js
│       │   ├── diff.controller.js
│       │   ├── figma.controller.js
│       │   ├── project.controller.js
│       │   ├── review.controller.js
│       │   └── upload.controller.js
│       ├── middlewares/      ← Express middlewares
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   └── upload.middleware.js
│       ├── models/           ← Database models
│       │   ├── project.model.js
│       │   ├── review.model.js
│       │   ├── upload.model.js
│       │   └── user.model.js
│       ├── routes/           ← Express route definitions
│       │   ├── auth.routes.js
│       │   ├── diff.routes.js
│       │   ├── figma.routes.js
│       │   ├── project.routes.js
│       │   ├── review.routes.js
│       │   └── upload.routes.js
│       ├── scripts/          ← External scripts
│       │   └── diff.py       ← OpenCV implementation
│       ├── services/         ← Core business logic
│       │   ├── claude.service.js
│       │   ├── diff.service.js
│       │   ├── email.service.js
│       │   └── figma.service.js
│       └── utils/            ← Helper functions
│           ├── fileHelper.js
│           ├── prompts.js
│           └── response.js
│
└── frontend/                 ← React + Tailwind CSS (Vite)
    ├── index.html            ← App entry HTML
    ├── package.json          ← Frontend dependencies
    ├── postcss.config.js     ← PostCSS config for Tailwind
    ├── tailwind.config.js    ← Tailwind styling configuration
    ├── vite.config.js        ← Vite bundler configuration
    └── src/
        ├── App.jsx           ← Main React component and Router setup
        ├── main.jsx          ← React DOM mounting point
        ├── index.css         ← Global CSS styles
        ├── features/         ← Feature-based directory structure
        │   ├── auth/         ← Authentication features
        │   │   ├── context/
        │   │   │   └── AuthContext.jsx
        │   │   ├── hooks/
        │   │   │   └── useAuth.js
        │   │   └── pages/
        │   │       ├── GoogleSuccess.jsx
        │   │       ├── LoginPage.jsx
        │   │       └── RegisterPage.jsx
        │   ├── figma/        ← Figma integration
        │   │   ├── components/
        │   │   │   └── FigmaConnect.jsx
        │   │   ├── context/
        │   │   │   └── FigmaContext.jsx
        │   │   └── hooks/
        │   │       └── useFigma.js
        │   ├── inspector/    ← Issue panel & AI feedback dashboard
        │   │   ├── AnalysisResults.jsx ← Top-level AI results screen
        │   │   ├── components/
        │   │   │   ├── AnalysisSummary.jsx
        │   │   │   ├── CategoryBreakdown.jsx
        │   │   │   ├── IssueCard.jsx
        │   │   │   ├── IssueInspector.jsx
        │   │   │   ├── IssueList.jsx
        │   │   │   ├── MetricCard.jsx
        │   │   │   ├── ScoreRing.jsx
        │   │   │   └── SeverityBadge.jsx
        │   │   ├── context/
        │   │   │   └── InspectorContext.jsx
        │   │   ├── css/
        │   │   │   └── AnalysisResults.css
        │   │   ├── hooks/
        │   │   │   └── useIssues.js
        │   │   └── utils/
        │   │       ├── mockData.js
        │   │       └── scoring.js
        │   ├── landing/      ← Public marketing footprint
        │   │   └── pages/
        │   │       └── LandingPage.jsx
        │   ├── review/       ← Image comparison stage
        │   │   ├── components/
        │   │   │   ├── ReviewCanvas.jsx
        │   │   │   ├── SideBySide.jsx
        │   │   │   └── SliderOverlay.jsx
        │   │   ├── context/
        │   │   │   └── ReviewContext.jsx
        │   │   └── pages/
        │   │       └── ReviewPage.jsx
        │   └── upload/       ← Image uploading features
        │       ├── components/
        │       │   └── (DropZone, ImagePreview components)
        │       ├── context/
        │       │   └── UploadContext.jsx
        │       └── pages/
        │           └── UploadPage.jsx
        └── shared/           ← App-wide reusable resources
            ├── components/
            │   ├── ProtectedRoute.jsx
            │   └── Sidebar.jsx
            └── hooks/
                └── useLocalStorage.js
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
