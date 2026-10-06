-- Go to the Supabase SQL editor and run the following commands to create the tables.

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin', 'department_head'))
);

CREATE TABLE Requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed')) DEFAULT 'Pending',
    building_location TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'Urgent')) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
