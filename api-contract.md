# The Master Context Prompt (For AI Generation)

Act as a Senior Full-Stack Developer under a strict 6-hour hackathon deadline.
We are building a Smart Campus Service Management System with a 3D spatial interface.

## TECH STACK:
- Framework: Next.js 15 (App Router only. Do not use Pages router).
- Styling: Tailwind CSS.
- Animations: Framer Motion.
- 3D Engine: React Three Fiber (R3F) & Drei.
- Database: Supabase (PostgreSQL).

## STRICT CODING RULES:
1. Speed over scalability. Do not over-engineer abstractions. 
2. Use absolute imports (e.g., `@/components/UI/Card`).
3. For UI components, write self-contained functional components using Tailwind. Do not write custom CSS files.
4. Assume dark mode is default. Use `bg-black`, `bg-zinc-900`, `border-zinc-800`, and `text-white`.
5. For state management, stick to React `useState` and `useEffect`. Do not introduce Redux or Zustand.
6. When writing API routes, use Next.js Route Handlers (`app/api/.../route.ts`). Return standard `NextResponse.json()` objects.
7. Gracefully fail. If a database fetch fails, return an empty array `[]` rather than crashing the client.

Output only the requested code. Do not explain the code unless asked.

## The API Contracts
These are the strict data structures your frontend components will send to your Next.js Route Handlers, and exactly what they should expect back. Beginner 1 (Database) must build to match these responses. Beginner 2 (Frontend) must build components that consume these exact shapes.

### 1. The Agentic Router (POST /api/agent)
This is the route you will build to talk to the LLM. It extracts intent and location from natural language.

**Request Body:**
```json
{
  "message": "The AC in Lab 3 is dripping water on the computers."
}
```

**Success Response (200 OK):**
```json
{
  "reply": "I've logged a high-priority maintenance request for the AC in Lab 3.",
  "action": {
    "intent": "CREATE_TICKET",
    "department": "Maintenance",
    "priority": "Urgent",
    "location_id": "LAB_3" 
  }
}
```
*(Note: location_id must map to your hardcoded 3D coordinates on the frontend, e.g., `const LOCATIONS = { LAB_3: [12, 5, -4] }`)*

### 2. Create Service Request (POST /api/requests)
Used by the standard submission form and the AI agent to log a ticket into Supabase.

**Request Body:**
```json
{
  "title": "AC Leaking",
  "description": "Dripping water on computers.",
  "department": "Maintenance",
  "priority": "Urgent",
  "location_id": "LAB_3",
  "user_id": "uuid-string"
}
```

**Success Response (201 Created):**
```json
{
  "id": "req_8f72c",
  "status": "Pending",
  "message": "Request created successfully."
}
```

### 3. Fetch All Requests (GET /api/requests?status=Pending)
Used by the Admin Dashboard and the 3D Map Sidebar to load active tickets.

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "req_8f72c",
      "title": "AC Leaking",
      "department": "Maintenance",
      "priority": "Urgent",
      "status": "Pending",
      "location_id": "LAB_3",
      "created_at": "2026-10-06T10:00:00Z"
    },
    {
      "id": "req_9a11b",
      "title": "Need bonafide certificate",
      "department": "Admin",
      "priority": "Low",
      "status": "Assigned",
      "location_id": "ADMIN_BLOCK",
      "created_at": "2026-10-05T14:30:00Z"
    }
  ]
}
```

### 4. Update Request Status (PATCH /api/requests/:id)
Used by the Admin Dashboard to move tickets across the Kanban board (Pending → Assigned → Completed).

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Success Response (200 OK):**
```json
{
  "id": "req_8f72c",
  "status": "In Progress",
  "updated_at": "2026-10-06T11:15:00Z"
}
```
