# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x (main) | Yes |

Bluey URL is not a hosted service in this repository. If you deploy it, you are responsible for that deployment.

## Reporting a vulnerability

Do not open a public GitHub issue for a security report.

Use [private vulnerability reporting](https://github.com/victor-dias-dev/bluey-url/security/advisories/new), or contact [@victor-dias-dev](https://github.com/victor-dias-dev) directly. Include the affected version, a reproduction, and the impact you expect.

Please give the maintainers time to reproduce the report before discussing it in public.

## What to expect

- An acknowledgement when the report is read.
- A fix or a documented mitigation when the report is valid.
- Credit in the changelog if you want it, and silence if you do not.

## Deployment checklist

These are configuration requirements, not optional hardening:

- Set a long, random `JWT_SECRET`. The application warns when a placeholder is still in use.
- Set `CORS_ORIGIN` to the exact browser origins that may call the API.
- Do not set `DOMAIN_AUTO_VERIFY`. Production ignores it, and it must stay off on any shared environment.
- Do not run `prisma:seed` against a production database. The seed account uses a published password.
- Put PostgreSQL and Redis on a private network. The compose files publish those ports so local development is easy; a public deployment should not.

## Known limitations

- Custom-domain verification does not query DNS yet. Until it does, a domain stays unverified unless a developer explicitly enables the local auto-verify flag.
- Click events are queued in Redis and are not persisted. The queued payload stores an anonymized IP, not the full address.
- Destination URLs are restricted to `http` and `https`. A shortener can still point at a malicious site that uses those schemes. Abuse filtering is listed on the roadmap and is not implemented.
