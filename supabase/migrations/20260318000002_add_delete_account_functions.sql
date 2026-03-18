-- Create SQL functions for account deletion to bypass schema cache issues

-- Function: soft delete user account
CREATE OR REPLACE FUNCTION soft_delete_user_account(
  user_id_param UUID,
  reason_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET
    deleted_at = NOW(),
    deletion_reason = COALESCE(reason_param, 'User requested account deletion'),
    is_active = FALSE
  WHERE id = user_id_param;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Function: restore user account (admin only)
CREATE OR REPLACE FUNCTION restore_user_account(
  user_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT role = 'admin' INTO is_admin_user
  FROM users
  WHERE id = auth.uid();

  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE users
  SET
    deleted_at = NULL,
    deletion_reason = NULL,
    is_active = TRUE
  WHERE id = user_id_param;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Function: hard delete user account (admin only)
CREATE OR REPLACE FUNCTION hard_delete_user_account(
  user_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT role = 'admin' INTO is_admin_user
  FROM users
  WHERE id = auth.uid();

  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM users WHERE id = user_id_param;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
