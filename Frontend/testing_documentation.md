# SereNidra Application Testing & Verification Documentation

## 1. Pages and Routes
| Page Name | Route | Protected | Data Displayed | Components Used |
| :--- | :--- | :--- | :--- | :--- |
| **Landing** | `/` | No | Static content, Hero, Features | `Navbar`, `Hero`, `Features`, `Footer` |
| **About** | `/about` | No | Mission, interactive cards, philosophy | `Navbar`, `About`, `Footer` |
| **Signup** | `/signup` | No | Signup form | `Signup` |
| **Login** | `/login` | No | Login form | `Login` |
| **Dashboard** | `/dashboard` | **Yes** | User welcome, Generator action, Recent History | `Navbar`, `MeditationGenerator`, `SessionHistory`, `Footer` |
| **Generate** | `/generate` | **Yes** | Meditation creation form | `Navbar`, `MeditationForm` |
| **History** | `/history` | **Yes** | Search bar, Filter panel, Session list | `Navbar`, `History`, `SessionList`, `SearchBar`, `FilterPanel` |
| **Session Detail** | `/session/:id` | **Yes** | Full script, Audio Player, Details | `Navbar`, `MeditationDetailsPage`, `ScriptDisplay`, `AudioPlayer` |

## 2. API Endpoints
All protected endpoints require a valid Firebase Auth Token in the `Authorization` header.

| Method | Endpoint | Protected | Purpose | LLM/AI Integration |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | No | Backend Health Check | No |
| **GET** | `/health` | No | Backend Health Check | No |
| **POST** | `/api/meditations/generate` | **Yes** | Generate new meditation script | **Yes (Gemini)** |
| **POST** | `/api/meditations/{id}/generate-audio` | **Yes** | Generate audio narration for session | **Yes (TTS)** |
| **GET** | `/api/meditations` | **Yes** | Fetch user's session history | No |
| **GET** | `/api/meditations/search` | **Yes** | Search sessions by text/filter | No |
| **GET** | `/api/meditations/{id}` | **Yes** | Get single session details | No |
| **DELETE** | `/api/meditations/{id}` | **Yes** | Delete a session | No |
| **GET** | `/api/random-quote` | No | Fetch random inspirational quote | **Yes (Gemini)** |

## 3. User Interaction Flow
| User Action | What Happens | API Called | Result |
| :--- | :--- | :--- | :--- |
| **Sign Up** | User enters credentials on `/signup` | Firebase Auth | Account created, redirected to Login |
| **Log In** | User enters credentials on `/login` | Firebase Auth | Authenticated, redirected to `/dashboard` |
| **Generate Session** | User submits form on `/generate` | `POST /api/meditations/generate` | Custom script generated & saved to DB. User redirected to Session Detail. |
| **Play Audio** | User clicks "Generate Audio" on Detail page | `POST /api/meditations/{id}/generate-audio` | Audio file generated. Player appears and plays narration. |
| **View History** | Navigate to `/history` | `GET /api/meditations` | List of past sessions displayed. |
| **Search** | Type in Search Bar on `/history` | `GET /api/meditations/search?query=...` | List updates to show matching sessions. |
| **Filter** | Click "Sleep" filter on `/history` | `GET /api/meditations/search?type=Sleep` | List updates to show only Sleep sessions. |
| **Delete** | Click Trash icon on Session Card | `DELETE /api/meditations/{id}` | Session removed from DB and UI list. |

## 4. Protected Routes Verification
The following routes are wrapped in `<ProtectedRoute>` in `App.jsx`. Accessing them without being logged in automatically redirects to `/login`.
- `/dashboard`
- `/generate`
- `/history`
- `/session/:id`

## 5. Error Scenarios Verification
| Scenario | Behavior | Verified |
| :--- | :--- | :--- |
| **Invalid Login** | Firebase returns error, UI shows red alert "Invalid credentials". | ✅ |
| **Unauth Access** | Middleware redirects to `/login`. | ✅ |
| **API Failure** | Backend returns 500. Frontend catches error and shows "Failed to fetch...". | ✅ |
| **Empty Search** | Search returns 0 results. UI shows "No sessions found" state. | ✅ |
| **Audio Gen Fail** | If TTS fails, UI alerts user "Failed to generate audio". | ✅ |

## 6. Responsive Design
- **Mobile**: Navbar collapses to hamburger (if implemented) or stacks. Grids (History, Cards) become 1-column.
- **Desktop**: Sidebar/Navbar full width. Grids expand to 3 or 4 columns.
