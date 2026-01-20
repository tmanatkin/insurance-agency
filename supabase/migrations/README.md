This is the easiest way I found to run db migrations exclusively on dev or prod

- Temporarily link the project you want (dev or prod)

  dev: `supabase link --project-ref txveadxryorantvqaitn`

  prod: `supabase link --project-ref ngdaecmjjntxbsypibnr`

- Push db migrations to linked project

  `supabase db push`

- Unlink linked project

  `supabase unlink`

This is the easiest way to push migrations, but leaves the project unlinked to prevent any accidental changes in the future
