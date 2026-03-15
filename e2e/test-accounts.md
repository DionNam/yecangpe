# E2E Test Accounts

Created: 2026-02-10

## Accounts

| Role | Email | Password | Auth ID | Public User Role | Has Profile |
|------|-------|----------|---------|------------------|-------------|
| Seeker (existing) | test-seeker@hanguljobs.com | TestPass123! | e8abd67d-e490-46be-83ea-6338becba8c4 | seeker | Yes (nationality=US, korean_level=intermediate, is_profile_public=true) |
| Seeker (new) | test-seeker-new@hanguljobs.com | TestPass123! | 00736870-3e55-42ea-bcbf-18ac27647913 | - | No (onboarding test) |
| Employer (existing) | test-employer@hanguljobs.com | TestPass123! | 8fd0c021-d3ee-43c1-95fb-c628e3497f7f | employer | Yes (company_name=Test Company Inc) |
| Employer (new) | test-employer-new@hanguljobs.com | TestPass123! | a4716967-2eec-4186-84ee-21125ab8ee35 | - | No (onboarding test) |

## Login Helper (browser_evaluate)

```js
const SUPABASE_URL = 'https://xztfqnznwcgjjbpyuchf.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dGZxbnpud2NnampicHl1Y2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM0MjMsImV4cCI6MjA4NDIyOTQyM30.93FMAkeqNhT8OTNoG3La7AGA9gJI6bsVyGR97w80PLU';

const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
  body: JSON.stringify({ email: EMAIL, password: 'TestPass123!' })
});
const session = await res.json();
localStorage.setItem('sb-xztfqnznwcgjjbpyuchf-auth-token', JSON.stringify(session));
// Then reload page
```

## Cleanup

```sql
DELETE FROM public.likes WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE 'test-%@hanguljobs.com');
DELETE FROM public.job_posts WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE 'test-%@hanguljobs.com');
DELETE FROM public.seeker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE 'test-%@hanguljobs.com');
DELETE FROM public.employer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE 'test-%@hanguljobs.com');
DELETE FROM public.users WHERE email LIKE 'test-%@hanguljobs.com';
DELETE FROM auth.users WHERE email LIKE 'test-%@hanguljobs.com';
```
