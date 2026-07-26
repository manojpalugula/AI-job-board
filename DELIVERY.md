# Recruiter workflow update

## What changed

- Recruiters no longer see **Save** or **Apply now** actions on job cards and job details.
- Candidates can submit one application per role. Duplicate applications are prevented.
- Recruiters can post any number of jobs. The dashboard shows only the signed-in recruiter's jobs.
- Every job displays its own applicant count and opens an individual applicant list, including candidate name, email, skills, and a hiring-status selector.
- The dashboard shows recruiter-specific totals for roles, applicants, and companies represented in that recruiter's postings.
- The existing Candidates page remains available for browsing the broader candidate pool.

## Run locally

1. Configure the server environment (including `MONGODB_URI` and `JWT_SECRET`).
2. From the project root, run `npm install`.
3. Run `npm run dev`.

The seeded recruiter account is `aisha.kapoor@example.com` with password `Password123!`.

## Verification

Server module syntax and the updated React JSX were parsed successfully. The starter's ESLint configuration does not enable JSX parsing, and Vite config loading was prevented by the restricted workspace sandbox, so those two commands could not be used as full build validation here.
