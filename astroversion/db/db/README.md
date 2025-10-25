---
import BaseLayout from '../layouts/BaseLayout.astro';
title: "Register"
---
<BaseLayout>
# Database Setup

1. Install PostgreSQL and create a database named `myownsite`.
2. Update `DATABASE_URL` in `api/auth/index.js` with your credentials.
3. Run the migration:

```
psql -U youruser -d myownsite -f db/schema.sql
```

4. Set `JWT_SECRET` in your environment for security.
</BaseLayout>
