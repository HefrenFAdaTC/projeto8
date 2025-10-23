/*
  # Task Viewer Database Schema

  1. New Tables
    - `partners`
      - `rowguid` (uuid, primary key)
      - `name` (text, partner name)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `users`
      - `rowguid` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `partner_id` (uuid, foreign key to partners)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tasks`
      - `rowguid` (uuid, primary key)
      - `title` (text, task title)
      - `description` (text, detailed description)
      - `priority` (text, values: 'high', 'medium', 'low')
      - `status` (text, task status)
      - `due_date` (timestamptz, due date)
      - `created_by` (uuid, foreign key to users)
      - `partner_id` (uuid, foreign key to partners)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `comments`
      - `rowguid` (uuid, primary key)
      - `task_id` (uuid, foreign key to tasks)
      - `user_id` (uuid, foreign key to users)
      - `content` (text, comment text)
      - `created_at` (timestamptz)
    
    - `attachments`
      - `rowguid` (uuid, primary key)
      - `task_id` (uuid, foreign key to tasks)
      - `filename` (text)
      - `url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their partner's data
    - Add policies for users to create/update tasks
*/

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  rowguid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  rowguid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  partner_id uuid REFERENCES partners(rowguid) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  rowguid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'pending',
  due_date timestamptz,
  created_by uuid REFERENCES users(rowguid) ON DELETE SET NULL,
  partner_id uuid REFERENCES partners(rowguid) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  rowguid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(rowguid) ON DELETE CASCADE,
  user_id uuid REFERENCES users(rowguid) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  rowguid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(rowguid) ON DELETE CASCADE,
  filename text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_partner_id ON tasks(partner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_attachments_task_id ON attachments(task_id);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners
CREATE POLICY "Users can view their own partner"
  ON partners FOR SELECT
  TO authenticated
  USING (
    rowguid IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view users from their partner"
  ON users FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  );

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks from their partner"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks for their partner"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks from their partner"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM users WHERE rowguid = auth.uid()
    )
  );

-- RLS Policies for comments
CREATE POLICY "Users can view comments on tasks from their partner"
  ON comments FOR SELECT
  TO authenticated
  USING (
    task_id IN (
      SELECT rowguid FROM tasks WHERE partner_id IN (
        SELECT partner_id FROM users WHERE rowguid = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create comments on tasks from their partner"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    task_id IN (
      SELECT rowguid FROM tasks WHERE partner_id IN (
        SELECT partner_id FROM users WHERE rowguid = auth.uid()
      )
    )
  );

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments on tasks from their partner"
  ON attachments FOR SELECT
  TO authenticated
  USING (
    task_id IN (
      SELECT rowguid FROM tasks WHERE partner_id IN (
        SELECT partner_id FROM users WHERE rowguid = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create attachments on tasks from their partner"
  ON attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    task_id IN (
      SELECT rowguid FROM tasks WHERE partner_id IN (
        SELECT partner_id FROM users WHERE rowguid = auth.uid()
      )
    )
  );