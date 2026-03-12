-- Make sure created_at and updated_at default to current UTC timestamp
ALTER TABLE users
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- Create a function to set PH time (UTC+8) on insert
CREATE OR REPLACE FUNCTION set_ph_time_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := NOW() + INTERVAL '8 hours';
  NEW.updated_at := NOW() + INTERVAL '8 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
CREATE TRIGGER trigger_set_ph_time_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_ph_time_insert();

-- Create a function to update updated_at on UPDATE
CREATE OR REPLACE FUNCTION set_ph_time_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW() + INTERVAL '8 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for UPDATE
CREATE TRIGGER trigger_set_ph_time_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_ph_time_update();