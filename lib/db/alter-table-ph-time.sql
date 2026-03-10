-- Make sure updated_at auto-updates on every update
ALTER TABLE users
MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Ensure created_at defaults to current timestamp
ALTER TABLE users
MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Trigger to set PH time on INSERT
DELIMITER $$

CREATE TRIGGER set_ph_time_insert BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  SET NEW.created_at = UTC_TIMESTAMP() + INTERVAL 8 HOUR;
  SET NEW.updated_at = UTC_TIMESTAMP() + INTERVAL 8 HOUR;
END$$

DELIMITER ;

-- Trigger to set PH time on UPDATE
DELIMITER $$

CREATE TRIGGER set_ph_time_update BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.updated_at = UTC_TIMESTAMP() + INTERVAL 8 HOUR;
END$$

DELIMITER ;