# PRD: Domain Migration — happyyoga.app → uvuyoga.com

## Overview

This PRD covers migrating the Soar application domain from the current production hostname (e.g., `https://www.happyyoga.app/`) to `uvuyoga.com` (primary: `https://www.uvuyoga.com`, with `www.uvuyoga.com` as an alias). The scope includes application changes (code, environment variables, tests, docs), infrastructure and operational changes (DNS, registrar, CDN/hosting, TLS), OAuth provider configuration (Google), analytics and SEO (sitemap, Search Console), email/web-push updates, and rollout procedures.

> Assumptions
>
> - The codebase follows Next.js 14 patterns and uses NextAuth for authentication.
> - Hosting is on Vercel (or similar). If you host elsewhere, the same high-level steps apply.
> - DNS and registrar are GoDaddy — you'll update DNS records and possibly manage domain forwarding there.
> - Google is used for social login; update Google OAuth client redirect URIs.

## Problem Statement

The site is currently live under `happyyoga.app` (or `www.happyyoga.app`) but needs to be moved to `uvuyoga.com`. The migration must preserve authentication, email/web-push delivery, SEO, and external integrations while minimizing downtime and user disruption.

## Target Users

- Existing authenticated users (must retain login & data access)
- New visitors arriving via search engines or marketing links
- Admins and DevOps maintaining domain, DNS, and provider settings

## Scope

### In-Scope

- Code updates to replace production base URLs and any hardcoded references to `happyyoga.app`.
- Environment variable updates: `NEXTAUTH_URL`, `NEXT_PUBLIC_BASE_URL`, VAPID keys/contact, analytics IDs as needed.
- OAuth provider updates (Google): update redirect URIs and origin settings.
- DNS changes at GoDaddy to point `uvuyoga.com` / `www.uvuyoga.com` to hosting provider.
- SSL/TLS provisioning (via Vercel or CDN) for `uvuyoga.com` and `www.uvuyoga.com`.
- Sitemap and robots updates and re-submission to Google Search Console.
- Email/footer content and web-push `mailto:` contacts updated to `@uvuyoga.com`.
- Tests updated to reflect new domain values and re-run.
- Redirect strategy: preserve inbound links (301 redirects from happyyoga.app → uvuyoga.com).
- Rollout plan with QA steps and rollback instructions.

### Out-of-Scope

- Large marketing campaigns or rebranding that require content overhaul.
- Domain purchase (assume `uvuyoga.com` is already owned).
- Major architectural changes unrelated to domain or routing.

## Functional Requirements

### Core Functionality

1. All generated absolute URLs in the app must use `https://www.uvuyoga.com` in production.
2. Environment variables must be updated and stored in Vercel (or hosting) to reflect the new domain.
3. OAuth redirects must allow `https://www.uvuyoga.com` and `https://uvuyoga.com` as authorized redirect URIs.
4. Existing `https://www.happyyoga.app/*` requests must receive 301 redirects to the equivalent `https://www.uvuyoga.com/*` URL.
5. Email templates, support contact addresses, and web-push VAPID contact must use `@uvuyoga.com`.
6. Analytics and Search Console should be updated to track `uvuyoga.com`.

### User Interface Requirements

- Any user-facing strings that show the domain (share messages, footers, invite links) must display `uvuyoga.com`.
- Social preview meta tags (OpenGraph/Twitter) should be validated for the new domain.
- Mobile/responsive behavior unaffected.

### Integration Requirements

- NextAuth config must use `NEXTAUTH_URL` = `https://www.uvuyoga.com` in production environment.
- Web-push must be updated to use `support@uvuyoga.com` in VAPID contact.
- Google OAuth console must include new redirect URIs.
- Vercel (or host) must have environment variables updated and new domain registered.

## User Stories

### Primary User Stories

**As a** returning user
**I want** to log in normally after the domain change
**So that** I can continue my existing sessions and access my data

Acceptance Criteria:

- [ ] Login via Google returns successfully to `https://www.uvuyoga.com` and session is established.
- [ ] Existing session cookies continue to function or users are redirected to a login with minimal friction.

**As an** admin
**I want** all requests to `happyyoga.app` to redirect to `uvuyoga.com`
**So that** SEO value and existing links do not break

Acceptance Criteria:

- [ ] 301 redirects are in place for all paths.
- [ ] Google Search Console shows crawl status and redirects.

### Secondary User Stories

**As a** developer
**I want** tests and environment to reflect the new production URL
**So that** CI passes and the codebase is consistent

Acceptance Criteria:

- [ ] Tests referencing the old domain are updated.
- [ ] Local `.env` and Vercel env show new values.

## Technical Requirements

### Frontend Requirements

- Update constants and utilities that produce absolute URLs (e.g., `app/utils/urlGeneration.ts`, `types/sharing.ts`).
- Update share strings and client components that render absolute domain strings.
- Update `manifest.json` and `public` resources if they contain absolute URLs.

### Backend Requirements

- Update `auth.ts` and NextAuth config to use the new `NEXTAUTH_URL`.
- Update any API route code that constructs absolute URLs for emails or redirects.
- Ensure cookie domain settings (if set explicitly) are updated to `uvuyoga.com`.

### Deployment/Infrastructure Requirements

- Add `uvuyoga.com` and `www.uvuyoga.com` to hosting provider (Vercel) as domains for the project.
- In GoDaddy, create or update DNS records:
  - A / ALIAS / ANAME pointing to host IPs or CNAME to the hosting provider as required.
  - Configure WWW as CNAME to root or provider recommended target.
- Enable automatic TLS via hosting provider or create certificates via Let's Encrypt.
- Create HTTP → HTTPS redirect rules if hosting requires it.

### OAuth & External Provider Requirements

- Update Google Cloud Console OAuth 2.0 Client ID authorized redirect URIs to include:
  - `https://www.uvuyoga.com/api/auth/callback/google`
  - `https://uvuyoga.com/api/auth/callback/google`
- Update any allowed JavaScript origins (if used) to `https://www.uvuyoga.com`.

### Data & SEO Requirements

- Generate an updated sitemap with `uvuyoga.com` URLs and submit to Google Search Console.
- Update robots.txt if it contains domain references.

## Success Criteria

- All production traffic is using `uvuyoga.com` (or redirected) without auth failures.
- No broken links for top 1,000 visited pages (monitor via analytics).
- Search engine indexing reflects the new domain after re-submission.
- No significant drop in user sign-in or session issues.

## Dependencies

### Internal Dependencies

- `app/utils/urlGeneration.ts`, `types/sharing.ts`, `lib/webPush.ts`, `auth.ts`, `public/manifest.json`, `public/sw.js`, footer or layout components.
- Tests under `__test__` which mock or assert the domain.

### External Dependencies

- GoDaddy for DNS/redirects.
- Hosting provider (Vercel) for domain registration, DNS targets, and TLS.
- Google Cloud Console for OAuth settings.
- Google Search Console & Analytics.

## Risks and Considerations

### Technical Risks

- OAuth redirects will fail until Google Console is updated — plan to update before switchover.
- Hardcoded domain strings in obscure files can cause missed links — run repo-wide search.
- Cookie domain or SameSite policies may need tweaking for cross-subdomain usage.

### Operational Risks

- DNS propagation delays cause split traffic during migration.
- Search ranking may temporarily fluctuate.

## Implementation Notes

### File Structure Impact

Expected files to edit (non-exhaustive):

- `app/FEATURES.ts` (if base URL referenced)
- `app/utils/urlGeneration.ts` (primary change)
- `types/sharing.ts` (share messages)
- `lib/webPush.ts` (VAPID contact)
- `auth.ts` (NextAuth configuration)
- `public/manifest.json`, `public/sw.js` (service worker)
- `app/layout.tsx` / `components/footer.tsx` (footer/contact)
- Tests in `__test__/` that reference the old domain
- README & documentation files

### Minimal Code Contract

- Inputs: existing codebase with environment variables and hosting on Vercel/GoDaddy
- Outputs: application uses `uvuyoga.com` as production domain; old domain redirects to the new domain via 301.
- Error modes: missing DNS changes, misconfigured OAuth redirect URIs, or outdated env vars cause login failures or unreachable site.

### Edge Cases

- Users with bookmarked sessions pointing to `happyyoga.app` may have cookies unrecognized by `uvuyoga.com` (domain-level cookie mismatch). Recommend session re-login flow.
- API clients using hardcoded webhook or callback URLs will need updates.
- If email templates contain absolute links to the old domain in previous emails, those links will still point to the old domain unless redirected.

## Testing Strategy

- Unit tests: Update domain expectations and run `npm run test`.
- Integration tests: Validate Google OAuth login flow in staging with new domain.
- Manual QA checklist:
  - Verify `NEXTAUTH_URL` is set in hosting env to `https://www.uvuyoga.com`.
  - Test login via Google on staging and production.
  - Validate share links render `uvuyoga.com`.
  - Verify web-push subscription and email templates use `support@uvuyoga.com`.
  - Confirm sitemap URLs and robots.txt contain new domain.

## Rollout Plan

1. Pre-migration (prepare)

   - Update code references and tests for new domain in a feature branch.
   - Update Google OAuth client with new redirect URIs.
   - Add `uvuyoga.com` and `www.uvuyoga.com` to hosting provider and set up TLS.
   - Prepare 301 redirect plan from `happyyoga.app` to `uvuyoga.com` (via hosting or GoDaddy forwarding).

2. Staging validation

   - Deploy to staging with env `NEXTAUTH_URL=https://www.uvuyoga.com` and validate login and flows.

3. DNS cutover

   - Add/update DNS records in GoDaddy (A/CNAME/ALIAS as required) pointing to hosting.
   - Verify TLS is issued and site resolves.

4. Soft switch & monitoring

   - Enable redirects from `happyyoga.app` to `uvuyoga.com`.
   - Monitor logs, analytics, and auth flows for errors.

5. Finalize
   - Submit new sitemap to Google Search Console.
   - Update documentation and marketing links.

### Rollback Plan

- Revert DNS changes to point back to the original hosting or restore previous records; revert redirects.
- Re-deploy previous commit of application code until ops are resolved.

## Future Considerations

- Consolidate email sending domain and SPF/DKIM/DMARC for `uvuyoga.com`.
- Update marketing assets and social profiles to reflect new domain.
- Consider wildcard cookies if cross-subdomain sessions are needed.

## Appendix: Quick Commands & Checklists

- Local test env (.env.local)

```bash
# .env.local (example)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VAPID_PRIVATE_KEY=xxxx
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxx
```

- Vercel/Hosting (production env)

```text
NEXTAUTH_URL=https://www.uvuyoga.com
NEXT_PUBLIC_BASE_URL=https://www.uvuyoga.com
VAPID_PRIVATE_KEY=xxxx
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxx
```

---

This PRD is ready for review. After you confirm, I'll convert this into a task list suitable for the `Rules-PRD_to_Tasks` system and create the task file under `.github/tasks/`.
