DROP TABLE IF EXISTS digitable;

CREATE TABLE digitable(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    img TEXT,
    level TEXT
)