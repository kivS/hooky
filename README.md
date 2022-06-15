# Hooky

Utility to install git hooks from the repo and keeping them in sync

## How to use

- Run directly

  ```bash
  deno run --allow-write --allow-read https://deno.land/x/hooky/main.ts <hook file | hooks folder>
  ```

  ```bash
  # or we can run it directly from github 
  deno run --allow-write --allow-read https://raw.githubusercontent.com/kivS/hooky/main/main.ts <hook file | hooks folder>
  ```

- Install as script

  ```bash
  deno install --allow-read --allow-write https://deno.land/x/hooky/main.ts
  ```

  ```bash
  # then we can run it like so
  hooky <hook file | hooks folder>
  ```
