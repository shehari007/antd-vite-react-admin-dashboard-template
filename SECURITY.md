# Security Policy

## Supported versions

| Version | Supported           |
| ------- | ------------------- |
| 2.2.x   | Yes                 |
| 2.1.x   | Security fixes only |
| < 2.1   | No                  |

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Email **shehariyar@gmail.com** with the details and a way to reproduce it. You
can expect an acknowledgement within a few days, and a fix or an explanation
before any public disclosure.

## What this template is and is not

ViteDash is a front end template. Everything in it runs on the visitor's
machine, and there are a few places where that matters:

- **The authentication is fake.** `src/services/authService.js` returns a made
  up token after a timeout. It exists so the screens have something to talk to,
  not to protect anything. Replace it before you ship.
- **Role checks are convenience, not security.** `RequireRole` and the sidebar
  filtering stop a user from wandering into a page they should not see. They do
  not stop anyone who opens the developer tools. Every rule enforced in the
  browser has to be enforced again on your server.
- **The session lives in localStorage.** That is readable by any script running
  on the page, so a cross site scripting bug exposes it. For production, prefer
  an httpOnly cookie set by your backend, with this app holding only the user
  profile.
- **`.env` is not a secret store.** Anything prefixed `VITE_` is compiled into
  the JavaScript bundle and is public. Real secrets belong on your server.

## Known advisories

`npm audit` reports one advisory in `react-router` relating to CSRF in its RSC
mode. This template is a client rendered single page app and does not use RSC
mode, so it is not affected. The fix requires a downgrade that would break other
things, so the dependency is left current and this note is here instead. It will
be dropped once an upstream patch release lands.
