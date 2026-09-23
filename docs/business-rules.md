# Business rules

Implementation status matches the code. A rule marked planned is not enforced.

## Accounts

| Rule | Status |
| --- | --- |
| Plans are Free, Pro, and Enterprise | Implemented. New accounts are Free. There is no billing flow, so Pro and Enterprise exist only as data. |
| Free accounts can keep 10 active links | Implemented |
| Paid accounts have no active-link cap | Implemented |
| A link can be deactivated | Implemented. Delete is a soft delete (`isActive = false`). |

## Links

| Rule | Status |
| --- | --- |
| The destination must be an `http` or `https` URL | Implemented |
| A short code is unique per domain | Implemented |
| Generated codes are 6 characters from an unguessable alphabet | Implemented, with up to 5 attempts on collision |
| A custom alias is 3–20 letters or digits and is limited to paid plans | Implemented |
| A link may expire and then returns `410` | Implemented, including when the destination was cached |
| The default redirect is `301`; `302` is optional | Implemented |
| Clicks are not recorded on the redirect path | Partially implemented. The redirect only enqueues an event. Nothing consumes the queue yet. |

## Domains

| Rule | Status |
| --- | --- |
| Custom domains are limited to paid plans | Implemented |
| A hostname belongs to one account | Implemented |
| The hostname must be verified with a DNS TXT record before it is used | Planned. The API returns the record it will check and responds `501` from the verify route. |
| Local development can skip that check | Implemented only when `DOMAIN_AUTO_VERIFY=true` and `NODE_ENV` is not `production`. |

## Privacy and abuse

| Rule | Status |
| --- | --- |
| Click IPs are anonymized | Implemented at enqueue time |
| Global rate limit | Implemented |
| Destination blocklist and a preview page | Planned |
