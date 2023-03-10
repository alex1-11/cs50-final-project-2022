CREATE TABLE users (
	id integer PRIMARY KEY AUTOINCREMENT,
	name text NOT NULL UNIQUE,
	hash text NOT NULL
);

CREATE TABLE tasks (
	id integer PRIMARY KEY AUTOINCREMENT,
	created datetime NOT NULL,
	user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title text NOT NULL,
	status text NOT NULL,
	priority integer NOT NULL,
	date date,
	datetime datetime,
	context_id integer REFERENCES contexts(id) ON DELETE SET NULL ON UPDATE CASCADE,
	project_id integer REFERENCES projects(id) ON DELETE SET NULL ON UPDATE CASCADE,
	note text,
	parent_id integer,
	repeat text
);

CREATE TABLE projects (
	id integer PRIMARY KEY AUTOINCREMENT,
	created datetime DEFAULT CURRENT_TIMESTAMP,
	title text NOT NULL,
	status text DEFAULT 'active' NOT NULL,
	color text,
	section text
);

CREATE TABLE tags (
	id integer PRIMARY KEY AUTOINCREMENT,
	title text UNIQUE NOT NULL
);

CREATE TABLE task_tags (
	task_id integer NOT NULL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
	tag_id integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE,
	UNIQUE (task_id, tag_id)
);

CREATE TABLE contexts (
	id integer PRIMARY KEY AUTOINCREMENT,
	title text UNIQUE NOT NULL
);

CREATE TABLE alarms (
	id integer PRIMARY KEY AUTOINCREMENT,
	task_id integer NOT NULL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
	datetime datetime NOT NULL
);

CREATE TABLE settings (
	id integer PRIMARY KEY AUTOINCREMENT,
	setting text UNIQUE NOT NULL
);

CREATE TABLE user_settings (
	user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	setting_id integer NOT NULL REFERENCES settings(id) ON DELETE CASCADE ON UPDATE CASCADE,
	state integer NOT NULL,
	UNIQUE (user_id, setting_id)
);









