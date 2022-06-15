import { assert, basename } from "./deps.ts";

const SUCCESS_MESSAGE_STYLE = "background: #222; color: #bada55";
const ERROR_MESSAGE_STYLE = "background: #222; color: #ff0000";

if (Deno.args.length < 1) {
  console.error("%cAdd hook file or folder", ERROR_MESSAGE_STYLE), Deno.exit(0);
}

const hooks_source = Deno.args[0];

const hooks_source_absolute_path = await Deno.realPath(hooks_source);
const hooks_source_lstat = await Deno.lstat(hooks_source_absolute_path);

try {
  const repo = await Deno.lstat(`${Deno.cwd()}/.git/`);
  assert(repo.isDirectory);
} catch (_err) {
  console.error(
    "%cGit repo not detected. Make sure you are in the root of the repo",
    ERROR_MESSAGE_STYLE,
  );
  Deno.exit(0);
}

if (hooks_source_lstat.isFile) {
  console.log(`Processing hook from [ ${hooks_source_absolute_path} ]`);

  const hook_target = `${Deno.cwd()}/.git/hooks/${
    basename(hooks_source_absolute_path)
  }`;

  await Deno.symlink(hooks_source_absolute_path, hook_target, { type: "file" });

  // read, write and execute permission(for user and group, read for rest) for symbolic link of hook
  await Deno.chmod(hook_target, 0o774);

  console.log(
    `%cHook [ ${hook_target} ] has been installed and activated`,
    SUCCESS_MESSAGE_STYLE,
  );
} else {
  console.log(`Folder of hooks detected...`);

  for await (const entry of Deno.readDir(hooks_source_absolute_path)) {
    if (!entry.isFile) continue;

    const hook_entry_path = `${hooks_source_absolute_path}/${entry.name}`;

    console.log(`Processing hook from [ ${hook_entry_path} ]`);

    const hook_target = `${Deno.cwd()}/.git/hooks/${entry.name}`;

    await Deno.symlink(hook_entry_path, hook_target, { type: "file" });

    // read, write and execute permission(for user and group, read for rest) for symbolic link of hook
    await Deno.chmod(hook_target, 0o774);

    console.log(
      `%cHook [ ${hook_target} ] has been installed and activated`,
      SUCCESS_MESSAGE_STYLE,
    );
  }
}
