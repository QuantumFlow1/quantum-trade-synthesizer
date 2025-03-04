
-- Make sure the profiles table exists and is correctly configured
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'trader', 'viewer', 'super_admin', 'lov_trader')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  trading_enabled BOOLEAN DEFAULT false,
  max_trade_amount NUMERIC,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- A better function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_value TEXT;
BEGIN
  -- Special case for our super admin
  IF new.email = 'arturgabrielian4@gmail.com' THEN
    role_value := 'super_admin';
  ELSE
    role_value := 'viewer'; -- Default to viewer for regular users
  END IF;

  -- Insert the profile
  INSERT INTO public.profiles (id, email, role, status)
  VALUES (new.id, new.email, role_value, 'active');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
